import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Timer from '../components/Timer';
import { soundManager } from '../utils/soundManager';
import { voiceManager } from '../utils/voiceManager';
import { difficultySettings } from '../config/difficulty';

const TOTAL_QUESTIONS = 10;

interface ObjectType {
  name: string;
  emoji: string;
}

const objects: ObjectType[] = [
  { name: 'Apples', emoji: '🍎' },
  { name: 'Stars', emoji: '⭐' },
  { name: 'Fish', emoji: '🐟' },
  { name: 'Cars', emoji: '🚗' },
  { name: 'Bananas', emoji: '🍌' },
  { name: 'Hearts', emoji: '❤️' },
  { name: 'Flowers', emoji: '🌸' },
  { name: 'Balls', emoji: '⚽' },
];

export default function CountObjectsGame() {
  const { difficulty } = useApp();
  const navigate = useNavigate();
  const config = difficultySettings[difficulty];

  const [objectType, setObjectType] = useState<ObjectType | null>(null);
  const [targetCount, setTargetCount] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(config.timer);
  const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

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
    const obj = objects[Math.floor(Math.random() * objects.length)];
    setObjectType(obj);

    const count = Math.floor(Math.random() * config.maxNumber) + 1;
    setTargetCount(count);

    const wrongOptions: number[] = [];
    const wrongCount = config.optionCount;
    while (wrongOptions.length < wrongCount) {
      const wrong = Math.floor(Math.random() * config.maxNumber) + 1;
      if (wrong !== count && !wrongOptions.includes(wrong)) {
        wrongOptions.push(wrong);
      }
    }

    const allOptions = [count, ...wrongOptions].sort(() => Math.random() - 0.5);
    setOptions(allOptions);

    setTimeLeft(config.timer);
    setFeedback('');
    setAnswered(false);
    setSelectedAnswer(null);
    setShowCelebration(false);
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

  const handleAnswer = async (answer: number) => {
    if (answered) return;

    setAnswered(true);
    soundManager.stopTick();
    voiceManager.stopSpeaking();
    setSelectedAnswer(answer);

    if (answer === targetCount) {
      const encouragement = voiceManager.getRandomEncouragement();
      setFeedback(encouragement);
      setCorrectCount(correctCount + 1);
      setShowCelebration(true);
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
      navigate('/game/count-objects-result', {
        state: { correctCount, wrongCount, gameType: 'count-objects' }
      });
    } else {
      setQuestionNumber(questionNumber + 1);
      generateQuestion();
    }
  };

  if (!objectType) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 via-teal-300 to-cyan-300 p-4">
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
          {showCelebration && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-5xl animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.3}s`,
                    animationDuration: `${0.8 + Math.random() * 0.4}s`,
                  }}
                >
                  🎉
                </div>
              ))}
            </div>
          )}

          <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-6">
            How many {objectType.name.toLowerCase()}?
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8 min-h-[200px] flex flex-wrap justify-center items-center gap-3 border-4 border-dashed border-orange-300">
            {Array.from({ length: targetCount }).map((_, index) => (
              <div
                key={index}
                className="text-5xl md:text-6xl animate-float"
                style={{
                  animationDelay: `${(index * 0.15) % 2}s`,
                }}
              >
                {objectType.emoji}
              </div>
            ))}
          </div>

          {feedback && (
            <div className={`text-4xl md:text-5xl font-bold mb-6 ${
              feedback.includes('Perfect') ? 'text-green-500' : 'text-orange-500'
            }`}>
              {feedback}
            </div>
          )}

          <div className="flex justify-center gap-6 md:gap-8 flex-wrap">
            {options.map((number) => {
              const isSelected = selectedAnswer === number;
              const isCorrect = number === targetCount;

              let buttonClass = "w-28 h-28 md:w-36 md:h-36 rounded-3xl shadow-2xl transition-all transform bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center";

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
                  <div className="text-6xl md:text-7xl font-black text-white drop-shadow-2xl">
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
