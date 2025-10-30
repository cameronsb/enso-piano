# Enso Piano - Feature Backlog

## Design Philosophy
- **Minimal Japanese-inspired aesthetic** - Clean, purposeful, art meets function
- **Form and function** - Beautiful learning tool and songwriting instrument
- **Efficient interactions** - Optimized for pop songwriter workflow

---

## Priority 1: Dynamic Piano Key Range

**Goal:** Support full 88-key piano with dynamic range selection via slider

**Technical Requirements:**
- Generate complete 88-key piano data structure (A0 to C8)
- Implement O(log n) or better lookup/update for key highlighting
- Add minimal slider UI to adjust visible key range
- Maintain current highlighting logic (scale degrees, chords, etc.)
- Ensure circular and linear views both support dynamic range

**Design Considerations:**
- Slider should be minimal, unobtrusive
- Default range: Current 2-octave view (configurable starting point)
- Smooth transitions when adjusting range
- Maintain Japanese aesthetic in slider design

**Implementation Notes:**
- Consider using Set or Map for O(1) key lookups
- Pre-generate all 88 keys with MIDI numbers, frequencies, note names
- Keep rendering performant - only render visible range
- Cache scale/chord calculations to avoid re-computation

---

## Priority 2: Refined UI Layout & Grouping

**Goal:** Reorganize controls into logical, minimal groupings

**View Toggle (Circular ↔ Piano):**
- Move to corner (top-right suggested)
- Replace text buttons with icon toggle
- Icons should be:
  - Circle/enso for circular view
  - Piano keys icon for linear view
- Minimal, single-toggle component

**Primary Controls (Key, Play Mode, Scale Display):**
- Group centrally above/below piano
- Replace "Select Key" with "Key: [C Major ▾]" dropdown (more compact)
- "Play" could be "Playback" or use a subtle play icon ▶
- "Scale Notes" needs separate treatment - consider:
  - Toggle switch for showing/hiding scale degree labels
  - Or: Hover/click behavior to reveal temporarily
  - Could be in settings/options panel

**Visual Hierarchy:**
- Piano is the hero element (largest, central)
- Primary controls are secondary (visible but not dominant)
- View toggle is tertiary (corner, minimal)

---

## Priority 3: Songwriter UX Workflow Audit

**Goal:** Optimize for pop songwriter's creative flow

**Typical Songwriter Workflows:**

1. **Finding a key/mood:**
   - Quick key selection ✓ (currently works)
   - MISSING: Common key suggestions (C, G, D, Am, Em)
   - MISSING: Recent keys history

2. **Building chord progressions:**
   - Visual chord selection ✓ (circular view)
   - Playback ✓ (recently added)
   - MISSING: Save/name progressions
   - MISSING: Common progressions library (I-V-vi-IV, etc.)
   - MISSING: Tempo control for playback
   - MISSING: Loop mode for playback

3. **Exploring melodies:**
   - See scale degrees ✓
   - Hear individual notes (piano click) ✓
   - MISSING: Record/playback melody ideas
   - MISSING: Metronome/click track
   - MISSING: Show intervals between notes

4. **Learning/Reference:**
   - Roman numerals ✓
   - Scale highlighting ✓
   - MISSING: Chord voicing suggestions
   - MISSING: Common substitutions
   - MISSING: Tension notes (7ths, 9ths, etc.)

**UX Improvements Needed:**

- **Speed:** Reduce clicks to common actions
  - Keyboard shortcuts (spacebar = play/pause, arrow keys = transpose)
  - Quick key change (no modal/dropdown required)

- **Context:** Keep relevant info visible
  - Show current key prominently
  - Display active chord progression
  - Show chord names when hovering notes

- **Memory:** Don't lose work
  - Session persistence (localStorage)
  - Export/import progressions
  - Share URL with current state

- **Discovery:** Help find ideas
  - Suggest next chords based on current progression
  - Highlight common movement patterns
  - "Randomize" button for inspiration

**Quick Wins:**
1. Keyboard shortcuts for play/pause
2. Click-to-play notes on piano (currently only visual)
3. Display current chord progression as text
4. Add tempo slider for playback
5. Persist state to localStorage

**Bigger Features:**
1. Progression library/presets
2. Melody recording
3. Export to MIDI
4. Chord substitution suggestions
5. Multi-track layering (bass + chords + melody)

---

## Future Considerations

- **Mobile experience:** Touch-friendly controls, responsive layout
- **Accessibility:** Keyboard navigation, screen reader support
- **Performance:** Virtual scrolling for 88 keys, Web Workers for audio
- **Export:** MIDI export, audio recording, share as URL/image
- **Learning mode:** Guided tutorials, ear training games
- **Customization:** Color themes, instrument sounds, tuning systems

---

## Technical Debt / Improvements

- Consolidate state management (context could be simplified)
- Optimize re-renders (memo/callback on expensive components)
- Add unit tests for music theory utilities
- Type safety improvements (stricter types for notes, chords)
- Accessibility audit (ARIA labels, keyboard nav)
