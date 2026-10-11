import Phaser from 'phaser';
import { LevelDefinition, GameHUDState } from '../types';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Collectible } from '../entities/Collectible';
import { MovingPlatform, CrumblingPlatform, Springboard, Checkpoint } from '../entities/Obstacle';
import { TextureGenerator } from '../systems/TextureGenerator';
import { InputSystem } from '../systems/InputSystem';
import { audioSynth } from '../systems/AudioSynthesizer';
import { progressRepository, LevelCompletionResult } from '../../persistence/ProgressRepository';

export interface GameSceneInitData {
  level: LevelDefinition;
  onHUDUpdate?: (hud: GameHUDState) => void;
  onLevelComplete?: (result: LevelCompletionResult) => void;
  onGameOver?: () => void;
}

export class GameScene extends Phaser.Scene {
  private levelData!: LevelDefinition;
  public player!: Player;
  public inputSystem!: InputSystem;

  // Entity collections
  private staticPlatforms!: Phaser.Physics.Arcade.StaticGroup;
  private movingPlatforms: MovingPlatform[] = [];
  private crumblingPlatforms: CrumblingPlatform[] = [];
  private enemies: Enemy[] = [];
  private collectibles: Collectible[] = [];
  private springboards: Springboard[] = [];
  private checkpoints: Checkpoint[] = [];
  private goalObject!: Phaser.Physics.Arcade.Image;

  // Game state
  private sardinesCollected = 0;
  private totalLevelSardines = 0;
  private score = 0;
  private elapsedTime = 0;
  private secretFound = false;
  private isLevelComplete = false;
  private isGameOver = false;
  private activeCheckpointName: string | null = null;

  // Callbacks
  private onHUDUpdate?: (hud: GameHUDState) => void;
  private onLevelComplete?: (result: LevelCompletionResult) => void;
  private onGameOver?: () => void;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: GameSceneInitData): void {
    this.levelData = data.level;
    this.onHUDUpdate = data.onHUDUpdate;
    this.onLevelComplete = data.onLevelComplete;
    this.onGameOver = data.onGameOver;

    // Reset counters
    this.sardinesCollected = 0;
    this.score = 0;
    this.elapsedTime = 0;
    this.secretFound = false;
    this.isLevelComplete = false;
    this.isGameOver = false;
    this.activeCheckpointName = null;
    this.movingPlatforms = [];
    this.crumblingPlatforms = [];
    this.enemies = [];
    this.collectibles = [];
    this.springboards = [];
    this.checkpoints = [];
  }

  preload(): void {
    // Generate procedural textures immediately into TextureManager
    TextureGenerator.generateAllTextures(this);

    // Preload background image if not cached
    if (this.levelData.backdropImage && !this.textures.exists(`bg_${this.levelData.id}`)) {
      this.load.image(`bg_${this.levelData.id}`, this.levelData.backdropImage);
    }
  }

  create(): void {
    // 1. Initialize Input System
    this.inputSystem = new InputSystem(this);

    // 2. Setup Background Parallax Layers
    this.createBackdrop();

    // 3. Setup World Bounds & Physics Groups
    this.physics.world.setBounds(0, 0, this.levelData.worldWidth, this.levelData.worldHeight + 100);

    this.staticPlatforms = this.physics.add.staticGroup();

    // 4. Build Level Geometry
    this.buildPlatforms();
    this.buildHazards();
    this.buildSpringboards();
    this.buildCheckpoints();
    this.buildGoal();

    // 5. Spawn Player & Enemies & Collectibles
    this.spawnPlayer();
    this.spawnEnemies();
    this.spawnCollectibles();

    // 6. Setup Collisions
    this.setupCollisions();

    // 7. Setup Camera
    this.setupCamera();

    // 8. Start Background Music
    audioSynth.startBackgroundMusic(this.levelData.theme);

    // Initial HUD notification
    this.emitHUD();
  }

  private createBackdrop(): void {
    const bgKey = `bg_${this.levelData.id}`;
    if (this.textures.exists(bgKey)) {
      // Repeat backdrop across level width
      const bgWidth = 1280;
      const repeats = Math.ceil(this.levelData.worldWidth / bgWidth) + 1;
      for (let i = 0; i < repeats; i++) {
        const bg = this.add.image(i * bgWidth, this.levelData.worldHeight / 2, bgKey);
        bg.setOrigin(0, 0.5);
        bg.setDisplaySize(bgWidth, this.levelData.worldHeight);
        bg.setScrollFactor(0.4, 0.2);
        bg.setDepth(-10);
      }
    } else {
      // Solid stylized gradient fallback
      const graphics = this.add.graphics();
      graphics.fillGradientStyle(0x1e1b4b, 0x1e1b4b, 0x0f172a, 0x0f172a, 1);
      graphics.fillRect(0, 0, this.levelData.worldWidth, this.levelData.worldHeight);
      graphics.setScrollFactor(0);
      graphics.setDepth(-10);
    }
  }

  private buildPlatforms(): void {
    for (const p of this.levelData.platforms) {
      if (p.isMoving) {
        const moving = new MovingPlatform(
          this,
          p.x,
          p.y,
          p.width,
          p.height,
          p.type === 'wood' ? 'tile_harbor' : 'tile_suburb',
          p.moveRangeX || 0,
          p.moveRangeY || 0,
          p.moveSpeed || 50
        );
        this.movingPlatforms.push(moving);
      } else if (p.isCrumbling) {
        const crumb = new CrumblingPlatform(this, p.x, p.y, p.width, p.height);
        this.crumblingPlatforms.push(crumb);
      } else {
        // Tile texture mapping
        let tileTex = 'tile_suburb';
        if (p.type === 'forest') tileTex = 'tile_forest';
        else if (p.type === 'harbor') tileTex = 'tile_harbor';
        else if (p.type === 'mushroom') tileTex = 'tile_mushroom';
        else if (p.type === 'wood') tileTex = 'tile_harbor';

        // Create tiled platform representation
        const tileCount = Math.max(1, Math.round(p.width / 32));
        const actualWidth = tileCount * 32;

        const tileSprite = this.add.tileSprite(p.x, p.y, actualWidth, p.height, tileTex);
        this.physics.add.existing(tileSprite, true);
        this.staticPlatforms.add(tileSprite);
      }
    }
  }

  private buildHazards(): void {
    for (const h of this.levelData.hazards) {
      const hazardKey = h.type === 'water' ? 'hazard_water' : 'obstacle_spikes';
      const hazardTile = this.add.tileSprite(h.x, h.y, h.width, h.height, hazardKey);
      this.physics.add.existing(hazardTile, true);

      // Overlap with player
      this.physics.add.overlap(this.player, hazardTile, () => {
        this.handlePlayerHurt();
      });
    }
  }

  private buildSpringboards(): void {
    for (const s of this.levelData.springboards) {
      const board = new Springboard(this, s.x, s.y, s.bounceForce || -580);
      this.springboards.push(board);
    }
  }

  private buildCheckpoints(): void {
    for (const cp of this.levelData.checkpoints) {
      const checkpoint = new Checkpoint(this, cp.x, cp.y, cp.id);
      this.checkpoints.push(checkpoint);
    }
  }

  private buildGoal(): void {
    const g = this.levelData.goal;
    this.goalObject = this.physics.add.image(g.x, g.y, 'goal_cat_door');
    this.goalObject.setImmovable(true);
    (this.goalObject.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // Golden halo tween around goal
    this.tweens.add({
      targets: this.goalObject,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private spawnPlayer(): void {
    const sp = this.levelData.spawnPoint;
    this.player = new Player(this, sp.x, sp.y);
  }

  private spawnEnemies(): void {
    for (const ed of this.levelData.enemies) {
      const enemy = new Enemy(this, ed);
      this.enemies.push(enemy);
      // Collide enemies with static platforms
      this.physics.add.collider(enemy, this.staticPlatforms);
    }
  }

  private spawnCollectibles(): void {
    this.totalLevelSardines = this.levelData.collectibles.filter(c => c.type === 'SARDINE').length;

    for (const cd of this.levelData.collectibles) {
      const col = new Collectible(this, cd);
      this.collectibles.push(col);
    }
  }

  private setupCollisions(): void {
    // 1. Player <-> Static Platforms
    this.physics.add.collider(this.player, this.staticPlatforms);

    // 2. Player <-> Moving Platforms
    this.movingPlatforms.forEach((mp) => {
      this.physics.add.collider(this.player, mp);
    });

    // 3. Player <-> Crumbling Platforms
    this.crumblingPlatforms.forEach((cp) => {
      this.physics.add.collider(this.player, cp, () => {
        cp.triggerCrumble();
      });
    });

    // 4. Player <-> Springboards
    this.springboards.forEach((sb) => {
      this.physics.add.overlap(this.player, sb, () => {
        sb.triggerAnimation();
        this.player.springLaunch(sb.bounceForce);
      });
    });

    // 5. Player <-> Checkpoints
    this.checkpoints.forEach((cp) => {
      this.physics.add.overlap(this.player, cp, () => {
        if (!cp.isActivated) {
          cp.activate();
          this.player.setCheckpoint(cp.x, cp.y - 10);
          this.activeCheckpointName = 'Snack Bowl Checkpoint!';
          this.emitHUD();
        }
      });
    });

    // 6. Player <-> Collectibles
    this.collectibles.forEach((item) => {
      this.physics.add.overlap(this.player, item, () => {
        if (!item.active) return;
        item.collect();
        if (item.itemType === 'SARDINE') {
          this.sardinesCollected++;
          this.score += 100;
        } else if (item.isSecret) {
          this.secretFound = true;
          this.score += 500;
        } else {
          this.score += 250;
        }
        this.emitHUD();
      });
    });

    // 7. Player <-> Enemies
    this.enemies.forEach((enemy) => {
      this.physics.add.overlap(this.player, enemy, () => {
        this.handlePlayerEnemyOverlap(enemy);
      });
    });

    // 8. Player <-> Goal Door
    this.physics.add.overlap(this.player, this.goalObject, () => {
      this.handleLevelWin();
    });
  }

  private setupCamera(): void {
    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.levelData.worldWidth, this.levelData.worldHeight);
    cam.startFollow(this.player, true, 0.08, 0.08, 0, 40);
    cam.setDeadzone(100, 60);
  }

  private handlePlayerEnemyOverlap(enemy: Enemy): void {
    if (enemy.isDefeated || this.player.isDead) return;

    if (enemy.enemyType === 'PIGEON') {
      // Pigeons are friendly interactive creatures
      return;
    }

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;

    // Check if player jumped on top of enemy
    const isFallingOnTop = playerBody.velocity.y > 0 && playerBody.bottom <= enemyBody.top + 16;

    if (isFallingOnTop) {
      // Bounce defeat!
      enemy.defeat();
      this.player.bounceOnEnemy();
      this.score += 200;
      this.emitHUD();
    } else {
      // Take damage
      this.handlePlayerHurt();
    }
  }

  private handlePlayerHurt(): void {
    const isFatal = this.player.takeDamage();
    this.emitHUD();

    if (isFatal) {
      this.isGameOver = true;
      audioSynth.stopBackgroundMusic();
      if (this.onGameOver) this.onGameOver();
    }
  }

  private async handleLevelWin(): Promise<void> {
    if (this.isLevelComplete) return;
    this.isLevelComplete = true;

    audioSynth.stopBackgroundMusic();
    audioSynth.playFanfare();

    // Confetti & victory pose
    this.player.anims.stop();
    this.player.setFrame(7);
    (this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    const result = await progressRepository.recordLevelCompletion(
      this.levelData.id,
      Math.round(this.elapsedTime),
      this.sardinesCollected,
      this.secretFound
    );

    this.emitHUD();

    if (this.onLevelComplete) {
      this.onLevelComplete(result);
    }
  }

  update(time: number, delta: number): void {
    if (this.isLevelComplete || this.isGameOver) return;

    // 1. Elapsed timer
    this.elapsedTime += delta / 1000;

    // 2. Poll Input
    const inputState = this.inputSystem.poll();

    // 3. Update Player
    this.player.updatePlayer(delta, inputState);

    // 4. Update Moving Platforms
    this.movingPlatforms.forEach((p) => p.updatePlatform());

    // 5. Update Enemies
    this.enemies.forEach((e) => e.updateEnemy(delta, this.player.x, this.player.y));

    // 6. Check Pit Fall
    if (this.player.y > this.levelData.worldHeight + 40) {
      this.handlePitFall();
    }

    // Periodic HUD update (once every 500ms or on score change)
    if (Math.floor(this.elapsedTime * 2) !== Math.floor((this.elapsedTime - delta / 1000) * 2)) {
      this.emitHUD();
    }
  }

  private handlePitFall(): void {
    const isFatal = this.player.takeDamage();
    if (isFatal) {
      this.isGameOver = true;
      audioSynth.stopBackgroundMusic();
      if (this.onGameOver) this.onGameOver();
    } else {
      this.player.respawnAtCheckpoint();
    }
    this.emitHUD();
  }

  public respawnPlayer(): void {
    this.isGameOver = false;
    this.player.respawnAtCheckpoint();
    audioSynth.startBackgroundMusic(this.levelData.theme);
    this.emitHUD();
  }

  public restartLevel(): void {
    audioSynth.stopBackgroundMusic();
    this.scene.restart();
  }

  private emitHUD(): void {
    if (!this.onHUDUpdate) return;
    this.onHUDUpdate({
      lives: this.player ? this.player.lives : 3,
      maxLives: this.player ? this.player.maxLives : 3,
      sardinesCollected: this.sardinesCollected,
      totalLevelSardines: this.totalLevelSardines,
      score: this.score,
      elapsedTime: Math.floor(this.elapsedTime),
      currentLevelName: this.levelData.name,
      currentLevelSubtitle: this.levelData.subtitle,
      isPaused: this.scene.isPaused(),
      isGameOver: this.isGameOver,
      isLevelComplete: this.isLevelComplete,
      secretFound: this.secretFound,
      activeCheckpointName: this.activeCheckpointName,
    });
  }
}
