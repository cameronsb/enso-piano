import { useEffect, useRef, useCallback } from "react";
import { useMusic } from "../contexts/MusicContext";
import { useAudioEngine } from "./useAudioEngine";
import { getNotesForChord, FREQUENCIES } from "../utils/musicTheory";
import type { ChordInProgression, NoteWithOctave } from "../types/music";

export function useProgressionPlayer() {
    const { state, actions } = useMusic();
    const { playNote } = useAudioEngine();
    const animationFrameRef = useRef<number>();
    const startTimeRef = useRef<number>(0);
    const startBeatRef = useRef<number>(0);
    const lastBeatPlayedRef = useRef<number>(-1);

    const { chordProgression, playbackState, selectedKey } = state;
    const { isPlaying, currentBeat, tempo, loop, subdivision } = playbackState;

    // Calculate total beats in progression
    const totalBeats = chordProgression.reduce(
        (sum, chord) => sum + chord.duration,
        0
    );

    // Find which chord should be playing at the current beat
    const getCurrentChord = useCallback(
        (beat: number): { chord: ChordInProgression; chordIndex: number } | null => {
            let currentBeat = 0;
            for (let i = 0; i < chordProgression.length; i++) {
                const chord = chordProgression[i];
                if (beat >= currentBeat && beat < currentBeat + chord.duration) {
                    return { chord, chordIndex: i };
                }
                currentBeat += chord.duration;
            }
            return null;
        },
        [chordProgression]
    );

    // Play a chord
    const playChord = useCallback(
        (chord: ChordInProgression) => {
            const notes = getNotesForChord(
                selectedKey,
                chord.rootNote,
                chord.intervals
            );

            // Convert notes to frequencies and play
            notes.forEach((note) => {
                const frequency = FREQUENCIES[note as NoteWithOctave];
                if (frequency) {
                    playNote(frequency, 0.8);
                }
            });
        },
        [selectedKey, playNote]
    );

    // Playback loop using requestAnimationFrame
    useEffect(() => {
        if (!isPlaying || chordProgression.length === 0) {
            return;
        }

        const secondsPerBeat = 60 / tempo;

        // Calculate subdivision multiplier
        // whole = 4 beats, quarter = 1 beat, eighth = 0.5 beats
        const subdivisionBeats = subdivision === "whole" ? 4 : subdivision === "quarter" ? 1 : 0.5;

        const updatePlayback = (timestamp: number) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
                startBeatRef.current = currentBeat;
            }

            const elapsedSeconds = (timestamp - startTimeRef.current) / 1000;
            const elapsedBeats = elapsedSeconds / secondsPerBeat;
            let newBeat = startBeatRef.current + elapsedBeats;

            // Handle looping
            if (newBeat >= totalBeats) {
                if (loop) {
                    newBeat = newBeat % totalBeats;
                    startTimeRef.current = timestamp;
                    startBeatRef.current = 0;
                    lastBeatPlayedRef.current = -1; // Reset on loop
                } else {
                    // Stop at the end
                    actions.setPlaybackPlaying(false);
                    actions.setPlaybackBeat(0);
                    return;
                }
            }

            // Update current beat
            actions.setPlaybackBeat(newBeat);

            // Play chord based on subdivision
            // For eighth notes (0.5), play every 0.5 beats
            // For quarter notes (1), play every 1 beat
            // For whole notes (4), play every 4 beats
            const currentSubdivisionIndex = Math.floor(newBeat / subdivisionBeats);
            if (currentSubdivisionIndex !== lastBeatPlayedRef.current && newBeat < totalBeats) {
                const currentBeatIndex = Math.floor(newBeat);
                const currentChordData = getCurrentChord(currentBeatIndex);
                if (currentChordData) {
                    playChord(currentChordData.chord);
                    lastBeatPlayedRef.current = currentSubdivisionIndex;
                }
            }

            animationFrameRef.current = requestAnimationFrame(updatePlayback);
        };

        animationFrameRef.current = requestAnimationFrame(updatePlayback);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [
        isPlaying,
        chordProgression,
        tempo,
        loop,
        totalBeats,
        subdivision,
        actions,
        getCurrentChord,
        playChord,
    ]);

    // Reset start time when playback is stopped
    useEffect(() => {
        if (!isPlaying) {
            startTimeRef.current = 0;
            startBeatRef.current = 0;
            lastBeatPlayedRef.current = -1;
        }
    }, [isPlaying]);

    // Control functions
    const play = useCallback(() => {
        if (chordProgression.length === 0) return;
        actions.setPlaybackPlaying(true);
    }, [chordProgression.length, actions]);

    const pause = useCallback(() => {
        actions.setPlaybackPlaying(false);
    }, [actions]);

    const stop = useCallback(() => {
        actions.setPlaybackPlaying(false);
        actions.setPlaybackBeat(0);
    }, [actions]);

    const togglePlayPause = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [isPlaying, play, pause]);

    return {
        play,
        pause,
        stop,
        togglePlayPause,
        isPlaying,
        currentBeat,
        totalBeats,
        getCurrentChord,
    };
}
