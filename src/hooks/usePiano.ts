import { useMemo } from "react";
import type { PianoKeyData, NoteWithOctave } from "../types/music";
import {
    generate88KeyPiano,
    createPianoKeyMap,
    createMidiKeyMap,
    getKeyRange,
} from "../utils/musicTheory";
import { useMusic } from "../contexts/MusicContext";

/**
 * Hook to access full 88-key piano data with efficient lookups
 * Provides O(1) key lookups and filtered range based on context
 */
export function usePiano() {
    const { state } = useMusic();
    const { pianoRange } = state;

    // Generate full 88-key piano (memoized - only once)
    const fullPiano = useMemo(() => generate88KeyPiano(), []);

    // Create lookup maps (memoized)
    const pianoKeyMap = useMemo(() => createPianoKeyMap(fullPiano), [fullPiano]);
    const midiKeyMap = useMemo(() => createMidiKeyMap(fullPiano), [fullPiano]);

    // Get filtered range based on context
    const visibleKeys = useMemo(
        () => getKeyRange(fullPiano, pianoRange.startMidi, pianoRange.endMidi),
        [fullPiano, pianoRange.startMidi, pianoRange.endMidi]
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
        visibleKeys,    // Keys in current range
        pianoKeyMap,    // O(1) lookup by note name
        midiKeyMap,     // O(1) lookup by MIDI number
        getKeyByNote,   // Helper function
        getKeyByMidi,   // Helper function
        range: pianoRange, // Current range from context
    };
}
