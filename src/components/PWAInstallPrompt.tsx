import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isInStandaloneMode);

    if (isInStandaloneMode) return;

    const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-seen');
    if (hasSeenPrompt) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    if (isIOS) {
      setTimeout(() => {
        setShowIOSInstructions(true);
      }, 3000);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      localStorage.setItem('pwa-install-prompt-seen', 'true');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-prompt-seen', 'true');
    setShowPrompt(false);
    setShowIOSInstructions(false);
  };

  if (isStandalone || (!showPrompt && !showIOSInstructions)) {
    return null;
  }

  if (showIOSInstructions) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 bg-white rounded-2xl shadow-2xl p-4 border-2 border-blue-500 animate-bounce">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
        <div className="pr-8">
          <div className="text-lg font-bold text-gray-800 mb-2">Install Genius Kids</div>
          <div className="text-sm text-gray-600">
            Tap <span className="inline-block mx-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0L8 11M8 11L5 8M8 11L11 8M2 13H14" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </span> Share → <strong>Add to Home Screen</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-4 text-white">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20"
      >
        <X size={20} />
      </button>
      <div className="pr-8">
        <div className="text-lg font-bold mb-1">Install Genius Kids</div>
        <div className="text-sm text-white/90 mb-3">
          Add to your home screen for quick access and offline play!
        </div>
        <button
          onClick={handleInstallClick}
          className="bg-white text-purple-600 font-semibold px-6 py-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          Install App
        </button>
      </div>
    </div>
  );
}
