import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Heart } from 'lucide-react';

interface TouchControlsProps {
  onLeft: (active: boolean) => void;
  onRight: (active: boolean) => void;
  onJump: (pressed: boolean) => void;
  onMeow: () => void;
  scale?: number;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onLeft,
  onRight,
  onJump,
  onMeow,
  scale = 1.0,
}) => {
  const leftActiveRef = useRef(false);
  const rightActiveRef = useRef(false);
  const jumpActiveRef = useRef(false);

  const handleTouchStartLeft = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    leftActiveRef.current = true;
    onLeft(true);
  };

  const handleTouchEndLeft = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    leftActiveRef.current = false;
    onLeft(false);
  };

  const handleTouchStartRight = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    rightActiveRef.current = true;
    onRight(true);
  };

  const handleTouchEndRight = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    rightActiveRef.current = false;
    onRight(false);
  };

  const handleTouchStartJump = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    jumpActiveRef.current = true;
    onJump(true);
  };

  const handleTouchEndJump = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    jumpActiveRef.current = false;
    onJump(false);
  };

  return (
    <div
      className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none select-none z-30 pb-[env(safe-area-inset-bottom,0px)]"
      style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}
    >
      {/* Directional Pad (Left & Right) */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          onTouchStart={handleTouchStartLeft}
          onTouchEnd={handleTouchEndLeft}
          onTouchCancel={handleTouchEndLeft}
          onMouseDown={handleTouchStartLeft}
          onMouseUp={handleTouchEndLeft}
          onMouseLeave={handleTouchEndLeft}
          aria-label="Move Left"
          className="w-14 h-14 rounded-2xl bg-zinc-900/80 active:bg-amber-500/80 backdrop-blur-md border border-zinc-700/80 flex items-center justify-center text-zinc-100 active:text-zinc-950 shadow-lg active:scale-95 transition-transform touch-none"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        <button
          onTouchStart={handleTouchStartRight}
          onTouchEnd={handleTouchEndRight}
          onTouchCancel={handleTouchEndRight}
          onMouseDown={handleTouchStartRight}
          onMouseUp={handleTouchEndRight}
          onMouseLeave={handleTouchEndRight}
          aria-label="Move Right"
          className="w-14 h-14 rounded-2xl bg-zinc-900/80 active:bg-amber-500/80 backdrop-blur-md border border-zinc-700/80 flex items-center justify-center text-zinc-100 active:text-zinc-950 shadow-lg active:scale-95 transition-transform touch-none"
        >
          <ArrowRight className="w-7 h-7" />
        </button>
      </div>

      {/* Action Buttons (Meow & Jump) */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Meow emote button */}
        <button
          onTouchStart={(e) => { e.preventDefault(); onMeow(); }}
          onClick={(e) => { e.preventDefault(); onMeow(); }}
          aria-label="Meow"
          className="w-12 h-12 rounded-full bg-zinc-900/80 active:bg-rose-500/80 backdrop-blur-md border border-zinc-700/80 flex items-center justify-center text-rose-400 active:text-white shadow-lg active:scale-95 transition-transform touch-none"
        >
          <Heart className="w-5 h-5 fill-current" />
        </button>

        {/* Jump Button (Large A button) */}
        <button
          onTouchStart={handleTouchStartJump}
          onTouchEnd={handleTouchEndJump}
          onTouchCancel={handleTouchEndJump}
          onMouseDown={handleTouchStartJump}
          onMouseUp={handleTouchEndJump}
          onMouseLeave={handleTouchEndJump}
          aria-label="Jump"
          className="w-16 h-16 rounded-full bg-amber-500/90 active:bg-amber-400 text-zinc-950 font-black text-lg flex items-center justify-center shadow-xl active:scale-95 transition-transform border border-amber-300 touch-none"
        >
          <ArrowUp className="w-8 h-8 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
