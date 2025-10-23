import { useCallback } from "react";
import { useMusic } from "../contexts/MusicContext";
import { useAudioEngine } from "./useAudioEngine";
import { getChordFrequencies } from "../utils/musicTheory";
import type { Note } from "../types/music";

export function useChordPlayer() {
    const { actions: musicActions } = useMusic();
    const { playChord } = useAudioEngine();

    const handleChordSelect = useCallback(
        (rootNote: Note, intervals: number[], numeral: string) => {
            // Let the context handle the state logic
            musicActions.selectChord(rootNote, intervals, numeral);

            // Play the chord
            const frequencies = getChordFrequencies(rootNote, intervals);
            playChord(frequencies);
        },
        [playChord, musicActions]
    );

    return handleChordSelect;
}