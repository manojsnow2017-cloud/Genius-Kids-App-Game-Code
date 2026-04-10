import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Timer from '../components/Timer';
import ElephantMascot from '../components/ElephantMascot';
import { soundManager } from '../utils/soundManager';
import { voiceManager } from '../utils/voiceManager';
import { difficultySettings } from '../config/difficulty';

const TOTAL_QUESTIONS = 10;

interface Shape {
  name: string;
  svg: string;
  color: string;
}

const shapes: Shape[] = [
  {
    name: 'Circle',
    svg: '<circle cx="60" cy="60" r="50" fill="currentColor" />',
    color: 'text-red-500'
  },
  {
    name: 'Square',
    svg: '<rect x="10" y="10" width="100" height="100" fill="currentColor" />',
    color: 'text-blue-500'
  },
  {
    name: 'Triangle',
    svg: '<polygon points="60,10 110,110 10,110" fill="currentColor" />',
    color: 'text-green-500'
  },
  {
    name: 'Star',
    svg: '<polygon points="60,10 70,40 100,40 75,60 85,90 60,70 35,90 45,60 20,40 50,40" fill="currentColor" />',
    color: 'text-yellow-500'
  },
  {
    name: 'Heart',
    svg: '<path d="M60,100 C60,100 10,70 10,45 C10,30 20,20 35,20 C45,20 55,25 60,35 C65,25 75,20 85,20 C100,20 110,30 110,45 C110,70 60,100 60,100 Z" fill="currentColor" />',
    color: 'text-pink-500'
  },
  {
    name: 'Diamond',
    svg: '<polygon points="60,10 110,60 60,110 10,60" fill="currentColor" />',
    color: 'text-purple-500'
  },
  {
    name: 'Oval',
    svg: '<ellipse cx="60" cy="60" rx="50" ry="35" fill="currentColor" />',
    color: 'text-orange-500'
  },
];

export default function ShapesGame() {
  const { difficulty } = useApp();
  const navigate = useNavigate();
  const config = difficultySettings[difficulty];

  const [targetShape, setTargetShape] = useState<Shape | null>(null);
  const [options, setOptions] = useState<Shape[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(config.timer);
  const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [showStars, setShowStars] = useState(false);
  const [mascotAnimation, setMascotAnimation] = useState<'idle' | 'wave' | 'jump' | 'celebrate'>('idle');
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    voiceManager.speakGameIntro('shapes');
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
    const target = shapes[Math.floor(Math.random() * shapes.length)];
    setTargetShape(target);

    const wrongOptionsCount = config.optionCount;

    const wrongOptions = shapes
      .filter((s) => s.name !== target.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, wrongOptionsCount);

    const allOptions = [target, ...wrongOptions].sort(() => Math.random() - 0.5);
    setOptions(allOptions);

    setTimeLeft(config.timer);
    setFeedback('');
    setAnswered(false);
    setSelectedShape(null);
    setShowStars(false);

    setTimeout(() => {
      voiceManager.speakInstruction(target.name);
    }, 500);
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

  const handleAnswer = async (shape: Shape) => {
    if (answered) return;

    setAnswered(true);
    soundManager.stopTick();
    voiceManager.stopSpeaking();
    setSelectedShape(shape.name);

    if (shape.name === targetShape?.name) {
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
      setFeedback('Try Again!');
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
      navigate('/game/shapes-result', {
        state: { correctCount, wrongCount, gameType: 'shapes' }
      });
    } else {
      setQuestionNumber(questionNumber + 1);
      generateQuestion();
    }
  };

  if (!targetShape) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300 p-4">
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
          {showStars && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {[...Array(25)].map((_, i) => (
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

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="text-3xl md:text-4xl font-bold text-purple-600">
              Tap the <span className="text-orange-500">{targetShape.name.toUpperCase()}</span>
            </div>
            <button
              onClick={() => voiceManager.replayInstruction()}
              className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all hover:scale-110"
              title="Replay instruction"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            </button>
          </div>

          {feedback && (
            <div className={`text-4xl md:text-5xl font-bold mb-6 ${
              feedback.includes('Amazing') ? 'text-green-500' : 'text-orange-500'
            }`}>
              {feedback}
            </div>
          )}

          <div className="flex justify-center gap-6 md:gap-10 flex-wrap">
            {options.map((shape) => {
              const isSelected = selectedShape === shape.name;
              const isCorrect = shape.name === targetShape.name;

              let buttonClass = `w-36 h-36 md:w-44 md:h-44 rounded-3xl shadow-2xl transition-all transform bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center gap-2 ${shape.color}`;

              if (isSelected) {
                if (isCorrect) {
                  buttonClass += " scale-110 ring-8 ring-green-400 animate-bounce";
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
                  key={shape.name}
                  onClick={() => handleAnswer(shape)}
                  disabled={answered}
                  className={buttonClass}
                >
                  <svg
                    viewBox="0 0 120 120"
                    className="w-20 h-20 md:w-24 md:h-24"
                    dangerouslySetInnerHTML={{ __html: shape.svg }}
                  />
                  <div className="text-xl md:text-2xl font-bold text-gray-700">
                    {shape.name}
                  </div>
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
