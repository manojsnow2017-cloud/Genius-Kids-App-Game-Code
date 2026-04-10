import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const difficulties = [
  {
    level: 'easy',
    title: 'Easy',
    icon: '🌟',
    description: 'Start simple',
    color: 'from-green-400 to-green-600',
  },
  {
    level: 'medium',
    title: 'Medium',
    icon: '⭐',
    description: 'A bit tricky',
    color: 'from-yellow-400 to-orange-600',
  },
  {
    level: 'hard',
    title: 'Hard',
    icon: '🔥',
    description: 'Challenge yourself',
    color: 'from-red-400 to-red-600',
  },
];

export default function DifficultySelection67() {
  const { setDifficulty } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const gamePath = location.state?.gamePath || '/game-6-7/addition';

  const handleDifficultySelect = (level: 'easy' | 'medium' | 'hard') => {
    setDifficulty(level);
    navigate(gamePath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-400 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Choose Difficulty
          </h1>
          <p className="text-2xl md:text-3xl text-white">
            How challenging do you want it to be?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.level}
              onClick={() => handleDifficultySelect(difficulty.level as 'easy' | 'medium' | 'hard')}
              className="bg-white p-10 rounded-3xl shadow-2xl transform transition-all hover:scale-105 hover:shadow-3xl"
            >
              <div className="text-8xl mb-4">{difficulty.icon}</div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${difficulty.color} text-transparent bg-clip-text mb-3`}>
                {difficulty.title}
              </div>
              <p className="text-xl text-gray-600 font-semibold">
                {difficulty.description}
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/game-mode-6-7')}
          className="mt-12 mx-auto block px-10 py-5 text-2xl font-semibold text-white bg-gray-700 rounded-2xl hover:bg-gray-800 transition-colors shadow-xl"
        >
          Back
        </button>
      </div>
    </div>
  );
}
