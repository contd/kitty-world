import React from 'react';
import { Play, Compass, Settings, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';
import { GameSaveData } from '../persistence/types';

interface MainMenuModalProps {
  saveData: GameSaveData | null;
  onStartGame: (levelId?: string) => void;
  onOpenLevelSelect: () => void;
  onOpenSettings: () => void;
  onOpenTauriInfo: () => void;
}

export const MainMenuModal: React.FC<MainMenuModalProps> = ({
  saveData,
  onStartGame,
  onOpenLevelSelect,
  onOpenSettings,
  onOpenTauriInfo,
}) => {
  return (
    <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-md flex items-center justify-center p-4 z-40 select-none overflow-y-auto">
      <div className="max-w-3xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* Left: Gorgeous Key Art */}
        <div className="md:w-1/2 relative bg-zinc-950 overflow-hidden min-h-[220px] md:min-h-[420px] flex items-center justify-center">
          <img
            src="/src/assets/images/hero_cat_adventure_cover_1791735064904.jpg"
            alt="Whiskers Adventure Cover Key Art"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Cozy Exploration · Classic Platforming
            </span>
            <h2 className="text-xl font-black text-white leading-tight">
              Whiskers & Wonders
            </h2>
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-zinc-400">Tauri v2 · Phaser 3 · TypeScript</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mb-2">
              Ready for Adventure?
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Guide Whiskers across colorful rooftops, mossy forest trees, and breezy harbor docks. Pounce on critters, gather golden sardines, and find secret cat treasures!
            </p>

            {/* Save quick stats */}
            {saveData && (
              <div className="grid grid-cols-2 gap-2 mb-6 p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 text-xs">
                <div>
                  <span className="text-zinc-500 block text-[10px]">Total Score</span>
                  <span className="font-bold text-amber-400 font-mono tabular-nums text-sm">
                    {saveData.totalScore}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">Sardines Eaten</span>
                  <span className="font-bold text-zinc-200 font-mono tabular-nums text-sm">
                    🐟 {saveData.totalSardines}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => onStartGame('level-1')}
              className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-zinc-950 font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Game</span>
            </button>

            <button
              onClick={onOpenLevelSelect}
              className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] text-zinc-200 font-medium rounded-xl transition-all border border-zinc-700 flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Select Level</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenSettings}
                className="py-2 px-3 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 font-medium rounded-lg transition-colors border border-zinc-800 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Settings className="w-3.5 h-3.5 text-zinc-400" />
                <span>Settings</span>
              </button>

              <button
                onClick={onOpenTauriInfo}
                className="py-2 px-3 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 font-medium rounded-lg transition-colors border border-zinc-800 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Tauri & iOS</span>
              </button>
            </div>

            <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-center gap-1.5 text-[11px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Offline Local-First · No Account Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
