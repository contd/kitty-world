import React, { useEffect, useRef, useState, useCallback } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from './game/config/gameConfig';
import { GameScene } from './game/scenes/GameScene';
import { GAME_LEVELS } from './game/systems/LevelData';
import { GameHUDState, LevelDefinition } from './game/types';
import { audioSynth } from './game/systems/AudioSynthesizer';
import { saveRepository } from './persistence/SaveRepository';
import { settingsRepository } from './persistence/SettingsRepository';
import { progressRepository, LevelCompletionResult } from './persistence/ProgressRepository';
import { GameSettings, GameSaveData, DEFAULT_SETTINGS } from './persistence/types';
import { currentPlatform } from './app/platform';

// UI Components
import { TopBar } from './ui/TopBar';
import { GameHUD } from './ui/GameHUD';
import { TouchControls } from './ui/TouchControls';
import { MainMenuModal } from './ui/MainMenuModal';
import { LevelSelectModal } from './ui/LevelSelectModal';
import { PauseModal } from './ui/PauseModal';
import { VictoryModal } from './ui/VictoryModal';
import { GameOverModal } from './ui/GameOverModal';
import { SettingsModal } from './ui/SettingsModal';
import { TauriInfoModal } from './ui/TauriInfoModal';
import { CreditsModal } from './ui/CreditsModal';

export default function App() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  // App & Persistence State
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [saveData, setSaveData] = useState<GameSaveData | null>(null);
  const [currentLevel, setCurrentLevel] = useState<LevelDefinition>(GAME_LEVELS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // HUD State
  const [hudState, setHudState] = useState<GameHUDState>({
    lives: 3,
    maxLives: 3,
    sardinesCollected: 0,
    totalLevelSardines: 12,
    score: 0,
    elapsedTime: 0,
    currentLevelName: GAME_LEVELS[0].name,
    currentLevelSubtitle: GAME_LEVELS[0].subtitle,
    isPaused: false,
    isGameOver: false,
    isLevelComplete: false,
    secretFound: false,
    activeCheckpointName: null,
  });

  // Modal Visibility
  const [showMainMenu, setShowMainMenu] = useState(true);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTauriModal, setShowTauriModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [victoryResult, setVictoryResult] = useState<LevelCompletionResult | null>(null);

  // Initialize persistence on mount
  const refreshSaveData = useCallback(async () => {
    const s = await saveRepository.getSave();
    setSaveData(s);
  }, []);

  useEffect(() => {
    const initPersistence = async () => {
      await saveRepository.init();
      await settingsRepository.init();
      const currentSettings = await settingsRepository.getSettings();
      setSettings(currentSettings);
      audioSynth.setVolumes(currentSettings.musicVolume, currentSettings.sfxVolume, currentSettings.isMuted);
      await refreshSaveData();
    };
    initPersistence();
  }, [refreshSaveData]);

  // Update audio synth whenever volume settings change
  const handleUpdateSettings = async (patch: Partial<GameSettings>) => {
    const updated = await settingsRepository.saveSettings(patch);
    setSettings(updated);
    audioSynth.setVolumes(updated.musicVolume, updated.sfxVolume, updated.isMuted);
  };

  // Helper to get active Phaser GameScene
  const getGameScene = useCallback((): GameScene | null => {
    if (!phaserGameRef.current) return null;
    return phaserGameRef.current.scene.getScene('GameScene') as GameScene | null;
  }, []);

  // Launch a level in Phaser
  const launchLevel = useCallback((level: LevelDefinition) => {
    setCurrentLevel(level);
    setIsPlaying(true);
    setIsPaused(false);
    setShowMainMenu(false);
    setShowLevelSelect(false);
    setShowPauseModal(false);
    setShowVictoryModal(false);
    setShowGameOverModal(false);

    if (!phaserGameRef.current && gameContainerRef.current) {
      const config = createGameConfig(gameContainerRef.current);
      phaserGameRef.current = new Phaser.Game(config);
    }

    const scene = getGameScene();
    if (scene) {
      scene.scene.restart({
        level,
        onHUDUpdate: (newHud: GameHUDState) => {
          setHudState(newHud);
          setIsPaused(newHud.isPaused);
        },
        onLevelComplete: (result: LevelCompletionResult) => {
          setVictoryResult(result);
          setShowVictoryModal(true);
          refreshSaveData();
        },
        onGameOver: () => {
          setShowGameOverModal(true);
        },
      });
    } else {
      // Scene is booting up via config, wait and start
      setTimeout(() => {
        const sc = getGameScene();
        if (sc) {
          sc.scene.start('GameScene', {
            level,
            onHUDUpdate: (newHud: GameHUDState) => {
              setHudState(newHud);
              setIsPaused(newHud.isPaused);
            },
            onLevelComplete: (result: LevelCompletionResult) => {
              setVictoryResult(result);
              setShowVictoryModal(true);
              refreshSaveData();
            },
            onGameOver: () => {
              setShowGameOverModal(true);
            },
          });
        }
      }, 100);
    }
  }, [getGameScene, refreshSaveData]);

  // Pause / Resume Handlers
  const togglePause = useCallback(() => {
    const scene = getGameScene();
    if (!scene) return;

    if (scene.scene.isPaused()) {
      scene.scene.resume();
      setIsPaused(false);
      setShowPauseModal(false);
    } else {
      scene.scene.pause();
      setIsPaused(true);
      setShowPauseModal(true);
    }
  }, [getGameScene]);

  // Restart Current Level
  const restartCurrentLevel = useCallback(() => {
    setShowPauseModal(false);
    setShowGameOverModal(false);
    setShowVictoryModal(false);
    const scene = getGameScene();
    if (scene) {
      scene.restartLevel();
    } else {
      launchLevel(currentLevel);
    }
  }, [getGameScene, launchLevel, currentLevel]);

  // Respawn at Checkpoint
  const respawnAtCheckpoint = useCallback(() => {
    setShowGameOverModal(false);
    const scene = getGameScene();
    if (scene) {
      scene.respawnPlayer();
    }
  }, [getGameScene]);

  // Next Level Handler
  const handleNextLevel = useCallback(() => {
    const currentIndex = GAME_LEVELS.findIndex((l) => l.id === currentLevel.id);
    if (currentIndex !== -1 && currentIndex + 1 < GAME_LEVELS.length) {
      launchLevel(GAME_LEVELS[currentIndex + 1]);
    } else {
      setShowLevelSelect(true);
    }
  }, [currentLevel, launchLevel]);

  // Touch control hooks
  const handleTouchLeft = useCallback((active: boolean) => {
    const scene = getGameScene();
    if (scene && scene.inputSystem) scene.inputSystem.setTouchLeft(active);
  }, [getGameScene]);

  const handleTouchRight = useCallback((active: boolean) => {
    const scene = getGameScene();
    if (scene && scene.inputSystem) scene.inputSystem.setTouchRight(active);
  }, [getGameScene]);

  const handleTouchJump = useCallback((pressed: boolean) => {
    const scene = getGameScene();
    if (scene && scene.inputSystem) scene.inputSystem.setTouchJump(pressed);
  }, [getGameScene]);

  const handleMeow = useCallback(() => {
    const scene = getGameScene();
    if (scene && scene.player) scene.player.meow();
  }, [getGameScene]);

  // Cleanup Phaser on unmount
  useEffect(() => {
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  // Determine if on-screen touch controls should show
  const showTouchControls = isPlaying && !showPauseModal && !showVictoryModal && !showGameOverModal && (
    settings.touchControlsEnabled || currentPlatform.hasTouch || currentPlatform.isMobile
  );

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-zinc-950 text-zinc-100 select-none">
      {/* Top Bar Header */}
      <TopBar
        isPlaying={isPlaying}
        isPaused={isPaused}
        settings={settings}
        onTogglePause={togglePause}
        onOpenLevelSelect={() => setShowLevelSelect(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenCredits={() => setShowCreditsModal(true)}
        onOpenTauriInfo={() => setShowTauriModal(true)}
        onQuickPlay={() => launchLevel(GAME_LEVELS[0])}
      />

      {/* Main Gameport Viewport */}
      <main className="relative flex-1 w-full h-full overflow-hidden bg-zinc-950 flex items-center justify-center">
        {/* Phaser Canvas Container */}
        <div
          ref={gameContainerRef}
          className="w-full h-full flex items-center justify-center overflow-hidden focus:outline-none"
        />

        {/* In-Game Floating HUD */}
        {isPlaying && !showMainMenu && (
          <GameHUD
            hudState={hudState}
            onPause={togglePause}
            onMeow={handleMeow}
          />
        )}

        {/* Mobile / Touch Screen On-Screen Controls */}
        {showTouchControls && (
          <TouchControls
            onLeft={handleTouchLeft}
            onRight={handleTouchRight}
            onJump={handleTouchJump}
            onMeow={handleMeow}
            scale={settings.touchControlScale}
          />
        )}

        {/* Modals & Screens */}
        {showMainMenu && (
          <MainMenuModal
            saveData={saveData}
            onStartGame={(lvlId) => {
              const target = GAME_LEVELS.find((l) => l.id === lvlId) || GAME_LEVELS[0];
              launchLevel(target);
            }}
            onOpenLevelSelect={() => setShowLevelSelect(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenTauriInfo={() => setShowTauriModal(true)}
          />
        )}

        {showLevelSelect && (
          <LevelSelectModal
            saveData={saveData}
            onSelectLevel={(lvlId) => {
              const target = GAME_LEVELS.find((l) => l.id === lvlId) || GAME_LEVELS[0];
              launchLevel(target);
            }}
            onClose={() => setShowLevelSelect(false)}
          />
        )}

        {showPauseModal && (
          <PauseModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResume={togglePause}
            onRestart={restartCurrentLevel}
            onOpenLevelSelect={() => {
              setShowPauseModal(false);
              setShowLevelSelect(true);
            }}
            onOpenSettings={() => {
              setShowPauseModal(false);
              setShowSettingsModal(true);
            }}
          />
        )}

        {showVictoryModal && victoryResult && (
          <VictoryModal
            result={victoryResult}
            onNextLevel={handleNextLevel}
            onReplay={restartCurrentLevel}
            onOpenLevelSelect={() => {
              setShowVictoryModal(false);
              setShowLevelSelect(true);
            }}
          />
        )}

        {showGameOverModal && (
          <GameOverModal
            onRespawn={respawnAtCheckpoint}
            onRestart={restartCurrentLevel}
            onOpenLevelSelect={() => {
              setShowGameOverModal(false);
              setShowLevelSelect(true);
            }}
          />
        )}

        {showSettingsModal && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onReloadSave={refreshSaveData}
            onClose={() => setShowSettingsModal(false)}
          />
        )}

        {showTauriModal && (
          <TauriInfoModal onClose={() => setShowTauriModal(false)} />
        )}

        {showCreditsModal && (
          <CreditsModal onClose={() => setShowCreditsModal(false)} />
        )}
      </main>
    </div>
  );
}
