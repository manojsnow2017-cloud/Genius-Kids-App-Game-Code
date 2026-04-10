import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Timer from '../components/Timer';
import { soundManager } from '../utils/soundManager';
import { voiceManager } from '../utils/voiceManager';
import { difficultySettings } from '../config/difficulty';

const TOTAL_QUESTIONS = 10;

export default function CountBalloonsGame() {
  const { difficulty } = useApp();
  const navigate = useNavigate();
  const config = difficultySettings[difficulty];
  const [targetNumber, setTargetNumber] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(config.timer);
  const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

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
    const num = Math.floor(Math.random() * config.maxNumber) + 1;
    setTargetNumber(num);
    setTimeLeft(config.timer);
    setFeedback('');
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

    if (answer === targetNumber) {
      const encouragement = voiceManager.getRandomEncouragement();
      setFeedback(encouragement);
      setCorrectCount(correctCount + 1);
      soundManager.playCorrect();
      soundManager.playPop();

      await voiceManager.speakEncouragement(encouragement);

      setTimeout(() => {
        moveToNextQuestion();
      }, 1000);
    } else {
      setFeedback('Wrong Answer! 🤔');
      setWrongCount(wrongCount + 1);
      soundManager.playWrong();

      setTimeout(() => {
        moveToNextQuestion();
      }, 1500);
    }
  };

  const moveToNextQuestion = () => {
    if (questionNumber >= TOTAL_QUESTIONS) {
      navigate('/game/count-result', {
        state: { correctCount, wrongCount }
      });
    } else {
      setQuestionNumber(questionNumber + 1);
      generateQuestion();
    }
  };

  const answerOptions = Array.from({ length: config.maxNumber }, (_, i) => i + 1);

  const getButtonClassName = (num: number) => {
    let baseClass = "aspect-square text-lg md:text-xl font-bold text-white rounded-xl shadow-lg transition-all";

    if (selectedAnswer === num) {
      if (num === targetNumber) {
        return `${baseClass} bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/50 shadow-xl scale-110`;
      } else {
        return `${baseClass} bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/50 shadow-xl scale-110`;
      }
    }

    if (answered) {
      return `${baseClass} bg-gradient-to-br from-purple-500 to-pink-500 opacity-50 cursor-not-allowed`;
    }

    return `${baseClass} bg-gradient-to-br from-purple-500 to-pink-500 hover:shadow-xl transform hover:scale-110`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-500 p-4">
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
          <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-6">
            How many balloons? 🎈
          </div>

          <div className="min-h-[200px] max-h-[300px] overflow-y-auto flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-6 p-4 border-2 border-dashed border-purple-300 rounded-2xl">
            {Array.from({ length: targetNumber }).map((_, index) => (
              <div
                key={index}
                className="text-4xl md:text-5xl animate-float"
                style={{
                  animationDelay: `${(index * 0.1) % 2}s`,
                }}
              >
                🎈
              </div>
            ))}
          </div>

          {feedback && (
            <div className={`text-3xl md:text-4xl font-bold mb-6 ${
              feedback.includes('Great') ? 'text-green-500' : 'text-orange-500'
            }`}>
              {feedback}
            </div>
          )}

          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3">
            {answerOptions.map((num) => (
              <button
                key={num}
                onClick={() => handleAnswer(num)}
                disabled={answered}
                className={getButtonClassName(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
