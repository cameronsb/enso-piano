# Enso Piano: Feature Implementation Plan

## Overview
This document outlines the architecture and implementation strategy for two major features:
1. **Scale Learning Mode** - Visual scale highlighting for educational purposes
2. **DAW-Style Song Structure** - Section-based progression builder with arrangement timeline

---

## Feature 1: Scale Learning Mode

### Concept
Enable a toggle that highlights all notes in the current tonic scale (based on selected key and mode), separate from chord highlighting. This creates a learning tool to visualize scale patterns.

### Architecture

#### Data Structure Changes

**MusicContext State Addition:**
```typescript
interface MusicState {
  // ... existing fields
  scaleViewEnabled: boolean; // New field
}
```

**New Action:**
```typescript
| { type: "TOGGLE_SCALE_VIEW" }
```

#### Utility Functions (musicTheory.ts)

```typescript
/**
 * Get all notes in a scale based on root note and mode
 * @returns Array of Note objects in the scale
 */
export function getScaleNotes(rootNote: Note, mode: Mode): Note[] {
  const rootIndex = NOTES.indexOf(rootNote);
  const scaleIntervals = SCALES[mode];

  return scaleIntervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return NOTES[noteIndex];
  });
}

/**
 * Check if a note is in the current scale
 */
export function isNoteInScale(note: Note, scaleNotes: Note[]): boolean {
  return scaleNotes.includes(note);
}
```

#### UI Changes

**New Toggle Component: `ScaleLearningToggle.tsx`**
- Simple checkbox/toggle button
- Located near the chord display mode toggles
- Label: "Show Scale Notes" or "Scale Learning Mode"
- Icon: musical scale symbol

**Piano Key Highlighting Logic:**
Current behavior:
- Keys are highlighted when they're in the selected chord

New behavior:
- If `scaleViewEnabled === true`: Highlight all scale notes
- If chord is selected AND `scaleViewEnabled === true`: Use different highlight style
  - Scale notes: subtle highlight (light accent)
  - Chord notes: strong highlight (current style)
- If chord is selected AND `scaleViewEnabled === false`: Current behavior

**CSS Classes:**
```css
.piano-key.scale-note {
  /* Subtle scale note highlight */
  background: var(--accent-lighter);
  border-color: var(--border-light);
}

.piano-key.scale-note.chord-note {
  /* Chord note takes precedence, stronger highlight */
  background: var(--accent-light);
  border-color: var(--accent);
}
```

#### Implementation Priority: HIGH
- **Complexity:** Low
- **Value:** High (educational feature)
- **Dependencies:** None
- **Estimated Time:** 2-3 hours

---

## Feature 2: DAW-Style Song Structure Builder

### Concept
Transform the linear chord progression into a section-based song builder where users create reusable sections (verse, chorus, bridge) and arrange them into a complete song structure.

### Problem with Current Architecture
- **Current:** Flat array `chordProgression: ChordInProgression[]`
- **Limitation:** Cannot reuse chord patterns, no song structure concept
- **User Need:** "song parts to encapsulate certain chord progressions"

### Proposed Architecture

#### Core Data Structures

```typescript
// types/music.ts

/**
 * A reusable section containing a chord progression
 * Examples: "Verse 1", "Chorus", "Bridge", "Intro"
 */
export interface SongSection {
  id: string;
  name: string;
  color?: string; // For visual distinction (hex color)
  chords: ChordInProgression[];
  createdAt: number; // Timestamp for ordering
}

/**
 * An instance of a section in the song arrangement
 * Allows same section to be used multiple times
 */
export interface ArrangementItem {
  id: string; // Unique ID for this instance
  sectionId: string; // Reference to SongSection.id
  order: number; // Position in arrangement (0-indexed)
}

/**
 * Song builder mode
 */
export type SongMode = "progression" | "sections";
```

#### MusicContext State Changes

```typescript
interface MusicState {
  // ... existing fields

  // Legacy progression mode (keep for backwards compatibility)
  chordProgression: ChordInProgression[];
  chordDisplayMode: ChordDisplayMode;

  // New song structure mode
  songMode: SongMode; // "progression" | "sections"
  sections: SongSection[];
  arrangement: ArrangementItem[];
  activeSectionId: string | null; // Currently editing section
}
```

#### New Actions

```typescript
// Section CRUD
| { type: "CREATE_SECTION"; payload: { name: string; color?: string } }
| { type: "DELETE_SECTION"; payload: string } // sectionId
| { type: "UPDATE_SECTION"; payload: { id: string; name?: string; color?: string } }
| { type: "DUPLICATE_SECTION"; payload: string } // sectionId
| { type: "SET_ACTIVE_SECTION"; payload: string | null }

// Chord management within sections
| { type: "ADD_CHORD_TO_SECTION"; payload: { sectionId: string; chord: ChordInProgression } }
| { type: "REMOVE_CHORD_FROM_SECTION"; payload: { sectionId: string; chordId: string } }
| { type: "UPDATE_CHORD_IN_SECTION"; payload: { sectionId: string; chordId: string; duration: number } }
| { type: "CLEAR_SECTION_CHORDS"; payload: string } // sectionId

// Arrangement
| { type: "ADD_TO_ARRANGEMENT"; payload: string } // sectionId
| { type: "REMOVE_FROM_ARRANGEMENT"; payload: string } // arrangementItemId
| { type: "REORDER_ARRANGEMENT"; payload: { fromIndex: number; toIndex: number } }
| { type: "CLEAR_ARRANGEMENT" }

// Mode switching
| { type: "SET_SONG_MODE"; payload: SongMode }
```

#### Reducer Logic Examples

```typescript
case "CREATE_SECTION": {
  const newSection: SongSection = {
    id: `section-${Date.now()}-${Math.random()}`,
    name: action.payload.name,
    color: action.payload.color || generateRandomColor(),
    chords: [],
    createdAt: Date.now(),
  };
  return {
    ...state,
    sections: [...state.sections, newSection],
    activeSectionId: newSection.id, // Auto-select new section
  };
}

case "ADD_TO_ARRANGEMENT": {
  const newItem: ArrangementItem = {
    id: `arr-${Date.now()}-${Math.random()}`,
    sectionId: action.payload,
    order: state.arrangement.length, // Add to end
  };
  return {
    ...state,
    arrangement: [...state.arrangement, newItem],
  };
}

case "REORDER_ARRANGEMENT": {
  const items = [...state.arrangement];
  const [removed] = items.splice(action.payload.fromIndex, 1);
  items.splice(action.payload.toIndex, 0, removed);

  // Renumber order
  const reordered = items.map((item, index) => ({
    ...item,
    order: index,
  }));

  return { ...state, arrangement: reordered };
}
```

#### Utility Functions

```typescript
// utils/songStructure.ts

/**
 * Flatten arrangement into a playable chord sequence
 * Used for playback and visualization
 */
export function flattenArrangement(
  sections: SongSection[],
  arrangement: ArrangementItem[]
): ChordInProgression[] {
  const sortedArrangement = [...arrangement].sort((a, b) => a.order - b.order);

  return sortedArrangement.flatMap(item => {
    const section = sections.find(s => s.id === item.sectionId);
    if (!section) return [];

    // Clone chords with unique IDs for each instance
    return section.chords.map(chord => ({
      ...chord,
      id: `${item.id}-${chord.id}`, // Unique per arrangement instance
    }));
  });
}

/**
 * Get total duration of arrangement in beats
 */
export function getArrangementDuration(
  sections: SongSection[],
  arrangement: ArrangementItem[]
): number {
  const flattened = flattenArrangement(sections, arrangement);
  return flattened.reduce((sum, chord) => sum + chord.duration, 0);
}

/**
 * Generate a random pastel color for sections
 */
export function generateRandomColor(): string {
  const colors = [
    '#fecaca', // red
    '#fed7aa', // orange
    '#fef08a', // yellow
    '#d9f99d', // lime
    '#a7f3d0', // green
    '#a5f3fc', // cyan
    '#bfdbfe', // blue
    '#ddd6fe', // violet
    '#f5d0fe', // fuchsia
    '#fbcfe8', // pink
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
```

### UI Components

#### 1. **SongModeToggle** (Simple toggle to switch modes)
```tsx
// Two-state toggle: "Progression" vs "Song Builder"
// Prominent placement near chord display
```

#### 2. **SectionLibrary** (Left sidebar when in sections mode)
```tsx
interface SectionLibraryProps {
  sections: SongSection[];
  activeSectionId: string | null;
  onSelectSection: (id: string) => void;
  onCreateSection: (name: string, color?: string) => void;
  onDeleteSection: (id: string) => void;
  onDuplicateSection: (id: string) => void;
}

// Features:
// - List of all created sections
// - Color-coded cards
// - Active section highlighted
// - "+" button to create new section
// - Context menu for delete/duplicate/rename
// - Drag handle to drag into arrangement
```

#### 3. **SectionEditor** (Replaces ChordProgressionTrack in sections mode)
```tsx
interface SectionEditorProps {
  section: SongSection | null;
  selectedKey: Note;
  mode: Mode;
  onAddChord: (chord: ChordInProgression) => void;
  onRemoveChord: (chordId: string) => void;
  onUpdateDuration: (chordId: string, duration: number) => void;
  onClearSection: () => void;
}

// Features:
// - Shows active section name and color
// - Same chord block UI as current progression track
// - "Clear Section" button
// - Empty state: "Select or create a section to begin"
```

#### 4. **ArrangementTimeline** (Main song structure view)
```tsx
interface ArrangementTimelineProps {
  sections: SongSection[];
  arrangement: ArrangementItem[];
  currentBeat?: number;
  isPlaying?: boolean;
  onAddToArrangement: (sectionId: string) => void;
  onRemoveFromArrangement: (itemId: string) => void;
  onReorderArrangement: (fromIndex: number, toIndex: number) => void;
}

// Features:
// - Horizontal timeline of section blocks
// - Each block shows section name, color, chord count
// - Drag to reorder
// - Click "x" to remove instance
// - Visual playback indicator showing current section
// - Drop zone to add sections from library
```

#### 5. **SectionCreatorDialog** (Modal for creating sections)
```tsx
interface SectionCreatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, color: string) => void;
}

// Features:
// - Text input for section name
// - Color picker (preset colors)
// - Suggested names: "Verse", "Chorus", "Bridge", "Intro", "Outro"
// - "Create" / "Cancel" buttons
```

### Layout Design

**Sections Mode Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Mode Toggle: [Progression] [Song Builder (active)]          │
├─────────────┬───────────────────────────────────────────────┤
│             │ ┌─ Active Section: "Verse 1" ─────────────┐   │
│ SECTIONS    │ │ [Cmaj] [Dm] [G7] [Cmaj]                │   │
│             │ │ 4♩     4♩   4♩   4♩         [Clear]    │   │
│ ┌─────────┐ │ └────────────────────────────────────────┘   │
│ │Verse 1  │ │                                               │
│ │●●●●     │ │ ┌─ Arrangement ─────────────────────────┐   │
│ └─────────┘ │ │ [Intro] [Verse 1] [Chorus] [Verse 1]  │   │
│             │ │ [Chorus] [Bridge] [Chorus] [Outro]     │   │
│ ┌─────────┐ │ └────────────────────────────────────────┘   │
│ │Chorus   │ │                                               │
│ │●●●      │ │ [Chord Grid Below]                           │
│ └─────────┘ │                                               │
│             │                                               │
│ ┌─────────┐ │                                               │
│ │Bridge   │ │                                               │
│ │●●       │ │                                               │
│ └─────────┘ │                                               │
│             │                                               │
│ [+ New]     │                                               │
└─────────────┴───────────────────────────────────────────────┘
```

### Playback Integration

**Current:** `useProgressionPlayer` plays `chordProgression` array

**New:** When in sections mode:
```typescript
// In useProgressionPlayer hook or new useSongPlayer
const playableProgression = useMemo(() => {
  if (songMode === "sections") {
    return flattenArrangement(sections, arrangement);
  }
  return chordProgression;
}, [songMode, sections, arrangement, chordProgression]);

// Use playableProgression for playback
```

**Visual Playback:**
- Highlight current section in arrangement timeline
- Highlight current chord within section
- Beat counter shows global position and section position

### Migration Strategy

**Phase 1: Add Data Structures (No UI Changes)**
- Add new state fields to MusicContext
- Add reducer actions
- Keep existing progression mode as default
- Test state management

**Phase 2: Basic Section Management**
- Implement SectionLibrary component
- Implement SectionEditor component
- Allow creating/editing sections
- No arrangement yet, just section creation

**Phase 3: Arrangement Timeline**
- Implement ArrangementTimeline component
- Drag sections to arrangement
- Reorder arrangement
- Flatten arrangement for playback

**Phase 4: Polish**
- Persistence to localStorage
- Import/export song structure
- Preset section templates
- Keyboard shortcuts
- Undo/redo

### Data Persistence

```typescript
// localStorage keys
const STORAGE_KEYS = {
  SECTIONS: 'enso-piano-sections',
  ARRANGEMENT: 'enso-piano-arrangement',
  SONG_MODE: 'enso-piano-song-mode',
};

// Save on every change
useEffect(() => {
  localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
}, [sections]);

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEYS.SECTIONS);
  if (saved) {
    dispatch({ type: 'LOAD_SECTIONS', payload: JSON.parse(saved) });
  }
}, []);
```

#### Implementation Priority: MEDIUM-HIGH
- **Complexity:** Very High
- **Value:** Very High (core feature differentiation)
- **Dependencies:** Requires careful planning and iterative development
- **Estimated Time:** 15-20 hours (phased approach)

---

## Implementation Sequence

### Recommended Order:

1. **Scale Learning Mode** (Quick Win)
   - Implement in 1 session
   - Provides immediate educational value
   - No dependencies on other features

2. **Song Structure - Phase 1** (Foundation)
   - Data structures and state management
   - No UI, just backend logic
   - Thorough testing

3. **Song Structure - Phase 2** (Section Editing)
   - SectionLibrary component
   - SectionEditor component
   - Basic CRUD operations

4. **Song Structure - Phase 3** (Arrangement)
   - ArrangementTimeline component
   - Drag-and-drop functionality
   - Playback integration

5. **Song Structure - Phase 4** (Polish)
   - Persistence
   - Export/import
   - UI refinements

---

## Open Questions / Design Decisions

### Scale Learning Mode
1. Should scale view disable chord selection, or work alongside it?
   - **Recommendation:** Work alongside, with chord notes having stronger highlight
2. Should there be different scale types (pentatonic, blues, modes)?
   - **Recommendation:** Start with major/minor, add later if requested

### Song Structure
1. Should sections be editable after being added to arrangement, or immutable?
   - **Recommendation:** Mutable - editing a section updates all instances in arrangement
   - Alternative: "Freeze" sections to prevent accidental changes

2. How to handle chord highlighting when arrangement has multiple instances of a section?
   - **Recommendation:** Highlight chords from active section only

3. Maximum sections / arrangement items to prevent performance issues?
   - **Recommendation:** Soft limit of 50 sections, 200 arrangement items

4. Export format for sharing songs?
   - **Recommendation:** JSON format with schema version for future compatibility

5. Should there be a "pattern length" constraint for sections (e.g., must be 4, 8, 16 bars)?
   - **Recommendation:** No constraints initially - freeform duration
   - Can add "snap to bar" option later

---

## Technical Considerations

### Performance
- **Flattening arrangement:** Memoize with `useMemo` to prevent recalculation
- **Section rendering:** Virtualize if >50 sections
- **Drag-and-drop:** Use `react-beautiful-dnd` or native HTML5 drag API

### Testing
- Unit tests for `flattenArrangement` utility
- Integration tests for section CRUD operations
- E2E tests for arrangement playback

### Accessibility
- Keyboard navigation for section library
- ARIA labels for drag handles
- Screen reader announcements for arrangement changes

---

## Success Metrics

### Scale Learning Mode
- ✓ User can toggle scale view on/off
- ✓ Scale notes are visually distinct from chord notes
- ✓ Works in both circular and linear piano views
- ✓ No performance impact on rendering

### Song Structure
- ✓ User can create unlimited sections
- ✓ User can add chords to sections
- ✓ User can arrange sections in timeline
- ✓ User can reorder arrangement via drag-and-drop
- ✓ Playback correctly follows arrangement
- ✓ Song structure persists across sessions
- ✓ No data loss when switching between progression/sections mode

---

## Future Enhancements (Post-MVP)

- **Section templates:** Pre-built common progressions (12-bar blues, pop chord patterns)
- **Section variations:** Create variations of a section (e.g., "Verse 1" vs "Verse 1 Alt")
- **Time signature per section:** Different sections can have different time signatures
- **Repeat markers:** "Play 2x" notation on arrangement items
- **A/B comparison:** Compare two different arrangements
- **Collaboration:** Share song structures via URL or export code
- **MIDI export:** Export arrangement as MIDI file
- **Audio export:** Record arrangement as audio file

---

## Summary

This plan provides a complete roadmap for both features:

1. **Scale Learning Mode** is straightforward and can be implemented quickly
2. **Song Structure** is complex but well-architected for incremental development
3. Both features maintain the minimalist zen aesthetic of Enso Piano
4. The phased approach allows for iterative testing and user feedback
5. Data structures are designed for extensibility and future enhancements

**Total Estimated Development Time:** 18-25 hours
**Recommended Timeline:** 3-4 focused development sessions
