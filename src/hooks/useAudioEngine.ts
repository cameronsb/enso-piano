import { useRef, useCallback, useEffect, useState } from "react";
import Soundfont, { Player } from "soundfont-player";

interface AudioEngine {
    context: AudioContext | null;
    instrument: Player | null;
    initialized: boolean;
    loading: boolean;
}

export function useAudioEngine() {
    const audioRef = useRef<AudioEngine>({
        context: null,
        instrument: null,
        initialized: false,
        loading: false,
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAudio = async () => {
            if (audioRef.current.initialized || audioRef.current.loading)
                return;

            audioRef.current.loading = true;

            try {
                const AudioContextClass =
                    window.AudioContext || (window as any).webkitAudioContext;
                const context = new AudioContextClass();

                // Load acoustic grand piano soundfont
                const instrument = await Soundfont.instrument(
                    context,
                    "acoustic_grand_piano",
                    {
                        soundfont: "MusyngKite",
                        // You can also use "FluidR3_GM" for a different sound
                    }
                );

                audioRef.current = {
                    context,
                    instrument,
                    initialized: true,
                    loading: false,
                };

                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load piano soundfont:", error);
                audioRef.current.loading = false;
                setIsLoading(false);
            }
        };

        initAudio();
    }, []);

    const playNote = useCallback((frequency: number, duration = 0.3) => {
        const { instrument } = audioRef.current;
        if (!instrument) return;

        // Convert frequency to MIDI note number
        const midiNote = frequencyToMidi(frequency);

        // Play the note with the sampled piano sound
        instrument.play(midiNote, 0, { duration, gain: 0.8 });
    }, []);

    const playChord = useCallback((frequencies: number[], duration = 0.8) => {
        const { instrument } = audioRef.current;
        if (!instrument) return;

        // Play all notes simultaneously
        frequencies.forEach((freq) => {
            const midiNote = frequencyToMidi(freq);
            instrument.play(midiNote, 0, { duration, gain: 0.6 });
        });
    }, []);

    return { playNote, playChord, isLoading };
}

// Helper function to convert frequency to MIDI note number
function frequencyToMidi(frequency: number): number {
    return Math.round(69 + 12 * Math.log2(frequency / 440));
}
