import { LevelDefinition } from '../types';

export const GAME_LEVELS: LevelDefinition[] = [
  // ==========================================
  // LEVEL 1: SUNNY ROOFTOPS (TUTORIAL)
  // ==========================================
  {
    id: 'level-1',
    worldNumber: 1,
    levelNumber: 1,
    name: 'Sunny Rooftops',
    subtitle: 'A Gentle Paws-On Tutorial',
    theme: 'suburb',
    backdropImage: '/src/assets/images/world1_suburban_backdrop_1791735074658.jpg',
    worldWidth: 2400,
    worldHeight: 700,
    spawnPoint: { x: 80, y: 520 },
    parTime: 35,
    platforms: [
      // Starting ground
      { x: 200, y: 580, width: 400, height: 40, type: 'ground' },
      // First steps
      { x: 480, y: 530, width: 120, height: 24, type: 'brick' },
      { x: 640, y: 470, width: 140, height: 24, type: 'brick' },
      // Main rooftop stretch
      { x: 880, y: 440, width: 280, height: 28, type: 'brick' },
      // Gap with lower landing
      { x: 1100, y: 560, width: 180, height: 32, type: 'ground' },
      // Springboard roof
      { x: 1320, y: 500, width: 160, height: 28, type: 'brick' },
      // High balcony
      { x: 1540, y: 380, width: 200, height: 28, type: 'brick' },
      // Checkpoint roof
      { x: 1820, y: 440, width: 220, height: 28, type: 'brick' },
      // Final rooftop goal area
      { x: 2150, y: 460, width: 380, height: 36, type: 'brick' },
    ],
    enemies: [
      // Friendly pigeons that flutter away when approaching
      { type: 'PIGEON', x: 500, y: 500 },
      { type: 'PIGEON', x: 920, y: 410 },
      { type: 'PIGEON', x: 1860, y: 410 },
    ],
    collectibles: [
      { type: 'SARDINE', x: 260, y: 540 },
      { type: 'SARDINE', x: 340, y: 540 },
      { type: 'SARDINE', x: 480, y: 490 },
      { type: 'SARDINE', x: 640, y: 430 },
      { type: 'SARDINE', x: 820, y: 400 },
      { type: 'SARDINE', x: 920, y: 400 },
      { type: 'SARDINE', x: 1000, y: 400 },
      { type: 'SARDINE', x: 1100, y: 520 },
      { type: 'SARDINE', x: 1320, y: 460 },
      { type: 'SARDINE', x: 1540, y: 340 },
      { type: 'SARDINE', x: 1620, y: 340 },
      // Secret Golden Trophy on high chimney
      { type: 'SECRET_TROPHY', x: 1600, y: 240, isSecret: true },
    ],
    hazards: [],
    springboards: [
      { x: 1380, y: 486, bounceForce: -560 },
    ],
    checkpoints: [
      { id: 'cp1-1', x: 1780, y: 418 },
    ],
    goal: {
      x: 2260,
      y: 415,
      width: 44,
      height: 54,
    },
  },

  // ==========================================
  // LEVEL 2: COBBLESTONE ALLEYWAYS
  // ==========================================
  {
    id: 'level-2',
    worldNumber: 1,
    levelNumber: 2,
    name: 'Cobblestone Alley',
    subtitle: 'Watch Out for Sleepy Hounds!',
    theme: 'suburb',
    backdropImage: '/src/assets/images/world1_suburban_backdrop_1791735074658.jpg',
    worldWidth: 2800,
    worldHeight: 750,
    spawnPoint: { x: 90, y: 560 },
    parTime: 45,
    platforms: [
      // Starting street
      { x: 220, y: 620, width: 440, height: 40, type: 'ground' },
      // Stepping awning
      { x: 480, y: 540, width: 120, height: 24, type: 'brick' },
      { x: 620, y: 470, width: 130, height: 24, type: 'brick' },
      // Alleyway courtyard with patrolling hound
      { x: 880, y: 580, width: 340, height: 32, type: 'ground' },
      // Crumbling brick section
      { x: 1120, y: 490, width: 90, height: 22, type: 'brick', isCrumbling: true },
      { x: 1240, y: 430, width: 90, height: 22, type: 'brick', isCrumbling: true },
      // Moving clothesline platform
      { x: 1420, y: 400, width: 120, height: 24, type: 'wood', isMoving: true, moveRangeX: 90, moveSpeed: 55 },
      // Mid-level rooftop with checkpoint
      { x: 1700, y: 440, width: 260, height: 28, type: 'brick' },
      // Lower hazard gap
      { x: 1980, y: 520, width: 140, height: 24, type: 'brick' },
      { x: 2160, y: 460, width: 130, height: 24, type: 'brick' },
      // High secret trellis
      { x: 2160, y: 290, width: 100, height: 20, type: 'wood' },
      // Final street avenue
      { x: 2480, y: 580, width: 420, height: 36, type: 'ground' },
    ],
    enemies: [
      // Sleepy Hound patrolling courtyard
      { type: 'HOUND', x: 880, y: 550, patrolDistance: 110, speed: 50 },
      // Friendly pigeon on chimney
      { type: 'PIGEON', x: 640, y: 440 },
      // Sleepy Hound guarding final lane
      { type: 'HOUND', x: 2480, y: 550, patrolDistance: 120, speed: 55 },
    ],
    collectibles: [
      { type: 'SARDINE', x: 260, y: 580 },
      { type: 'SARDINE', x: 380, y: 580 },
      { type: 'SARDINE', x: 480, y: 500 },
      { type: 'SARDINE', x: 620, y: 430 },
      { type: 'SARDINE', x: 800, y: 540 },
      { type: 'SARDINE', x: 960, y: 540 },
      { type: 'SARDINE', x: 1120, y: 450 },
      { type: 'SARDINE', x: 1240, y: 390 },
      { type: 'SARDINE', x: 1420, y: 360 },
      { type: 'SARDINE', x: 1700, y: 400 },
      { type: 'SARDINE', x: 1980, y: 480 },
      { type: 'SARDINE', x: 2160, y: 420 },
      { type: 'SARDINE', x: 2360, y: 540 },
      { type: 'SARDINE', x: 2460, y: 540 },
      // Secret Shiny Yarn Ball tucked on high trellis
      { type: 'YARN_BALL', x: 2160, y: 250, isSecret: true },
    ],
    hazards: [
      // Alleyway trash spikes hazard
      { type: 'spikes', x: 1400, y: 640, width: 120, height: 16 },
    ],
    springboards: [
      { x: 1980, y: 506, bounceForce: -600 },
    ],
    checkpoints: [
      { id: 'cp2-1', x: 1660, y: 418 },
    ],
    goal: {
      x: 2600,
      y: 535,
      width: 44,
      height: 54,
    },
  },

  // ==========================================
  // LEVEL 3: WHISPERING WOODS
  // ==========================================
  {
    id: 'level-3',
    worldNumber: 2,
    levelNumber: 1,
    name: 'Whispering Woods',
    subtitle: 'Bouncy Mushrooms & Soaring Crows',
    theme: 'forest',
    backdropImage: '/src/assets/images/world2_forest_backdrop_1791735083342.jpg',
    worldWidth: 3200,
    worldHeight: 800,
    spawnPoint: { x: 90, y: 600 },
    parTime: 55,
    platforms: [
      // Mossy forest entry
      { x: 220, y: 660, width: 440, height: 40, type: 'forest' },
      // Giant bouncy mushroom
      { x: 500, y: 580, width: 100, height: 26, type: 'mushroom' },
      // Ancient oak branch
      { x: 720, y: 480, width: 220, height: 28, type: 'forest' },
      // Floating moss stone
      { x: 990, y: 420, width: 120, height: 24, type: 'forest' },
      // Ground hollow with hedgehog
      { x: 1220, y: 620, width: 320, height: 32, type: 'forest' },
      // Ascending mushroom steps
      { x: 1460, y: 530, width: 90, height: 24, type: 'mushroom' },
      { x: 1600, y: 440, width: 90, height: 24, type: 'mushroom' },
      // Checkpoint canopy
      { x: 1840, y: 380, width: 240, height: 28, type: 'forest' },
      // Moving dandelion spore platform
      { x: 2120, y: 350, width: 110, height: 22, type: 'wood', isMoving: true, moveRangeX: 110, moveSpeed: 60 },
      // High secret canopy
      { x: 2120, y: 190, width: 120, height: 22, type: 'forest' },
      // Lower moss run
      { x: 2400, y: 490, width: 180, height: 24, type: 'forest' },
      { x: 2640, y: 560, width: 180, height: 24, type: 'forest' },
      // Ancient Great Tree goal sanctuary
      { x: 2950, y: 620, width: 400, height: 36, type: 'forest' },
    ],
    enemies: [
      // Flying Crow soaring above branch
      { type: 'CROW', x: 800, y: 380, patrolDistance: 130, speed: 65 },
      // Prickly hedgehog in hollow
      { type: 'HEDGEHOG', x: 1220, y: 590, patrolDistance: 90, speed: 45 },
      // Flying Crow in upper canopy
      { type: 'CROW', x: 2200, y: 300, patrolDistance: 120, speed: 70 },
      // Friendly forest pigeon
      { type: 'PIGEON', x: 1880, y: 350 },
    ],
    collectibles: [
      { type: 'SARDINE', x: 240, y: 620 },
      { type: 'SARDINE', x: 360, y: 620 },
      { type: 'SARDINE', x: 500, y: 530 },
      { type: 'SARDINE', x: 680, y: 440 },
      { type: 'SARDINE', x: 760, y: 440 },
      { type: 'SARDINE', x: 990, y: 380 },
      { type: 'SARDINE', x: 1160, y: 580 },
      { type: 'SARDINE', x: 1280, y: 580 },
      { type: 'SARDINE', x: 1460, y: 490 },
      { type: 'SARDINE', x: 1600, y: 400 },
      { type: 'SARDINE', x: 1840, y: 340 },
      { type: 'SARDINE', x: 2120, y: 310 },
      { type: 'SARDINE', x: 2400, y: 450 },
      { type: 'SARDINE', x: 2520, y: 510 },
      { type: 'SARDINE', x: 2640, y: 520 },
      { type: 'SARDINE', x: 2850, y: 580 },
      { type: 'SARDINE', x: 2950, y: 580 },
      // Secret Glowing Catnip Heart in high canopy
      { type: 'CATNIP_HEART', x: 2120, y: 150, isSecret: true },
    ],
    hazards: [
      // Briar thorn patch in forest floor
      { type: 'spikes', x: 980, y: 680, width: 140, height: 16 },
      { type: 'spikes', x: 2280, y: 680, width: 140, height: 16 },
    ],
    springboards: [
      { x: 500, y: 566, bounceForce: -620 },
    ],
    checkpoints: [
      { id: 'cp3-1', x: 1780, y: 358 },
    ],
    goal: {
      x: 3040,
      y: 575,
      width: 44,
      height: 54,
    },
  },

  // ==========================================
  // LEVEL 4: SUNKEN HARBOR DOCKS
  // ==========================================
  {
    id: 'level-4',
    worldNumber: 3,
    levelNumber: 1,
    name: 'Sunken Harbor Docks',
    subtitle: 'The Grand Maritime Challenge',
    theme: 'harbor',
    backdropImage: '/src/assets/images/world3_harbor_backdrop_1791735091455.jpg',
    worldWidth: 3600,
    worldHeight: 800,
    spawnPoint: { x: 90, y: 580 },
    parTime: 65,
    platforms: [
      // Starting wooden dock
      { x: 240, y: 640, width: 460, height: 40, type: 'harbor' },
      // Floating harbor raft
      { x: 580, y: 570, width: 120, height: 24, type: 'harbor' },
      // Crane tier 1
      { x: 780, y: 500, width: 140, height: 24, type: 'harbor' },
      // Moving cargo platform across bay
      { x: 1040, y: 440, width: 120, height: 24, type: 'wood', isMoving: true, moveRangeX: 120, moveSpeed: 60 },
      // Island dock with jumping frog
      { x: 1340, y: 580, width: 280, height: 32, type: 'harbor' },
      // Crumbling weathered jetty boards
      { x: 1580, y: 500, width: 80, height: 22, type: 'harbor', isCrumbling: true },
      { x: 1700, y: 440, width: 80, height: 22, type: 'harbor', isCrumbling: true },
      // Fishing tugboat checkpoint
      { x: 1960, y: 420, width: 260, height: 28, type: 'harbor' },
      // Vertical moving dock lift
      { x: 2260, y: 380, width: 110, height: 22, type: 'wood', isMoving: true, moveRangeY: 80, moveSpeed: 45 },
      // High lighthouse gantry
      { x: 2520, y: 320, width: 180, height: 24, type: 'harbor' },
      // Secret crow's nest
      { x: 2520, y: 170, width: 90, height: 20, type: 'wood' },
      // Final jetty stretch with frog & springboard
      { x: 2840, y: 480, width: 220, height: 28, type: 'harbor' },
      // Grand Golden Lighthouse Haven
      { x: 3250, y: 580, width: 440, height: 36, type: 'harbor' },
    ],
    enemies: [
      // Bouncing Frog on island dock
      { type: 'FROG', x: 1340, y: 550, patrolDistance: 90, speed: 45, jumpInterval: 1800 },
      // Soaring Seagull / Crow over the harbor waters
      { type: 'CROW', x: 1040, y: 360, patrolDistance: 120, speed: 65 },
      // Bouncing Frog on final jetty
      { type: 'FROG', x: 2860, y: 450, patrolDistance: 80, speed: 50, jumpInterval: 2000 },
      // Friendly maritime pigeon on tugboat
      { type: 'PIGEON', x: 1980, y: 390 },
    ],
    collectibles: [
      { type: 'SARDINE', x: 240, y: 600 },
      { type: 'SARDINE', x: 360, y: 600 },
      { type: 'SARDINE', x: 580, y: 530 },
      { type: 'SARDINE', x: 780, y: 460 },
      { type: 'SARDINE', x: 920, y: 420 },
      { type: 'SARDINE', x: 1040, y: 400 },
      { type: 'SARDINE', x: 1260, y: 540 },
      { type: 'SARDINE', x: 1380, y: 540 },
      { type: 'SARDINE', x: 1580, y: 460 },
      { type: 'SARDINE', x: 1700, y: 400 },
      { type: 'SARDINE', x: 1960, y: 380 },
      { type: 'SARDINE', x: 2060, y: 380 },
      { type: 'SARDINE', x: 2260, y: 340 },
      { type: 'SARDINE', x: 2440, y: 280 },
      { type: 'SARDINE', x: 2520, y: 280 },
      { type: 'SARDINE', x: 2740, y: 440 },
      { type: 'SARDINE', x: 2840, y: 440 },
      { type: 'SARDINE', x: 3120, y: 540 },
      { type: 'SARDINE', x: 3240, y: 540 },
      // Secret Golden Lighthouse Cat Trophy
      { type: 'SECRET_TROPHY', x: 2520, y: 130, isSecret: true },
    ],
    hazards: [
      // Harbor splash water hazards between docks
      { type: 'water', x: 440, y: 720, width: 140, height: 32 },
      { type: 'water', x: 900, y: 720, width: 240, height: 32 },
      { type: 'water', x: 1500, y: 720, width: 340, height: 32 },
      { type: 'water', x: 2160, y: 720, width: 300, height: 32 },
      { type: 'water', x: 2700, y: 720, width: 180, height: 32 },
    ],
    springboards: [
      { x: 780, y: 486, bounceForce: -580 },
      { x: 2840, y: 466, bounceForce: -620 },
    ],
    checkpoints: [
      { id: 'cp4-1', x: 1920, y: 398 },
    ],
    goal: {
      x: 3380,
      y: 535,
      width: 44,
      height: 54,
    },
  },
];
