import { SyncStatus, INITIAL_SYNC_STATUS } from './SyncStatus';
import { SyncPayload, RemoteTransportAdapter, ConflictResolutionStrategy } from './SyncTypes';
import { SaveRepository, saveRepository } from '../persistence/SaveRepository';
import { GameSaveData } from '../persistence/types';

/**
 * SyncService abstraction designed for local-first play with future cloud backend extensions.
 * In this initial release:
 * - Operates entirely offline without making network requests.
 * - Manages an offline mutation queue abstraction.
 * - Documents conflict resolution hooks.
 * - Reflects an honest 'Local-First Offline' state in settings.
 */
export class SyncService {
  private status: SyncStatus = { ...INITIAL_SYNC_STATUS };
  private transport: RemoteTransportAdapter | null = null;
  private saveRepo: SaveRepository;
  private pendingQueue: SyncPayload[] = [];
  private conflictStrategy: ConflictResolutionStrategy = 'PREFER_MAX_PROGRESS';
  private statusListeners: Array<(status: SyncStatus) => void> = [];

  constructor(saveRepo?: SaveRepository) {
    this.saveRepo = saveRepo || saveRepository;
  }

  getStatus(): SyncStatus {
    return { ...this.status };
  }

  subscribe(listener: (status: SyncStatus) => void): () => void {
    this.statusListeners.push(listener);
    listener(this.getStatus());
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    const s = this.getStatus();
    this.statusListeners.forEach((l) => l(s));
  }

  /**
   * Extension point: Allows plugging in a remote transport (e.g. Firebase, custom API, WebDAV)
   * in future updates without rewriting game persistence.
   */
  registerTransport(transport: RemoteTransportAdapter): void {
    this.transport = transport;
    this.status = {
      ...this.status,
      isCloudConfigured: true,
      message: 'Cloud transport registered (Ready for configuration)',
    };
    this.notify();
  }

  /**
   * Prepares a serializable payload with checksum metadata
   */
  createSyncPayload(data: GameSaveData): SyncPayload {
    const jsonStr = JSON.stringify(data);
    // Simple fast hashing for local payload integrity
    let hash = 0;
    for (let i = 0; i < jsonStr.length; i++) {
      hash = (hash << 5) - hash + jsonStr.charCodeAt(i);
      hash |= 0;
    }

    return {
      saveId: data.saveId,
      schemaVersion: data.schemaVersion,
      clientTimestamp: Date.now(),
      data,
      checksum: Math.abs(hash).toString(16),
    };
  }

  /**
   * Queue a local mutation to be synchronized when cloud is connected
   */
  enqueueLocalMutation(data: GameSaveData): void {
    const payload = this.createSyncPayload(data);
    this.pendingQueue.push(payload);
    this.status.pendingMutationsCount = this.pendingQueue.length;
    this.notify();
  }

  /**
   * Resolves conflicts between local and remote save states
   */
  resolveConflict(local: GameSaveData, remote: GameSaveData): GameSaveData {
    if (this.conflictStrategy === 'LAST_WRITE_WINS') {
      return local.updatedAt >= remote.updatedAt ? local : remote;
    }

    // Default 'PREFER_MAX_PROGRESS':
    // Merges unlocked levels, highest scores, max stars, and combined sardines
    const merged: GameSaveData = {
      ...local,
      updatedAt: Date.now(),
      totalScore: Math.max(local.totalScore, remote.totalScore),
      totalSardines: Math.max(local.totalSardines, remote.totalSardines),
      levels: { ...local.levels },
      achievements: Array.from(new Set([...local.achievements, ...remote.achievements])),
    };

    for (const [lvlId, remoteLvl] of Object.entries(remote.levels)) {
      const localLvl = merged.levels[lvlId];
      if (!localLvl) {
        merged.levels[lvlId] = remoteLvl;
      } else {
        merged.levels[lvlId] = {
          levelId: lvlId,
          unlocked: localLvl.unlocked || remoteLvl.unlocked,
          completed: localLvl.completed || remoteLvl.completed,
          stars: Math.max(localLvl.stars, remoteLvl.stars),
          bestTime:
            localLvl.bestTime && remoteLvl.bestTime
              ? Math.min(localLvl.bestTime, remoteLvl.bestTime)
              : localLvl.bestTime || remoteLvl.bestTime,
          sardinesCollected: Math.max(localLvl.sardinesCollected, remoteLvl.sardinesCollected),
          maxSardines: localLvl.maxSardines,
          secretFound: localLvl.secretFound || remoteLvl.secretFound,
        };
      }
    }

    return merged;
  }
}

export const syncService = new SyncService();
