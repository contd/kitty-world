import { GameSaveData, CURRENT_SCHEMA_VERSION, DEFAULT_SAVE_DATA, INITIAL_LEVELS, createDefaultSaveData, createInitialLevels } from '../types';

export interface Migration {
  fromVersion: number;
  toVersion: number;
  migrate(data: any): GameSaveData;
}

export const migrations: Migration[] = [
  // Example future migration from version 1 to 2
  {
    fromVersion: 1,
    toVersion: 2,
    migrate(data: any): GameSaveData {
      return {
        ...data,
        schemaVersion: 2,
        updatedAt: Date.now(),
      };
    },
  },
];

export function validateSaveData(data: any): { isValid: boolean; sanitized: GameSaveData } {
  if (!data || typeof data !== 'object') {
    return { isValid: false, sanitized: createDefaultSaveData() };
  }

  try {
    const sanitized: GameSaveData = {
      schemaVersion: typeof data.schemaVersion === 'number' ? data.schemaVersion : CURRENT_SCHEMA_VERSION,
      saveId: typeof data.saveId === 'string' ? data.saveId : 'whiskers-offline-save-primary',
      createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
      updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
      totalScore: typeof data.totalScore === 'number' && !isNaN(data.totalScore) ? Math.max(0, data.totalScore) : 0,
      totalSardines: typeof data.totalSardines === 'number' && !isNaN(data.totalSardines) ? Math.max(0, data.totalSardines) : 0,
      currentWorld: typeof data.currentWorld === 'number' ? data.currentWorld : 1,
      selectedCostume: typeof data.selectedCostume === 'string' ? data.selectedCostume : 'classic_ginger',
      unlockedCostumes: Array.isArray(data.unlockedCostumes) ? data.unlockedCostumes : ['classic_ginger'],
      levels: createInitialLevels(),
      achievements: Array.isArray(data.achievements) ? data.achievements : [],
    };

    // Merge saved level progress
    if (data.levels && typeof data.levels === 'object') {
      for (const levelId of Object.keys(INITIAL_LEVELS)) {
        if (data.levels[levelId]) {
          const rawLvl = data.levels[levelId];
          sanitized.levels[levelId] = {
            levelId,
            unlocked: Boolean(rawLvl.unlocked || levelId === 'level-1'),
            completed: Boolean(rawLvl.completed),
            stars: Math.min(3, Math.max(0, Number(rawLvl.stars) || 0)),
            bestTime: typeof rawLvl.bestTime === 'number' ? rawLvl.bestTime : null,
            sardinesCollected: Math.max(0, Number(rawLvl.sardinesCollected) || 0),
            maxSardines: INITIAL_LEVELS[levelId].maxSardines,
            secretFound: Boolean(rawLvl.secretFound),
          };
        }
      }
    }

    return { isValid: true, sanitized };
  } catch (err) {
    console.error('Save data validation failure:', err);
    return { isValid: false, sanitized: { ...DEFAULT_SAVE_DATA, createdAt: Date.now(), updatedAt: Date.now() } };
  }
}

export function runMigrations(data: any): GameSaveData {
  let { isValid, sanitized } = validateSaveData(data);
  if (!isValid) {
    console.warn('Corrupt or missing save detected. Safe recovery initiated with default save.');
    return sanitized;
  }

  let currentVer = sanitized.schemaVersion;
  while (currentVer < CURRENT_SCHEMA_VERSION) {
    const migration = migrations.find((m) => m.fromVersion === currentVer);
    if (!migration) {
      console.warn(`No migration path from version ${currentVer} to ${CURRENT_SCHEMA_VERSION}. Clamping to current schema.`);
      sanitized.schemaVersion = CURRENT_SCHEMA_VERSION;
      break;
    }
    sanitized = migration.migrate(sanitized);
    currentVer = sanitized.schemaVersion;
  }

  return sanitized;
}
