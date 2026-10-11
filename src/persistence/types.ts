/**
 * Persistence data types, schemas, and default states
 */

export interface GameSettings {
  musicVolume: number; // 0.0 to 1.0
  sfxVolume: number;   // 0.0 to 1.0
  isMuted: boolean;
  touchControlsEnabled: boolean;
  touchControlScale: number; // 0.8 to 1.4
  screenShake: boolean;
  highContrast: boolean;
}

export interface LevelProgress {
  levelId: string;
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0 to 3
  bestTime: number | null; // in seconds
  sardinesCollected: number;
  maxSardines: number;
  secretFound: boolean;
}

export interface GameSaveData {
  schemaVersion: number;
  saveId: string;
  createdAt: number;
  updatedAt: number;
  totalScore: number;
  totalSardines: number;
  currentWorld: number;
  selectedCostume: string; // 'classic_ginger', 'tuxedo', 'calico'
  unlockedCostumes: string[];
  levels: Record<string, LevelProgress>;
  achievements: string[];
}

export const CURRENT_SCHEMA_VERSION = 1;

export const DEFAULT_SETTINGS: GameSettings = {
  musicVolume: 0.6,
  sfxVolume: 0.8,
  isMuted: false,
  touchControlsEnabled: false, // auto-enabled on touch devices
  touchControlScale: 1.0,
  screenShake: true,
  highContrast: false,
};

export const INITIAL_LEVELS: Record<string, LevelProgress> = {
  'level-1': {
    levelId: 'level-1',
    unlocked: true,
    completed: false,
    stars: 0,
    bestTime: null,
    sardinesCollected: 0,
    maxSardines: 12,
    secretFound: false,
  },
  'level-2': {
    levelId: 'level-2',
    unlocked: false,
    completed: false,
    stars: 0,
    bestTime: null,
    sardinesCollected: 0,
    maxSardines: 15,
    secretFound: false,
  },
  'level-3': {
    levelId: 'level-3',
    unlocked: false,
    completed: false,
    stars: 0,
    bestTime: null,
    sardinesCollected: 0,
    maxSardines: 18,
    secretFound: false,
  },
  'level-4': {
    levelId: 'level-4',
    unlocked: false,
    completed: false,
    stars: 0,
    bestTime: null,
    sardinesCollected: 0,
    maxSardines: 20,
    secretFound: false,
  },
};

export function createInitialLevels(): Record<string, LevelProgress> {
  return JSON.parse(JSON.stringify(INITIAL_LEVELS));
}

export function createDefaultSaveData(): GameSaveData {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    saveId: 'whiskers-offline-save-primary',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    totalScore: 0,
    totalSardines: 0,
    currentWorld: 1,
    selectedCostume: 'classic_ginger',
    unlockedCostumes: ['classic_ginger'],
    levels: createInitialLevels(),
    achievements: [],
  };
}

export const DEFAULT_SAVE_DATA: GameSaveData = createDefaultSaveData();
