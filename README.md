# Whiskers & Wonders: 2D Adventure Platformer

A charming, responsive, cross-platform 2D platform adventure game built with **Tauri v2, Phaser 3, TypeScript, and React**.

Inspired by the cozy exploration and animal personality of *Little Kitty, Big City* combined with classic side-scrolling platformer mechanics.

---

## 🎮 Gameplay Features

- **Nimble Feline Protagonist:** Fully animated player controller featuring smooth acceleration, coyote time (120ms), jump buffering (120ms), variable jump height, enemy bounce pouncing, damage knockback, and a purr/meow emote (`E` key or heart button).
- **4 Complete Playable Levels:**
  - **Level 1: Sunny Rooftops (Tutorial):** Gentle introduction to running, jumping, springboards, peaceful street pigeons, snack bowl checkpoints, and attic doors.
  - **Level 2: Cobblestone Alley:** Patrolling Sleepy Hounds, crumbling brick platforms, moving clothesline platforms, and a hidden secret yarn ball.
  - **Level 3: Whispering Woods:** Mossy forest canopy, giant bouncy mushrooms, soaring crows, prickly hedgehogs, and secret catnip heart.
  - **Level 4: Sunken Harbor Docks:** Floating dock platforms over water hazards, jumping frogs, crane platforms, and the Grand Golden Lighthouse Haven.
- **Enemies & Creatures:**
  - *Sleepy Hound:* Patrolling guard dog with snoot collision.
  - *Mischievous Crow:* Aerial patrol with swoop hovering.
  - *Bouncing Frog:* Timed hopping cycles.
  - *Prickly Hedgehog:* Ground hazard patrol.
  - *Street Pigeon:* Interactive friendly creature that flutters up safely when approached.
- **Collectibles & Progression:** Golden sardines, shiny yarn balls, glowing catnip hearts, golden trophies, star ratings (1 to 3 stars per stage), and high scores.
- **Unified Controls:**
  - **Keyboard:** Arrow keys or `A`/`D` to move, `Space`/`W`/`Up` to jump, `E` to meow, `Esc` to pause.
  - **Gamepad:** Full controller support with D-pad, stick, and button mapping.
  - **Mobile Touch:** On-screen virtual D-pad and jump button with notch and safe-area inset handling.
- **100% Offline Procedural Sound:** Web Audio API synthesizer for jump swooshes, bell chimes, purrs, bounces, fanfares, and cozy ambient music.

---

## 🛠️ Technology Stack & Architecture

- **Native Shell:** Tauri v2 with least-privilege capability manifests.
- **Game Engine:** Phaser 3 with Arcade Physics and WebGL renderer (Canvas fallback).
- **Language & Framework:** TypeScript with strict type checking, React 19, Tailwind CSS.
- **Local-First Persistence:** Native SQLite plugin (`tauri-plugin-sql`) on desktop, with browser IndexedDB / localStorage fallback. Includes schema versioning, corrupt save recovery, and JSON import/export.
- **Future Sync Architecture:** Clean `SyncService` abstraction with conflict resolution hooks ready for future cloud backends.

---

## 🚀 Getting Started

### Development Mode
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Automated Tests
```bash
npm test
```

### Type Checking & Linting
```bash
npm run lint
```

### Build Desktop Application (Tauri v2)
```bash
cargo tauri build
```

### Build iOS Application
See [`IOS_SETUP.md`](./IOS_SETUP.md) for full Xcode prerequisites and mobile packaging instructions.

---

## 📄 License & Attribution

See [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md) for complete asset licenses and open-source attributions.
