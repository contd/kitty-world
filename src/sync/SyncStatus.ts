/**
 * Synchronization state model for future cloud sync functionality
 */

export type SyncState = 'DISABLED' | 'IDLE' | 'UNCONFIGURED' | 'SYNCING' | 'OFFLINE_READY' | 'CONFLICT';

export interface SyncStatus {
  state: SyncState;
  lastSyncedAt: number | null;
  pendingMutationsCount: number;
  message: string;
  isCloudConfigured: boolean;
}

export const INITIAL_SYNC_STATUS: SyncStatus = {
  state: 'OFFLINE_READY',
  lastSyncedAt: null,
  pendingMutationsCount: 0,
  message: 'Local-first offline mode active. All progress is safely stored on this device.',
  isCloudConfigured: false,
};
