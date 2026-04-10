export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  maxNumber: number;
  timer: number;
  optionCount: number;
}

export const difficultySettings: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    maxNumber: 10,
    timer: 5,
    optionCount: 3
  },
  medium: {
    maxNumber: 20,
    timer: 5,
    optionCount: 4
  },
  hard: {
    maxNumber: 20,
    timer: 5,
    optionCount: 5
  }
};

export const difficultyLabels: Record<DifficultyLevel, { emoji: string; label: string; description: string }> = {
  easy: {
    emoji: '🟢',
    label: 'Easy',
    description: 'Learn numbers 1–10'
  },
  medium: {
    emoji: '🟡',
    label: 'Medium',
    description: 'Numbers up to 20'
  },
  hard: {
    emoji: '🔴',
    label: 'Hard',
    description: 'Fast challenge'
  }
};
