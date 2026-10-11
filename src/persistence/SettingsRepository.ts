import { StorageAdapter } from './adapters/StorageAdapter';
import { TauriSqliteAdapter } from './adapters/TauriSqliteAdapter';
import { GameSettings, DEFAULT_SETTINGS } from './types';
import { detectPlatform } from '../app/platform';

const SETTINGS_KEY = 'whiskers_settings_v1';

export class SettingsRepository {
  private adapter: StorageAdapter;
  private cachedSettings: GameSettings | null = null;
  private isInitialized = false;

  constructor(adapter?: StorageAdapter) {
    this.adapter = adapter || new TauriSqliteAdapter();
  }

  async init(): Promise<void> {
    if (this.isInitialized) return;
    await this.adapter.init();
    this.isInitialized = true;
  }

  async getSettings(): Promise<GameSettings> {
    await this.init();
    if (this.cachedSettings) return this.cachedSettings;

    try {
      const stored = await this.adapter.get<Partial<GameSettings>>(SETTINGS_KEY);
      const platform = detectPlatform();

      // On mobile or touch devices, default touchControlsEnabled to true if not explicitly set
      const defaultTouch = platform.hasTouch || platform.isMobile;

      const merged: GameSettings = {
        ...DEFAULT_SETTINGS,
        touchControlsEnabled: defaultTouch,
        ...(stored || {}),
      };

      this.cachedSettings = merged;
      return merged;
    } catch (err) {
      console.warn('Failed to load settings, using defaults:', err);
      return { ...DEFAULT_SETTINGS };
    }
  }

  async saveSettings(settings: Partial<GameSettings>): Promise<GameSettings> {
    await this.init();
    const current = await this.getSettings();
    const updated: GameSettings = {
      ...current,
      ...settings,
    };
    this.cachedSettings = updated;
    await this.adapter.set(SETTINGS_KEY, updated);
    return updated;
  }
}

export const settingsRepository = new SettingsRepository();
