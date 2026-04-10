# PWA Testing Guide

## How to Test the PWA

### 1. Local Testing

```bash
# Build the production version
npm run build

# Serve the built files
npx serve dist
```

Then open http://localhost:3000 in your browser.

### 2. Test Install on Android (Chrome/Edge)

1. Open the app URL in Chrome on Android
2. Use the app for a few seconds
3. An install prompt should appear at the bottom
4. Click "Install App"
5. Verify app appears on home screen
6. Open from home screen (should open fullscreen without browser UI)

### 3. Test Install on iOS (Safari)

1. Open the app URL in Safari on iPhone/iPad
2. Wait 3 seconds for the iOS install banner
3. Follow the instructions: Tap Share → Add to Home Screen
4. Verify app appears on home screen
5. Open from home screen (should open fullscreen)

### 4. Test Offline Functionality

#### Method 1: Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to Application tab → Service Workers
3. Check "Offline" checkbox
4. Reload the page
5. Navigate through the app
6. Play games, verify sounds work
7. Everything should work normally

#### Method 2: Airplane Mode
1. Install the app (Android or iOS)
2. Use the app online first (loads all assets)
3. Close the app
4. Enable Airplane Mode
5. Open the app from home screen
6. Test all features:
   - Profile creation
   - Game selection
   - Playing games
   - Sounds (tick, pop, correct, wrong)
   - Timers
   - Score tracking
   - Navigation

### 5. Test Auto-Update

1. Install the app
2. Make a small change (e.g., change app name in vite.config.ts)
3. Build: `npm run build`
4. Deploy the new version
5. Open the installed app
6. The app should detect update and reload automatically

### 6. Verify PWA Score (Lighthouse)

1. Open the app in Chrome
2. Open DevTools (F12)
3. Go to Lighthouse tab
4. Select "Progressive Web App" category
5. Click "Generate report"
6. Expected scores:
   - PWA: 100
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 95+
   - SEO: 90+

### 7. Test Features Checklist

#### Before Install
- [ ] App loads correctly
- [ ] All games work
- [ ] Sounds play
- [ ] Timers work
- [ ] Navigation works
- [ ] Install prompt appears (Android)
- [ ] iOS banner appears (iPhone/iPad)

#### After Install (Standalone Mode)
- [ ] App opens fullscreen (no browser UI)
- [ ] Splash screen appears for 1 second
- [ ] All games work
- [ ] All sounds work offline
- [ ] Timers function correctly
- [ ] Score tracking works
- [ ] Can play 10 rounds without issues
- [ ] Navigation between games works
- [ ] Back button works correctly
- [ ] No console errors

#### Offline Mode
- [ ] App loads offline
- [ ] Can navigate all screens
- [ ] Games load and play
- [ ] All 4 sounds work (tick, pop, correct, wrong)
- [ ] Timers count down properly
- [ ] Scores are tracked
- [ ] Balloon animations work
- [ ] No "offline" error messages
- [ ] Everything feels smooth

#### Mobile Specific
- [ ] Safe area padding works (iPhone notch)
- [ ] No double-tap zoom
- [ ] No horizontal scroll
- [ ] Proper viewport height (100dvh)
- [ ] Portrait orientation locked
- [ ] Touch interactions smooth
- [ ] No tap delay

#### Sound System
- [ ] Tick sound plays during timer
- [ ] Tick sound stops on answer
- [ ] Tick sound stops on timeout
- [ ] Pop sound plays on correct answer
- [ ] Correct sound plays on right answer
- [ ] Wrong sound plays on wrong answer
- [ ] Wrong sound plays on timeout
- [ ] No sound overlaps
- [ ] Sounds work offline

## Expected Behavior

### First Visit (Online)
1. App loads
2. Service worker installs in background
3. All assets cached for offline use
4. Install prompt may appear (after 5 seconds on Android)

### Second Visit (Online)
1. App loads from cache (faster)
2. Service worker checks for updates
3. If update found, downloads in background
4. Page refreshes automatically with new version

### Offline Visit
1. App loads from cache
2. All features work normally
3. No network calls fail
4. Sounds play from cache
5. Games work perfectly

## Troubleshooting

### Install Prompt Not Showing (Android)
- Wait 5 seconds after opening the app
- Make sure you're using HTTPS (or localhost)
- Check if app is already installed
- Clear site data and try again

### iOS Banner Not Showing
- Wait 3 seconds after page load
- Make sure localStorage is not disabled
- Check if you dismissed it before
- Clear Safari data and try again

### Offline Not Working
- Visit the app online first (must cache assets)
- Check Service Worker is installed (DevTools → Application)
- Verify all assets are cached
- Check console for errors

### Sounds Not Playing Offline
- Play each sound at least once while online
- Check browser audio permissions
- Verify sound files are in precache manifest
- Check service worker status

## Version Information
- Current Version: 1.0.0
- Location: Bottom of home screen
- Updates: Automatic via service worker
