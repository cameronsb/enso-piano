import { useMemo } from "react";
import type {
    Note,
    PianoKeyData,
    NoteWithOctave,
    SelectedChord,
} from "../types/music";
import { PianoKey } from "./PianoKey";
import { FREQUENCIES, NOTES } from "../utils/musicTheory";

interface CircularPianoProps {
    selectedKey: Note;
    mode: string;
    onKeyPress: (baseNote: Note, frequency: number) => void;
    selectedChords: SelectedChord[];
    onDeselect: () => void;
}

export function CircularPiano({
    selectedKey,
    mode,
    onKeyPress,
    selectedChords,
    onDeselect,
}: CircularPianoProps) {
    const pianoKeys = useMemo(() => {
        const keys: PianoKeyData[] = [];
        const radius = 190;
        const totalWhiteKeys = 14; // 2 octaves

        const whiteKeysPattern: Note[] = ["C", "D", "E", "F", "G", "A", "B"];
        const blackKeysPattern: (Note | null)[] = [
            "C#",
            "D#",
            null,
            "F#",
            "G#",
            "A#",
            null,
        ];

        // Create white keys for 2 octaves
        for (let octave = 0; octave < 2; octave++) {
            whiteKeysPattern.forEach((note, index) => {
                const keyIndex = octave * 7 + index;
                const angle = (keyIndex * 360) / totalWhiteKeys - 90;
                const radian = (angle * Math.PI) / 180;
                const x = 250 + Math.cos(radian) * radius - 25;
                const y = 250 + Math.sin(radian) * radius - 60;
                const octaveNum = octave + 4;

                keys.push({
                    note: `${note}${octaveNum}` as NoteWithOctave,
                    baseNote: note,
                    angle: angle + 90,
                    x,
                    y,
                    isBlack: false,
                    octave: octaveNum,
                });
            });
        }

        // Create black keys for 2 octaves
        for (let octave = 0; octave < 2; octave++) {
            blackKeysPattern.forEach((note, index) => {
                if (note === null) return;

                const keyIndex = octave * 7 + index;
                const angle = ((keyIndex + 0.5) * 360) / totalWhiteKeys - 90;
                const radian = (angle * Math.PI) / 180;
                const blackRadius = radius - 25;
                const x = 250 + Math.cos(radian) * blackRadius - 18;
                const y = 250 + Math.sin(radian) * blackRadius - 45;
                const octaveNum = octave + 4;

                keys.push({
                    note: `${note}${octaveNum}` as NoteWithOctave,
                    baseNote: note,
                    angle: angle + 90,
                    x,
                    y,
                    isBlack: true,
                    octave: octaveNum,
                });
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

    const handleKeyPress = (keyData: PianoKeyData) => {
        const frequency = FREQUENCIES[keyData.note];
        if (frequency) {
            onKeyPress(keyData.baseNote, frequency);
        }
    };

    const handleCenterClick = () => {
        if (selectedChords.length > 0) {
            onDeselect();
        }
    };

    return (
        <div className="piano-container">
            <div
                className={`center-circle ${
                    selectedChords.length > 0 ? "clickable" : ""
                }`}
                onClick={handleCenterClick}
            >
                <div className="selected-key">{selectedKey}</div>
                <div className="key-mode">{mode}</div>
                {selectedChords.length > 0 && (
                    <div className="selected-chord-info">
                        {selectedChords[0].numeral}
                    </div>
                )}
            </div>
            <div id="pianoKeys">
                {pianoKeys.map((keyData) => (
                    <PianoKey
                        key={keyData.note}
                        keyData={keyData}
                        onPress={handleKeyPress}
                        isHighlighted={highlightedNotes.has(keyData.baseNote)}
                    />
                ))}
            </div>
        </div>
    );
}
