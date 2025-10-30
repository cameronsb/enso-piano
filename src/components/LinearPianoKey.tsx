import { useState, useEffect } from "react";
import { useInteraction } from "../contexts/InteractionContext";
import type { PianoKeyData } from "../types/music";

interface LinearPianoKeyProps {
    keyData: PianoKeyData;
    onPress: (keyData: PianoKeyData) => void;
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
    position,
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

    // Calculate position for black keys dynamically
    // Black keys need to be positioned relative to their corresponding white key
    const getBlackKeyPosition = (): number => {
        const whiteKeyWidth = 60;
        const gapWidth = 2;
        const keyUnit = whiteKeyWidth + gapWidth;
        const blackKeyWidth = 40;
        const offset = whiteKeyWidth - blackKeyWidth / 2;

        // Use position if available (for dynamic positioning)
        if (position !== undefined) {
            return position * keyUnit + offset;
        }

        // Calculate from MIDI number relative to C (MIDI 12 = C0)
        const midiNumber = keyData.midiNumber;

        // Map MIDI number to chromatic position from C
        // C=0, C#=1, D=2, D#=3, E=4, F=5, F#=6, G=7, G#=8, A=9, A#=10, B=11
        const chromaticPosition = (midiNumber - 12) % 12;

        // Count how many white keys come before this note in the chromatic scale from C
        // C(0) C#(0) D(1) D#(1) E(2) F(3) F#(3) G(4) G#(4) A(5) A#(5) B(6)
        const whiteKeysBeforeInOctave = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];

        // Calculate which octave this is (from C0)
        const octaveFromC0 = Math.floor((midiNumber - 12) / 12);

        // Total white keys before this note
        const whiteKeyIndex = octaveFromC0 * 7 + whiteKeysBeforeInOctave[chromaticPosition];

        return whiteKeyIndex * keyUnit + offset;
    };

    const style: React.CSSProperties = isBlackKey
        ? {
              left: `${getBlackKeyPosition()}px`,
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
