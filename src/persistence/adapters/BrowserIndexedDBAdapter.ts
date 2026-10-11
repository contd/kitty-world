import { StorageAdapter } from './StorageAdapter';

const DB_NAME = 'WhiskersAdventureDB';
const DB_VERSION = 1;
const STORE_NAME = 'game_data';

export class BrowserIndexedDBAdapter implements StorageAdapter {
  readonly name = 'IndexedDB';
  private db: IDBDatabase | null = null;
  private isAvailable = false;

  async init(): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('IndexedDB is not available in this environment. Falling back to localStorage.');
      this.isAvailable = false;
      return;
    }

    try {
      this.db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      this.isAvailable = true;
    } catch (err) {
      console.warn('Failed to open IndexedDB, falling back to localStorage:', err);
      this.isAvailable = false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.isAvailable && this.db) {
      try {
        return await new Promise<T | null>((resolve, reject) => {
          const tx = this.db!.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const request = store.get(key);

          request.onsuccess = () => {
            resolve(request.result !== undefined ? (request.result as T) : null);
          };
          request.onerror = () => reject(request.error);
        });
      } catch (err) {
        console.warn('IndexedDB get error, falling back to localStorage:', err);
      }
    }

    // LocalStorage fallback
    try {
      const item = localStorage.getItem(`${DB_NAME}_${key}`);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (this.isAvailable && this.db) {
      try {
        await new Promise<void>((resolve, reject) => {
          const tx = this.db!.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const request = store.put(value, key);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
        return;
      } catch (err) {
        console.warn('IndexedDB set error, falling back to localStorage:', err);
      }
    }

    // LocalStorage fallback
    try {
      localStorage.setItem(`${DB_NAME}_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  }

  async remove(key: string): Promise<void> {
    if (this.isAvailable && this.db) {
      try {
        await new Promise<void>((resolve, reject) => {
          const tx = this.db!.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const request = store.delete(key);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (err) {
        console.warn('IndexedDB remove error:', err);
      }
    }

    try {
      localStorage.removeItem(`${DB_NAME}_${key}`);
    } catch {}
  }

  async clear(): Promise<void> {
    if (this.isAvailable && this.db) {
      try {
        await new Promise<void>((resolve, reject) => {
          const tx = this.db!.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const request = store.clear();

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (err) {
        console.warn('IndexedDB clear error:', err);
      }
    }

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(DB_NAME)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {}
  }
}
