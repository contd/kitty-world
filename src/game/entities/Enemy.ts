import Phaser from 'phaser';
import { EnemyType, EnemyDef } from '../types';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public enemyType: EnemyType;
  private startX: number;
  private patrolDistance: number;
  private moveSpeed: number;
  private direction = 1;
  private jumpTimer = 0;
  private jumpInterval = 2000;
  public isDefeated = false;

  constructor(scene: Phaser.Scene, def: EnemyDef) {
    const textureKey = Enemy.getTextureKey(def.type);
    super(scene, def.x, def.y, textureKey);

    this.enemyType = def.type;
    this.startX = def.x;
    this.patrolDistance = def.patrolDistance || 100;
    this.moveSpeed = def.speed || 60;
    this.jumpInterval = def.jumpInterval || 2200;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(false);

    if (this.enemyType === 'CROW') {
      body.setAllowGravity(false);
      body.setSize(22, 16);
      body.setOffset(3, 4);
    } else if (this.enemyType === 'PIGEON') {
      body.setAllowGravity(true);
      body.setSize(18, 16);
      body.setOffset(4, 6);
    } else {
      body.setAllowGravity(true);
      body.setSize(24, 20);
      body.setOffset(4, 4);
    }
  }

  private static getTextureKey(type: EnemyType): string {
    switch (type) {
      case 'HOUND': return 'enemy_hound';
      case 'CROW': return 'enemy_crow';
      case 'FROG': return 'enemy_frog';
      case 'HEDGEHOG': return 'enemy_hedgehog';
      case 'PIGEON': return 'creature_pigeon';
      default: return 'enemy_hound';
    }
  }

  updateEnemy(delta: number, playerX: number, playerY: number): void {
    if (this.isDefeated) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    switch (this.enemyType) {
      case 'HOUND':
      case 'HEDGEHOG': {
        // Linear patrolling
        const currentOffset = this.x - this.startX;
        if (currentOffset > this.patrolDistance) {
          this.direction = -1;
        } else if (currentOffset < -this.patrolDistance) {
          this.direction = 1;
        }
        body.setVelocityX(this.direction * this.moveSpeed);
        this.setFlipX(this.direction > 0);
        break;
      }

      case 'CROW': {
        // Swooping / flying patrol with sinusoidal hovering
        const crowOffset = this.x - this.startX;
        if (crowOffset > this.patrolDistance) {
          this.direction = -1;
        } else if (crowOffset < -this.patrolDistance) {
          this.direction = 1;
        }
        body.setVelocityX(this.direction * this.moveSpeed);
        body.setVelocityY(Math.sin(this.scene.time.now / 300) * 45);
        this.setFlipX(this.direction < 0);
        break;
      }

      case 'FROG': {
        // Periodic jumping
        this.jumpTimer += delta;
        const onGround = body.blocked.down || body.touching.down;
        if (this.jumpTimer >= this.jumpInterval && onGround) {
          this.jumpTimer = 0;
          body.setVelocityY(-340);
          body.setVelocityX(this.direction * (this.moveSpeed * 1.5));
          this.setFlipX(this.direction > 0);
        } else if (onGround) {
          body.setVelocityX(0);
          // Reverse direction at edges
          const frogOffset = this.x - this.startX;
          if (frogOffset > this.patrolDistance) this.direction = -1;
          if (frogOffset < -this.patrolDistance) this.direction = 1;
        }
        break;
      }

      case 'PIGEON': {
        // Non-hostile interactive creature: flutters away when cat gets close!
        const dist = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);
        if (dist < 75 && !this.isDefeated) {
          // Flutter up into the sky safely
          this.isDefeated = true;
          body.setVelocityY(-180);
          body.setVelocityX((this.x > playerX ? 1 : -1) * 90);
          this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1200,
            onComplete: () => this.destroy(),
          });
        }
        break;
      }
    }
  }

  defeat(): void {
    if (this.isDefeated) return;
    this.isDefeated = true;

    // Defeat animation: flip upside down and tumble off screen
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setEnable(false);

    this.scene.tweens.add({
      targets: this,
      y: this.y - 30,
      angle: 180,
      scaleX: 0.5,
      scaleY: 0.5,
      alpha: 0,
      duration: 400,
      ease: 'Quad.easeOut',
      onComplete: () => this.destroy(),
    });
  }
}
