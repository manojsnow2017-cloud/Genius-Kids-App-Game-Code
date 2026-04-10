class MusicManager {
  private audio: HTMLAudioElement | null = null;
  private enabled = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('backgroundMusicEnabled');
      this.enabled = saved !== 'false';
    }
  }

  init(audioSrc: string) {
    if (this.audio) return;

    this.audio = new Audio(audioSrc);
    this.audio.loop = true;
    this.audio.volume = 0.25;

    if (typeof window !== 'undefined') {
      (window as any).pauseBackgroundMusic = () => this.pause();
      (window as any).resumeBackgroundMusic = () => this.resume();
    }

    const playMusic = () => {
      if (this.enabled && this.audio) {
        this.audio.play().catch(() => {});
        document.removeEventListener('click', playMusic);
        document.removeEventListener('touchstart', playMusic);
      }
    };

    document.addEventListener('click', playMusic);
    document.addEventListener('touchstart', playMusic);
  }

  play() {
    if (this.audio && this.enabled) {
      this.audio.play().catch(() => {});
    }
  }

  pause() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
  }

  resume() {
    if (this.audio && this.enabled && this.audio.paused) {
      this.audio.play().catch(() => {});
    }
  }

  toggle() {
    this.enabled = !this.enabled;

    if (typeof window !== 'undefined') {
      localStorage.setItem('backgroundMusicEnabled', String(this.enabled));
    }

    if (this.enabled) {
      this.play();
    } else {
      this.pause();
    }

    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  setVolume(volume: number) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  cleanup() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}

export const musicManager = new MusicManager();
