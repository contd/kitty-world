import React from 'react';
import { X, Lock, Play, Star, Trophy, Clock } from 'lucide-react';
import { GAME_LEVELS } from '../game/systems/LevelData';
import { GameSaveData } from '../persistence/types';

interface LevelSelectModalProps {
  saveData: GameSaveData | null;
  onSelectLevel: (levelId: string) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  saveData,
  onSelectLevel,
  onClose,
}) => {
  return (
    <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none overflow-y-auto">
      <div className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-black text-white">Select Level</h2>
            <p className="text-xs text-zinc-400">
              Explore 4 diverse worlds from cozy rooftops to deep harbor docks
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GAME_LEVELS.map((level) => {
            const progress = saveData?.levels[level.id];
            const isUnlocked = Boolean(progress?.unlocked || level.id === 'level-1');
            const isCompleted = Boolean(progress?.completed);
            const stars = progress?.stars || 0;
            const sardines = progress?.sardinesCollected || 0;
            const maxSardines = level.collectibles.filter((c) => c.type === 'SARDINE').length;
            const bestTime = progress?.bestTime;
            const secretFound = Boolean(progress?.secretFound);

            return (
              <div
                key={level.id}
                className={`relative rounded-xl border p-4 flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-zinc-950/70 border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-950'
                    : 'bg-zinc-950/30 border-zinc-900 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                      World {level.worldNumber} · Stage {level.levelNumber}
                    </span>
                    {/* Stars */}
                    {isUnlocked && (
                      <div className="flex items-center gap-0.5 text-xs">
                        {[1, 2, 3].map((starIdx) => (
                          <span
                            key={starIdx}
                            className={starIdx <= stars ? 'text-amber-400' : 'text-zinc-700'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-0.5">
                    {level.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-3">
                    {level.subtitle}
                  </p>

                  {/* Level stats */}
                  {isUnlocked && (
                    <div className="grid grid-cols-3 gap-2 py-2 px-2.5 bg-zinc-900/60 rounded-lg text-[11px] mb-3">
                      <div>
                        <span className="text-zinc-500 block text-[9px]">Sardines</span>
                        <span className="font-mono font-semibold text-amber-400">
                          🐟 {sardines}/{maxSardines}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[9px]">Best Time</span>
                        <span className="font-mono font-semibold text-zinc-300">
                          {bestTime ? `${bestTime}s` : '--'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[9px]">Secret</span>
                        <span className="font-semibold text-zinc-300">
                          {secretFound ? '🏆 Found' : '🔒 Hidden'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Button */}
                {isUnlocked ? (
                  <button
                    onClick={() => {
                      onSelectLevel(level.id);
                      onClose();
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                        : 'bg-amber-400 hover:bg-amber-300 text-zinc-950'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCompleted ? 'Replay Level' : 'Play Stage'}</span>
                  </button>
                ) : (
                  <div className="w-full py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800/80 text-zinc-500 text-xs font-medium flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Complete previous stage</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
