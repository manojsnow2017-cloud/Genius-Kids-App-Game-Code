export interface AdditionQuestion {
  num1: number;
  num2: number;
  correctAnswer: number;
  options: number[];
}

export const generateAdditionQuestion = (maxNumber: number = 20, optionCount: number = 3): AdditionQuestion => {
  let num1: number;
  let num2: number;
  let correctAnswer: number;

  if (maxNumber <= 10) {
    const patterns = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
      [1, 1], [2, 1], [1, 2], [2, 2], [3, 1],
      [1, 3], [2, 3], [3, 2], [1, 4], [4, 1]
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    num1 = pattern[0];
    num2 = pattern[1];
    correctAnswer = num1 + num2;
  } else {
    const halfMax = Math.floor(maxNumber / 2);
    num1 = Math.floor(Math.random() * halfMax) + 1;
    num2 = Math.floor(Math.random() * halfMax) + 1;

    while (num1 + num2 > maxNumber) {
      num1 = Math.floor(Math.random() * halfMax) + 1;
      num2 = Math.floor(Math.random() * halfMax) + 1;
    }

    correctAnswer = num1 + num2;
  }

  const wrongAnswers: number[] = [];
  const maxWrongAnswers = optionCount;

  while (wrongAnswers.length < maxWrongAnswers) {
    let wrongAnswer: number;

    if (optionCount === 3) {
      const offset = Math.floor(Math.random() * 6) - 3;
      wrongAnswer = correctAnswer + offset;
    } else if (optionCount === 4) {
      const offsets = [-2, -1, 1, 2];
      const offset = offsets[Math.floor(Math.random() * offsets.length)];
      wrongAnswer = correctAnswer + offset;
    } else {
      const offsets = [-3, -2, -1, 1, 2, 3];
      const offset = offsets[Math.floor(Math.random() * offsets.length)];
      wrongAnswer = correctAnswer + offset;
    }

    if (
      wrongAnswer !== correctAnswer &&
      wrongAnswer >= 0 &&
      wrongAnswer <= maxNumber + 5 &&
      !wrongAnswers.includes(wrongAnswer)
    ) {
      wrongAnswers.push(wrongAnswer);
    }
  }

  const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

  return {
    num1,
    num2,
    correctAnswer,
    options,
  };
};
