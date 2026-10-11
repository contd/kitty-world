import Phaser from 'phaser';
import { PlayerState } from '../types';
import { InputState } from '../systems/InputSystem';
import { audioSynth } from '../systems/AudioSynthesizer';

export interface PlayerConfig {
  spawnX: number;
  spawnY: number;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  // Movement parameters
  private readonly maxSpeed = 220;
  private readonly acceleration = 1200;
  private readonly drag = 1000;
  private readonly jumpForce = -420;
  private readonly minJumpVelocity = -180;
  private readonly gravity = 900;

  // Jump tuning
  private readonly coyoteTimeDuration = 120; // ms
  private readonly jumpBufferDuration = 120;  // ms
  private timeSinceLeftGround = 9999;
  private jumpBufferTimer = 0;
  private isJumping = false;

  // State machine
  public currentState: PlayerState = 'IDLE';
  public lives = 3;
  public maxLives = 3;
  public isInvulnerable = false;
  private invulnerableTimer = 0;
  public isDead = false;

  // Checkpoint & respawn
  public checkpointX: number;
  public checkpointY: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player_cat', 0);

    this.checkpointX = x;
    this.checkpointY = y;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Setup arcade body
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(this.gravity);
    body.setSize(20, 24);
    body.setOffset(6, 8);
    body.setCollideWorldBounds(false);

    this.setupAnimations();
  }

  private setupAnimations(): void {
    const anims = this.scene.anims;
    if (!anims.exists('cat_idle')) {
      anims.create({
        key: 'cat_idle',
        frames: anims.generateFrameNumbers('player_cat', { frames: [0, 1] }),
        frameRate: 3,
        repeat: -1,
      });
    }
    if (!anims.exists('cat_run')) {
      anims.create({
        key: 'cat_run',
        frames: anims.generateFrameNumbers('player_cat', { frames: [2, 3, 4, 3] }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  updatePlayer(delta: number, input: InputState): void {
    if (this.isDead) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down || body.touching.down;

    // Handle invulnerability timer and visual flash
    if (this.isInvulnerable) {
      this.invulnerableTimer -= delta;
      this.setAlpha(Math.floor(this.invulnerableTimer / 80) % 2 === 0 ? 0.3 : 1);
      if (this.invulnerableTimer <= 0) {
        this.isInvulnerable = false;
        this.setAlpha(1);
      }
    }

    // Update timers
    if (onGround) {
      this.timeSinceLeftGround = 0;
      this.isJumping = false;
    } else {
      this.timeSinceLeftGround += delta;
    }

    if (input.jumpPressed) {
      this.jumpBufferTimer = this.jumpBufferDuration;
    } else if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer -= delta;
    }

    // 1. Horizontal Movement
    if (input.left) {
      body.setAccelerationX(-this.acceleration);
      this.setFlipX(true);
    } else if (input.right) {
      body.setAccelerationX(this.acceleration);
      this.setFlipX(false);
    } else {
      body.setAccelerationX(0);
      body.setDragX(this.drag);
    }

    // Clamp max velocity
    body.setMaxVelocity(this.maxSpeed, 700);

    // 2. Jump Handling (Coyote time & Jump buffer)
    const canCoyoteJump = this.timeSinceLeftGround < this.coyoteTimeDuration && !this.isJumping;
    const hasBufferedJump = this.jumpBufferTimer > 0;

    if (hasBufferedJump && canCoyoteJump) {
      this.executeJump();
      this.jumpBufferTimer = 0;
      this.timeSinceLeftGround = 9999;
    }

    // Variable jump height: release jump button early to truncate jump
    if (input.jumpReleased && body.velocity.y < this.minJumpVelocity) {
      body.setVelocityY(this.minJumpVelocity);
    }

    // 3. Meow / Action emote
    if (input.actionPressed) {
      this.meow();
    }

    // 4. Update Animation & State
    this.updateStateAndVisuals(onGround, body);
  }

  private executeJump(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(this.jumpForce);
    this.isJumping = true;
    audioSynth.playJump();

    // Squash & stretch visual juice
    this.setScale(0.8, 1.25);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 180,
      ease: 'Quad.easeOut',
    });
  }

  bounceOnEnemy(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(this.jumpForce * 0.85);
    this.isJumping = true;
    audioSynth.playEnemyBounce();

    this.setScale(1.2, 0.8);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 160,
      ease: 'Back.easeOut',
    });
  }

  springLaunch(force = -580): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(force);
    this.isJumping = true;
    audioSynth.playSpringboard();

    this.setScale(0.7, 1.35);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 220,
      ease: 'Quad.easeOut',
    });
  }

  takeDamage(): boolean {
    if (this.isInvulnerable || this.isDead) return false;

    this.lives = Math.max(0, this.lives - 1);
    audioSynth.playHurt();

    if (this.lives <= 0) {
      this.isDead = true;
      return true; // Fatal
    }

    // Non-fatal damage: knockback and invulnerability
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(-260);
    body.setVelocityX(this.flipX ? 150 : -150);

    this.isInvulnerable = true;
    this.invulnerableTimer = 1500; // 1.5s invulnerability window

    // Screen shake if enabled
    this.scene.cameras.main.shake(180, 0.012);
    return false;
  }

  respawnAtCheckpoint(): void {
    this.isDead = false;
    this.lives = this.maxLives;
    this.isInvulnerable = true;
    this.invulnerableTimer = 1500;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.setAcceleration(0, 0);
    this.setPosition(this.checkpointX, this.checkpointY);
    this.setAlpha(1);
    this.setFrame(0);
  }

  setCheckpoint(x: number, y: number): void {
    this.checkpointX = x;
    this.checkpointY = y;
  }

  meow(): void {
    audioSynth.playMeow();
    // Spawn a small heart / note icon above cat
    const heart = this.scene.add.text(this.x, this.y - 20, '♥ Meow!', {
      fontSize: '11px',
      color: '#f43f5e',
      fontStyle: 'bold',
      fontFamily: 'system-ui',
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: heart,
      y: heart.y - 24,
      alpha: 0,
      duration: 700,
      ease: 'Quad.easeOut',
      onComplete: () => heart.destroy(),
    });
  }

  private updateStateAndVisuals(onGround: boolean, body: Phaser.Physics.Arcade.Body): void {
    if (!onGround) {
      if (body.velocity.y < 0) {
        this.currentState = 'JUMPING';
        this.anims.stop();
        this.setFrame(5); // Jump frame
      } else {
        this.currentState = 'FALLING';
        this.anims.stop();
        this.setFrame(6); // Fall frame
      }
    } else {
      if (Math.abs(body.velocity.x) > 15) {
        this.currentState = 'RUNNING';
        if (!this.anims.isPlaying || this.anims.currentAnim?.key !== 'cat_run') {
          this.anims.play('cat_run', true);
        }
      } else {
        this.currentState = 'IDLE';
        if (!this.anims.isPlaying || this.anims.currentAnim?.key !== 'cat_idle') {
          this.anims.play('cat_idle', true);
        }
      }
    }
  }
}
