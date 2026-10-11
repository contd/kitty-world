import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight, RotateCcw, Compass, Sparkles, Clock } from 'lucide-react';
import { LevelCompletionResult } from '../persistence/ProgressRepository';

interface VictoryModalProps {
  result: LevelCompletionResult;
  onNextLevel: () => void;
  onReplay: () => void;
  onOpenLevelSelect: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  result,
  onNextLevel,
  onReplay,
  onOpenLevelSelect,
}) => {
  useEffect(() => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
    });
  }, []);

  return (
    <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-center">
        {/* Victory Icon & Title */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-3xl">
          🐱✨
        </div>
        <h2 className="text-2xl font-black text-white mb-1">
          Stage Cleared!
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          Whiskers safely reached the warm golden cat door!
        </p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                starIdx <= result.earnedStars
                  ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40 scale-105'
                  : 'bg-zinc-950/60 text-zinc-700 border border-zinc-800'
              }`}
            >
              ★
            </div>
          ))}
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-6 text-left">
          <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block">Sardines Collected</span>
            <span className="text-base font-bold text-amber-400 font-mono tabular-nums">
              🐟 {result.sardinesCollected}
            </span>
          </div>

          <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block">Clear Time</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-zinc-200 font-mono tabular-nums">
                {result.timeElapsed}s
              </span>
              {result.isNewBestTime && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded">
                  NEW!
                </span>
              )}
            </div>
          </div>

          <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block">Stage Score</span>
            <span className="text-base font-bold text-zinc-200 font-mono tabular-nums">
              +{result.totalScore}
            </span>
          </div>

          <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block">Secret Treasure</span>
            <span className="text-sm font-semibold text-zinc-300">
              {result.secretFound ? '🏆 Discovered!' : '🔒 Not Found'}
            </span>
          </div>
        </div>

        {/* Unlocked banner if next level unlocked */}
        {result.unlockedNextLevelId && (
          <div className="mb-6 p-2.5 bg-emerald-950/70 border border-emerald-600/40 rounded-xl text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Next Stage Unlocked!</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          {result.unlockedNextLevelId ? (
            <button
              onClick={onNextLevel}
              className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenLevelSelect}
              className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md"
            >
              <span>Level Selection</span>
              <Compass className="w-4 h-4" />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReplay}
              className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Replay</span>
            </button>

            <button
              onClick={onOpenLevelSelect}
              className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Levels</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
