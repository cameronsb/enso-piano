# 🤖 AI Agent Development Guide: Enso Piano Project

## 🎉 Major Architecture Update!

The codebase has been completely refactored with **clean state management** using React Context API with the reducer pattern. No more prop drilling!

## Context

You are working on **円相 Enso Piano**, an interactive web-based piano application with a **newly refactored clean architecture**. The project uses React, TypeScript, and Vite with proper separation of concerns.

## Project State

-   **Status**: Fully functional MVP with core features complete
-   **Repository**: Git initialized with 3 commits tracking all development
-   **Dev Server**: Running on port 5173 (use `npm run dev` if not active)
-   **Location**: `/Users/cam/Desktop/music/circ-piano/`

## Key Features Implemented ✅

1. **Dual Keyboard Views**

    - Circular layout (360° chromatic arrangement)
    - Traditional piano layout (2 octaves: C4-B5)
    - Toggle button to switch between views

2. **Real Piano Sounds**

    - Uses `soundfont-player` library with MusyngKite acoustic grand piano
    - Web Audio API integration for low-latency playback
    - Automatic soundfont loading from CDN on app start

3. **Interactive Playback**

    - Click-to-play individual notes
    - Drag-to-glissando across multiple keys
    - Global pointer tracking via React Context
    - Touch device support

4. **Music Theory Features**

    - Chord selection (triads & seventh chords)
    - Visual highlighting of chord notes on keyboard
    - Major/Minor mode switching
    - Roman numeral notation (I, ii, iii, IV, V, vi, vii°)
    - All 12 keys supported

5. **State Management**
    - Selected key tracking
    - Mode selection (major/minor)
    - Chord selection (array-based for future multi-select)
    - View mode persistence

## Technical Stack

```
Frontend Framework:  React 18 + TypeScript
Build Tool:         Vite 5
Audio:              Web Audio API + soundfont-player
Styling:            Vanilla CSS (no framework)
State:              Context API + Reducer Pattern (CLEAN!)
Version Control:    Git
```

## 🏗️ NEW Clean Architecture

```
src/
├── contexts/                    # STATE MANAGEMENT LAYER
│   ├── MusicContext.tsx        # Music domain (reducer pattern)
│   ├── UIContext.tsx           # UI state (theme, view, etc)
│   └── InteractionContext.tsx  # Touch/drag interactions
│
├── hooks/                       # BUSINESS LOGIC LAYER
│   ├── useAudioEngine.ts       # Audio management
│   ├── useKeyPress.ts          # Key press handling (NEW!)
│   └── useChordPlayer.ts       # Chord playback (NEW!)
│
├── components/                  # PRESENTATION LAYER
│   ├── CircularPiano.tsx       # Uses contexts directly
│   ├── LinearPiano.tsx         # Uses contexts directly
│   ├── ChordDisplay.tsx        # Uses contexts directly
│   └── [All other components]  # All use hooks, no props!
│
├── App.tsx                      # ONLY 55 LINES NOW! (was 166)
└── index.css                    # Styles
```

### Key Architecture Benefits:
- **Zero Prop Drilling**: Components get state via hooks
- **Single Source of Truth**: All state in contexts
- **Separation of Concerns**: Music vs UI vs Interaction
- **Easy Extension**: Just add to contexts!
- **Type Safety**: Full TypeScript coverage

## Important Implementation Details

### Glissando System

-   `InteractionContext` tracks `isPointerDown` globally
-   `lastPlayedNote` prevents re-triggering same note
-   Each key listens to `onMouseEnter` + checks pointer state
-   Global `mouseup` listener resets state

### Chord Highlighting

-   Selected chords stored as array: `SelectedChord[]`
-   Piano components calculate `highlightedNotes` Set from chord intervals
-   Keys receive `isHighlighted` prop for styling

### Audio Architecture

```typescript
// In useAudioEngine.ts
1. Load soundfont on mount (async, shows loading message)
2. Convert frequency → MIDI note: 69 + 12*log2(freq/440)
3. Play via soundfont: instrument.play(midiNote, time, {duration, gain})
```

### Circular Layout Math

```typescript
// Position keys in circle
const angle = (keyIndex * 360) / totalWhiteKeys - 90;
const x = centerX + Math.cos(radian) * radius;
const y = centerY + Math.sin(radian) * radius;
```

## Current Architecture Patterns

1. **Context-Based State**: All state managed in contexts
2. **Reducer Pattern**: Predictable state updates in MusicContext
3. **Custom Hooks**: Business logic separated from components
4. **Memoization**: `useMemo` for expensive calculations
5. **Clean Components**: Components only handle rendering

## Data Structures

```typescript
// Key note storage
type Note = 'C' | 'C#' | 'D' | ... | 'B'
type NoteWithOctave = `${Note}${number}` // "C4", "F#5"

// Chord selection
interface SelectedChord {
    rootNote: Note;
    intervals: number[];    // [0, 4, 7] for major triad
    numeral: string;        // "I", "V7", etc.
}

// Currently: array with 1 item (radio button behavior)
// Future: could support multiple selections
```

## CSS Organization

-   Variables in `:root` for theming
-   No preprocessor, vanilla CSS
-   Mobile breakpoint at 600px
-   Classes: `.piano-key`, `.chord-item`, `.view-btn`, etc.
-   State classes: `.active`, `.highlighted`, `.selected`, `.clickable`

## How to Extend (Super Easy Now!)

### Adding a New Feature

1. **Add to appropriate context** (MusicContext or UIContext)
2. **Add action type** if using reducer
3. **Use in any component** via hooks - no wiring needed!
4. **That's it!** No prop drilling, no App.tsx changes

Example:
```typescript
// Add metronome feature
// 1. In MusicContext
interface MusicState {
    isMetronomeOn: boolean;
    bpm: number;
}

// 2. In any component
const { state, actions } = useMusic();
<Metronome active={state.isMetronomeOn} bpm={state.bpm} />
```

### Common Extension Points

**Add a new scale/mode:**

-   Add to `SCALES` in `musicTheory.ts`
-   Add chord types to `CHORD_TYPES`
-   Update `Mode` type
-   Add button to `ModeToggle`

**Add keyboard shortcuts:**

-   Create new hook `useKeyboardShortcuts.ts`
-   Map keys to notes/functions
-   Handle in `App.tsx` or components

**Add recording:**

-   Create `useRecorder` hook
-   Track note events with timestamps
-   Store in state, add playback function
-   UI controls in new component

## Development Commands

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build
git log          # View commit history
git status       # Check current changes
```

## Known Issues to Be Aware Of

1. **Soundfont loading**: Takes 2-3 seconds on first load
2. **Mobile Safari**: May need user gesture to enable audio
3. **Black key positioning**: Uses hardcoded positions in LinearPianoKey
4. **No unit tests**: All testing is manual currently

## Useful Locations

-   **Music theory constants**: `src/utils/musicTheory.ts` (lines 1-90)
-   **Main state management**: `src/App.tsx` (lines 1-102)
-   **Audio playback**: `src/hooks/useAudioEngine.ts`
-   **Color scheme**: `src/index.css` (lines 14-23, CSS variables)
-   **Glissando logic**: `src/contexts/InteractionContext.tsx`

## Recent Changes (Last 3 Commits)

```
a22a155 - Add comprehensive project overview documentation
9ad1f06 - Add traditional piano keyboard view with toggle
d530707 - Initial commit: Enso Piano with circular layout
```

## User's Preferences & Style

-   Clean, minimal code with proper TypeScript types
-   Functional React patterns (hooks, no classes)
-   Descriptive variable names
-   Comments for complex logic only
-   Commits after feature completion
-   Double quotes for strings (Prettier style)

## Likely Next Steps (User May Request)

1. **Keyboard shortcuts** - Map QWERTY to piano keys
2. **More scales** - Harmonic minor, modes, pentatonic
3. **Recording/Playback** - Capture and replay performances
4. **Dark mode** - Theme toggle
5. **Accessibility** - ARIA labels, keyboard navigation
6. **Mobile optimization** - Better touch handling
7. **Chord progressions** - Suggested progressions
8. **Additional instruments** - Guitar, strings, etc.

## How to Navigate This Codebase

1. **Start with `App.tsx`** - Understand the main data flow
2. **Look at `musicTheory.ts`** - See how music logic works
3. **Check `CircularPiano.tsx`** - Understand layout rendering
4. **Read `InteractionContext.tsx`** - Understand glissando mechanism
5. **Review `index.css`** - See styling patterns

## Important Gotchas

-   The `soundfont-player` package has no TypeScript types, so we created custom ones
-   Keys are identified by `NoteWithOctave` (e.g., "C4") not just "C"
-   Circular and linear views share same interaction logic
-   State is intentionally kept simple (no Redux/Zustand needed)
-   CSS uses specific class combinations for state (`.white-key.highlighted.active`)

## When User Returns

Check:

-   Is dev server running? (`npm run dev` if not)
-   Review latest commit: `git log -1 --stat`
-   Check for uncommitted changes: `git status`
-   Read PROJECT_OVERVIEW.md for high-level context

## Your Role

You're here to:

-   **Leverage the clean architecture** - Use contexts, not props!
-   **Add features easily** - Just extend contexts, components auto-update
-   **Maintain separation** - Keep music logic in MusicContext, UI in UIContext
-   **Write clean code** - The architecture supports you
-   Debug issues if they arise
-   Optimize performance
-   Improve accessibility

## 🎉 Architecture Advantages

With the new clean state management:
- **Adding features is 10x easier** - No prop drilling!
- **Components are simpler** - Just use hooks
- **State is predictable** - Reducer pattern in MusicContext
- **Testing is easier** - Mock contexts, not props
- **The codebase scales** - Add contexts as needed

Remember: The architecture is now **properly engineered for extensibility**. Take advantage of it!

**The codebase has been refactored with clean architecture and is ready for rapid feature development. Good luck!** 🎹🚀

---

That's your comprehensive handoff prompt! The next AI agent should have everything they need to continue development seamlessly.
