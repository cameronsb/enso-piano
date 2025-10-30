import { useMemo } from "react";
import type { Note, PianoKeyData } from "../types/music";
import { LinearPianoKey } from "./LinearPianoKey";
import { NOTES, getScaleNotes, getScaleDegreeNumeral, getEnharmonicSpelling } from "../utils/musicTheory";
import { useMusic } from "../contexts/MusicContext";
import { useKeyPress } from "../hooks/useKeyPress";
import { usePiano } from "../hooks/usePiano";

export function LinearPiano() {
    const { state: musicState, actions: musicActions } = useMusic();
    const handleKeyPress = useKeyPress();
    const { visibleKeys } = usePiano(); // Use dynamic key range

    const { selectedKey, mode, selectedChords, scaleViewEnabled } = musicState;

    // Add enharmonic display names based on current key context
    const pianoKeysWithDisplayNames = useMemo(() => {
        return visibleKeys.map(key => {
            const chromaticIndex = NOTES.indexOf(key.baseNote);
            const displayName = getEnharmonicSpelling(chromaticIndex, selectedKey, mode);
            return {
                ...key,
                displayName
            };
        });
    }, [visibleKeys, selectedKey, mode]);

    // Get the enharmonic spelling for the selected key
    const selectedKeyDisplayName = useMemo(() => {
        const chromaticIndex = NOTES.indexOf(selectedKey);
        return getEnharmonicSpelling(chromaticIndex, selectedKey, mode);
    }, [selectedKey, mode]);

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
        // Use the frequency from the PianoKeyData (already calculated)
        handleKeyPress(keyData.baseNote, keyData.frequency);
    };

    const whiteKeys = pianoKeysWithDisplayNames.filter((k) => !k.isBlack);
    const blackKeys = pianoKeysWithDisplayNames.filter((k) => k.isBlack);

    return (
        <div className="linear-piano-container">
            <div
                className={`piano-info-display ${
                    selectedChords.length > 0 ? "clickable" : ""
                }`}
                onClick={() =>
                    selectedChords.length > 0 && musicActions.deselectChords()
                }
            >
                <div className="selected-key-linear">{selectedKeyDisplayName}</div>
                <div className="key-mode-linear">
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </div>
                {selectedChords.length > 0 && (
                    <div className="selected-chord-info-linear">
                        {selectedChords[0].numeral}
                    </div>
                )}
            </div>

            <div className="piano-keyboard">
                <div className="white-keys-container">
                    {whiteKeys.map((keyData, index) => {
                        const scaleNumeral = getScaleDegreeNumeral(
                            keyData.baseNote,
                            selectedKey,
                            mode
                        );
                        return (
                            <LinearPianoKey
                                key={keyData.note}
                                keyData={keyData}
                                onPress={handleKeyPressCallback}
                                isHighlighted={highlightedNotes.has(
                                    keyData.baseNote
                                )}
                                isScaleNote={scaleNotes.has(keyData.baseNote)}
                                position={index}
                                scaleNumeral={scaleNumeral}
                                showScaleNumeral={scaleViewEnabled}
                            />
                        );
                    })}
                </div>
                <div className="black-keys-container">
                    {blackKeys.map((keyData) => {
                        const scaleNumeral = getScaleDegreeNumeral(
                            keyData.baseNote,
                            selectedKey,
                            mode
                        );

                        // Calculate which white key this black key comes after
                        // Find the last white key before this black key
                        const whiteKeyIndex = whiteKeys.reduce((lastIndex, wk, index) => {
                            return wk.midiNumber < keyData.midiNumber ? index : lastIndex;
                        }, -1);

                        return (
                            <LinearPianoKey
                                key={keyData.note}
                                keyData={keyData}
                                onPress={handleKeyPressCallback}
                                isHighlighted={highlightedNotes.has(
                                    keyData.baseNote
                                )}
                                isScaleNote={scaleNotes.has(keyData.baseNote)}
                                position={whiteKeyIndex}
                                isBlackKey={true}
                                scaleNumeral={scaleNumeral}
                                showScaleNumeral={scaleViewEnabled}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
