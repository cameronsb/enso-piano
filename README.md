# 円相 Enso Piano - Circular Harmony Explorer

A beautiful circular piano interface for exploring musical harmony and chord progressions. Built with React, TypeScript, and Vite.

## Features

-   🎹 **Circular Piano Layout**: Two-octave chromatic piano arranged in a circle
-   🎵 **Interactive Keys**: Click or touch piano keys to play notes
-   🎼 **Music Theory**: Displays triads and seventh chords for any key
-   🎚️ **Major/Minor Modes**: Toggle between major and minor scales
-   🔊 **Web Audio API**: Real-time sound synthesis
-   📱 **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

### Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure (🎯 Clean Architecture)

```
src/
├── contexts/            # State Management (New!)
│   ├── MusicContext.tsx      # Music domain state
│   ├── UIContext.tsx         # UI state
│   └── InteractionContext.tsx # Interaction state
├── hooks/              # Business Logic
│   ├── useAudioEngine.ts     # Audio management
│   ├── useKeyPress.ts        # Key interaction
│   └── useChordPlayer.ts     # Chord playback
├── components/         # UI Components
│   ├── CircularPiano.tsx
│   ├── LinearPiano.tsx
│   ├── ChordDisplay.tsx
│   └── [Other UI Components]
├── types/              # TypeScript definitions
│   └── music.ts
├── utils/              # Pure utility functions
│   └── musicTheory.ts
├── App.tsx             # Main app (now only 55 lines!)
├── main.tsx            # Entry point
└── index.css           # Styles
```

## 🏗️ Architecture Highlights

### Clean State Management
-   **Zero Prop Drilling**: Components access state directly via context hooks
-   **Separation of Concerns**: Music logic, UI state, and interactions are separate
-   **Reducer Pattern**: Predictable state updates in MusicContext
-   **Type-Safe**: Full TypeScript coverage with strict typing

### Core Components

-   **App**: Clean component wrapper (reduced from 166 to 55 lines!)
-   **CircularPiano/LinearPiano**: Keyboard views using context hooks
-   **ChordDisplay**: Chord selection and progression builder
-   **Context Providers**: Wrap the app with state management

### Custom Hooks

-   **useMusic()**: Access music state and actions
-   **useUI()**: Access UI state and actions
-   **useAudioEngine()**: Web Audio API integration
-   **useKeyPress()**: Centralized key press logic
-   **useChordPlayer()**: Chord selection and playback

## Extending the Application (Now Super Easy! 🚀)

### Adding New Features

With our clean architecture, adding features is straightforward:

```typescript
// Example: Add tempo control
// 1. Add to MusicContext state
interface MusicState {
    tempo: number;  // New!
}

// 2. Add action
{ type: "SET_TEMPO"; payload: number }

// 3. Use anywhere - no prop drilling!
const { state, actions } = useMusic();
<TempoSlider value={state.tempo} onChange={actions.setTempo} />
```

### Adding New Modes

```typescript
// Simply update musicTheory.ts
SCALES.dorian = [0, 2, 3, 5, 7, 9, 10];
// Components automatically get the new mode!
```

### Customizing Sound

Edit `useAudioEngine.ts` to change instruments or sound parameters

### Styling

All styles are in `src/index.css`. The design uses CSS custom properties (variables) for easy theming:

```css
:root {
    --bg-primary: #fafaf9;
    --bg-secondary: #f5f5f4;
    --text-primary: #1c1917;
    --text-secondary: #78716c;
    --accent: #dc2626;
    /* ... */
}
```

## Technologies

-   **React 18**: UI framework
-   **TypeScript**: Type safety and better DX
-   **Vite**: Fast build tool and dev server
-   **Web Audio API**: Real-time audio synthesis
-   **CSS3**: Modern styling with custom properties

## License

MIT
