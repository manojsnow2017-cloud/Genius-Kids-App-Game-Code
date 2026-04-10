export interface TimeQuestion {
  type: 'read' | 'add';
  baseHours: number;
  baseMinutes: number;
  addMinutes?: number;
  correctAnswer: string;
  options: string[];
  questionText: string;
}

export function formatTime12Hour(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${period}`;
}

export function addMinutesToTime(hours: number, minutes: number, addMinutes: number): { hours: number; minutes: number } {
  let newMinutes = minutes + addMinutes;
  let newHours = hours;

  while (newMinutes >= 60) {
    newMinutes -= 60;
    newHours += 1;
  }

  if (newHours >= 24) {
    newHours -= 24;
  }

  return { hours: newHours, minutes: newMinutes };
}

export function generateEasyTimeQuestion(): TimeQuestion {
  const hours = Math.floor(Math.random() * 12) + 1;
  const possibleMinutes = [0, 30];
  const minutes = possibleMinutes[Math.floor(Math.random() * possibleMinutes.length)];

  const correctAnswer = formatTime12Hour(hours, minutes);

  const wrongOptions = new Set<string>();
  while (wrongOptions.size < 2) {
    const wrongHour = Math.floor(Math.random() * 12) + 1;
    const wrongMinutes = possibleMinutes[Math.floor(Math.random() * possibleMinutes.length)];
    const wrongAnswer = formatTime12Hour(wrongHour, wrongMinutes);
    if (wrongAnswer !== correctAnswer) {
      wrongOptions.add(wrongAnswer);
    }
  }

  const options = [correctAnswer, ...Array.from(wrongOptions)].sort(() => Math.random() - 0.5);

  return {
    type: 'read',
    baseHours: hours,
    baseMinutes: minutes,
    correctAnswer,
    options,
    questionText: 'What time is it?'
  };
}

export function generateMediumTimeQuestion(): TimeQuestion {
  const possibleMinutes = [0, 5, 10, 15, 20, 25, 30, 45];
  const possibleAdditions = [5, 10, 15];

  const baseHours = Math.floor(Math.random() * 12) + 1;
  const baseMinutes = possibleMinutes[Math.floor(Math.random() * possibleMinutes.length)];
  const addMinutes = possibleAdditions[Math.floor(Math.random() * possibleAdditions.length)];

  const result = addMinutesToTime(baseHours, baseMinutes, addMinutes);
  const correctAnswer = formatTime12Hour(result.hours, result.minutes);
  const baseTime = formatTime12Hour(baseHours, baseMinutes);

  const wrongOptions = new Set<string>();
  while (wrongOptions.size < 3) {
    const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1) * 5;
    const wrongResult = addMinutesToTime(result.hours, result.minutes, offset);
    const wrongAnswer = formatTime12Hour(wrongResult.hours, wrongResult.minutes);
    if (wrongAnswer !== correctAnswer) {
      wrongOptions.add(wrongAnswer);
    }
  }

  const options = [correctAnswer, ...Array.from(wrongOptions)].sort(() => Math.random() - 0.5);

  return {
    type: 'add',
    baseHours,
    baseMinutes,
    addMinutes,
    correctAnswer,
    options,
    questionText: `What is ${addMinutes} minutes after ${baseTime}?`
  };
}

export function generateHardTimeQuestion(): TimeQuestion {
  const possibleMinutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const minAddition = 10;
  const maxAddition = 20;

  const baseHours = Math.floor(Math.random() * 12) + 1;
  const baseMinutes = possibleMinutes[Math.floor(Math.random() * possibleMinutes.length)];
  const addMinutes = Math.floor(Math.random() * (maxAddition - minAddition + 1)) + minAddition;

  const result = addMinutesToTime(baseHours, baseMinutes, addMinutes);
  const correctAnswer = formatTime12Hour(result.hours, result.minutes);
  const baseTime = formatTime12Hour(baseHours, baseMinutes);

  const wrongOptions = new Set<string>();
  while (wrongOptions.size < 4) {
    const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 1);
    const wrongResult = addMinutesToTime(result.hours, result.minutes, offset);
    const wrongAnswer = formatTime12Hour(wrongResult.hours, wrongResult.minutes);
    if (wrongAnswer !== correctAnswer) {
      wrongOptions.add(wrongAnswer);
    }
  }

  const options = [correctAnswer, ...Array.from(wrongOptions)].sort(() => Math.random() - 0.5);

  return {
    type: 'add',
    baseHours,
    baseMinutes,
    addMinutes,
    correctAnswer,
    options,
    questionText: `What is ${addMinutes} minutes after ${baseTime}?`
  };
}
