import { useCallback } from "react";
import { useMusic } from "../contexts/MusicContext";
import { useUI } from "../contexts/UIContext";
import { useAudioEngine } from "./useAudioEngine";
import type { Note } from "../types/music";

export function useKeyPress() {
    const { actions: musicActions } = useMusic();
    const { state: uiState } = useUI();
    const { playNote } = useAudioEngine();

    const handleKeyPress = useCallback(
        (baseNote: Note, frequency: number) => {
            // Only change the selected key in keySelection mode
            if (uiState.interactionMode === "keySelection") {
                musicActions.selectKey(baseNote);
            }
            playNote(frequency);
        },
        [playNote, uiState.interactionMode, musicActions]
    );

    return handleKeyPress;
}