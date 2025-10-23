import { useState, useEffect } from "react";
import type { PianoKeyData } from "../types/music";
import { useInteraction } from "../contexts/InteractionContext";

interface PianoKeyProps {
    keyData: PianoKeyData;
    onPress: (keyData: PianoKeyData) => void;
    isHighlighted?: boolean;
    isScaleNote?: boolean;
    scaleNumeral?: string | null;
    showScaleNumeral?: boolean;
}

export function PianoKey({
    keyData,
    onPress,
    isHighlighted = false,
    isScaleNote = false,
    scaleNumeral = null,
    showScaleNumeral = false,
}: PianoKeyProps) {
    const [isActive, setIsActive] = useState(false);
    const { isPointerDown, setPointerDown, setLastPlayedNote, shouldPlayNote } =
        useInteraction();

    const playKey = () => {
        if (shouldPlayNote(keyData.note)) {
            setIsActive(true);
            setLastPlayedNote(keyData.note);
            onPress(keyData);

            // Visual feedback - remove active state after a short delay
            setTimeout(() => setIsActive(false), 200);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setPointerDown(true);
        playKey();
    };

    const handleMouseEnter = () => {
        // Play note when dragging over (glissando effect)
        if (isPointerDown) {
            playKey();
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        setPointerDown(true);
        playKey();
    };

    // Handle global mouse up to end glissando
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

    const className = `piano-key ${
        keyData.isBlack ? "black-key" : "white-key"
    }${isActive ? " active" : ""}${isHighlighted ? " highlighted" : ""}${
        isScaleNote && !isHighlighted ? " scale-note" : ""
    }`;

    const style: React.CSSProperties = {
        left: `${keyData.x}px`,
        top: `${keyData.y}px`,
        transform: `rotate(${keyData.angle}deg)`,
    };

    const labelFontSize =
        keyData.octave === 5
            ? keyData.isBlack
                ? "0.6rem"
                : "0.7rem"
            : undefined;

    return (
        <div
            className={className}
            data-note={keyData.note}
            style={style}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onTouchStart={handleTouchStart}
        >
            <span
                className="key-label key-label-top"
                style={labelFontSize ? { fontSize: labelFontSize } : undefined}
            >
                {keyData.baseNote}
            </span>
            <span
                className="key-label key-label-bottom"
                style={labelFontSize ? { fontSize: labelFontSize } : undefined}
            >
                {keyData.baseNote}
            </span>
            {showScaleNumeral && scaleNumeral && (
                <span className="scale-numeral">
                    {scaleNumeral}
                </span>
            )}
        </div>
    );
}
