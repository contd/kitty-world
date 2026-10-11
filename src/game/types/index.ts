export type PlayerState = 'IDLE' | 'RUNNING' | 'JUMPING' | 'FALLING' | 'HURT' | 'VICTORY';

export type EnemyType = 'HOUND' | 'CROW' | 'FROG' | 'HEDGEHOG' | 'PIGEON';

export type CollectibleType = 'SARDINE' | 'YARN_BALL' | 'CATNIP_HEART' | 'SECRET_TROPHY';

export type ObstacleType = 'SPIKES' | 'WATER' | 'SPRINGBOARD' | 'MOVING_PLATFORM' | 'CRUMBLING_PLATFORM';

export interface PlatformDef {
  x: number;
  y: number;
  width: number;
  height: number;
  type?: 'ground' | 'brick' | 'wood' | 'mushroom' | 'cloud' | 'forest' | 'harbor';
  isMoving?: boolean;
  moveRangeX?: number;
  moveRangeY?: number;
  moveSpeed?: number;
  isCrumbling?: boolean;
}

export interface EnemyDef {
  type: EnemyType;
  x: number;
  y: number;
  patrolDistance?: number;
  speed?: number;
  jumpInterval?: number;
}

export interface CollectibleDef {
  type: CollectibleType;
  x: number;
  y: number;
  isSecret?: boolean;
}

export interface HazardDef {
  type: 'spikes' | 'water';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpringboardDef {
  x: number;
  y: number;
  bounceForce?: number;
}

export interface CheckpointDef {
  id: string;
  x: number;
  y: number;
}

export interface GoalDef {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LevelDefinition {
  id: string;
  worldNumber: number;
  levelNumber: number;
  name: string;
  subtitle: string;
  theme: 'suburb' | 'forest' | 'harbor';
  backdropImage: string;
  worldWidth: number;
  worldHeight: number;
  spawnPoint: { x: number; y: number };
  platforms: PlatformDef[];
  enemies: EnemyDef[];
  collectibles: CollectibleDef[];
  hazards: HazardDef[];
  springboards: SpringboardDef[];
  checkpoints: CheckpointDef[];
  goal: GoalDef;
  parTime: number; // in seconds
}

export interface GameHUDState {
  lives: number;
  maxLives: number;
  sardinesCollected: number;
  totalLevelSardines: number;
  score: number;
  elapsedTime: number;
  currentLevelName: string;
  currentLevelSubtitle: string;
  isPaused: boolean;
  isGameOver: boolean;
  isLevelComplete: boolean;
  secretFound: boolean;
  activeCheckpointName: string | null;
}
