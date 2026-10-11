import { GameSaveData } from '../persistence/types';

export interface SyncPayload {
  saveId: string;
  schemaVersion: number;
  clientTimestamp: number;
  data: GameSaveData;
  checksum: string;
}

export type ConflictResolutionStrategy = 'LAST_WRITE_WINS' | 'PREFER_MAX_PROGRESS' | 'MANUAL_PROMPT';

export interface RemoteTransportAdapter {
  isAvailable(): Promise<boolean>;
  push(payload: SyncPayload): Promise<{ success: boolean; remoteRevision?: string }>;
  pull(saveId: string): Promise<SyncPayload | null>;
}
