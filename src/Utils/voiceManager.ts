const encouragementPhrases = [
  'Amazing!',
  'Great job!',
  'Well done!',
  'You are smart!',
  'Fantastic!',
  'Awesome!',
  'Super!',
  'Nice work!',
];

const instructionPhrases = [
  'Tap the {item}',
  'Can you find the {item}?',
  'Touch the {item}',
  'Where is the {item}?',
];

const gameIntroductions = {
  colours: "Let's learn colors! Tap the color I say.",
  shapes: "Can you find the shape I ask for?",
  addition: "Let's add the numbers together!",
  counting: "Count the objects and choose the right number.",
  balloons: "Pop all the balloons! Tap each one.",
  numberRecognition: "Find the number I say!",
  time: "Let's learn to tell time! Look at the clock carefully.",
};

const hintPhrases = [
  "Try again! Look carefully.",
  "Let's find it together.",
  "You can do it! Look again.",
  "Almost there! Try once more.",
];

class VoiceManager {
  private isSpeaking = false;
  private lastInstruction = '';
  private backgroundMusicPaused = false;

  stopSpeaking() {
    if (this.isSpeaking && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  getRandomEncouragement(): string {
    return encouragementPhrases[Math.floor(Math.random() * encouragementPhrases.length)];
  }

  getInstruction(item: string): string {
    const template = instructionPhrases[Math.floor(Math.random() * instructionPhrases.length)];
    return template.replace('{item}', item.toLowerCase());
  }

  speakInstruction(item: string): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      this.stopSpeaking();

      const instruction = this.getInstruction(item);
      this.lastInstruction = instruction;
      const utterance = new SpeechSynthesisUtterance(instruction);

      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        resolve();
      };

      const timeout = setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 300);

      setTimeout(() => {
        clearTimeout(timeout);
        if (this.isSpeaking) {
          resolve();
        }
      }, 5000);
    });
  }

  replayInstruction(): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window) || !this.lastInstruction) {
        resolve();
        return;
      }

      this.stopSpeaking();

      const utterance = new SpeechSynthesisUtterance(this.lastInstruction);

      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        resolve();
      };

      const timeout = setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);

      setTimeout(() => {
        clearTimeout(timeout);
        if (this.isSpeaking) {
          resolve();
        }
      }, 5000);
    });
  }

  speakEncouragement(customPhrase?: string): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      this.stopSpeaking();

      const phrase = customPhrase || this.getRandomEncouragement();
      const utterance = new SpeechSynthesisUtterance(phrase);

      utterance.rate = 0.85;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        resolve();
      };

      const timeout = setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);

      setTimeout(() => {
        clearTimeout(timeout);
        if (this.isSpeaking) {
          resolve();
        }
      }, 3000);
    });
  }

  speakGameIntro(gameType: keyof typeof gameIntroductions): Promise<void> {
    const intro = gameIntroductions[gameType];
    return this.speak(intro);
  }

  speakWelcome(): Promise<void> {
    return this.speak("Hello! Welcome to Genius Kids. Let's learn and play!");
  }

  speakHint(): Promise<void> {
    const hint = hintPhrases[Math.floor(Math.random() * hintPhrases.length)];
    return this.speak(hint);
  }

  private speak(text: string, pitch: number = 1): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      this.stopSpeaking();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = pitch;
      utterance.volume = 1;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (typeof window !== 'undefined' && (window as any).pauseBackgroundMusic) {
          (window as any).pauseBackgroundMusic();
          this.backgroundMusicPaused = true;
        }
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (this.backgroundMusicPaused && typeof window !== 'undefined' && (window as any).resumeBackgroundMusic) {
          setTimeout(() => {
            (window as any).resumeBackgroundMusic();
          }, 300);
          this.backgroundMusicPaused = false;
        }
        resolve();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (this.backgroundMusicPaused && typeof window !== 'undefined' && (window as any).resumeBackgroundMusic) {
          (window as any).resumeBackgroundMusic();
          this.backgroundMusicPaused = false;
        }
        resolve();
      };

      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    });
  }

  cleanup() {
    this.stopSpeaking();
    this.lastInstruction = '';
  }
}

export const voiceManager = new VoiceManager();
