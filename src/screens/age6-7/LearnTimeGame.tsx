import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import Timer from '../../components/Timer';
import AnalogClock from '../../components/AnalogClock';
import ElephantMascot from '../../components/ElephantMascot';
import { soundManager } from '../../utils/soundManager';
import { voiceManager } from '../../utils/voiceManager';
import { difficultySettings } from '../../config/difficulty';
import {
  generateEasyTimeQuestion,
  generateMediumTimeQuestion,
  generateHardTimeQuestion,
  TimeQuestion
} from '../../utils/timeUtils';

const TOTAL_QUESTIONS = 10;

export default function LearnTimeGame() {
  const { difficulty } = useApp();
  const navigate = useNavigate();
  const config = difficultySettings[difficulty];

  const [currentQuestion, setCurrentQuestion] = useState<TimeQuestion | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(config.timer);
  const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showStars, setShowStars] = useState(false);
  const [mascotAnimation, setMascotAnimation] = useState<'idle' | 'wave' | 'jump' | 'celebrate'>('idle');
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    voiceManager.speakGameIntro('time');
    setTimeout(() => {
      generateQuestion();
    }, 3000);

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
    setAnswered(false);
    setSelectedAnswer(null);
    setFeedback('');
    setShowStars(false);
    setTimeLeft(config.timer);

    let question: TimeQuestion;
    if (difficulty === 'easy') {
      question = generateEasyTimeQuestion();
    } else if (difficulty === 'medium') {
      question = generateMediumTimeQuestion();
    } else {
      question = generateHardTimeQuestion();
    }

    setCurrentQuestion(question);

    setTimeout(() => {
      voiceManager.speakInstruction(question.questionText);
    }, 500);
  };

  const handleTimeUp = () => {
    if (answered) return;

    setAnswered(true);
    soundManager.stopTick();
    setFeedback("Time's Up!");
    setWrongCount(wrongCount + 1);

    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  };

  const handleAnswer = async (answer: string) => {
    if (answered) return;

    setAnswered(true);
    soundManager.stopTick();
    voiceManager.stopSpeaking();
    setSelectedAnswer(answer);

    if (answer === currentQuestion?.correctAnswer) {
      const encouragement = voiceManager.getRandomEncouragement();
      setFeedback(encouragement);
      setCorrectCount(correctCount + 1);
      setShowStars(true);
      setConsecutiveWrong(0);
      setMascotAnimation('celebrate');
      soundManager.playCorrect();
      soundManager.playPop();

      await voiceManager.speakEncouragement(encouragement);

      setTimeout(() => {
        setMascotAnimation('idle');
        moveToNextQuestion();
      }, 1000);
    } else {
      setFeedback('Wrong answer');
      setWrongCount(wrongCount + 1);
      const newConsecutiveWrong = consecutiveWrong + 1;
      setConsecutiveWrong(newConsecutiveWrong);
      soundManager.playWrong();

      if (newConsecutiveWrong >= 2) {
        await voiceManager.speakHint();
      }

      setTimeout(() => {
        moveToNextQuestion();
      }, 1500);
    }
  };

  const moveToNextQuestion = () => {
    if (questionNumber >= TOTAL_QUESTIONS) {
      navigate('/game-6-7/result', {
        state: { correctCount, wrongCount, gameType: 'time' }
      });
    } else {
      setQuestionNumber(questionNumber + 1);
      generateQuestion();
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-yellow-300 to-amber-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <button
            onClick={() => navigate('/game-mode-6-7')}
            className="px-6 py-3 text-lg font-semibold text-white bg-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Back
          </button>

          <div className="text-xl md:text-2xl font-bold text-white bg-orange-600 px-6 py-3 rounded-xl shadow-lg">
            Question {questionNumber} / {TOTAL_QUESTIONS}
          </div>

          <div className="text-lg md:text-xl font-bold text-white bg-green-500 px-4 py-3 rounded-xl shadow-lg">
            Correct: {correctCount} | Wrong: {wrongCount}
          </div>
        </div>

        <div className="mb-6 bg-white rounded-2xl p-4 shadow-lg">
          <Timer timeLeft={timeLeft} totalTime={config.timer} />
        </div>

        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
          {showStars && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-4xl animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: '1s',
                  }}
                >
                  ⭐
                </div>
              ))}
            </div>
          )}

          <h2 className="text-4xl md:text-5xl font-bold text-sky-700 mb-10">
            {currentQuestion.questionText}
          </h2>

          {currentQuestion.type === 'read' && (
            <div className="mb-12">
              <AnalogClock
                hours={currentQuestion.baseHours}
                minutes={currentQuestion.baseMinutes}
                size="large"
              />
            </div>
          )}

          {feedback && (
            <div className={`text-4xl md:text-5xl font-bold mb-8 ${
              feedback.includes('Great') || feedback.includes('Amazing') || feedback.includes('Awesome') || feedback.includes('Fantastic') || feedback.includes('Super') ? 'text-green-500' : 'text-orange-500'
            }`}>
              {feedback}
            </div>
          )}

          <div className={`grid gap-6 md:gap-8 max-w-3xl mx-auto ${currentQuestion.options.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;

              let buttonClass = "px-10 py-8 text-3xl md:text-4xl font-bold rounded-3xl shadow-2xl transition-all transform";

              if (isSelected) {
                if (isCorrect) {
                  buttonClass += " bg-gradient-to-br from-green-400 to-green-600 text-white scale-110 ring-8 ring-green-300 animate-bounce";
                } else {
                  buttonClass += " bg-gradient-to-br from-red-400 to-red-600 text-white scale-110 ring-8 ring-red-300 shake";
                }
              } else if (!answered) {
                buttonClass += " bg-gradient-to-br from-sky-400 to-blue-500 text-white hover:scale-110 hover:shadow-3xl hover:from-sky-500 hover:to-blue-600";
              } else {
                buttonClass += " bg-gray-200 text-gray-400 opacity-40";
              }

              return (
                <button
                  key={option}
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

        <ElephantMascot size="small" animate={mascotAnimation} position="corner" />
      </div>
    </div>
  );
}
