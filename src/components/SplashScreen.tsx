import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 200);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-600 via-blue-500 to-green-500 flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-white mb-4 animate-bounce">
            123
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Genius Kids
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Math & Learning Games
          </p>
        </div>

        <div className="w-64 h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 text-white/80 text-sm">
          Loading fun games...
        </div>
      </div>

      <div className="absolute bottom-8 flex gap-3">
        <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}
