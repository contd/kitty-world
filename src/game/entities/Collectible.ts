import Phaser from 'phaser';
import { CollectibleType, CollectibleDef } from '../types';
import { audioSynth } from '../systems/AudioSynthesizer';

export class Collectible extends Phaser.Physics.Arcade.Sprite {
  public itemType: CollectibleType;
  public isSecret: boolean;
  private startY: number;
  private floatOffset = Math.random() * Math.PI * 2;

  constructor(scene: Phaser.Scene, def: CollectibleDef) {
    const textureKey = Collectible.getTextureKey(def.type);
    super(scene, def.x, def.y, textureKey);

    this.itemType = def.type;
    this.isSecret = Boolean(def.isSecret);
    this.startY = def.y;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setSize(18, 18);

    // Subtle gentle float animation
    scene.tweens.add({
      targets: this,
      y: this.startY - 6,
      duration: 1200 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private static getTextureKey(type: CollectibleType): string {
    switch (type) {
      case 'SARDINE': return 'item_sardine';
      case 'YARN_BALL': return 'item_yarn';
      case 'CATNIP_HEART': return 'item_catnip';
      case 'SECRET_TROPHY': return 'item_trophy';
      default: return 'item_sardine';
    }
  }

  collect(): void {
    if (this.isSecret) {
      audioSynth.playSecretFound();
    } else {
      audioSynth.playSardinePickup();
    }

    // Sparkle burst effect
    this.scene.tweens.add({
      targets: this,
      y: this.y - 25,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 250,
      ease: 'Quad.easeOut',
      onComplete: () => this.destroy(),
    });
  }
}
