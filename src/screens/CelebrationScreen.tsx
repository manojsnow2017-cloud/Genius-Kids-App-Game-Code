import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export default function CelebrationScreen() {
  const { profile } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const stars = location.state?.stars || 5;

  useEffect(() => {
    if ('speechSynthesis' in window && profile?.name) {
      const utterance = new SpeechSynthesisUtterance(
        `Great Job ${profile.name}! You earned ${stars} stars!`
      );
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      utterance.volume = 1;

      const timeout = setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 500);

      return () => {
        clearTimeout(timeout);
        window.speechSynthesis.cancel();
      };
    }
  }, [profile, stars]);

  const handleContinue = () => {
    navigate('/game-mode');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-400 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              fontSize: `${30 + Math.random() * 30}px`,
            }}
          >
            {['🎉', '⭐', '✨', '🌟', '💫', '🎊', '🎈'][Math.floor(Math.random() * 7)]}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-16 max-w-2xl w-full text-center relative z-10 animate-pulse">
        <div className="text-9xl mb-6 animate-bounce">🎉</div>

        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
          Great Job!
        </h1>

        <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-8">
          {profile?.name}
        </div>

        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-8 mb-8">
          <div className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
            You earned
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {Array.from({ length: stars }).map((_, i) => (
              <div
                key={i}
                className="text-6xl md:text-7xl animate-bounce"
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                ⭐
              </div>
            ))}
          </div>
          <div className="text-3xl md:text-4xl font-bold text-yellow-600">
            {stars} Stars!
          </div>
        </div>

        <p className="text-2xl md:text-3xl font-bold text-purple-600 mb-8">
          Keep up the amazing work!
        </p>

        <button
          onClick={handleContinue}
          className="w-full py-6 text-3xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
}
