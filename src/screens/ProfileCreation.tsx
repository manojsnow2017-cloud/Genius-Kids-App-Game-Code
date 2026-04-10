import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { APP_VERSION } from '../config/version';
import ElephantMascot from '../components/ElephantMascot';
import { voiceManager } from '../utils/voiceManager';

const avatars = ['😊', '🦁', '🐼'];

export default function ProfileCreation() {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [mascotAnimation, setMascotAnimation] = useState<'idle' | 'wave' | 'jump' | 'celebrate'>('idle');
  const { setProfile } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setMascotAnimation('wave');
      voiceManager.speakWelcome();
      setTimeout(() => {
        setMascotAnimation('idle');
      }, 3000);
    }, 500);
  }, []);

  const handleContinue = () => {
    if (name.trim()) {
      setProfile({ name: name.trim(), avatar: selectedAvatar });
      navigate('/age-selection');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-300 flex items-center justify-center p-4 relative">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <ElephantMascot size="medium" animate={mascotAnimation} position="top" />

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-purple-600">
          Welcome to Genius Kids
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-3">
              Child's Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="w-full px-6 py-4 text-xl border-4 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-3">
              Select Avatar
            </label>
            <div className="flex gap-4 justify-center">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-6xl p-4 rounded-2xl transition-all transform hover:scale-110 ${
                    selectedAvatar === avatar
                      ? 'bg-purple-200 ring-4 ring-purple-500 scale-110'
                      : 'bg-gray-100 hover:bg-purple-100'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!name.trim()}
            className="w-full py-5 text-2xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Continue
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 text-white/70 text-sm">
        Version {APP_VERSION}
      </div>
    </div>
  );
}
