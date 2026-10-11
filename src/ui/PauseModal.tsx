import React from 'react';
import { Play, RotateCcw, Compass, Settings, Volume2, VolumeX } from 'lucide-react';
import { GameSettings } from '../persistence/types';

interface PauseModalProps {
  settings: GameSettings;
  onUpdateSettings: (patch: Partial<GameSettings>) => void;
  onResume: () => void;
  onRestart: () => void;
  onOpenLevelSelect: () => void;
  onOpenSettings: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  settings,
  onUpdateSettings,
  onResume,
  onRestart,
  onOpenLevelSelect,
  onOpenSettings,
}) => {
  return (
    <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="max-w-sm w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-black text-white text-center mb-1">
          Game Paused
        </h2>
        <p className="text-xs text-zinc-400 text-center mb-6">
          Take a breather and stretch those claws!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mb-6">
          <button
            onClick={onResume}
            className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Restart Level</span>
          </button>

          <button
            onClick={onOpenLevelSelect}
            className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Level Select</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 font-medium rounded-xl transition-colors border border-zinc-800 flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-400" />
            <span>Settings</span>
          </button>
        </div>

        {/* Quick audio toggle */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>Audio Sound</span>
          <button
            onClick={() => onUpdateSettings({ isMuted: !settings.isMuted })}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
          >
            {settings.isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{settings.isMuted ? 'Muted' : 'Enabled'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
