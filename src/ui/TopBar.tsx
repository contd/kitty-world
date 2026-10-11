import React from 'react';
import { Volume2, VolumeX, Play, Pause, Compass, Settings as SettingsIcon, Info } from 'lucide-react';
import { GameSettings } from '../persistence/types';

interface TopBarProps {
  isPlaying: boolean;
  isPaused: boolean;
  settings: GameSettings;
  onTogglePause: () => void;
  onOpenLevelSelect: () => void;
  onOpenSettings: () => void;
  onOpenCredits: () => void;
  onOpenTauriInfo: () => void;
  onQuickPlay: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isPlaying,
  isPaused,
  settings,
  onTogglePause,
  onOpenLevelSelect,
  onOpenSettings,
  onOpenCredits,
  onOpenTauriInfo,
  onQuickPlay,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 z-40 select-none">
      {/* Zone 1: Single text element wordmark in display face */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-lg font-extrabold tracking-tight text-amber-400 font-sans whitespace-nowrap">
          Whiskers & Wonders
        </span>
        <span className="hidden sm:inline text-xs text-zinc-500 font-medium">
          2D Adventure Platformer
        </span>
      </div>

      {/* Zone 2: Concise single-line navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
        <button
          onClick={onOpenLevelSelect}
          className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Compass className="w-4 h-4 text-amber-500" />
          <span>Levels</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <SettingsIcon className="w-4 h-4 text-zinc-400" />
          <span>Settings</span>
        </button>
        <button
          onClick={onOpenTauriInfo}
          className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Tauri v2 & iOS</span>
        </button>
        <button
          onClick={onOpenCredits}
          className="hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-zinc-400"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Credits</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        {isPlaying ? (
          <button
            onClick={onTogglePause}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5 text-zinc-300" />}
            <span>{isPaused ? 'Resume' : 'Pause (Esc)'}</span>
          </button>
        ) : (
          <button
            onClick={onQuickPlay}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Now</span>
          </button>
        )}
      </div>
    </header>
  );
};
