# Genius Kids – Math & Learning Games 🎓

A production-ready Progressive Web App (PWA) featuring interactive math learning games for children ages 3-7.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![PWA](https://img.shields.io/badge/PWA-ready-success)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### 🎮 Age-Appropriate Games
- **Ages 3-5**: Count Balloons, Pop Balloons, Simple Addition
- **Ages 6-7**: Addition, Multiplication, Mixed Operations

### 📱 PWA Capabilities
- ✅ **Installable** on iOS and Android
- ✅ **Works Offline** after first visit
- ✅ **Auto-updates** when new versions deploy
- ✅ **Splash Screen** in standalone mode
- ✅ **Mobile-optimized** with safe area support

### 🔊 Interactive Features
- Real-time audio feedback (tick, pop, correct, wrong sounds)
- Visual timer with countdown
- Animated balloon interactions
- Score tracking across sessions
- Colorful, kid-friendly design

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Bundler**: Vite 5
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 3
- **PWA**: vite-plugin-pwa + Workbox
- **Icons**: Lucide React

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development
- Development server: `http://localhost:5173`
- Hot Module Replacement enabled
- TypeScript type checking

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import repository at [vercel.com](https://vercel.com)
3. Use default Vite settings
4. Deploy!

**Configuration included:**
- ✅ `vercel.json` for React Router support
- ✅ Service Worker headers
- ✅ Security headers

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## PWA Features

### Installation
- **Android**: Custom install prompt after 5 seconds
- **iOS**: Banner with "Add to Home Screen" instructions

### Offline Support
- Service worker caches all assets (340KB)
- All games work without internet
- Sounds play from cache
- Navigation functions offline

### Mobile Optimization
- 100dvh viewport for proper mobile height
- Safe area padding for iPhone notch
- Touch-optimized interactions
- Portrait orientation lock
- No double-tap zoom

## Project Structure

```
genius-kids-pwa/
├── public/
│   ├── icons/              # PWA icons (192x192, 512x512)
│   └── *.mp3              # Audio files
├── src/
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   ├── screens/           # Game screens
│   │   └── age6-7/       # Age 6-7 specific games
│   ├── utils/            # Utility functions
│   └── config/           # App configuration
├── vercel.json           # Vercel deployment config
└── vite.config.ts        # Vite + PWA configuration
```

## Testing

### PWA Testing
```bash
# Run Lighthouse audit
npm run build
npm run preview
# Open in Chrome → DevTools → Lighthouse → PWA
```

### Expected Lighthouse Scores
- PWA: 100 ✅
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

## Browser Support

- ✅ Chrome 90+ (Android/Desktop)
- ✅ Safari 15+ (iOS/macOS)
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Samsung Internet 15+

## PWA Checklist

- [x] Service Worker with offline caching
- [x] Web App Manifest
- [x] 192x192 and 512x512 icons
- [x] Maskable icon support
- [x] HTTPS required (automatic on Vercel)
- [x] Responsive design
- [x] Works offline
- [x] Install prompts (iOS & Android)
- [x] Splash screen
- [x] Auto-update on new deploy

See [PWA_CHECKLIST.md](./PWA_CHECKLIST.md) for full checklist.

## Performance

- **Build Size**: 219KB JS (67KB gzipped)
- **CSS**: 24KB (4.5KB gzipped)
- **Precached Assets**: 340KB total
- **First Load**: ~500KB
- **Subsequent Loads**: ~0KB (served from cache)

## Audio Assets

All audio files are precached for offline playback:
- `tick.mp3` - Timer countdown sound
- `pop.mp3` - Balloon pop sound
- `correct.mp3` - Correct answer sound
- `wrong.mp3` - Wrong answer sound

## Environment Variables

Create `.env` file for Supabase (optional):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - feel free to use for educational purposes.

## Version

**Current Version**: 1.0.0

Version number displayed at bottom of home screen.

## Support

For issues or questions:
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- See [TESTING.md](./TESTING.md) for testing procedures
- See [PWA_CHECKLIST.md](./PWA_CHECKLIST.md) for PWA verification

---

**Built with ❤️ for young learners**
