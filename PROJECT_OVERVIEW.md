# 円相 Enso Piano - Project Overview

A beautiful, interactive piano application featuring both circular and traditional keyboard layouts with real acoustic piano sounds, music theory visualization, and chord exploration.

## 🎯 Project Purpose

An educational and creative music tool that helps users:

-   Learn chord progressions and music theory
-   Visualize relationships between notes in different layouts
-   Play with realistic piano sounds in a web browser
-   Explore major and minor scales interactively

## ✨ Key Features

### 🎹 Dual Keyboard Views

-   **Circular Layout**: Zen-inspired circular arrangement showing the chromatic scale
-   **Traditional Layout**: Standard piano keyboard (2 octaves, C4-B5)
-   Seamless toggle between views with state preservation

### 🎵 Interactive Playback

-   **Real Piano Sounds**: MusyngKite soundfont with acoustic grand piano samples
-   **Glissando Support**: Click and drag across keys to play smooth runs
-   **Touch Support**: Full touch device compatibility
-   **Visual Feedback**: Keys animate on press with smooth transitions

### 🎼 Music Theory Integration

-   **Chord Selection**: Click any chord to highlight its notes on the keyboard
-   **Mode Switching**: Toggle between Major and Minor scales
-   **Roman Numeral Notation**: Standard music theory chord labeling
-   **Triads & Seventh Chords**: Complete diatonic chord progressions

### 🎨 Design

-   Clean, minimalist aesthetic inspired by Japanese Enso circles
-   Subtle accent colors (red) for selected/highlighted states
-   Responsive layout for desktop and mobile
-   Smooth animations and transitions

## 📁 Project Structure

```
circ-piano/
├── src/
│   ├── components/          # React components
│   │   ├── CircularPiano.tsx       # Circular keyboard layout
│   │   ├── PianoKey.tsx            # Individual circular key
│   │   ├── LinearPiano.tsx         # Traditional keyboard layout
│   │   ├── LinearPianoKey.tsx      # Individual linear key
│   │   ├── ChordDisplay.tsx        # Chord grid container
│   │   ├── ChordGrid.tsx           # Grid of chord items
│   │   ├── ChordItem.tsx           # Individual chord button
│   │   ├── ModeToggle.tsx          # Major/Minor switch
│   │   └── ViewToggle.tsx          # Circular/Linear switch
│   │
│   ├── contexts/            # React Context providers
│   │   └── InteractionContext.tsx  # Global pointer state for glissando
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── useAudioEngine.ts       # Web Audio API + Soundfont integration
│   │
│   ├── types/               # TypeScript definitions
│   │   ├── music.ts                # Music theory types
│   │   └── soundfont-player.d.ts   # Library type definitions
│   │
│   ├── utils/               # Utility functions
│   │   └── musicTheory.ts          # Scales, chords, frequencies
│   │
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
│
├── public/                  # Static assets (handled by Vite)
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── README.md                # User documentation
└── PROJECT_OVERVIEW.md      # This file

```

## 🏗️ Architecture

### State Management (✨ Newly Refactored!)

-   **MusicContext**: Centralized music state (key, mode, chords, progression)
-   **UIContext**: UI state management (view mode, theme, interaction mode)
-   **InteractionContext**: Glissando/drag interaction state
-   **Zero Prop Drilling**: All components use context hooks directly

### Clean Architecture Patterns

```
src/
├── contexts/                # State Management Layer
│   ├── MusicContext.tsx    # Music domain state (reducer pattern)
│   ├── UIContext.tsx       # UI state (theme, view, interaction)
│   └── InteractionContext.tsx # Pointer/touch interaction state
│
├── hooks/                   # Business Logic Layer
│   ├── useAudioEngine.ts   # Audio playback management
│   ├── useKeyPress.ts      # Key press handling logic
│   └── useChordPlayer.ts   # Chord selection & playback
│
└── components/             # Presentation Layer
    └── [Pure UI Components] # Consume state via hooks
```

### Component Hierarchy

```
App (55 lines, down from 166!)
├── UIProvider
│   └── MusicProvider
│       └── InteractionProvider
│           ├── ViewToggle (uses useUI)
│           ├── ThemeToggle (uses useUI)
│           ├── InteractionModeToggle (uses useUI)
│           ├── CircularPiano / LinearPiano (uses useMusic, useUI)
│           └── ChordDisplay (uses useMusic)
│               ├── ModeToggle (uses useMusic)
│               ├── ChordDisplayModeToggle (uses useMusic)
│               └── ChordGrid → ChordItem
```

### Data Flow

1. **User clicks piano key** → `useKeyPress` hook → Updates MusicContext → Plays sound
2. **User clicks chord** → `useChordPlayer` hook → Updates MusicContext → Plays chord
3. **User drags across keys** → InteractionContext → Plays unique notes
4. **User toggles view** → UIContext → Components re-render with new state

## 🎼 Music Theory Implementation

### Note System

-   12-tone chromatic scale: `C, C#, D, D#, E, F, F#, G, G#, A, A#, B`
-   Octave notation: `C4` = Middle C, `C5` = One octave higher
-   Frequency-based playback using Web Audio API

### Scale Patterns

-   **Major Scale**: `[0, 2, 4, 5, 7, 9, 11]` semitones from root
-   **Minor Scale**: `[0, 2, 3, 5, 7, 8, 10]` semitones from root

### Chord Construction

-   **Triads**: Root + 3rd + 5th
-   **Seventh Chords**: Root + 3rd + 5th + 7th
-   **Chord Types**: maj, min, dim, maj7, min7, dom7, half-dim7

### Interval Notation

All chords stored as interval arrays from the scale degree:

-   Major triad: `[0, 4, 7]` (root, major 3rd, perfect 5th)
-   Minor triad: `[0, 3, 7]` (root, minor 3rd, perfect 5th)
-   Dominant 7th: `[0, 4, 7, 10]` (root, major 3rd, perfect 5th, minor 7th)

## 🔊 Audio System

### Technology Stack

-   **Web Audio API**: Low-latency audio playback
-   **soundfont-player**: Sampled instrument library
-   **MusyngKite Soundfont**: High-quality piano samples (CDN-loaded)

### Audio Features

-   **Lazy Loading**: Soundfont loads on app initialization
-   **Frequency to MIDI**: Converts Hz to MIDI note numbers
-   **Envelope Control**: Adjustable attack, sustain, release
-   **Volume Normalization**: Consistent playback levels

## 🎨 Styling System

### CSS Architecture

-   **CSS Variables**: Theming with custom properties
-   **No CSS Framework**: Vanilla CSS for full control
-   **Mobile-First**: Responsive breakpoints at 600px
-   **Smooth Transitions**: 0.15-0.2s ease timing

### Color Palette

```css
--bg-primary: #fafaf9      /* Main background */
--bg-secondary: #f5f5f4    /* Cards, panels */
--text-primary: #1c1917    /* Main text */
--text-secondary: #78716c  /* Muted text */
--accent: #dc2626          /* Red highlights */
--white-key: #ffffff       /* Piano white keys */
--black-key: #292524       /* Piano black keys */
```

## 🚀 Development

### Prerequisites

-   Node.js 18+
-   npm 9+

### Setup

```bash
npm install
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```

### Development Server

-   URL: `http://localhost:5173`
-   Hot Module Replacement (HMR)
-   Fast refresh for React components

## 🎯 Adding New Features (Now Much Easier!)

### With the New Clean Architecture

#### Adding a New State Feature

```typescript
// 1. Add to MusicContext state
interface MusicState {
    // existing state...
    tempo: number;  // New feature
}

// 2. Add action type
type MusicAction =
    // existing actions...
    | { type: "SET_TEMPO"; payload: number }

// 3. Update reducer
case "SET_TEMPO":
    return { ...state, tempo: action.payload };

// 4. Use in any component
const { state, actions } = useMusic();
```

#### Adding a New Instrument

```typescript
// Simply extend contexts, no prop drilling needed!
// Components automatically get access via hooks
```

#### Adding Recording Feature

```typescript
// Create new context
export const RecordingContext = createContext();

// Stack with existing providers
<RecordingProvider>
    <UIProvider>
        <MusicProvider>
            <App />
        </MusicProvider>
    </UIProvider>
</RecordingProvider>;
```

## 📦 Dependencies

### Runtime

-   `react` & `react-dom`: UI framework
-   `soundfont-player`: Piano sample playback

### Development

-   `vite`: Build tool and dev server
-   `typescript`: Type safety
-   `@vitejs/plugin-react`: React + Vite integration
-   `eslint`: Code linting

## 🔄 Version Control

### Git History

```
9ad1f06 - Add traditional piano keyboard view with toggle
d530707 - Initial commit: Enso Piano with circular layout
```

### Branching Strategy

-   `main`: Stable, working features
-   Feature branches: Create for new features
-   Commit messages: Descriptive, imperative mood

## 🎯 Future Enhancement Ideas

### Features to Consider

-   [ ] Keyboard shortcuts (QWERTY keyboard as piano)
-   [ ] Recording and playback
-   [ ] MIDI input support
-   [ ] Additional scales (harmonic minor, melodic minor, modes)
-   [ ] Chord progression builder
-   [ ] Export to MIDI file
-   [ ] More instruments (guitar, strings, etc.)
-   [ ] Custom soundfont loading
-   [ ] Metronome integration
-   [ ] Dark mode theme
-   [ ] Shareable URLs with saved state

### Technical Improvements

-   [ ] Service Worker for offline support
-   [ ] Lazy load soundfont only when needed
-   [ ] Optimize bundle size
-   [ ] Add unit tests (Jest + React Testing Library)
-   [ ] E2E tests (Playwright)
-   [ ] Performance monitoring
-   [ ] Accessibility audit (ARIA labels, keyboard nav)

## 🐛 Known Issues / Limitations

1. **Initial Load Time**: Soundfont downloads on first visit (~2-3 seconds)
2. **Browser Compatibility**: Requires modern browser with Web Audio API
3. **Mobile Safari**: May require user interaction to enable audio
4. **No Sustain Pedal**: No way to sustain notes like real piano
5. **Limited Octave Range**: Only 2 octaves (C4-B5)

## 📚 Technical Documentation

### Key Algorithms

**Circular Key Positioning**:

```typescript
const angle = (keyIndex * 360) / totalWhiteKeys - 90;
const x = centerX + Math.cos(radian) * radius;
const y = centerY + Math.sin(radian) * radius;
```

**Chord Note Calculation**:

```typescript
const noteIndex = (rootIndex + interval) % 12;
const note = NOTES[noteIndex];
```

**Frequency to MIDI Conversion**:

```typescript
const midiNote = Math.round(69 + 12 * Math.log2(frequency / 440));
```

### Performance Considerations

-   `useMemo` for expensive key layout calculations
-   `useCallback` for event handlers to prevent re-renders
-   React.StrictMode for development safety
-   Debounced key press to prevent rapid re-triggering

## 🤝 Contributing Guidelines

When extending this project:

1. Follow the existing code style (Prettier default)
2. Use TypeScript for all new code
3. Add types to `src/types/music.ts` for music theory concepts
4. Keep components small and focused
5. Test on both desktop and mobile
6. Update this overview document with major changes
7. Commit with descriptive messages

## 📄 License

MIT - See package.json

## 🙏 Credits

-   **Soundfont**: MusyngKite piano samples
-   **Inspiration**: Enso circles (円相) from Zen Buddhism
-   **Music Theory**: Standard Western music theory
