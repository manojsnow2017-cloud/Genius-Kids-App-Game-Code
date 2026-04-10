import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const gameModes = [
  {
    id: 'count-balloons',
    title: 'Counting',
    icon: '🎈',
    description: 'Count the balloons!',
    path: '/game/count-balloons',
  },
  {
    id: 'addition-fun',
    title: 'Addition',
    icon: '➕',
    description: 'Simple math fun!',
    path: '/game/addition-fun',
  },
  {
    id: 'colours',
    title: 'Colours',
    icon: '🎨',
    description: 'Learn your colours!',
    path: '/game/colours',
  },
  {
    id: 'shapes',
    title: 'Shapes',
    icon: '🔷',
    description: 'Identify shapes!',
    path: '/game/shapes',
  },
  {
    id: 'numbers',
    title: 'Find the Number',
    icon: '🔢',
    description: 'Recognize numbers!',
    path: '/game/numbers',
  },
  {
    id: 'count-objects',
    title: 'Count Objects',
    icon: '⭐',
    description: 'Count fun objects!',
    path: '/game/count-objects',
  },
];

export default function GameModeSelection() {
  const { profile } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-300 to-pink-400 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{profile?.avatar}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Select Game
          </h1>
          <p className="text-2xl text-white">
            Choose a fun game to play!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => navigate('/difficulty-selection', { state: { gamePath: mode.path } })}
              className="bg-white p-6 md:p-8 rounded-3xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-5xl md:text-7xl mb-3 md:mb-4">{mode.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold text-purple-600 mb-1 md:mb-2">
                {mode.title}
              </h3>
              <p className="text-sm md:text-lg text-gray-600">{mode.description}</p>
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
