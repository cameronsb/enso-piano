import { useState, useEffect } from "react";
import { useInteraction } from "../contexts/InteractionContext";
import type { Note, NoteWithOctave } from "../types/music";

interface KeyData {
    note: NoteWithOctave;
    baseNote: Note;
    displayName?: string;
    isBlack: boolean;
    octave: number;
}

interface LinearPianoKeyProps {
    keyData: KeyData;
    onPress: (keyData: KeyData) => void;
    isHighlighted?: boolean;
    isScaleNote?: boolean;
    position?: number;
    isBlackKey?: boolean;
    scaleNumeral?: string | null;
    showScaleNumeral?: boolean;
}

export function LinearPianoKey({
    keyData,
    onPress,
    isHighlighted = false,
    isScaleNote = false,
    isBlackKey = false,
    scaleNumeral = null,
    showScaleNumeral = false,
}: LinearPianoKeyProps) {
    const [isActive, setIsActive] = useState(false);
    const { isPointerDown, setPointerDown, setLastPlayedNote, shouldPlayNote } =
        useInteraction();

    const playKey = () => {
        if (shouldPlayNote(keyData.note)) {
            setIsActive(true);
            setLastPlayedNote(keyData.note);
            onPress(keyData);

            setTimeout(() => setIsActive(false), 200);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setPointerDown(true);
        playKey();
    };

    const handleMouseEnter = () => {
        if (isPointerDown) {
            playKey();
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        setPointerDown(true);
        playKey();
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setPointerDown(false);
            setIsActive(false);
        };

        const handleGlobalTouchEnd = () => {
            setPointerDown(false);
            setIsActive(false);
        };

        window.addEventListener("mouseup", handleGlobalMouseUp);
        window.addEventListener("touchend", handleGlobalTouchEnd);

        return () => {
            window.removeEventListener("mouseup", handleGlobalMouseUp);
            window.removeEventListener("touchend", handleGlobalTouchEnd);
        };
    }, [setPointerDown]);

    const className = `linear-piano-key ${
        isBlackKey ? "linear-black-key" : "linear-white-key"
    }${isActive ? " active" : ""}${isHighlighted ? " highlighted" : ""}${
        isScaleNote && !isHighlighted ? " scale-note" : ""
    }`;

    // Calculate position for black keys
    // Black keys sit between white keys. We need to map each black note to its position
    // relative to white keys. White keys are 60px + 2px gap = 62px each
    const getBlackKeyPosition = (note: string): number => {
        const whiteKeyWidth = 60;
        const gapWidth = 2;
        const keyUnit = whiteKeyWidth + gapWidth;
        const blackKeyWidth = 40;
        const offset = whiteKeyWidth - blackKeyWidth / 2;

        // Map each black note to which white key it follows
        const blackKeyMap: { [key: string]: number } = {
            "C#4": 0, // After C4 (position 0)
            "D#4": 1, // After D4 (position 1)
            "F#4": 3, // After F4 (position 3)
            "G#4": 4, // After G4 (position 4)
            "A#4": 5, // After A4 (position 5)
            "C#5": 7, // After C5 (position 7)
            "D#5": 8, // After D5 (position 8)
            "F#5": 10, // After F5 (position 10)
            "G#5": 11, // After G5 (position 11)
            "A#5": 12, // After A5 (position 12)
        };

        const whiteKeyIndex = blackKeyMap[note];
        return whiteKeyIndex * keyUnit + offset;
    };

    const style: React.CSSProperties = isBlackKey
        ? {
              left: `${getBlackKeyPosition(keyData.note)}px`,
          }
        : {};

    return (
        <div
            className={className}
            data-note={keyData.note}
            style={style}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onTouchStart={handleTouchStart}
        >
            <span className="linear-key-label">{keyData.displayName || keyData.baseNote}</span>
            {showScaleNumeral && scaleNumeral && (
                <span className="linear-scale-numeral">
                    {scaleNumeral}
                </span>
            )}
        </div>
    );
}
