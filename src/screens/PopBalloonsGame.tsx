import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Timer from '../components/Timer';
import { soundManager } from '../utils/soundManager';
import { difficultySettings } from '../config/difficulty';

const TOTAL_QUESTIONS = 10;

export default function PopBalloonsGame() {
  const { difficulty } = useApp();
  const navigate = useNavigate();
  const config = difficultySettings[difficulty];
  const [targetNumber, setTargetNumber] = useState(0);
  const [balloons, setBalloons] = useState<boolean[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(config.timer);
  const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    generateQuestion();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      soundManager.cleanup();
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
    const num = Math.floor(Math.random() * config.maxNumber) + 1;
    setTargetNumber(num);
    setBalloons(Array(config.maxNumber).fill(true));
    setPoppedCount(0);
    setTimeLeft(config.timer);
    setFeedback('');
    setAnswered(false);
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

  const handleBalloonClick = (index: number) => {
    if (!balloons[index] || answered) return;

    soundManager.playPop();

    const newBalloons = [...balloons];
    newBalloons[index] = false;
    setBalloons(newBalloons);

    const newPoppedCount = poppedCount + 1;
    setPoppedCount(newPoppedCount);

    if (newPoppedCount === targetNumber) {
      setAnswered(true);
      soundManager.stopTick();
      soundManager.playCorrect();
      setFeedback('Perfect! 🎉');
      setCorrectCount(correctCount + 1);

      setTimeout(() => {
        moveToNextQuestion();
      }, 800);
    } else if (newPoppedCount > targetNumber) {
      setAnswered(true);
      soundManager.stopTick();
      soundManager.playWrong();
      setFeedback('Oops! Too many! 🤔');
      setWrongCount(wrongCount + 1);

      setTimeout(() => {
        moveToNextQuestion();
      }, 1500);
    }
  };

  const moveToNextQuestion = () => {
    if (questionNumber >= TOTAL_QUESTIONS) {
      navigate('/game/pop-result', {
        state: { correctCount, wrongCount }
      });
    } else {
      setQuestionNumber(questionNumber + 1);
      generateQuestion();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 p-4">
      <div className="max-w-6xl mx-auto">
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

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 text-center">
          <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-4">
            Pop {targetNumber} {targetNumber === 1 ? 'Balloon' : 'Balloons'}! 💥
          </div>

          <div className="text-xl md:text-2xl font-semibold text-gray-600 mb-6">
            Popped: {poppedCount} / {targetNumber}
          </div>

          <div className="min-h-[250px] max-h-[350px] overflow-y-auto flex flex-wrap justify-center items-center gap-3 md:gap-4 mb-6 p-4 border-2 border-dashed border-purple-300 rounded-2xl">
            {balloons.map((isVisible, index) => (
              <button
                key={index}
                onClick={() => handleBalloonClick(index)}
                disabled={!isVisible || answered}
                className={`text-5xl md:text-6xl transform transition-all ${
                  isVisible
                    ? 'animate-float hover:scale-125 cursor-pointer'
                    : 'opacity-0 cursor-not-allowed'
                }`}
                style={{
                  animationDelay: `${(index * 0.1) % 2}s`,
                }}
              >
                {isVisible ? '🎈' : '💥'}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`text-3xl md:text-4xl font-bold mb-6 ${
              feedback.includes('Perfect') ? 'text-green-500' : 'text-orange-500'
            }`}>
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
