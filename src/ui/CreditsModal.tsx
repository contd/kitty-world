import React from 'react';
import { X, Award, Code, Heart, Music, Image as ImageIcon } from 'lucide-react';

interface CreditsModalProps {
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none overflow-y-auto">
      <div className="max-w-xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-black text-white">Credits & Asset Inventory</h2>
            <p className="text-xs text-zinc-400">
              License notices, engine details, and artistic attribution
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-zinc-300 mb-6">
          <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
            <h3 className="text-amber-400 font-bold mb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Project Concept & Creative Direction</span>
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              <strong>Whiskers & Wonders: 2D Adventure Platformer</strong> is an original game inspired by the delightful animal personality of <em>Little Kitty, Big City</em> and the tight mechanics of classic side-scrolling platformers. Created with 100% original characters, physics tuning, and level layouts.
            </p>
          </div>

          <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
            <h3 className="text-amber-400 font-bold mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              <span>Visual Art & Sprites Inventory</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 leading-relaxed">
              <li><strong>Backdrop Sceneries:</strong> Original high-resolution environmental illustrations (Suburbia Rooftops, Whispering Woods, Sunken Harbor).</li>
              <li><strong>Character & Entity Sprites:</strong> Dynamic canvas procedural pixel-art generator (<code className="text-amber-300 bg-zinc-900 px-1 py-0.5 rounded">TextureGenerator.ts</code>). Zero external image download dependency.</li>
              <li><strong>License:</strong> MIT / Creative Commons Zero (CC0). Local and free for commercial and non-commercial redistribution.</li>
            </ul>
          </div>

          <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
            <h3 className="text-amber-400 font-bold mb-1 flex items-center gap-1.5">
              <Music className="w-4 h-4" />
              <span>Audio Synthesis Engine</span>
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              All sound effects (jumps, sardine pickups, meows, bounces, springboards, fanfare) and ambient adventure melodies are synthesized in real-time via the <strong>Web Audio API</strong> oscillator pipeline. 100% offline with zero external audio samples to stream.
            </p>
          </div>

          <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
            <h3 className="text-amber-400 font-bold mb-1 flex items-center gap-1.5">
              <Code className="w-4 h-4" />
              <span>Open Source Libraries & Tools</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li><strong>Phaser 3:</strong> MIT License © Richard Davey</li>
              <li><strong>Tauri v2:</strong> MIT or Apache 2.0 License © Tauri Programme within The Commons Conservancy</li>
              <li><strong>React 19 & Vite:</strong> MIT License</li>
              <li><strong>Lucide Icons:</strong> ISC License</li>
              <li><strong>Vitest:</strong> MIT License</li>
            </ul>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl transition-colors cursor-pointer text-xs"
        >
          Close
        </button>
      </div>
    </div>
  );
};
