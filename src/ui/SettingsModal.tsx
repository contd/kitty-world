import React, { useState } from 'react';
import { X, Volume2, VolumeX, Smartphone, Monitor, Shield, Download, Upload, Trash2, Cloud, Check } from 'lucide-react';
import { GameSettings, GameSaveData } from '../persistence/types';
import { saveRepository } from '../persistence/SaveRepository';
import { syncService } from '../sync/SyncService';
import { currentPlatform } from '../app/platform';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (patch: Partial<GameSettings>) => void;
  onReloadSave: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onReloadSave,
  onClose,
}) => {
  const [resetConfirm, setResetConfirm] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);
  const syncStatus = syncService.getStatus();

  const handleExportSave = async () => {
    const jsonStr = await saveRepository.exportSaveJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whiskers_adventure_save_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSave = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        await saveRepository.importSaveJson(content);
        onReloadSave();
        setCopiedStatus(true);
        setTimeout(() => setCopiedStatus(false), 2000);
      } catch (err) {
        alert('Could not import save file. Please verify it is a valid Whiskers Adventure save.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSave = async () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }
    await saveRepository.resetSave();
    onReloadSave();
    setResetConfirm(false);
  };

  return (
    <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none overflow-y-auto">
      <div className="max-w-xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-black text-white">Settings</h2>
            <p className="text-xs text-zinc-400">
              Audio, controls, persistence, and display preferences
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Audio Controls */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-3">
            Audio & Sound Effects
          </h3>
          <div className="space-y-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
            {/* Master Mute */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Sound Mute</span>
                <span className="text-[11px] text-zinc-500">Mutes all synthesizer audio</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ isMuted: !settings.isMuted })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  settings.isMuted ? 'bg-rose-500 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {settings.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{settings.isMuted ? 'Muted' : 'Unmuted'}</span>
              </button>
            </div>

            {/* Music volume slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-300">Background Melody Volume</span>
                <span className="font-mono tabular-nums text-zinc-400">{Math.round(settings.musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.musicVolume}
                onChange={(e) => onUpdateSettings({ musicVolume: parseFloat(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* SFX volume slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-300">Sound Effects (SFX) Volume</span>
                <span className="font-mono tabular-nums text-zinc-400">{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={(e) => onUpdateSettings({ sfxVolume: parseFloat(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Input & Touch Controls */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-3">
            Input & Mobile Controls
          </h3>
          <div className="space-y-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">On-Screen Touch Controls</span>
                <span className="text-[11px] text-zinc-500">Virtual D-pad and Jump button for mobile / touch screens</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ touchControlsEnabled: !settings.touchControlsEnabled })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  settings.touchControlsEnabled ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {settings.touchControlsEnabled ? 'Enabled' : 'Hidden'}
              </button>
            </div>

            {/* Touch Scale */}
            {settings.touchControlsEnabled && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-zinc-300">Touch Control Scale</span>
                  <span className="font-mono tabular-nums text-zinc-400">{Math.round(settings.touchControlScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.3"
                  step="0.05"
                  value={settings.touchControlScale}
                  onChange={(e) => onUpdateSettings({ touchControlScale: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            )}

            {/* Screen Shake */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Screen Shake</span>
                <span className="text-[11px] text-zinc-500">Camera rumble effect when taking damage</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ screenShake: !settings.screenShake })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  settings.screenShake ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {settings.screenShake ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Local-First Persistence & Future Sync */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-3">
            Local-First Save & Sync Status
          </h3>
          <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Persistence Engine</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                {currentPlatform.isTauri ? 'Native SQLite (Tauri v2)' : 'IndexedDB (Browser Local-First)'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Cloud Sync Status</span>
              <span className="text-zinc-300 font-mono text-[11px]">
                Offline-First (Planned Extension)
              </span>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              {syncStatus.message}
            </p>

            {/* Backup & Restore */}
            <div className="pt-3 border-t border-zinc-800 flex flex-wrap gap-2">
              <button
                onClick={handleExportSave}
                className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export Save (JSON)</span>
              </button>

              <label className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer text-xs">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Import Save</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportSave}
                  className="hidden"
                />
              </label>

              {copiedStatus && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Save Imported!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Reset Save Data */}
        <div className="p-4 bg-rose-950/20 border border-rose-900/30 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-300 block">Clear Saved Progress</span>
            <span className="text-[11px] text-zinc-500">Resets unlocked levels, high scores, and sardines</span>
          </div>
          <button
            onClick={handleResetSave}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              resetConfirm ? 'bg-rose-600 text-white animate-pulse' : 'bg-zinc-800 text-rose-400 hover:bg-rose-950'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{resetConfirm ? 'Confirm Clear?' : 'Reset Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
