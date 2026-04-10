import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { difficultyLabels } from '../config/difficulty';

export default function ResultScreen() {
  const { profile, difficulty, ageGroup } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const correctCount = location.state?.correctCount || location.state?.score || 0;
  const wrongCount = location.state?.wrongCount || 0;
  const totalQuestions = 10;
  const stateGameType = location.state?.gameType || '';
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  const is67Game = location.pathname.includes('6-7');

  const gameType = stateGameType ||
                   (location.pathname.includes('addition-fun') ? 'addition-fun' :
                   location.pathname.includes('count') ? 'count' :
                   location.pathname.includes('pop') ? 'pop' :
                   location.pathname.includes('addition') ? 'addition' :
                   location.pathname.includes('multiplication') ? 'multiplication' :
                   location.pathname.includes('mixed') ? 'mixed' : 'addition');

  useEffect(() => {
    if ('speechSynthesis' in window && profile?.name) {
      const utterance = new SpeechSynthesisUtterance(
        `Congratulations ${profile.name}! You completed the challenge!`
      );
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;

      const timeout = setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 500);

      return () => {
        clearTimeout(timeout);
        window.speechSynthesis.cancel();
      };
    }
  }, [profile]);

  const handlePlayAgain = () => {
    if (gameType === 'addition-fun') {
      navigate('/game/addition-fun');
    } else if (gameType === 'count') {
      navigate('/game/count-balloons');
    } else if (gameType === 'pop') {
      navigate('/game/pop-balloons');
    } else if (gameType === 'colours') {
      navigate('/game/colours');
    } else if (gameType === 'shapes') {
      navigate('/game/shapes');
    } else if (gameType === 'number') {
      navigate('/game/numbers');
    } else if (gameType === 'count-objects') {
      navigate('/game/count-objects');
    } else if (gameType === 'addition') {
      navigate('/game-6-7/addition');
    } else if (gameType === 'multiplication') {
      navigate('/game-6-7/multiplication');
    } else if (gameType === 'mixed') {
      navigate('/game-6-7/mixed');
    }
  };

  const handleBackToMenu = () => {
    if (is67Game) {
      navigate('/game-mode-6-7');
    } else {
      navigate('/game-mode');
    }
  };

  let emoji, message;
  if (is67Game) {
    emoji = correctCount >= 8 ? '🎉' : correctCount >= 5 ? '👍' : '💪';
    message = correctCount >= 8 ? 'Excellent!' : correctCount >= 5 ? 'Good Job!' : 'Keep Practicing!';
  } else {
    emoji = correctCount >= 7 ? '🎉' : '👍';
    message = correctCount >= 7 ? 'Excellent Work!' : 'Keep Practicing!';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-300 to-pink-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center">
        <div className="text-8xl mb-6">{emoji}</div>

        <h1 className="text-4xl md:text-5xl font-bold text-purple-600 mb-6">
          {is67Game ? 'Great Work' : 'Great Job'} {profile?.name}!
        </h1>

        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 mb-6">
          {!is67Game && ageGroup === '3-5' && (
            <div className="bg-white rounded-xl p-3 shadow mb-4">
              <div className="text-base font-semibold text-gray-600 mb-1">Difficulty</div>
              <div className="text-2xl font-bold text-purple-600">
                {difficultyLabels[difficulty].emoji} {difficultyLabels[difficulty].label}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-xl p-4 shadow">
              <div className="text-lg font-semibold text-gray-600 mb-2">Correct</div>
              <div className="text-5xl font-bold text-green-500">{correctCount}</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow">
              <div className="text-lg font-semibold text-gray-600 mb-2">Wrong</div>
              <div className="text-5xl font-bold text-red-500">{wrongCount}</div>
            </div>
          </div>
          <div className="text-xl font-semibold text-gray-700 mb-2">
            Total Questions: {totalQuestions}
          </div>
          {is67Game && (
            <div className="text-2xl font-bold text-indigo-600">
              Accuracy: {accuracy}%
            </div>
          )}
        </div>

        <p className="text-3xl font-bold text-purple-600 mb-8">
          {message}
        </p>

        <div className="flex justify-center gap-4 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="text-6xl animate-float"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              🎈
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <button
            onClick={handlePlayAgain}
            className="w-full py-5 text-2xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Play Again
          </button>

          <button
            onClick={handleBackToMenu}
            className="w-full py-5 text-2xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            {is67Game ? 'Back to Age Selection' : 'Back to Game Menu'}
          </button>
        </div>
      </div>
    </div>
  );
}
