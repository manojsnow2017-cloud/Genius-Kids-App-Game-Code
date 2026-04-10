import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Timer from '../components/Timer';
import ElephantMascot from '../components/ElephantMascot';
import { soundManager } from '../utils/soundManager';
import { voiceManager } from '../utils/voiceManager';
import { difficultySettings } from '../config/difficulty';

const TOTAL_QUESTIONS = 10;

interface Colour {
  name: string;
  emoji: string;
  hex: string;
}

const colours: Colour[] = [
  { name: 'Red', emoji: '🔴', hex: '#EF4444' },
  { name: 'Blue', emoji: '🔵', hex: '#3B82F6' },
  { name: 'Green', emoji: '🟢', hex: '#10B981' },
  { name: 'Yellow', emoji: '🟡', hex: '#F59E0B' },
  { name: 'Orange', emoji: '🟠', hex: '#F97316' },
  { name: 'Purple', emoji: '🟣', hex: '#A855F7' },
  { name: 'Pink', emoji: '🩷', hex: '#EC4899' },
  { name: 'Brown', emoji: '🟤', hex: '#92400E' },
];

export default function ColoursGame() {
  const { difficulty } = useApp();
  const navigate = useNavigate();
  const config = difficultySettings[difficulty];

  const [targetColour, setTargetColour] = useState<Colour | null>(null);
  const [options, setOptions] = useState<Colour[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(config.timer);
  const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);
  const [selectedColour, setSelectedColour] = useState<string | null>(null);
  const [showStars, setShowStars] = useState(false);
  const [mascotAnimation, setMascotAnimation] = useState<'idle' | 'wave' | 'jump' | 'celebrate'>('idle');
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    voiceManager.speakGameIntro('colours');
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
    const target = colours[Math.floor(Math.random() * colours.length)];
    setTargetColour(target);

    const wrongOptionsCount = config.optionCount;

    const wrongOptions = colours
      .filter((c) => c.name !== target.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, wrongOptionsCount);

    const allOptions = [target, ...wrongOptions].sort(() => Math.random() - 0.5);
    setOptions(allOptions);

    setTimeLeft(config.timer);
    setFeedback('');
    setAnswered(false);
    setSelectedColour(null);
    setShowStars(false);

    setTimeout(() => {
      voiceManager.speakInstruction(`${target.name} color`);
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

  const handleAnswer = async (colour: Colour) => {
    if (answered) return;

    setAnswered(true);
    soundManager.stopTick();
    voiceManager.stopSpeaking();
    setSelectedColour(colour.name);

    if (colour.name === targetColour?.name) {
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
      navigate('/game/colours-result', {
        state: { correctCount, wrongCount, gameType: 'colours' }
      });
    } else {
      setQuestionNumber(questionNumber + 1);
      generateQuestion();
    }
  };

  if (!targetColour) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 p-4">
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

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="text-3xl md:text-4xl font-bold text-purple-600">
              Tap the {targetColour.name.toUpperCase()} colour
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
              feedback.includes('Great') ? 'text-green-500' : 'text-orange-500'
            }`}>
              {feedback}
            </div>
          )}

          <div className="flex justify-center gap-6 md:gap-8 flex-wrap">
            {options.map((colour) => {
              const isSelected = selectedColour === colour.name;
              const isCorrect = colour.name === targetColour.name;

              let buttonClass = "w-32 h-32 md:w-40 md:h-40 rounded-3xl shadow-2xl transition-all transform flex flex-col items-center justify-center gap-3";

              if (isSelected) {
                if (isCorrect) {
                  buttonClass += " scale-110 ring-8 ring-green-400 animate-bounce";
                } else {
                  buttonClass += " scale-110 ring-8 ring-red-400 shake";
                }
              } else if (!answered) {
                buttonClass += " hover:scale-110 hover:shadow-3xl";
              } else {
                buttonClass += " opacity-50";
              }

              return (
                <button
                  key={colour.name}
                  onClick={() => handleAnswer(colour)}
                  disabled={answered}
                  className={buttonClass}
                  style={{ backgroundColor: colour.hex }}
                >
                  <div className="text-6xl md:text-7xl">{colour.emoji}</div>
                  <div className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                    {colour.name}
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
