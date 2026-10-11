import React from 'react';
import { RotateCcw, Heart, Compass } from 'lucide-react';

interface GameOverModalProps {
  onRespawn: () => void;
  onRestart: () => void;
  onOpenLevelSelect: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  onRespawn,
  onRestart,
  onOpenLevelSelect,
}) => {
  return (
    <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="max-w-sm w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-3xl">
          😿
        </div>
        <h2 className="text-xl font-black text-white mb-1">
          Paws Out of Breath!
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          Whiskers bumped into trouble. Have a quick snack and try again!
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onRespawn}
            className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md"
          >
            <Heart className="w-4 h-4 fill-current text-rose-600" />
            <span>Respawn at Checkpoint</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Restart Stage from Beginning</span>
          </button>

          <button
            onClick={onOpenLevelSelect}
            className="w-full py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 font-medium rounded-xl transition-colors border border-zinc-800 flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>Level Selection</span>
          </button>
        </div>
      </div>
    </div>
  );
};
