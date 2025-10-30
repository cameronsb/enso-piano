import { useMusic } from "../contexts/MusicContext";
import { useUI } from "../contexts/UIContext";

/**
 * Minimal, Japanese-inspired piano range selector
 * Single slider to control number of visible keys (12 to 88)
 */
export function PianoRangeControl() {
    const { state, actions } = useMusic();
    const { state: uiState } = useUI();
    const { pianoRange } = state;
    const { viewMode } = uiState;

    // Calculate current range span
    const currentKeyCount = pianoRange.endMidi - pianoRange.startMidi + 1;

    // Limits
    const MIN_KEYS = 12; // 1 octave
    const MAX_KEYS_LINEAR = 88; // Full piano
    const MAX_KEYS_CIRCULAR = 49; // ~4 octaves (capped for circular)

    const maxKeys = viewMode === "circular" ? MAX_KEYS_CIRCULAR : MAX_KEYS_LINEAR;

    // Handle slider change - adjust number of keys while keeping range centered-ish
    const handleKeyCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newKeyCount = parseInt(e.target.value);

        // Try to keep the range centered around middle C (60) when possible
        const centerNote = 60; // C4
        const halfRange = Math.floor(newKeyCount / 2);

        let newStart = centerNote - halfRange;
        let newEnd = newStart + newKeyCount - 1;

        // Adjust if out of bounds
        if (newStart < 21) {
            newStart = 21;
            newEnd = newStart + newKeyCount - 1;
        }
        if (newEnd > 108) {
            newEnd = 108;
            newStart = newEnd - newKeyCount + 1;
        }

        actions.setPianoRange(newStart, newEnd);
    };

    return (
        <div className="piano-range-control" style={styles.container}>
            <div style={styles.sliderContainer}>
                <label className="range-label">Piano Range</label>
                <input
                    type="range"
                    min={MIN_KEYS}
                    max={maxKeys}
                    value={currentKeyCount}
                    onChange={handleKeyCountChange}
                    className="range-slider"
                />
                <div className="range-info" style={styles.rangeInfo}>
                    {currentKeyCount} keys
                </div>
            </div>
        </div>
    );
}

// Minimal Japanese-inspired styles with dark mode support
const styles: Record<string, React.CSSProperties> = {
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        borderRadius: "4px",
        maxWidth: "400px",
    },
    presets: {
        display: "flex",
        gap: "8px",
        justifyContent: "center",
    },
    sliderContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    rangeInfo: {
        fontSize: "12px",
        textAlign: "center",
    },
};
