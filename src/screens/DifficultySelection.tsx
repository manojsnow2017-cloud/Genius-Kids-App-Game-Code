import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { DifficultyLevel, difficultyLabels } from '../config/difficulty';
import ElephantMascot from '../components/ElephantMascot';
import { Star, Shapes, Rocket } from 'lucide-react';

export default function DifficultySelection() {
  const { setDifficulty } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const gamePath = location.state?.gamePath || '/game/count-balloons';

  const handleDifficultySelect = (level: DifficultyLevel) => {
    setDifficulty(level);
    navigate(gamePath);
  };

  const difficultyIcons = {
    easy: <Star className="w-16 h-16 text-green-500" />,
    medium: <Shapes className="w-16 h-16 text-yellow-500" />,
    hard: <Rocket className="w-16 h-16 text-red-500" />,
  };

  const difficultyDescriptions = {
    easy: 'Perfect for beginners\nLearn colors, shapes and simple numbers',
    medium: 'Growing challenge\nMore choices and trickier questions',
    hard: 'Super challenge\nTest your skills with harder puzzles',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-300 p-6 flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-30 animate-float">⭐</div>
        <div className="absolute top-20 right-20 text-5xl opacity-30 animate-float" style={{ animationDelay: '0.5s' }}>🔢</div>
        <div className="absolute bottom-20 left-20 text-7xl opacity-30 animate-float" style={{ animationDelay: '1s' }}>🎨</div>
        <div className="absolute bottom-32 right-32 text-6xl opacity-30 animate-float" style={{ animationDelay: '1.5s' }}>⭐</div>
        <div className="absolute top-1/3 left-1/4 text-5xl opacity-30 animate-float" style={{ animationDelay: '2s' }}>🔷</div>
        <div className="absolute top-2/3 right-1/4 text-5xl opacity-30 animate-float" style={{ animationDelay: '2.5s' }}>🔶</div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <ElephantMascot size="medium" animate="idle" position="top" />

        <h1 className="text-5xl font-bold text-white text-center mb-2 drop-shadow-lg">
          Choose Your Level
        </h1>
        <p className="text-3xl text-white text-center mb-12 drop-shadow font-semibold">
          Let's play and learn!
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {(Object.keys(difficultyLabels) as DifficultyLevel[]).map((level) => {
            const config = difficultyLabels[level];
            return (
              <button
                key={level}
                onClick={() => handleDifficultySelect(level)}
                className="bg-white rounded-3xl p-8 shadow-2xl hover:scale-110 transform transition-all duration-300 hover:shadow-3xl active:scale-95 animate-bounce-in"
              >
                <div className="flex justify-center mb-4">
                  {difficultyIcons[level]}
                </div>
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">
                  {config.label}
                </h2>
                <p className="text-base text-gray-600 text-center leading-relaxed whitespace-pre-line">
                  {difficultyDescriptions[level]}
                </p>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => navigate('/game-mode')}
          className="mt-12 w-full max-w-md mx-auto block bg-white text-blue-600 px-10 py-5 rounded-full text-2xl font-bold hover:bg-blue-50 transition-colors shadow-xl active:scale-95"
        >
          ⬅ Back to Games
        </button>
      </div>
    </div>
  );
}
