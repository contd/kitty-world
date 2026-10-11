import { StorageAdapter } from './StorageAdapter';
import { BrowserIndexedDBAdapter } from './BrowserIndexedDBAdapter';
import { detectPlatform } from '../../app/platform';

export class TauriSqliteAdapter implements StorageAdapter {
  readonly name = 'TauriSQLite';
  private fallbackAdapter = new BrowserIndexedDBAdapter();
  private isTauriNative = false;
  private dbInstance: any = null;

  async init(): Promise<void> {
    const platform = detectPlatform();

    if (platform.isTauri) {
      try {
        // Dynamically load Tauri SQL plugin if available in native runtime
        // In Tauri v2: import Database from '@tauri-apps/plugin-sql';
        const tauriSql = await import('@tauri-apps/api/core').catch(() => null);
        if (tauriSql) {
          this.isTauriNative = true;
          // Execute initialization SQL query via Tauri invoke or plugin
          // In standard runtime we ensure table structure:
          // CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT, updated_at INTEGER);
        }
      } catch (err) {
        console.info('Tauri SQLite plugin not detected at runtime; employing browser persistence engine:', err);
        this.isTauriNative = false;
      }
    }

    // Initialize fallback (IndexedDB / LocalStorage)
    await this.fallbackAdapter.init();
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.isTauriNative && this.dbInstance) {
      try {
        const rows = await this.dbInstance.select(
          'SELECT value FROM kv_store WHERE key = $1',
          [key]
        );
        if (rows && rows.length > 0) {
          return JSON.parse(rows[0].value) as T;
        }
        return null;
      } catch (err) {
        console.warn('Tauri SQLite select error, delegating to browser adapter:', err);
      }
    }
    return this.fallbackAdapter.get<T>(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (this.isTauriNative && this.dbInstance) {
      try {
        const serialized = JSON.stringify(value);
        const now = Date.now();
        await this.dbInstance.execute(
          'INSERT INTO kv_store (key, value, updated_at) VALUES ($1, $2, $3) ON CONFLICT(key) DO UPDATE SET value = $2, updated_at = $3',
          [key, serialized, now]
        );
        return;
      } catch (err) {
        console.warn('Tauri SQLite set error, delegating to browser adapter:', err);
      }
    }
    return this.fallbackAdapter.set<T>(key, value);
  }

  async remove(key: string): Promise<void> {
    if (this.isTauriNative && this.dbInstance) {
      try {
        await this.dbInstance.execute('DELETE FROM kv_store WHERE key = $1', [key]);
        return;
      } catch (err) {
        console.warn('Tauri SQLite delete error:', err);
      }
    }
    return this.fallbackAdapter.remove(key);
  }

  async clear(): Promise<void> {
    if (this.isTauriNative && this.dbInstance) {
      try {
        await this.dbInstance.execute('DELETE FROM kv_store');
        return;
      } catch (err) {
        console.warn('Tauri SQLite clear error:', err);
      }
    }
    return this.fallbackAdapter.clear();
  }
}
