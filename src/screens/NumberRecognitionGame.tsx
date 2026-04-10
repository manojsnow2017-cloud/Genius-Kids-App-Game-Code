import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Timer from '../components/Timer';
import { soundManager } from '../utils/soundManager';
import { voiceManager } from '../utils/voiceManager';
import { difficultySettings } from '../config/difficulty';

const TOTAL_QUESTIONS = 10;

export default function NumberRecognitionGame() {
  const { difficulty } = useApp();
  const navigate = useNavigate();
  const config = difficultySettings[difficulty];

  const [targetNumber, setTargetNumber] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(config.timer);
  const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    generateQuestion();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      soundManager.cleanup();
      voiceManager.cleanup();
    };
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (!answered && questionNumber <= TOTAL_QUESTIONS) {
      soundManager.playTick();

      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return config.timer;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [answered, questionNumber]);

  const generateQuestion = () => {
    const target = Math.floor(Math.random() * (config.maxNumber + 1));
    setTargetNumber(target);

    const wrongOptions: number[] = [];
    const wrongCount = config.optionCount;
    while (wrongOptions.length < wrongCount) {
      const wrong = Math.floor(Math.random() * (config.maxNumber + 1));
      if (wrong !== target && !wrongOptions.includes(wrong)) {
        wrongOptions.push(wrong);
      }
    }

    const allOptions = [target, ...wrongOptions].sort(() => Math.random() - 0.5);
    setOptions(allOptions);

    setTimeLeft(config.timer);
    setFeedback('');
    setAnswered(false);
    setSelectedNumber(null);
    setShowConfetti(false);
  };

  const handleTimeUp = () => {
    if (answered) return;

    setAnswered(true);
    soundManager.stopTick();
    soundManager.playWrong();
    setFeedback("Time's Up!");
    setWrongCount(wrongCount + 1);

    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  };

  const handleAnswer = async (number: number) => {
    if (answered) return;

    setAnswered(true);
    soundManager.stopTick();
    voiceManager.stopSpeaking();
    setSelectedNumber(number);

    if (number === targetNumber) {
      const encouragement = voiceManager.getRandomEncouragement();
      setFeedback(encouragement);
      setCorrectCount(correctCount + 1);
      setShowConfetti(true);
      soundManager.playCorrect();
      soundManager.playPop();

      await voiceManager.speakEncouragement(encouragement);

      setTimeout(() => {
        moveToNextQuestion();
      }, 1000);
    } else {
      setFeedback('Try Again!');
      setWrongCount(wrongCount + 1);
      soundManager.playWrong();

      setTimeout(() => {
        moveToNextQuestion();
      }, 1500);
    }
  };

  const moveToNextQuestion = () => {
    if (questionNumber >= TOTAL_QUESTIONS) {
      navigate('/game/number-result', {
        state: { correctCount, wrongCount, gameType: 'number' }
      });
    } else {
      setQuestionNumber(questionNumber + 1);
      generateQuestion();
    }
  };

  const numberColors = [
    'from-red-400 to-red-600',
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-yellow-400 to-yellow-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-green-300 to-yellow-300 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <button
            onClick={() => navigate('/game-mode')}
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
          <Timer timeLeft={timeLeft} totalTime={config.timer} />
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`,
                    fontSize: `${20 + Math.random() * 20}px`,
                  }}
                >
                  {['🎉', '✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 5)]}
                </div>
              ))}
            </div>
          )}

          <div className="text-3xl md:text-5xl font-bold text-purple-600 mb-8">
            Tap the number <span className="text-6xl md:text-7xl text-orange-500">{targetNumber}</span>
          </div>

          {feedback && (
            <div className={`text-4xl md:text-5xl font-bold mb-6 ${
              feedback.includes('Excellent') ? 'text-green-500' : 'text-orange-500'
            }`}>
              {feedback}
            </div>
          )}

          <div className="flex justify-center gap-6 md:gap-10 flex-wrap">
            {options.map((number, index) => {
              const isSelected = selectedNumber === number;
              const isCorrect = number === targetNumber;

              let buttonClass = `w-32 h-32 md:w-44 md:h-44 rounded-3xl shadow-2xl transition-all transform bg-gradient-to-br ${numberColors[index % numberColors.length]}`;

              if (isSelected) {
                if (isCorrect) {
                  buttonClass += " scale-125 ring-8 ring-green-400 animate-pulse";
                } else {
                  buttonClass += " scale-110 ring-8 ring-red-400";
                }
              } else if (!answered) {
                buttonClass += " hover:scale-110 hover:shadow-3xl";
              } else {
                buttonClass += " opacity-50";
              }

              return (
                <button
                  key={number}
                  onClick={() => handleAnswer(number)}
                  disabled={answered}
                  className={buttonClass}
                >
                  <div className="text-7xl md:text-8xl font-black text-white drop-shadow-2xl">
                    {number}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
