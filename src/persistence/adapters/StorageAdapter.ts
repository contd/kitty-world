/**
 * Generic Storage Adapter Interface for Local-First Persistence
 */

export interface StorageAdapter {
  readonly name: string;
  init(): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}
