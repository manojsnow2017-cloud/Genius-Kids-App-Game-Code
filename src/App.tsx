import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import ProfileCreation from './screens/ProfileCreation';
import AgeSelection from './screens/AgeSelection';
import DifficultySelection from './screens/DifficultySelection';
import GameModeSelection from './screens/GameModeSelection';
import CountBalloonsGame from './screens/CountBalloonsGame';
import PopBalloonsGame from './screens/PopBalloonsGame';
import AdditionGame from './screens/AdditionGame';
import ColoursGame from './screens/ColoursGame';
import ShapesGame from './screens/ShapesGame';
import NumberRecognitionGame from './screens/NumberRecognitionGame';
import CountObjectsGame from './screens/CountObjectsGame';
import CelebrationScreen from './screens/CelebrationScreen';
import ResultScreen from './screens/ResultScreen';
import GameModeSelection67 from './screens/age6-7/GameModeSelection';
import DifficultySelection67 from './screens/age6-7/DifficultySelection';
import AdditionGame67 from './screens/age6-7/AdditionGame';
import MultiplicationGame67 from './screens/age6-7/MultiplicationGame';
import MixedGame67 from './screens/age6-7/MixedGame';
import LearnTimeGame from './screens/age6-7/LearnTimeGame';
import SplashScreen from './components/SplashScreen';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import MusicToggle from './components/MusicToggle';
import { musicManager } from './utils/musicManager';
import { createBackgroundMusic } from './utils/backgroundMusic';

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [musicInitialized, setMusicInitialized] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setShowSplash(true);
    }

    if (!musicInitialized) {
      createBackgroundMusic().then((musicUrl: string) => {
        musicManager.init(musicUrl);
        setMusicInitialized(true);
      }).catch(() => {
        setMusicInitialized(true);
      });
    }
  }, [musicInitialized]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <AppProvider>
      <BrowserRouter>
        <MusicToggle />
        <Routes>
          <Route path="/" element={<ProfileCreation />} />
          <Route path="/age-selection" element={<AgeSelection />} />
          <Route path="/difficulty-selection" element={<DifficultySelection />} />
          <Route path="/game-mode" element={<GameModeSelection />} />

          <Route path="/game/count-balloons" element={<CountBalloonsGame />} />
          <Route path="/game/pop-balloons" element={<PopBalloonsGame />} />
          <Route path="/game/addition-fun" element={<AdditionGame />} />
          <Route path="/game/colours" element={<ColoursGame />} />
          <Route path="/game/shapes" element={<ShapesGame />} />
          <Route path="/game/numbers" element={<NumberRecognitionGame />} />
          <Route path="/game/count-objects" element={<CountObjectsGame />} />

          <Route path="/game/celebration" element={<CelebrationScreen />} />
          <Route path="/game/addition-result" element={<ResultScreen />} />
          <Route path="/game/count-result" element={<ResultScreen />} />
          <Route path="/game/pop-result" element={<ResultScreen />} />
          <Route path="/game/colours-result" element={<ResultScreen />} />
          <Route path="/game/shapes-result" element={<ResultScreen />} />
          <Route path="/game/number-result" element={<ResultScreen />} />
          <Route path="/game/count-objects-result" element={<ResultScreen />} />

          <Route path="/game-mode-6-7" element={<GameModeSelection67 />} />
          <Route path="/difficulty-6-7" element={<DifficultySelection67 />} />
          <Route path="/game-6-7/addition" element={<AdditionGame67 />} />
          <Route path="/game-6-7/multiplication" element={<MultiplicationGame67 />} />
          <Route path="/game-6-7/learn-time" element={<LearnTimeGame />} />
          <Route path="/game-6-7/mixed" element={<MixedGame67 />} />
          <Route path="/game-6-7/result" element={<ResultScreen />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <PWAInstallPrompt />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
