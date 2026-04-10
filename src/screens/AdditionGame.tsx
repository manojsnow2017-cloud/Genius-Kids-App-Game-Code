import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { generateAdditionQuestion, AdditionQuestion } from '../utils/generateQuestion';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';
import { soundManager } from '../utils/soundManager';
import { voiceManager } from '../utils/voiceManager';
import { difficultySettings } from '../config/difficulty';

const TOTAL_QUESTIONS = 10;

export default function AdditionGame() {
  const { difficulty } = useApp();
  const navigate = useNavigate();
  const config = difficultySettings[difficulty];

  const [currentQuestion, setCurrentQuestion] = useState<AdditionQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timer);
  const [feedback, setFeedback] = useState('');
  const [showBalloons, setShowBalloons] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    generateNewQuestion();
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

    if (feedback === '' && questionNumber <= TOTAL_QUESTIONS) {
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
  }, [feedback, questionNumber]);

  const generateNewQuestion = () => {
    setCurrentQuestion(generateAdditionQuestion(config.maxNumber, config.optionCount));
    setTimeLeft(config.timer);
    setFeedback('');
    setShowBalloons(false);
    setSelectedAnswer(null);
  };

  const handleTimeUp = () => {
    soundManager.stopTick();
    soundManager.playWrong();
    setFeedback("Time's Up!");
    setWrongCount(wrongCount + 1);
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  };

  const handleAnswer = async (answer: number) => {
    if (!currentQuestion || feedback !== '') return;

    soundManager.stopTick();
    voiceManager.stopSpeaking();
    setSelectedAnswer(answer);

    if (answer === currentQuestion.correctAnswer) {
      const encouragement = voiceManager.getRandomEncouragement();
      setFeedback(encouragement);
      setScore(score + 1);
      setShowBalloons(true);
      soundManager.playCorrect();
      soundManager.playPop();

      await voiceManager.speakEncouragement(encouragement);

      setTimeout(() => {
        moveToNextQuestion();
      }, 1000);
    } else {
      setFeedback('Try again next time!');
      setWrongCount(wrongCount + 1);
      soundManager.playWrong();

      setTimeout(() => {
        moveToNextQuestion();
      }, 1500);
    }
  };

  const moveToNextQuestion = () => {
    if (questionNumber >= TOTAL_QUESTIONS) {
      navigate('/game/addition-result', { state: { score, correctCount: score, wrongCount } });
    } else {
      setQuestionNumber(questionNumber + 1);
      generateNewQuestion();
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-300 to-blue-400 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/game-mode')}
            className="px-6 py-3 text-lg font-semibold text-white bg-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Back
          </button>

          <div className="text-2xl font-bold text-white bg-yellow-400 px-6 py-3 rounded-xl shadow-lg">
            Question {questionNumber} / {TOTAL_QUESTIONS}
          </div>

          <div className="text-2xl font-bold text-white bg-green-500 px-6 py-3 rounded-xl shadow-lg">
            Score: {score}
          </div>
        </div>

        <div className="mb-6 bg-white rounded-2xl p-4 shadow-lg">
          <Timer timeLeft={timeLeft} totalTime={config.timer} />
        </div>

        <QuestionCard
          num1={currentQuestion.num1}
          num2={currentQuestion.num2}
          options={currentQuestion.options}
          onAnswer={handleAnswer}
          feedback={feedback}
          showBalloons={showBalloons}
          selectedAnswer={selectedAnswer}
          correctAnswer={currentQuestion.correctAnswer}
        />
      </div>
    </div>
  );
}
