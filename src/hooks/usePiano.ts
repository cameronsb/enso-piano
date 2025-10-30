import { useMemo } from "react";
import type { PianoKeyData, NoteWithOctave } from "../types/music";
import {
    generate88KeyPiano,
    createPianoKeyMap,
    createMidiKeyMap,
    getKeyRange,
} from "../utils/musicTheory";
import { useMusic } from "../contexts/MusicContext";
import { useUI } from "../contexts/UIContext";

/**
 * Hook to access full 88-key piano data with efficient lookups
 * Provides O(1) key lookups and filtered range based on context
 * Automatically caps circular view at 4 octaves (49 keys) for readability
 */
export function usePiano() {
    const { state: musicState } = useMusic();
    const { state: uiState } = useUI();
    const { pianoRange } = musicState;
    const { viewMode } = uiState;

    // Generate full 88-key piano (memoized - only once)
    const fullPiano = useMemo(() => generate88KeyPiano(), []);

    // Create lookup maps (memoized)
    const pianoKeyMap = useMemo(() => createPianoKeyMap(fullPiano), [fullPiano]);
    const midiKeyMap = useMemo(() => createMidiKeyMap(fullPiano), [fullPiano]);

    // Cap circular view at 4 octaves (49 keys max) to prevent overcrowding
    const effectiveRange = useMemo(() => {
        const MAX_CIRCULAR_KEYS = 49; // ~4 octaves
        const requestedSpan = pianoRange.endMidi - pianoRange.startMidi + 1;

        if (viewMode === "circular" && requestedSpan > MAX_CIRCULAR_KEYS) {
            // Keep the start position, but cap the end
            return {
                startMidi: pianoRange.startMidi,
                endMidi: pianoRange.startMidi + MAX_CIRCULAR_KEYS - 1,
            };
        }

        return pianoRange;
    }, [pianoRange, viewMode]);

    // Get filtered range based on context
    const visibleKeys = useMemo(
        () => getKeyRange(fullPiano, effectiveRange.startMidi, effectiveRange.endMidi),
        [fullPiano, effectiveRange.startMidi, effectiveRange.endMidi]
    );

    // Helper to get key data by note name (O(1))
    const getKeyByNote = (note: NoteWithOctave): PianoKeyData | undefined => {
        return pianoKeyMap.get(note);
    };

    // Helper to get key data by MIDI number (O(1))
    const getKeyByMidi = (midiNumber: number): PianoKeyData | undefined => {
        return midiKeyMap.get(midiNumber);
    };

    return {
        fullPiano,      // All 88 keys
        visibleKeys,    // Keys in current range (capped for circular)
        pianoKeyMap,    // O(1) lookup by note name
        midiKeyMap,     // O(1) lookup by MIDI number
        getKeyByNote,   // Helper function
        getKeyByMidi,   // Helper function
        range: effectiveRange, // Effective range (may be capped for circular)
        requestedRange: pianoRange, // Original requested range
    };
}
