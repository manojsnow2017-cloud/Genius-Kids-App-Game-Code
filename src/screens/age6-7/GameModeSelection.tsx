import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const gameModes = [
  {
    id: 'addition-50',
    title: 'Addition (1–50)',
    icon: '➕',
    description: 'Add numbers up to 50!',
    path: '/game-6-7/addition',
  },
  {
    id: 'multiplication',
    title: 'Multiplication (2–5 Tables)',
    icon: '✖️',
    description: 'Practice your times tables!',
    path: '/game-6-7/multiplication',
  },
  {
    id: 'learn-time',
    title: 'Learn Time',
    icon: '🕒',
    description: 'Read clocks and add minutes!',
    path: '/game-6-7/learn-time',
  },
  {
    id: 'mixed',
    title: 'Mixed Challenge',
    icon: '🎯',
    description: 'Addition + Multiplication!',
    path: '/game-6-7/mixed',
  },
];

export default function GameModeSelection67() {
  const { profile } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-400 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{profile?.avatar}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            6–7 Years
          </h1>
          <p className="text-2xl text-white">
            Choose Your Challenge!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => navigate('/difficulty-6-7', { state: { gamePath: mode.path } })}
              className="bg-white p-8 rounded-3xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-7xl mb-4">{mode.icon}</div>
              <h3 className="text-2xl font-bold text-indigo-600 mb-2">
                {mode.title}
              </h3>
              <p className="text-lg text-gray-600">{mode.description}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/age-selection')}
          className="mt-8 mx-auto block px-8 py-4 text-xl font-semibold text-white bg-gray-700 rounded-2xl hover:bg-gray-800 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}
