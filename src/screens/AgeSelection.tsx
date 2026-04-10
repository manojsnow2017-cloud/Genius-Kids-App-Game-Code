import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const ageGroups = [
  { id: '3-5', label: '3–5 Years', enabled: true },
  { id: '6-7', label: '6–7 Years', enabled: true },
  { id: '8-10', label: '8–10 Years', enabled: false },
  { id: '11-12', label: '11–12 Years', enabled: false },
];

export default function AgeSelection() {
  const { profile, setAgeGroup } = useApp();
  const navigate = useNavigate();

  const handleAgeSelect = (ageId: string, enabled: boolean) => {
    if (enabled) {
      setAgeGroup(ageId);
      if (ageId === '3-5') {
        navigate('/game-mode');
      } else if (ageId === '6-7') {
        navigate('/game-mode-6-7');
      }
    } else {
      alert('Coming Soon!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-300 to-green-300 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{profile?.avatar}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Hi {profile?.name}!
          </h1>
          <h2 className="text-3xl font-semibold text-white">
            Choose Age Group
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ageGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => handleAgeSelect(group.id, group.enabled)}
              className={`relative p-8 rounded-3xl shadow-xl transform transition-all hover:scale-105 ${
                group.enabled
                  ? 'bg-white hover:shadow-2xl'
                  : 'bg-gray-300 opacity-75'
              }`}
            >
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                {group.label}
              </div>
              {!group.enabled && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-yellow-400 text-gray-800 px-6 py-3 rounded-full text-xl font-bold shadow-lg">
                    Coming Soon
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-8 mx-auto block px-8 py-4 text-xl font-semibold text-white bg-gray-700 rounded-2xl hover:bg-gray-800 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}
