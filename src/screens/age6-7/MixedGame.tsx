import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import Timer from '../../components/Timer';
import { soundManager } from '../../utils/soundManager';
import { generateEasyTimeQuestion, generateMediumTimeQuestion, generateHardTimeQuestion, TimeQuestion } from '../../utils/timeUtils';

const TOTAL_QUESTIONS = 10;
const TIME_PER_QUESTION = 15;

interface Question {
  num1?: number;
  num2?: number;
  correctAnswer: number | string;
  options: (number | string)[];
  type: 'addition' | 'multiplication' | 'time';
  timeQuestion?: TimeQuestion;
}

const generateQuestion = (difficulty: 'easy' | 'medium' | 'hard'): Question => {
  let questionTypes: ('addition' | 'multiplication' | 'time')[];

  if (difficulty === 'easy') {
    questionTypes = ['addition', 'multiplication'];
  } else if (difficulty === 'medium') {
    questionTypes = ['addition', 'multiplication'];
  } else {
    questionTypes = ['addition', 'multiplication', 'time'];
  }

  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  if (type === 'time') {
    let timeQ: TimeQuestion;
    if (difficulty === 'easy') {
      timeQ = generateEasyTimeQuestion();
    } else if (difficulty === 'medium') {
      timeQ = generateMediumTimeQuestion();
    } else {
      timeQ = generateHardTimeQuestion();
    }

    return {
      correctAnswer: timeQ.correctAnswer,
      options: timeQ.options,
      type: 'time',
      timeQuestion: timeQ
    };
  }

  let num1: number, num2: number, correctAnswer: number, optionsCount: number;

  if (difficulty === 'easy') {
    optionsCount = 3;
  } else if (difficulty === 'medium') {
    optionsCount = 4;
  } else {
    optionsCount = 5;
  }

  if (type === 'addition') {
    if (difficulty === 'easy') {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      while (num1 + num2 > 20) {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
      }
    } else {
      num1 = Math.floor(Math.random() * 25) + 1;
      num2 = Math.floor(Math.random() * 25) + 1;
      while (num1 + num2 > 50) {
        num1 = Math.floor(Math.random() * 25) + 1;
        num2 = Math.floor(Math.random() * 25) + 1;
      }
    }
    correctAnswer = num1 + num2;
  } else {
    if (difficulty === 'easy') {
      num1 = Math.floor(Math.random() * 2) + 2;
      num2 = Math.floor(Math.random() * 10) + 1;
    } else if (difficulty === 'medium') {
      num1 = Math.floor(Math.random() * 4) + 2;
      num2 = Math.floor(Math.random() * 10) + 1;
    } else {
      const tables = [2, 3, 4, 5, 6, 7, 8, 9];
      num1 = tables[Math.floor(Math.random() * tables.length)];
      num2 = Math.floor(Math.random() * 12) + 1;
    }
    correctAnswer = num1 * num2;
  }

  const wrongAnswers: number[] = [];
  while (wrongAnswers.length < optionsCount - 1) {
    const offset = Math.floor(Math.random() * 8) - 4;
    const wrongAnswer = correctAnswer + offset;

    if (
      wrongAnswer !== correctAnswer &&
      wrongAnswer > 0 &&
      !wrongAnswers.includes(wrongAnswer)
    ) {
      wrongAnswers.push(wrongAnswer);
    }
  }

  const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

  return { num1, num2, correctAnswer, options, type };
};

export default function MixedGame67() {
  const navigate = useNavigate();
  const { difficulty } = useApp();

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [feedback, setFeedback] = useState('');
  const [showBalloons, setShowBalloons] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    generateNewQuestion();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      soundManager.cleanup();
    };
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!answered && questionNumber <= TOTAL_QUESTIONS) {
      soundManager.playTick();

      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return TIME_PER_QUESTION;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [answered, questionNumber]);

  const generateNewQuestion = () => {
    setCurrentQuestion(generateQuestion(difficulty));
    setTimeLeft(TIME_PER_QUESTION);
    setFeedback('');
    setShowBalloons(false);
    setAnswered(false);
    setSelectedAnswer(null);
  };

  const handleTimeUp = () => {
    if (answered) return;
    setAnswered(true);
    soundManager.stopTick();
    soundManager.playWrong();
    setFeedback("Time's Up!");
    setWrongCount(wrongCount + 1);
    setTimeout(() => moveToNextQuestion(), 1500);
  };

  const handleAnswer = (answer: number | string) => {
    if (!currentQuestion || answered) return;

    setAnswered(true);
    soundManager.stopTick();
    setSelectedAnswer(answer);

    if (answer === currentQuestion.correctAnswer) {
      setFeedback('Correct! 🎉');
      setCorrectCount(correctCount + 1);
      setShowBalloons(true);
      soundManager.playCorrect();
      soundManager.playPop();

      setTimeout(() => moveToNextQuestion(), 800);
    } else {
      setFeedback('Wrong Answer!');
      setWrongCount(wrongCount + 1);
      soundManager.playWrong();

      setTimeout(() => moveToNextQuestion(), 1500);
    }
  };

  const moveToNextQuestion = () => {
    if (questionNumber >= TOTAL_QUESTIONS) {
      navigate('/game-6-7/result', { state: { correctCount, wrongCount, gameType: 'mixed' } });
    } else {
      setQuestionNumber(questionNumber + 1);
      generateNewQuestion();
    }
  };

  if (!currentQuestion) return null;

  const operator = currentQuestion.type === 'addition' ? '+' : currentQuestion.type === 'multiplication' ? '×' : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-yellow-400 to-green-400 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <button
            onClick={() => navigate('/game-mode-6-7')}
            className="px-6 py-3 text-lg font-semibold text-white bg-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Back
          </button>

          <div className="text-xl md:text-2xl font-bold text-white bg-blue-600 px-6 py-3 rounded-xl shadow-lg">
            Question {questionNumber} / {TOTAL_QUESTIONS}
          </div>

          <div className="text-lg md:text-xl font-bold text-white bg-green-500 px-4 py-3 rounded-xl shadow-lg">
            Correct: {correctCount} | Wrong: {wrongCount}
          </div>
        </div>

        <div className="mb-6 bg-white rounded-2xl p-4 shadow-lg">
          <Timer timeLeft={timeLeft} totalTime={TIME_PER_QUESTION} />
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            {currentQuestion.type === 'time' && currentQuestion.timeQuestion ? (
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-4">
                {currentQuestion.timeQuestion.questionText}
              </div>
            ) : (
              <div className="text-5xl md:text-6xl font-bold text-orange-600 mb-4">
                {currentQuestion.num1} {operator} {currentQuestion.num2} = ?
              </div>
            )}
          </div>

          {showBalloons && (
            <div className="flex justify-center gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="text-6xl animate-float"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  🎈
                </div>
              ))}
            </div>
          )}

          {feedback && (
            <div className={`text-3xl md:text-4xl font-bold text-center mb-6 ${
              feedback.includes('Correct') ? 'text-green-500' : 'text-orange-500'
            }`}>
              {feedback}
            </div>
          )}

          <div className={`grid gap-4 md:gap-6 ${currentQuestion.options.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "py-6 md:py-8 text-2xl md:text-3xl font-bold text-white rounded-2xl shadow-lg transition-all";

              if (selectedAnswer === option) {
                if (option === currentQuestion.correctAnswer) {
                  buttonClass += " bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/50 shadow-xl scale-105";
                } else {
                  buttonClass += " bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/50 shadow-xl";
                }
              } else if (answered) {
                buttonClass += " bg-gradient-to-br from-orange-500 to-yellow-500 opacity-50 cursor-not-allowed";
              } else {
                buttonClass += " bg-gradient-to-br from-orange-500 to-yellow-500 hover:shadow-xl transform hover:scale-105";
              }

              return (
                <button
                  key={`${option}-${index}`}
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className={buttonClass}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
