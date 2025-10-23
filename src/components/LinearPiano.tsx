import { useMemo } from "react";
import type { Note, SelectedChord, NoteWithOctave } from "../types/music";
import { LinearPianoKey } from "./LinearPianoKey";
import { FREQUENCIES, NOTES } from "../utils/musicTheory";

interface LinearPianoProps {
    selectedKey: Note;
    mode: string;
    onKeyPress: (baseNote: Note, frequency: number) => void;
    selectedChords: SelectedChord[];
    onDeselect: () => void;
}

interface KeyData {
    note: NoteWithOctave;
    baseNote: Note;
    isBlack: boolean;
    octave: number;
}

export function LinearPiano({
    selectedKey,
    mode,
    onKeyPress,
    selectedChords,
    onDeselect,
}: LinearPianoProps) {
    const pianoKeys = useMemo(() => {
        const keys: KeyData[] = [];
        const whiteNotes: Note[] = ["C", "D", "E", "F", "G", "A", "B"];
        const blackNotes: (Note | null)[] = [
            "C#",
            "D#",
            null,
            "F#",
            "G#",
            "A#",
            null,
        ];

        // Create 2 octaves (C4 to B5)
        for (let octave = 4; octave <= 5; octave++) {
            whiteNotes.forEach((note) => {
                keys.push({
                    note: `${note}${octave}` as NoteWithOctave,
                    baseNote: note,
                    isBlack: false,
                    octave,
                });
            });

            blackNotes.forEach((note) => {
                if (note) {
                    keys.push({
                        note: `${note}${octave}` as NoteWithOctave,
                        baseNote: note,
                        isBlack: true,
                        octave,
                    });
                }
            });
        }

        return keys;
    }, []);

    // Calculate which notes are highlighted by selected chords
    const highlightedNotes = useMemo(() => {
        const notes = new Set<Note>();

        selectedChords.forEach((chord) => {
            const rootIndex = NOTES.indexOf(chord.rootNote);
            chord.intervals.forEach((interval) => {
                const noteIndex = (rootIndex + interval) % 12;
                notes.add(NOTES[noteIndex]);
            });
        });

        return notes;
    }, [selectedChords]);

    const handleKeyPress = (keyData: KeyData) => {
        const frequency = FREQUENCIES[keyData.note];
        if (frequency) {
            onKeyPress(keyData.baseNote, frequency);
        }
    };

    const whiteKeys = pianoKeys.filter((k) => !k.isBlack);
    const blackKeys = pianoKeys.filter((k) => k.isBlack);

    return (
        <div className="linear-piano-container">
            <div
                className={`piano-info-display ${
                    selectedChords.length > 0 ? "clickable" : ""
                }`}
                onClick={() => selectedChords.length > 0 && onDeselect()}
            >
                <div className="selected-key-linear">{selectedKey}</div>
                <div className="key-mode-linear">{mode}</div>
                {selectedChords.length > 0 && (
                    <div className="selected-chord-info-linear">
                        {selectedChords[0].numeral}
                    </div>
                )}
            </div>

            <div className="piano-keyboard">
                <div className="white-keys-container">
                    {whiteKeys.map((keyData, index) => (
                        <LinearPianoKey
                            key={keyData.note}
                            keyData={keyData}
                            onPress={handleKeyPress}
                            isHighlighted={highlightedNotes.has(
                                keyData.baseNote
                            )}
                            position={index}
                        />
                    ))}
                </div>
                <div className="black-keys-container">
                    {blackKeys.map((keyData) => (
                        <LinearPianoKey
                            key={keyData.note}
                            keyData={keyData}
                            onPress={handleKeyPress}
                            isHighlighted={highlightedNotes.has(
                                keyData.baseNote
                            )}
                            isBlackKey={true}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

