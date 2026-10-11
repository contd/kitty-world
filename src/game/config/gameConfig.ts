import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';

export function createGameConfig(parentContainer: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: parentContainer,
    width: 960,
    height: 540,
    backgroundColor: '#09090b',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0, x: 0 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 960,
      height: 540,
    },
    render: {
      pixelArt: true,
      antialias: false,
      powerPreference: 'high-performance',
    },
    scene: [GameScene],
  };
}
