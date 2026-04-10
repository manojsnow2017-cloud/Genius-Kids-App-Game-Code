class SoundManager {
  private tickSound: HTMLAudioElement | null = null;
  private popSound: HTMLAudioElement | null = null;
  private correctSound: HTMLAudioElement | null = null;
  private wrongSound: HTMLAudioElement | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    this.loadSounds();
    this.loadSoundPreference();
  }

  private loadSounds() {
    this.tickSound = new Audio('/tick.mp3');
    this.tickSound.loop = true;

    this.popSound = new Audio('/pop.mp3');
    this.correctSound = new Audio('/correct.mp3');
    this.wrongSound = new Audio('/wrong.mp3');
  }

  private loadSoundPreference() {
    const saved = localStorage.getItem('soundEnabled');
    this.soundEnabled = saved === null ? true : saved === 'true';
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    localStorage.setItem('soundEnabled', enabled.toString());
    if (!enabled) {
      this.stopAll();
    }
  }

  getSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  playTick() {
    if (!this.soundEnabled || !this.tickSound) return;
    this.tickSound.play().catch(() => {});
  }

  stopTick() {
    if (!this.tickSound) return;
    this.tickSound.pause();
    this.tickSound.currentTime = 0;
  }

  playPop() {
    if (!this.soundEnabled || !this.popSound) return;
    this.popSound.currentTime = 0;
    this.popSound.play().catch(() => {});
  }

  playCorrect() {
    if (!this.soundEnabled || !this.correctSound) return;
    this.correctSound.currentTime = 0;
    this.correctSound.play().catch(() => {});
  }

  playWrong() {
    if (!this.soundEnabled || !this.wrongSound) return;
    this.wrongSound.currentTime = 0;
    this.wrongSound.play().catch(() => {});
  }

  stopAll() {
    this.stopTick();
    if (this.popSound) {
      this.popSound.pause();
      this.popSound.currentTime = 0;
    }
    if (this.correctSound) {
      this.correctSound.pause();
      this.correctSound.currentTime = 0;
    }
    if (this.wrongSound) {
      this.wrongSound.pause();
      this.wrongSound.currentTime = 0;
    }
  }

  cleanup() {
    this.stopAll();
  }
}

export const soundManager = new SoundManager();
