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

## Project Structure

```
src/
├── components/          # React components
│   ├── CircularPiano.tsx
│   ├── PianoKey.tsx
│   ├── ChordDisplay.tsx
│   ├── ChordGrid.tsx
│   ├── ChordItem.tsx
│   └── ModeToggle.tsx
├── hooks/              # Custom React hooks
│   └── useAudioEngine.ts
├── types/              # TypeScript type definitions
│   └── music.ts
├── utils/              # Utility functions
│   └── musicTheory.ts
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Component Architecture

### Core Components

-   **App**: Main application container, manages state and audio playback
-   **CircularPiano**: Renders the circular piano keyboard
-   **PianoKey**: Individual piano key component with interaction handling
-   **ChordDisplay**: Displays chord progressions for selected key
-   **ChordGrid**: Grid layout for displaying triads or seventh chords
-   **ChordItem**: Individual chord button with click-to-play functionality
-   **ModeToggle**: Switch between major and minor modes

### Hooks

-   **useAudioEngine**: Custom hook for Web Audio API integration

### Utilities

-   **musicTheory**: Music theory calculations (scales, chords, frequencies)

## Extending the Application

### Adding New Modes

To add additional modes (e.g., harmonic minor, melodic minor):

1. Add the mode to the `Mode` type in `src/types/music.ts`
2. Define the scale pattern in `SCALES` in `src/utils/musicTheory.ts`
3. Define the chord types in `CHORD_TYPES`
4. Update the `ModeToggle` component to include the new mode

### Customizing Sound

Edit the `useAudioEngine` hook in `src/hooks/useAudioEngine.ts`:

-   Change `oscillator.type` to adjust the waveform ('sine', 'square', 'sawtooth', 'triangle')
-   Adjust `masterGain.gain.value` to change the volume
-   Modify the ADSR envelope parameters for different attack/decay characteristics

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
