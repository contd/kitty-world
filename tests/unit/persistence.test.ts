import { describe, it, expect } from 'vitest';
import { validateSaveData, runMigrations } from '../../src/persistence/migrations';
import { DEFAULT_SAVE_DATA, CURRENT_SCHEMA_VERSION } from '../../src/persistence/types';

describe('Local-First Persistence & Schema Migrations', () => {
  it('validates and preserves valid save data', () => {
    const raw = {
      schemaVersion: 1,
      saveId: 'test-save',
      createdAt: 1000,
      updatedAt: 2000,
      totalScore: 1500,
      totalSardines: 25,
      currentWorld: 1,
      selectedCostume: 'classic_ginger',
      unlockedCostumes: ['classic_ginger'],
      levels: {
        'level-1': {
          levelId: 'level-1',
          unlocked: true,
          completed: true,
          stars: 3,
          bestTime: 28,
          sardinesCollected: 12,
          maxSardines: 12,
          secretFound: true,
        },
      },
      achievements: ['fish_feast'],
    };

    const { isValid, sanitized } = validateSaveData(raw);
    expect(isValid).toBe(true);
    expect(sanitized.totalScore).toBe(1500);
    expect(sanitized.levels['level-1'].stars).toBe(3);
    expect(sanitized.levels['level-1'].completed).toBe(true);
  });

  it('safely recovers from corrupt or malformed save data', () => {
    const corrupt = {
      schemaVersion: 'invalid',
      totalScore: -999,
      levels: null,
    };

    const { isValid, sanitized } = validateSaveData(corrupt);
    expect(sanitized.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(sanitized.totalScore).toBe(0);
    expect(sanitized.levels['level-1'].unlocked).toBe(true);
  });

  it('runs schema migrations correctly', () => {
    const v1Data = {
      ...DEFAULT_SAVE_DATA,
      schemaVersion: 1,
    };

    const migrated = runMigrations(v1Data);
    expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
  });
});
