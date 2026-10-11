/**
 * Web Audio API Procedural Sound Synthesizer
 * 100% offline, zero-asset audio synthesis with volume controls and background music generator.
 */

export class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isMuted = false;
  private musicVolume = 0.6;
  private sfxVolume = 0.8;
  private isMusicPlaying = false;
  private musicTimer: number | null = null;
  private musicStep = 0;

  constructor() {
    // Lazily initialized on first user interaction
  }

  private initContext(): void {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : 1;
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = this.musicVolume;
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = this.sfxVolume;
        this.sfxGain.connect(this.masterGain);
      }
    } catch (e) {
      console.warn('AudioContext failed to initialize:', e);
    }
  }

  private resume(): void {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setVolumes(music: number, sfx: number, muted: boolean): void {
    this.musicVolume = Math.max(0, Math.min(1, music));
    this.sfxVolume = Math.max(0, Math.min(1, sfx));
    this.isMuted = muted;

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  playJump(): void {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(540, t + 0.12);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  playSardinePickup(): void {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Pentatonic high sparkle chime
    const freqs = [659.25, 880.0, 1174.66]; // E5, A5, D6
    freqs.forEach((freq, idx) => {
      const start = t + idx * 0.04;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(start);
      osc.stop(start + 0.18);
    });
  }

  playSecretFound(): void {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const start = t + i * 0.07;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(start);
      osc.stop(start + 0.3);
    });
  }

  playEnemyBounce(): void {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.14);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  playSpringboard(): void {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(780, t + 0.25);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.28);
  }

  playHurt(): void {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.2);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  playMeow(): void {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Classic meow frequency curve: starts at 520, peaks at 740, slides down to 480
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.linearRampToValueAtTime(740, t + 0.12);
    osc.frequency.exponentialRampToValueAtTime(460, t + 0.35);

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.38);
  }

  playCheckpoint(): void {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Resonant bell chime
    [880, 1320, 1760].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25 / (idx + 1), t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t);
      osc.stop(t + 0.8);
    });
  }

  playFanfare(): void {
    this.resume();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.14 }, // C5
      { f: 659.25, d: 0.14 }, // E5
      { f: 783.99, d: 0.14 }, // G5
      { f: 1046.5, d: 0.35 }, // C6
    ];

    let accum = 0;
    notes.forEach((n) => {
      const start = t + accum;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, start);

      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + n.d);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(start);
      osc.stop(start + n.d);

      accum += n.d * 0.85;
    });
  }

  /**
   * Starts procedural cozy adventure ambient melody
   */
  startBackgroundMusic(theme: 'suburb' | 'forest' | 'harbor' = 'suburb'): void {
    this.resume();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    const scales = {
      suburb: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25], // C Major pentatonic
      forest: [220.0, 261.63, 293.66, 329.63, 392.0, 440.0],  // A Minor pentatonic
      harbor: [349.23, 392.0, 440.0, 523.25, 587.33, 698.46], // F Major pentatonic
    };

    const notes = scales[theme] || scales.suburb;
    const tempoMs = 280;

    const playStep = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain || this.isMuted) {
        if (this.isMusicPlaying) {
          this.musicTimer = window.setTimeout(playStep, tempoMs);
        }
        return;
      }

      const t = this.ctx.currentTime;
      // Melody pattern
      const pattern = [0, 2, 4, 3, 1, 3, 5, 4, 2, 1, 0, 3];
      const noteIdx = pattern[this.musicStep % pattern.length];
      const freq = notes[noteIdx % notes.length];

      // Bass note every 4 steps
      if (this.musicStep % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(freq * 0.5, t);
        bassGain.gain.setValueAtTime(0.12, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);
        bassOsc.start(t);
        bassOsc.stop(t + 0.8);
      }

      // Melody note
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(t);
      osc.stop(t + 0.22);

      this.musicStep++;
      this.musicTimer = window.setTimeout(playStep, tempoMs);
    };

    playStep();
  }

  stopBackgroundMusic(): void {
    this.isMusicPlaying = false;
    if (this.musicTimer !== null) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const audioSynth = new AudioSynthesizer();
