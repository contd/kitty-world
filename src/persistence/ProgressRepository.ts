import { SaveRepository, saveRepository } from './SaveRepository';
import { GameSaveData, LevelProgress } from './types';

export interface LevelCompletionResult {
  levelId: string;
  timeElapsed: number;
  sardinesCollected: number;
  totalScore: number;
  secretFound: boolean;
  isNewBestTime: boolean;
  unlockedNextLevelId?: string;
  earnedStars: number;
}

export class ProgressRepository {
  private saveRepo: SaveRepository;

  constructor(saveRepo?: SaveRepository) {
    this.saveRepo = saveRepo || saveRepository;
  }

  async recordLevelCompletion(
    levelId: string,
    timeElapsed: number,
    sardinesCollected: number,
    secretFound: boolean
  ): Promise<LevelCompletionResult> {
    const save = await this.saveRepo.getSave();
    const currentLevelProgress = save.levels[levelId] || {
      levelId,
      unlocked: true,
      completed: false,
      stars: 0,
      bestTime: null,
      sardinesCollected: 0,
      maxSardines: 15,
      secretFound: false,
    };

    // Calculate stars:
    // 1 star: Complete level
    // 2 stars: Collect >= 70% of sardines
    // 3 stars: Find secret OR collect 100% of sardines within par time
    const sardineRatio = sardinesCollected / Math.max(1, currentLevelProgress.maxSardines);
    let earnedStars = 1;
    if (sardineRatio >= 0.7) earnedStars = 2;
    if (secretFound || sardineRatio >= 0.95) earnedStars = 3;

    const isNewBestTime =
      currentLevelProgress.bestTime === null || timeElapsed < currentLevelProgress.bestTime;
    const finalBestTime = isNewBestTime ? timeElapsed : currentLevelProgress.bestTime;

    const updatedLevelProgress: LevelProgress = {
      ...currentLevelProgress,
      completed: true,
      stars: Math.max(currentLevelProgress.stars, earnedStars),
      bestTime: finalBestTime,
      sardinesCollected: Math.max(currentLevelProgress.sardinesCollected, sardinesCollected),
      secretFound: currentLevelProgress.secretFound || secretFound,
    };

    save.levels[levelId] = updatedLevelProgress;

    // Determine next level unlock
    let unlockedNextLevelId: string | undefined;
    const levelOrder = ['level-1', 'level-2', 'level-3', 'level-4'];
    const currentIndex = levelOrder.indexOf(levelId);
    if (currentIndex !== -1 && currentIndex + 1 < levelOrder.length) {
      const nextId = levelOrder[currentIndex + 1];
      if (save.levels[nextId] && !save.levels[nextId].unlocked) {
        save.levels[nextId].unlocked = true;
        unlockedNextLevelId = nextId;
      }
    }

    // Accumulate total sardines and score
    save.totalSardines += sardinesCollected;
    const levelScore = Math.floor(
      sardinesCollected * 100 +
      (secretFound ? 500 : 0) +
      Math.max(0, 1000 - Math.floor(timeElapsed * 10))
    );
    save.totalScore += levelScore;

    // Check achievement triggers
    if (save.totalSardines >= 30 && !save.achievements.includes('fish_feast')) {
      save.achievements.push('fish_feast');
    }
    if (save.levels['level-4']?.completed && !save.achievements.includes('grand_champion')) {
      save.achievements.push('grand_champion');
    }

    await this.saveRepo.writeSave(save);

    return {
      levelId,
      timeElapsed,
      sardinesCollected,
      totalScore: levelScore,
      secretFound,
      isNewBestTime,
      unlockedNextLevelId,
      earnedStars,
    };
  }

  async getLevelProgress(levelId: string): Promise<LevelProgress | null> {
    const save = await this.saveRepo.getSave();
    return save.levels[levelId] || null;
  }

  async getAllProgress(): Promise<GameSaveData> {
    return this.saveRepo.getSave();
  }
}

export const progressRepository = new ProgressRepository();
