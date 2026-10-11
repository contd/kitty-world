import Phaser from 'phaser';

/**
 * Procedural Pixel & Texture Generator for Phaser 3
 * Generates all character sprites, enemies, tiles, and collectibles dynamically
 * ensuring 100% offline availability and zero asset load failures.
 */
export class TextureGenerator {
  static generateAllTextures(scene: Phaser.Scene): void {
    const tm = scene.textures;

    this.createPlayerTexture(tm);
    this.createEnemyTextures(tm);
    this.createCollectibleTextures(tm);
    this.createPlatformTextures(tm);
    this.createObstacleTextures(tm);
    this.createParticleTextures(tm);
  }

  private static createPlayerTexture(tm: Phaser.Textures.TextureManager): void {
    if (tm.exists('player_cat')) return;

    // We'll create a 32x32 spritesheet canvas with 8 animation frames:
    // Frame 0: Idle 1
    // Frame 1: Idle 2 (ear twitch / tail swish)
    // Frame 2: Run 1 (right paw forward)
    // Frame 3: Run 2 (neutral contact)
    // Frame 4: Run 3 (left paw forward)
    // Frame 5: Jump (tucked)
    // Frame 6: Fall (stretched)
    // Frame 7: Hurt / Celebrate
    const width = 32 * 8;
    const height = 32;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const drawCat = (offsetX: number, frame: number) => {
      ctx.save();
      ctx.translate(offsetX + 16, 16);

      const isRunning = frame >= 2 && frame <= 4;
      const isJumping = frame === 5;
      const isFalling = frame === 6;
      const isHurtOrCelebration = frame === 7;

      // Body parameters
      const catOrange = '#f97316';
      const catWhite = '#ffffff';
      const catPink = '#fb7185';
      const catCollar = '#ef4444';
      const catBell = '#fbbf24';

      // Tail swish
      ctx.strokeStyle = catOrange;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const tailOffset = Math.sin(frame * 1.5) * 3;
      ctx.moveTo(-10, 3);
      ctx.quadraticCurveTo(-16, -2 + tailOffset, -18, -8 + tailOffset);
      ctx.stroke();

      // Tail tip (white)
      ctx.strokeStyle = catWhite;
      ctx.beginPath();
      ctx.moveTo(-17, -7 + tailOffset);
      ctx.lineTo(-18, -8 + tailOffset);
      ctx.stroke();

      // Main Body
      ctx.fillStyle = catOrange;
      ctx.beginPath();
      ctx.ellipse(0, 3, 10, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Belly patch (white)
      ctx.fillStyle = catWhite;
      ctx.beginPath();
      ctx.ellipse(2, 4, 6, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Paws / Legs
      ctx.fillStyle = catWhite;
      if (isRunning) {
        const legSwing = (frame - 3) * 4;
        // Front paws
        ctx.fillRect(4 + legSwing, 8, 4, 5);
        // Back paws
        ctx.fillRect(-8 - legSwing, 8, 4, 5);
      } else if (isJumping) {
        // Tucked paws
        ctx.fillRect(4, 7, 4, 3);
        ctx.fillRect(-6, 7, 4, 3);
      } else if (isFalling) {
        // Extended paws
        ctx.fillRect(5, 9, 3, 5);
        ctx.fillRect(-7, 9, 3, 5);
      } else {
        // Idle paws
        ctx.fillRect(3, 8, 4, 4);
        ctx.fillRect(-6, 8, 4, 4);
      }

      // Head
      ctx.fillStyle = catOrange;
      ctx.beginPath();
      ctx.arc(6, -4, 8, 0, Math.PI * 2);
      ctx.fill();

      // Cheeks (white)
      ctx.fillStyle = catWhite;
      ctx.beginPath();
      ctx.ellipse(8, -2, 5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ears (pointy triangles)
      ctx.fillStyle = catOrange;
      // Left ear
      ctx.beginPath();
      ctx.moveTo(1, -9);
      ctx.lineTo(4, -15);
      ctx.lineTo(7, -10);
      ctx.fill();
      // Right ear
      ctx.beginPath();
      ctx.moveTo(8, -10);
      ctx.lineTo(12, -15);
      ctx.lineTo(14, -8);
      ctx.fill();

      // Inner ears (pink)
      ctx.fillStyle = catPink;
      ctx.beginPath();
      ctx.moveTo(3, -10);
      ctx.lineTo(4, -13);
      ctx.lineTo(6, -10);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(9, -10);
      ctx.lineTo(11, -13);
      ctx.lineTo(12, -9);
      ctx.fill();

      // Collar with golden bell
      ctx.fillStyle = catCollar;
      ctx.fillRect(2, 2, 8, 2);
      ctx.fillStyle = catBell;
      ctx.beginPath();
      ctx.arc(6, 4, 2, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      if (isHurtOrCelebration) {
        // Cute happy squinting eyes ^^
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(6, -5, 2, Math.PI, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(10, -5, 2, Math.PI, 0);
        ctx.stroke();
      } else {
        // Big expressive glossy amber eyes
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(6, -4, 2.5, 0, Math.PI * 2);
        ctx.arc(10, -4, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Eye highlights
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(5.5, -5, 1, 0, Math.PI * 2);
        ctx.arc(9.5, -5, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cute pink nose
      ctx.fillStyle = catPink;
      ctx.beginPath();
      ctx.moveTo(8, -2);
      ctx.lineTo(7, -3);
      ctx.lineTo(9, -3);
      ctx.fill();

      // Whiskers
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(11, -2);
      ctx.lineTo(15, -3);
      ctx.moveTo(11, -1);
      ctx.lineTo(15, 0);
      ctx.stroke();

      ctx.restore();
    };

    for (let f = 0; f < 8; f++) {
      drawCat(f * 32, f);
    }

    tm.addSpriteSheet('player_cat', canvas as any, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  private static createEnemyTextures(tm: Phaser.Textures.TextureManager): void {
    // 1. Sleepy Hound (Dog)
    if (!tm.exists('enemy_hound')) {
      const c = document.createElement('canvas');
      c.width = 36;
      c.height = 28;
      const ctx = c.getContext('2d')!;
      // Body
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.ellipse(18, 16, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(28, 12, 7, 0, Math.PI * 2);
      ctx.fill();
      // Floppy ear
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(25, 14, 4, 7, 0.3, 0, Math.PI * 2);
      ctx.fill();
      // Snoot
      ctx.fillStyle = '#d97706';
      ctx.fillRect(30, 12, 5, 4);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(34, 12, 2, 2);
      // Sleeping eye
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(28, 10, 2, 0, Math.PI);
      ctx.stroke();
      // Legs
      ctx.fillStyle = '#78350f';
      ctx.fillRect(10, 22, 4, 6);
      ctx.fillRect(22, 22, 4, 6);
      tm.addCanvas('enemy_hound', c);
    }

    // 2. Mischievous Crow
    if (!tm.exists('enemy_crow')) {
      const c = document.createElement('canvas');
      c.width = 28;
      c.height = 24;
      const ctx = c.getContext('2d')!;
      // Body
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(14, 13, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Wing
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(12, 10, 7, 4, -0.4, 0, Math.PI * 2);
      ctx.fill();
      // Head & eye
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(20, 10, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(19, 8, 2, 2);
      // Beak
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(25, 9);
      ctx.lineTo(28, 11);
      ctx.lineTo(25, 12);
      ctx.fill();
      // Tail
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(2, 12, 6, 3);
      tm.addCanvas('enemy_crow', c);
    }

    // 3. Bouncing Frog
    if (!tm.exists('enemy_frog')) {
      const c = document.createElement('canvas');
      c.width = 28;
      c.height = 24;
      const ctx = c.getContext('2d')!;
      // Body
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.ellipse(14, 15, 10, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      // Light belly
      ctx.fillStyle = '#86efac';
      ctx.beginPath();
      ctx.ellipse(14, 17, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Eyes on top
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.arc(9, 8, 4, 0, Math.PI * 2);
      ctx.arc(19, 8, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(9, 8, 2, 0, Math.PI * 2);
      ctx.arc(19, 8, 2, 0, Math.PI * 2);
      ctx.fill();
      // Feet
      ctx.fillStyle = '#15803d';
      ctx.fillRect(4, 20, 6, 3);
      ctx.fillRect(18, 20, 6, 3);
      tm.addCanvas('enemy_frog', c);
    }

    // 4. Prickly Hedgehog
    if (!tm.exists('enemy_hedgehog')) {
      const c = document.createElement('canvas');
      c.width = 28;
      c.height = 22;
      const ctx = c.getContext('2d')!;
      // Spikes back
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(12, 11, 10, Math.PI * 0.7, Math.PI * 2);
      ctx.fill();
      // Face
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(18, 8);
      ctx.lineTo(26, 14);
      ctx.lineTo(16, 18);
      ctx.fill();
      // Eye & nose
      ctx.fillStyle = '#18181b';
      ctx.fillRect(20, 11, 2, 2);
      ctx.fillRect(25, 13, 2, 2);
      tm.addCanvas('enemy_hedgehog', c);
    }

    // 5. Friendly Street Pigeon (Interactive Creature)
    if (!tm.exists('creature_pigeon')) {
      const c = document.createElement('canvas');
      c.width = 26;
      c.height = 24;
      const ctx = c.getContext('2d')!;
      // Body
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.ellipse(12, 14, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Iridescent neck
      ctx.fillStyle = '#0d9488';
      ctx.beginPath();
      ctx.arc(18, 10, 4.5, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(19, 8, 4, 0, Math.PI * 2);
      ctx.fill();
      // Eye & Beak
      ctx.fillStyle = '#f97316';
      ctx.fillRect(19, 7, 1.5, 1.5);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(23, 8, 3, 2);
      // Feet
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(10, 19, 2, 4);
      ctx.fillRect(14, 19, 2, 4);
      tm.addCanvas('creature_pigeon', c);
    }
  }

  private static createCollectibleTextures(tm: Phaser.Textures.TextureManager): void {
    // 1. Golden Sardine
    if (!tm.exists('item_sardine')) {
      const c = document.createElement('canvas');
      c.width = 24;
      c.height = 18;
      const ctx = c.getContext('2d')!;
      // Golden Fish Body
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(11, 9, 8, 5, -0.1, 0, Math.PI * 2);
      ctx.fill();
      // Tail fin
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(3, 9);
      ctx.lineTo(0, 5);
      ctx.lineTo(0, 13);
      ctx.closePath();
      ctx.fill();
      // Shiny shimmer highlight
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(11, 7, 5, 2, -0.1, 0, Math.PI * 2);
      ctx.fill();
      // Eye
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(16, 8, 1.2, 0, Math.PI * 2);
      ctx.fill();
      tm.addCanvas('item_sardine', c);
    }

    // 2. Shiny Yarn Ball
    if (!tm.exists('item_yarn')) {
      const c = document.createElement('canvas');
      c.width = 22;
      c.height = 22;
      const ctx = c.getContext('2d')!;
      // Base wool circle
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(11, 11, 9, 0, Math.PI * 2);
      ctx.fill();
      // Woven wool curves
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(11, 11, 6, 0.4, Math.PI * 1.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(11, 11, 7, Math.PI * 1.2, Math.PI * 2.2);
      ctx.stroke();
      // Loose thread trailing out
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(18, 14);
      ctx.quadraticCurveTo(21, 18, 20, 21);
      ctx.stroke();
      tm.addCanvas('item_yarn', c);
    }

    // 3. Catnip Heart
    if (!tm.exists('item_catnip')) {
      const c = document.createElement('canvas');
      c.width = 20;
      c.height = 20;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(10, 16);
      ctx.bezierCurveTo(4, 11, 2, 6, 6, 4);
      ctx.bezierCurveTo(9, 2, 10, 6, 10, 6);
      ctx.bezierCurveTo(10, 6, 11, 2, 14, 4);
      ctx.bezierCurveTo(18, 6, 16, 11, 10, 16);
      ctx.fill();
      // Leaf vein
      ctx.strokeStyle = '#6ee7b7';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(10, 7);
      ctx.lineTo(10, 14);
      ctx.stroke();
      tm.addCanvas('item_catnip', c);
    }

    // 4. Secret Fish Trophy
    if (!tm.exists('item_trophy')) {
      const c = document.createElement('canvas');
      c.width = 24;
      c.height = 26;
      const ctx = c.getContext('2d')!;
      // Pedestal
      ctx.fillStyle = '#78350f';
      ctx.fillRect(4, 21, 16, 4);
      // Gold cat statuette
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(12, 13, 7, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Ears
      ctx.beginPath();
      ctx.moveTo(7, 7);
      ctx.lineTo(9, 2);
      ctx.lineTo(11, 6);
      ctx.lineTo(13, 6);
      ctx.lineTo(15, 2);
      ctx.lineTo(17, 7);
      ctx.fill();
      // Sparkle star
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(12, 11, 2, 0, Math.PI * 2);
      ctx.fill();
      tm.addCanvas('item_trophy', c);
    }
  }

  private static createPlatformTextures(tm: Phaser.Textures.TextureManager): void {
    // 1. Brick / Suburb Rooftop Tile (32x32)
    if (!tm.exists('tile_suburb')) {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 32;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#c2410c'; // Terracotta
      ctx.fillRect(0, 0, 32, 32);
      // Top moss/shingle trim
      ctx.fillStyle = '#15803d'; // Moss green
      ctx.fillRect(0, 0, 32, 4);
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(0, 5, 32, 2);
      // Brick mortar lines
      ctx.strokeStyle = '#9a3412';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0.5, 0.5, 31, 31);
      ctx.beginPath();
      ctx.moveTo(0, 16);
      ctx.lineTo(32, 16);
      ctx.moveTo(16, 0);
      ctx.lineTo(16, 16);
      ctx.moveTo(8, 16);
      ctx.lineTo(8, 32);
      ctx.moveTo(24, 16);
      ctx.lineTo(24, 32);
      ctx.stroke();
      tm.addCanvas('tile_suburb', c);
    }

    // 2. Forest Moss & Ancient Bark Tile (32x32)
    if (!tm.exists('tile_forest')) {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 32;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#451a03'; // Bark
      ctx.fillRect(0, 0, 32, 32);
      // Lush moss top
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(0, 0, 32, 6);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(0, 0, 32, 2);
      // Bark rings
      ctx.strokeStyle = '#290e02';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0.5, 0.5, 31, 31);
      ctx.beginPath();
      ctx.moveTo(6, 10);
      ctx.lineTo(6, 28);
      ctx.moveTo(18, 12);
      ctx.lineTo(18, 30);
      ctx.stroke();
      tm.addCanvas('tile_forest', c);
    }

    // 3. Maritime Dock Wood Plank Tile (32x32)
    if (!tm.exists('tile_harbor')) {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 32;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#78350f'; // Warm wood
      ctx.fillRect(0, 0, 32, 32);
      // Top lighter plank bevel
      ctx.fillStyle = '#92400e';
      ctx.fillRect(0, 0, 32, 4);
      // Planks seams & iron bolts
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0.5, 0.5, 31, 31);
      ctx.beginPath();
      ctx.moveTo(0, 16);
      ctx.lineTo(32, 16);
      ctx.stroke();
      // Iron bolts
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(4, 8, 1.5, 0, Math.PI * 2);
      ctx.arc(28, 8, 1.5, 0, Math.PI * 2);
      ctx.arc(4, 24, 1.5, 0, Math.PI * 2);
      ctx.arc(28, 24, 1.5, 0, Math.PI * 2);
      ctx.fill();
      tm.addCanvas('tile_harbor', c);
    }

    // 4. Mushroom Platform Cap
    if (!tm.exists('tile_mushroom')) {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 24;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#ec4899'; // Bright pink mushroom
      ctx.beginPath();
      ctx.ellipse(16, 16, 15, 10, 0, Math.PI, 0);
      ctx.fill();
      // White spots
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(10, 10, 3, 0, Math.PI * 2);
      ctx.arc(22, 11, 2.5, 0, Math.PI * 2);
      ctx.arc(16, 7, 2, 0, Math.PI * 2);
      ctx.fill();
      // Stem under
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(12, 16, 8, 8);
      tm.addCanvas('tile_mushroom', c);
    }

    // 5. Crumbling Brick Platform
    if (!tm.exists('tile_crumbling')) {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 18;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#78716c';
      ctx.fillRect(0, 0, 32, 18);
      // Crack lines
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(12, 8);
      ctx.lineTo(10, 18);
      ctx.moveTo(22, 0);
      ctx.lineTo(18, 10);
      ctx.lineTo(24, 18);
      ctx.stroke();
      tm.addCanvas('tile_crumbling', c);
    }
  }

  private static createObstacleTextures(tm: Phaser.Textures.TextureManager): void {
    // 1. Spikes
    if (!tm.exists('obstacle_spikes')) {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 16;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#64748b';
      // 3 spikes
      for (let i = 0; i < 3; i++) {
        const x = i * 10 + 1;
        ctx.beginPath();
        ctx.moveTo(x, 16);
        ctx.lineTo(x + 5, 1);
        ctx.lineTo(x + 10, 16);
        ctx.closePath();
        ctx.fill();
        // Sharp metallic glint
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 5, 2);
        ctx.lineTo(x + 7, 16);
        ctx.stroke();
      }
      tm.addCanvas('obstacle_spikes', c);
    }

    // 2. Springboard
    if (!tm.exists('obstacle_springboard')) {
      const c = document.createElement('canvas');
      c.width = 30;
      c.height = 18;
      const ctx = c.getContext('2d')!;
      // Base
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(2, 14, 26, 4);
      // Metallic spring coils
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(7, 14);
      ctx.lineTo(23, 10);
      ctx.lineTo(7, 6);
      ctx.lineTo(23, 3);
      ctx.stroke();
      // Red top bounce pad
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(2, 0, 26, 4);
      tm.addCanvas('obstacle_springboard', c);
    }

    // 3. Water Hazard
    if (!tm.exists('hazard_water')) {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 24;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 0, 32, 24);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, 3);
      ctx.bezierCurveTo(8, 0, 12, 6, 16, 3);
      ctx.bezierCurveTo(20, 0, 28, 6, 32, 3);
      ctx.lineTo(32, 0);
      ctx.lineTo(0, 0);
      ctx.fill();
      tm.addCanvas('hazard_water', c);
    }

    // 4. Checkpoint (Cat Food Bowl with Bell)
    if (!tm.exists('checkpoint_inactive')) {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 28;
      const ctx = c.getContext('2d')!;
      // Bowl base
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.ellipse(16, 20, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Empty rim
      ctx.fillStyle = '#1d4ed8';
      ctx.beginPath();
      ctx.ellipse(16, 17, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Post & quiet bell
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(16, 17);
      ctx.lineTo(16, 4);
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(16, 4, 3, 0, Math.PI * 2);
      ctx.fill();
      tm.addCanvas('checkpoint_inactive', c);
    }

    if (!tm.exists('checkpoint_active')) {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 28;
      const ctx = c.getContext('2d')!;
      // Bowl base
      ctx.fillStyle = '#10b981'; // Active emerald bowl!
      ctx.beginPath();
      ctx.ellipse(16, 20, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Filled with tasty cat crunchies
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(16, 17, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Post & shining golden bell
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(16, 17);
      ctx.lineTo(16, 4);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24'; // Golden ringing bell
      ctx.beginPath();
      ctx.arc(16, 4, 4, 0, Math.PI * 2);
      ctx.fill();
      tm.addCanvas('checkpoint_active', c);
    }

    // 5. Goal Door / Golden Archway
    if (!tm.exists('goal_cat_door')) {
      const c = document.createElement('canvas');
      c.width = 44;
      c.height = 54;
      const ctx = c.getContext('2d')!;
      // Wooden Arch Frame
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(22, 22, 20, Math.PI, 0);
      ctx.lineTo(42, 54);
      ctx.lineTo(2, 54);
      ctx.closePath();
      ctx.fill();
      // Cozy glowing golden interior
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(22, 22, 16, Math.PI, 0);
      ctx.lineTo(38, 54);
      ctx.lineTo(6, 54);
      ctx.closePath();
      ctx.fill();
      // Cute cat flap silhouette
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(22, 36, 10, 0, Math.PI * 2);
      ctx.fill();
      // Cat silhouette in door
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(22, 38, 5, 0, Math.PI * 2);
      ctx.fill();
      // Ears
      ctx.beginPath();
      ctx.moveTo(19, 34);
      ctx.lineTo(20, 31);
      ctx.lineTo(21, 33);
      ctx.moveTo(23, 33);
      ctx.lineTo(24, 31);
      ctx.lineTo(25, 34);
      ctx.fill();
      tm.addCanvas('goal_cat_door', c);
    }
  }

  private static createParticleTextures(tm: Phaser.Textures.TextureManager): void {
    if (!tm.exists('sparkle_particle')) {
      const c = document.createElement('canvas');
      c.width = 8;
      c.height = 8;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(4, 4, 3, 0, Math.PI * 2);
      ctx.fill();
      tm.addCanvas('sparkle_particle', c);
    }

    if (!tm.exists('dust_particle')) {
      const c = document.createElement('canvas');
      c.width = 6;
      c.height = 6;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(3, 3, 2.5, 0, Math.PI * 2);
      ctx.fill();
      tm.addCanvas('dust_particle', c);
    }
  }
}
