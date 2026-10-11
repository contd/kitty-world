import { StorageAdapter } from './adapters/StorageAdapter';
import { TauriSqliteAdapter } from './adapters/TauriSqliteAdapter';
import { GameSaveData, DEFAULT_SAVE_DATA, createDefaultSaveData } from './types';
import { runMigrations, validateSaveData } from './migrations';

const SAVE_KEY = 'whiskers_save_primary';

export class SaveRepository {
  private adapter: StorageAdapter;
  private cachedSave: GameSaveData | null = null;
  private isInitialized = false;

  constructor(adapter?: StorageAdapter) {
    this.adapter = adapter || new TauriSqliteAdapter();
  }

  async init(): Promise<void> {
    if (this.isInitialized) return;
    await this.adapter.init();
    this.isInitialized = true;
  }

  async getSave(): Promise<GameSaveData> {
    await this.init();
    if (this.cachedSave) {
      return this.cachedSave;
    }

    try {
      const raw = await this.adapter.get<any>(SAVE_KEY);
      if (!raw) {
        // First launch: write and cache defaults
        const fresh = createDefaultSaveData();
        await this.adapter.set(SAVE_KEY, fresh);
        this.cachedSave = fresh;
        return fresh;
      }

      // Run migrations and validation
      const migrated = runMigrations(raw);
      this.cachedSave = migrated;
      return migrated;
    } catch (err) {
      console.error('Failed to load save from storage adapter. Recovering safely with default state:', err);
      const recovery = createDefaultSaveData();
      this.cachedSave = recovery;
      return recovery;
    }
  }

  async writeSave(data: GameSaveData): Promise<void> {
    await this.init();
    const { isValid, sanitized } = validateSaveData(data);
    sanitized.updatedAt = Date.now();
    this.cachedSave = sanitized;
    await this.adapter.set(SAVE_KEY, sanitized);
  }

  async resetSave(): Promise<GameSaveData> {
    await this.init();
    const fresh = createDefaultSaveData();
    await this.adapter.set(SAVE_KEY, fresh);
    this.cachedSave = fresh;
    return fresh;
  }

  async exportSaveJson(): Promise<string> {
    const save = await this.getSave();
    return JSON.stringify(save, null, 2);
  }

  async importSaveJson(jsonString: string): Promise<GameSaveData> {
    try {
      const parsed = JSON.parse(jsonString);
      const migrated = runMigrations(parsed);
      await this.writeSave(migrated);
      return migrated;
    } catch (err) {
      throw new Error(`Invalid save JSON: ${(err as Error).message}`);
    }
  }
}

export const saveRepository = new SaveRepository();
