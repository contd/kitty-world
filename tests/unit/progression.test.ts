import { describe, it, expect } from 'vitest';
import { ProgressRepository } from '../../src/persistence/ProgressRepository';
import { SaveRepository } from '../../src/persistence/SaveRepository';
import { StorageAdapter } from '../../src/persistence/adapters/StorageAdapter';
import { DEFAULT_SAVE_DATA, GameSaveData } from '../../src/persistence/types';

// In-memory mock adapter for deterministic unit tests
class MockMemoryAdapter implements StorageAdapter {
  readonly name = 'MemoryMock';
  private store = new Map<string, any>();

  async init(): Promise<void> {}
  async get<T>(key: string): Promise<T | null> {
    return this.store.get(key) || null;
  }
  async set<T>(key: string, value: T): Promise<void> {
    this.store.set(key, JSON.parse(JSON.stringify(value)));
  }
  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }
  async clear(): Promise<void> {
    this.store.clear();
  }
}

describe('Level Progression & Unlocking Logic', () => {
  it('unlocks Level 2 after completing Level 1', async () => {
    const mockAdapter = new MockMemoryAdapter();
    const saveRepo = new SaveRepository(mockAdapter);
    const progressRepo = new ProgressRepository(saveRepo);

    // Initial state: Level 1 unlocked, Level 2 locked
    const initial = await progressRepo.getAllProgress();
    expect(initial.levels['level-1'].unlocked).toBe(true);
    expect(initial.levels['level-2'].unlocked).toBe(false);

    // Complete Level 1 with 12 sardines in 32 seconds
    const result = await progressRepo.recordLevelCompletion('level-1', 32, 12, true);

    expect(result.levelId).toBe('level-1');
    expect(result.unlockedNextLevelId).toBe('level-2');
    expect(result.earnedStars).toBe(3);

    // Verify persisted state reflects unlocked Level 2
    const updated = await progressRepo.getAllProgress();
    expect(updated.levels['level-2'].unlocked).toBe(true);
    expect(updated.levels['level-1'].completed).toBe(true);
    expect(updated.totalSardines).toBe(12);
  });

  it('updates best clear time only when faster', async () => {
    const mockAdapter = new MockMemoryAdapter();
    const saveRepo = new SaveRepository(mockAdapter);
    const progressRepo = new ProgressRepository(saveRepo);

    // First clear: 40 seconds
    const res1 = await progressRepo.recordLevelCompletion('level-1', 40, 8, false);
    expect(res1.isNewBestTime).toBe(true);

    // Second clear: 45 seconds (slower)
    const res2 = await progressRepo.recordLevelCompletion('level-1', 45, 10, false);
    expect(res2.isNewBestTime).toBe(false);

    const check = await progressRepo.getLevelProgress('level-1');
    expect(check?.bestTime).toBe(40);
  });
});
