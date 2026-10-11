import React from 'react';
import { X, Smartphone, Monitor, ShieldCheck, Terminal, Layers } from 'lucide-react';
import { currentPlatform } from '../app/platform';

interface TauriInfoModalProps {
  onClose: () => void;
}

export const TauriInfoModal: React.FC<TauriInfoModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none overflow-y-auto">
      <div className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-black text-white">Tauri v2 & iOS Platform Guide</h2>
            <p className="text-xs text-zinc-400">
              Cross-platform architecture, permissions, and build commands
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Runtime Diagnostics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800 text-xs">
            <span className="text-[10px] text-zinc-500 block">Environment</span>
            <span className="font-bold text-amber-400">
              {currentPlatform.isTauri ? 'Native Tauri v2' : 'Web View / Dev'}
            </span>
          </div>

          <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800 text-xs">
            <span className="text-[10px] text-zinc-500 block">Target OS</span>
            <span className="font-bold text-zinc-200 capitalize">
              {currentPlatform.os}
            </span>
          </div>

          <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800 text-xs">
            <span className="text-[10px] text-zinc-500 block">Input Mode</span>
            <span className="font-bold text-zinc-200">
              {currentPlatform.hasTouch ? 'Touch & Mobile' : 'Keyboard & Mouse'}
            </span>
          </div>

          <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800 text-xs">
            <span className="text-[10px] text-zinc-500 block">Offline Mode</span>
            <span className="font-bold text-emerald-400">
              Active (100%)
            </span>
          </div>
        </div>

        {/* Architecture details */}
        <div className="space-y-4 text-xs text-zinc-300 mb-6">
          <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
            <h3 className="text-amber-400 font-bold mb-1 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Tauri v2 Desktop Architecture</span>
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Configured via <code className="text-amber-300 bg-zinc-900 px-1 py-0.5 rounded">src-tauri/tauri.conf.json</code> with least-privilege capability manifests in <code className="text-amber-300 bg-zinc-900 px-1 py-0.5 rounded">src-tauri/capabilities/default.json</code>. Uses the official SQLite plugin for instant local persistence on macOS, Windows, and Linux.
            </p>
          </div>

          <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
            <h3 className="text-amber-400 font-bold mb-1 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              <span>Dedicated iOS Mobile Support</span>
            </h3>
            <p className="text-zinc-400 leading-relaxed mb-2">
              Tauri v2 mobile tooling generates standard Xcode projects (<code className="text-amber-300 bg-zinc-900 px-1 py-0.5 rounded">src-tauri/gen/apple</code>) targeting iOS 13+ devices:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li>Configured with touch-first viewport: <code className="text-zinc-300">viewport-fit=cover</code></li>
              <li>Safe-area insets dynamically handled for Apple Dynamic Island and Home Indicator</li>
              <li>Zero network calls during gameplay — runs smoothly in offline airplane mode</li>
              <li>Web Audio API synthesized sound initializes without mobile autoplay blockages</li>
            </ul>
          </div>

          <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
            <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              <span>Build & Run Commands</span>
            </h3>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]"># Run Web / Dev Environment</span>
                <span className="text-amber-300">npm run dev</span>
              </div>
              <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]"># Run Unit Tests with Vitest</span>
                <span className="text-amber-300">npm test</span>
              </div>
              <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]"># Build Desktop Native App (macOS, Windows, Linux)</span>
                <span className="text-amber-300">cargo tauri build</span>
              </div>
              <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]"># Initialize iOS Project & Build for iPhone / iPad</span>
                <span className="text-amber-300">cargo tauri ios init && cargo tauri ios build</span>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl transition-colors cursor-pointer text-xs"
        >
          Close Guide
        </button>
      </div>
    </div>
  );
};
