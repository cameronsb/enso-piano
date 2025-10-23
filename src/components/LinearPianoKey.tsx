import { useState, useEffect } from "react";
import { useInteraction } from "../contexts/InteractionContext";

interface KeyData {
    note: string;
    baseNote: string;
    isBlack: boolean;
    octave: number;
}

interface LinearPianoKeyProps {
    keyData: KeyData;
    onPress: (keyData: KeyData) => void;
    isHighlighted?: boolean;
    position?: number;
    isBlackKey?: boolean;
}

export function LinearPianoKey({
    keyData,
    onPress,
    isHighlighted = false,
    position = 0,
    isBlackKey = false,
}: LinearPianoKeyProps) {
    const [isActive, setIsActive] = useState(false);
    const { isPointerDown, setPointerDown, setLastPlayedNote, shouldPlayNote } =
        useInteraction();

    const playKey = () => {
        if (shouldPlayNote(keyData.note as any)) {
            setIsActive(true);
            setLastPlayedNote(keyData.note as any);
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
    }${isActive ? " active" : ""}${isHighlighted ? " highlighted" : ""}`;

    // Calculate position for black keys
    const blackKeyPositions: { [key: string]: number } = {
        "C#4": 0, "D#4": 1, "F#4": 3, "G#4": 4, "A#4": 5,
        "C#5": 7, "D#5": 8, "F#5": 10, "G#5": 11, "A#5": 12,
    };

    const style: React.CSSProperties = isBlackKey
        ? {
              left: `${blackKeyPositions[keyData.note] * 60 + 42}px`,
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
            <span className="linear-key-label">{keyData.baseNote}</span>
        </div>
    );
}

