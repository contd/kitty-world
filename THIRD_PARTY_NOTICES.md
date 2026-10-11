# Third-Party Notices and Asset Inventory

This document provides license information and attribution for third-party libraries and original assets used in **Whiskers & Wonders: 2D Adventure Platformer**.

---

## 1. Local Game Assets Inventory

| Asset Name | Local File Path | Source / Creator | License | Modifications |
| :--- | :--- | :--- | :--- | :--- |
| **Title Key Art** | `/src/assets/images/hero_cat_adventure_cover_1791735064904.jpg` | Original Project Production Art | CC0 / Project License | Full resolution cover art for game menus |
| **World 1 Backdrop (Suburbia)** | `/src/assets/images/world1_suburban_backdrop_1791735074658.jpg` | Original Project Production Art | CC0 / Project License | Parallax background layer for Levels 1 & 2 |
| **World 2 Backdrop (Whispering Woods)** | `/src/assets/images/world2_forest_backdrop_1791735083342.jpg` | Original Project Production Art | CC0 / Project License | Parallax background layer for Level 3 |
| **World 3 Backdrop (Sunken Harbor)** | `/src/assets/images/world3_harbor_backdrop_1791735091455.jpg` | Original Project Production Art | CC0 / Project License | Parallax background layer for Level 4 |
| **Player Spritesheet (Whiskers)** | Procedural in `src/game/systems/TextureGenerator.ts` | Original In-Engine Canvas Synthesis | MIT / CC0 | 8-frame animations: Idle, Run, Jump, Fall, Hurt, Meow |
| **Enemy Sprites** (Hound, Crow, Frog, Hedgehog, Pigeon) | Procedural in `src/game/systems/TextureGenerator.ts` | Original In-Engine Canvas Synthesis | MIT / CC0 | Animated sprites with collision hitboxes |
| **Tilesets & Obstacles** (Bricks, Wood, Mushrooms, Spikes, Bowls) | Procedural in `src/game/systems/TextureGenerator.ts` | Original In-Engine Canvas Synthesis | MIT / CC0 | Modular 32x32 tiles and interactable obstacles |
| **Synthesized Audio** | Procedural in `src/game/systems/AudioSynthesizer.ts` | Web Audio API Synthesizer | MIT | Real-time oscillator sound effects and melodies |

---

## 2. Software Dependencies & Libraries

### Phaser 3
- **Copyright:** (c) 2011-2024 Richard Davey, Photon Storm Ltd.
- **License:** MIT License
- **URL:** https://phaser.io

### Tauri v2
- **Copyright:** (c) 2019-2024 Tauri Programme within The Commons Conservancy.
- **License:** MIT or Apache 2.0 License
- **URL:** https://tauri.app

### React & React DOM
- **Copyright:** (c) Meta Platforms, Inc. and affiliates.
- **License:** MIT License
- **URL:** https://react.dev

### Lucide React
- **Copyright:** (c) Lucide Project
- **License:** ISC License
- **URL:** https://lucide.dev

### Vitest
- **Copyright:** (c) Anthony Fu and Vitest contributors
- **License:** MIT License
- **URL:** https://vitest.dev

### Canvas-Confetti
- **Copyright:** (c) 2020 Kiril Vatev
- **License:** ISC License
- **URL:** https://github.com/catdad/canvas-confetti
