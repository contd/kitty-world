import Phaser from 'phaser';
import { audioSynth } from '../systems/AudioSynthesizer';

export class MovingPlatform extends Phaser.Physics.Arcade.Image {
  private startX: number;
  private startY: number;
  private rangeX: number;
  private rangeY: number;
  private speed: number;
  private dirX = 1;
  private dirY = 1;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    textureKey: string,
    rangeX = 80,
    rangeY = 0,
    speed = 50
  ) {
    super(scene, x, y, textureKey);
    this.startX = x;
    this.startY = y;
    this.rangeX = rangeX;
    this.rangeY = rangeY;
    this.speed = speed;

    this.setDisplaySize(width, height);
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Kinematic/immovable body

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    body.setAllowGravity(false);
  }

  updatePlatform(): void {
    if (this.rangeX > 0) {
      this.x += this.dirX * (this.speed * 0.016);
      if (Math.abs(this.x - this.startX) >= this.rangeX) {
        this.dirX *= -1;
      }
    }
    if (this.rangeY > 0) {
      this.y += this.dirY * (this.speed * 0.016);
      if (Math.abs(this.y - this.startY) >= this.rangeY) {
        this.dirY *= -1;
      }
    }
    // Update arcade physics body coordinates
    (this.body as Phaser.Physics.Arcade.Body).updateFromGameObject();
  }
}

export class CrumblingPlatform extends Phaser.Physics.Arcade.Sprite {
  private isTriggered = false;
  private isPlatformDestroyed = false;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y, 'tile_crumbling');
    this.setDisplaySize(width, height);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }

  triggerCrumble(): void {
    if (this.isTriggered || this.isPlatformDestroyed) return;
    this.isTriggered = true;

    // Shake platform
    const startX = this.x;
    this.scene.tweens.add({
      targets: this,
      x: startX + 3,
      duration: 50,
      yoyo: true,
      repeat: 6,
      onComplete: () => {
        // Fall down
        this.isPlatformDestroyed = true;
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setEnable(false);

        this.scene.tweens.add({
          targets: this,
          y: this.y + 120,
          alpha: 0,
          duration: 500,
          ease: 'Quad.easeIn',
          onComplete: () => this.destroy(),
        });
      },
    });
  }
}

export class Springboard extends Phaser.Physics.Arcade.Image {
  public bounceForce: number;

  constructor(scene: Phaser.Scene, x: number, y: number, bounceForce = -580) {
    super(scene, x, y, 'obstacle_springboard');
    this.bounceForce = bounceForce;
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }

  triggerAnimation(): void {
    this.setScale(1.3, 0.6);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 180,
      ease: 'Back.easeOut',
    });
  }
}

export class Checkpoint extends Phaser.Physics.Arcade.Sprite {
  public id: string;
  public isActivated = false;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string) {
    super(scene, x, y, 'checkpoint_inactive');
    this.id = id;
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }

  activate(): void {
    if (this.isActivated) return;
    this.isActivated = true;
    this.setTexture('checkpoint_active');
    audioSynth.playCheckpoint();

    // Ringing bell bounce animation
    this.setScale(1.25);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: 'Bounce.easeOut',
    });
  }
}
