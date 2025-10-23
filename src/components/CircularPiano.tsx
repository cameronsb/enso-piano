import { useMemo, useRef, useState, useEffect } from "react";
import type {
    Note,
    PianoKeyData,
    NoteWithOctave,
} from "../types/music";
import { PianoKey } from "./PianoKey";
import { FREQUENCIES, NOTES } from "../utils/musicTheory";
import { useMusic } from "../contexts/MusicContext";
import { useUI } from "../contexts/UIContext";
import { useKeyPress } from "../hooks/useKeyPress";

export function CircularPiano() {
    const { state: musicState, actions: musicActions } = useMusic();
    const { state: uiState, actions: uiActions } = useUI();
    const handleKeyPress = useKeyPress();

    const { selectedKey, mode, selectedChords } = musicState;
    const { circularPianoRotation: rotation } = uiState;
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startAngle, setStartAngle] = useState(0);
    const [currentRotation, setCurrentRotation] = useState(rotation);
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

    const handleKeyPressCallback = (keyData: PianoKeyData) => {
        const frequency = FREQUENCIES[keyData.note];
        if (frequency) {
            handleKeyPress(keyData.baseNote, frequency);
        }
    };

    const handleCenterClick = () => {
        if (selectedChords.length > 0) {
            musicActions.deselectChords();
        }
    };

    // Calculate angle from center to mouse position
    const getAngleFromCenter = (clientX: number, clientY: number): number => {
        if (!containerRef.current) return 0;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(clientY - centerY, clientX - centerX);
        return (angle * 180) / Math.PI;
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        const angle = getAngleFromCenter(e.clientX, e.clientY);
        setStartAngle(angle - currentRotation);
        setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const angle = getAngleFromCenter(e.clientX, e.clientY);
        const newRotation = angle - startAngle;
        setCurrentRotation(newRotation);
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            uiActions.setCircularRotation(currentRotation);
        }
    };

    // Add global mouse event listeners
    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, currentRotation, startAngle]);

    // Sync rotation prop with local state
    useEffect(() => {
        setCurrentRotation(rotation);
    }, [rotation]);

    return (
        <div
            className="piano-container"
            ref={containerRef}
            onContextMenu={handleContextMenu}
            style={{ cursor: isDragging ? "grabbing" : "default" }}
        >
            <div
                className={`center-circle ${
                    selectedChords.length > 0 ? "clickable" : ""
                }`}
                onClick={handleCenterClick}
            >
                <div className="selected-key">{selectedKey}</div>
                <div className="key-mode">
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </div>
                {selectedChords.length > 0 && (
                    <div className="selected-chord-info">
                        {selectedChords[0].numeral}
                    </div>
                )}
            </div>
            <div
                id="pianoKeys"
                style={{
                    transform: `rotate(${currentRotation}deg)`,
                    transition: isDragging ? "none" : "transform 0.3s ease"
                }}
            >
                {pianoKeys.map((keyData) => (
                    <PianoKey
                        key={keyData.note}
                        keyData={keyData}
                        onPress={handleKeyPressCallback}
                        isHighlighted={highlightedNotes.has(keyData.baseNote)}
                    />
                ))}
            </div>
        </div>
    );
}
