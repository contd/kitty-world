import React from 'react';
import { GameHUDState } from '../game/types';
import { Pause, Heart, Sparkles, Clock, Trophy } from 'lucide-react';

interface GameHUDProps {
  hudState: GameHUDState;
  onPause: () => void;
  onMeow: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ hudState, onPause, onMeow }) => {
  // Format elapsed seconds into mm:ss
  const minutes = Math.floor(hudState.elapsedTime / 60);
  const seconds = hudState.elapsedTime % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none z-30 select-none">
      {/* Left cluster: Lives and Level Name */}
      <div className="flex items-center gap-3">
        {/* Lives (Paw Hearts) */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/85 backdrop-blur-md rounded-lg border border-zinc-800 shadow-md">
          {Array.from({ length: hudState.maxLives }).map((_, i) => (
            <span
              key={i}
              className={`text-sm transition-transform duration-200 ${
                i < hudState.lives ? 'text-rose-500 scale-100' : 'text-zinc-600 scale-90 opacity-40'
              }`}
              title="Lives remaining"
            >
              🐾
            </span>
          ))}
        </div>

        {/* Level Name */}
        <div className="hidden sm:flex flex-col px-3 py-1 bg-zinc-900/85 backdrop-blur-md rounded-lg border border-zinc-800 shadow-md">
          <span className="text-xs font-bold text-amber-300 leading-tight">
            {hudState.currentLevelName}
          </span>
          <span className="text-[10px] text-zinc-400 leading-tight">
            {hudState.currentLevelSubtitle}
          </span>
        </div>

        {/* Active Checkpoint Notice */}
        {hudState.activeCheckpointName && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 border border-emerald-600/40 rounded-md text-[11px] text-emerald-300 animate-pulse">
            <span>✓ {hudState.activeCheckpointName}</span>
          </div>
        )}
      </div>

      {/* Right cluster: Sardines, Score, Timer, Emote & Pause */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {/* Sardines Collected */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/85 backdrop-blur-md rounded-lg border border-zinc-800 shadow-md text-amber-400 font-semibold text-xs">
          <span>🐟</span>
          <span className="font-mono tabular-nums">
            {hudState.sardinesCollected}
            <span className="text-zinc-500 text-[11px]">/{hudState.totalLevelSardines}</span>
          </span>
        </div>

        {/* Score */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/85 backdrop-blur-md rounded-lg border border-zinc-800 shadow-md text-zinc-200 font-semibold text-xs">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono tabular-nums">{hudState.score}</span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900/85 backdrop-blur-md rounded-lg border border-zinc-800 shadow-md text-zinc-300 font-mono text-xs tabular-nums">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>{timeFormatted}</span>
        </div>

        {/* Meow button */}
        <button
          onClick={onMeow}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900/85 hover:bg-zinc-800 active:scale-95 border border-zinc-800 shadow-md text-amber-400 transition-all cursor-pointer"
          title="Meow / Purr (Key: E)"
        >
          <span className="text-sm">😸</span>
        </button>

        {/* Pause button */}
        <button
          onClick={onPause}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900/85 hover:bg-zinc-800 active:scale-95 border border-zinc-800 shadow-md text-zinc-300 transition-all cursor-pointer"
          title="Pause (Key: Esc)"
        >
          <Pause className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
