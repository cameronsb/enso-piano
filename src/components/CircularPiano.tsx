import { useMemo, useRef, useState, useEffect } from "react";
import type {
    Note,
    PianoKeyData,
} from "../types/music";
import { PianoKey } from "./PianoKey";
import { NOTES, getScaleNotes, getScaleDegreeNumeral, getEnharmonicSpelling } from "../utils/musicTheory";
import { useMusic } from "../contexts/MusicContext";
import { useUI } from "../contexts/UIContext";
import { useKeyPress } from "../hooks/useKeyPress";
import { usePiano } from "../hooks/usePiano";

export function CircularPiano() {
    const { state: musicState, actions: musicActions } = useMusic();
    const { state: uiState, actions: uiActions } = useUI();
    const handleKeyPress = useKeyPress();
    const { visibleKeys } = usePiano(); // Use dynamic key range

    const { selectedKey, mode, selectedChords, scaleViewEnabled } = musicState;
    const { circularPianoRotation: rotation } = uiState;
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startAngle, setStartAngle] = useState(0);
    const [currentRotation, setCurrentRotation] = useState(rotation);

    // Calculate positions for circular layout based on visible keys
    const pianoKeys = useMemo(() => {
        const radius = 190;
        // Count white keys to determine spacing
        const whiteKeys = visibleKeys.filter(k => !k.isBlack);
        const totalWhiteKeys = whiteKeys.length;

        return visibleKeys.map((key) => {
            // Find the white key index for this key
            const whiteKeyIndex = whiteKeys.findIndex(wk => wk.note === key.note);

            let angle, radian, x, y, adjustedRadius;

            if (!key.isBlack) {
                // White key positioning
                angle = (whiteKeyIndex * 360) / totalWhiteKeys - 90;
                radian = (angle * Math.PI) / 180;
                adjustedRadius = radius;
                x = 250 + Math.cos(radian) * adjustedRadius - 25;
                y = 250 + Math.sin(radian) * adjustedRadius - 60;
            } else {
                // Black key positioning (between white keys)
                // Find the previous white key
                const prevWhiteIndex = whiteKeys.findIndex((wk, i) =>
                    i < whiteKeys.length - 1 &&
                    key.midiNumber > wk.midiNumber &&
                    key.midiNumber < whiteKeys[i + 1].midiNumber
                );
                angle = ((prevWhiteIndex + 0.5) * 360) / totalWhiteKeys - 90;
                radian = (angle * Math.PI) / 180;
                adjustedRadius = radius - 25;
                x = 250 + Math.cos(radian) * adjustedRadius - 18;
                y = 250 + Math.sin(radian) * adjustedRadius - 45;
            }

            return {
                ...key,
                angle: angle + 90,
                x,
                y,
            };
        });
    }, [visibleKeys]);

    // Add enharmonic display names based on current key context
    const pianoKeysWithDisplayNames = useMemo(() => {
        return pianoKeys.map(key => {
            const chromaticIndex = NOTES.indexOf(key.baseNote);
            const displayName = getEnharmonicSpelling(chromaticIndex, selectedKey, mode);
            return {
                ...key,
                displayName
            };
        });
    }, [pianoKeys, selectedKey, mode]);

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

    // Calculate which notes are in the current scale
    const scaleNotes = useMemo(() => {
        if (!scaleViewEnabled) return new Set<Note>();
        const notes = getScaleNotes(selectedKey, mode);
        return new Set(notes);
    }, [scaleViewEnabled, selectedKey, mode]);

    const handleKeyPressCallback = (keyData: PianoKeyData) => {
        // Use the frequency from PianoKeyData (already calculated)
        handleKeyPress(keyData.baseNote, keyData.frequency);
    };

    const handleCenterClick = () => {
        if (selectedChords.length > 0) {
            musicActions.deselectChords();
        }
    };

    // Get the enharmonic spelling for the selected key
    const selectedKeyDisplayName = useMemo(() => {
        const chromaticIndex = NOTES.indexOf(selectedKey);
        return getEnharmonicSpelling(chromaticIndex, selectedKey, mode);
    }, [selectedKey, mode]);

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
                <div className="selected-key">{selectedKeyDisplayName}</div>
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
                {pianoKeysWithDisplayNames.map((keyData) => {
                    const scaleNumeral = getScaleDegreeNumeral(
                        keyData.baseNote,
                        selectedKey,
                        mode
                    );
                    return (
                        <PianoKey
                            key={keyData.note}
                            keyData={keyData}
                            onPress={handleKeyPressCallback}
                            isHighlighted={highlightedNotes.has(keyData.baseNote)}
                            isScaleNote={scaleNotes.has(keyData.baseNote)}
                            scaleNumeral={scaleNumeral}
                            showScaleNumeral={scaleViewEnabled}
                        />
                    );
                })}
            </div>
        </div>
    );
}
