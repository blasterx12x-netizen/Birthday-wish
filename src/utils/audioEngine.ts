// Synthesized Web Audio API engine for optional background birthday music & crisp sound effects.
// Strictly never autoplays before explicit user interaction.

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private musicTimer: number | null = null;
  private musicEnabled = false;
  private sfxEnabled = true;
  private noteIndex = 0;

  // Warm celestial "Happy Birthday" + dreamy waltz progression in F major / D minor
  // Frequencies in Hz
  private readonly melody: Array<{ freq: number; beats: number; bass?: number }> = [
    { freq: 261.63, beats: 0.75, bass: 174.61 }, // C4 (Happy)
    { freq: 261.63, beats: 0.25 },               // C4 (birth-)
    { freq: 293.66, beats: 1.0, bass: 174.61 },  // D4 (-day)
    { freq: 261.63, beats: 1.0 },                // C4 (to)
    { freq: 349.23, beats: 1.0, bass: 130.81 },  // F4 (you)
    { freq: 329.63, beats: 2.0, bass: 130.81 },  // E4

    { freq: 261.63, beats: 0.75, bass: 130.81 }, // C4 (Happy)
    { freq: 261.63, beats: 0.25 },               // C4 (birth-)
    { freq: 293.66, beats: 1.0, bass: 146.83 },  // D4 (-day)
    { freq: 261.63, beats: 1.0 },                // C4 (to)
    { freq: 392.0, beats: 1.0, bass: 174.61 },   // G4 (you)
    { freq: 349.23, beats: 2.0, bass: 174.61 },  // F4

    { freq: 261.63, beats: 0.75, bass: 174.61 }, // C4 (Happy)
    { freq: 261.63, beats: 0.25 },               // C4 (birth-)
    { freq: 523.25, beats: 1.0, bass: 116.54 },  // C5 (-day)
    { freq: 440.0, beats: 1.0 },                 // A4 (dear)
    { freq: 349.23, beats: 1.0, bass: 146.83 },  // F4 ([name])
    { freq: 329.63, beats: 1.0 },                // E4
    { freq: 293.66, beats: 2.0, bass: 116.54 },  // D4

    { freq: 466.16, beats: 0.75, bass: 116.54 }, // Bb4 (Happy)
    { freq: 466.16, beats: 0.25 },               // Bb4 (birth-)
    { freq: 440.0, beats: 1.0, bass: 130.81 },   // A4 (-day)
    { freq: 349.23, beats: 1.0 },                // F4 (to)
    { freq: 392.0, beats: 1.0, bass: 130.81 },   // G4 (you)
    { freq: 349.23, beats: 2.5, bass: 174.61 },  // F4
  ];

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMusicOn(): boolean {
    return this.musicEnabled;
  }

  public isSfxOn(): boolean {
    return this.sfxEnabled;
  }

  public setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
  }

  public startMusic(): void {
    if (this.musicEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    this.musicEnabled = true;
    this.noteIndex = 0;
    this.scheduleNextNote();
  }

  public stopMusic(): void {
    this.musicEnabled = false;
    if (this.musicTimer !== null) {
      window.clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.musicEnabled) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  private scheduleNextNote(): void {
    if (!this.musicEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const item = this.melody[this.noteIndex % this.melody.length];
    this.playMusicBoxTone(item.freq, item.beats * 0.45);
    if (item.bass) {
      this.playWarmPad(item.bass, item.beats * 0.75);
    }

    this.noteIndex = (this.noteIndex + 1) % this.melody.length;
    const delayMs = item.beats * 520;
    this.musicTimer = window.setTimeout(() => {
      this.scheduleNextNote();
    }, delayMs);
  }

  private playMusicBoxTone(freq: number, duration: number): void {
    if (!this.ctx || !this.musicEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const overtone = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const overtoneGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.065, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.35, duration));

    overtoneGain.gain.setValueAtTime(0.0001, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.014, now + 0.01);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + Math.max(0.4, duration + 0.05));
    overtone.stop(now + 0.3);
  }

  private playWarmPad(freq: number, duration: number): void {
    if (!this.ctx || !this.musicEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.55, duration));

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + Math.max(0.6, duration + 0.05));
  }

  // --- Sound Effects ---

  public playClick(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(640, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.055);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playCardFlip(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.11);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playBalloonPop(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Pitch drop pop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.085);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);

    // Subtle air snap using short buffer
    const bufferSize = Math.floor(ctx.sampleRate * 0.04);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1400, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
  }

  public playHeartCatch(combo = 1): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const baseFreq = 523.25 * Math.pow(1.06, Math.min(combo, 10));
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.09);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playGiftOpen(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, idx) => {
      const start = ctx.currentTime + idx * 0.075;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.1, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.58);
    });
  }

  public playEnvelopeOpen(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const start = ctx.currentTime + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.08, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.52);
    });
  }

  public playVictory(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    const offsets = [0, 0.09, 0.18, 0.27, 0.42, 0.54];
    notes.forEach((freq, i) => {
      const start = ctx.currentTime + offsets[i];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.11, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.48);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.5);
    });
  }

  public playFirework(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Soft low thump + shimmer chime
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.22);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);

    // Sparkle crackle
    const bufferSize = Math.floor(ctx.sampleRate * 0.28);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.pow(1 - i / bufferSize, 2);
      data[i] = (Math.random() > 0.72 ? (Math.random() * 2 - 1) : 0) * env;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, now);
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.07, now);
    nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(now);
  }
}

export const audioEngine = new BirthdayAudioEngine();
