import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { musicManager } from '../utils/musicManager';

export default function MusicToggle() {
  const [isEnabled, setIsEnabled] = useState(musicManager.isEnabled());

  useEffect(() => {
    setIsEnabled(musicManager.isEnabled());
  }, []);

  const handleToggle = () => {
    const newState = musicManager.toggle();
    setIsEnabled(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed top-4 right-4 z-50 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform active:scale-95"
      aria-label={isEnabled ? 'Mute music' : 'Unmute music'}
    >
      {isEnabled ? (
        <Volume2 className="w-6 h-6 text-blue-600" />
      ) : (
        <VolumeX className="w-6 h-6 text-gray-400" />
      )}
    </button>
  );
}
