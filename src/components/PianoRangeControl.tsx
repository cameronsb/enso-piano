import { useMusic } from "../contexts/MusicContext";
import { PIANO_RANGES } from "../utils/musicTheory";

/**
 * Minimal, Japanese-inspired piano range selector
 * Uses a simple slider to adjust visible key range
 */
export function PianoRangeControl() {
    const { state, actions } = useMusic();
    const { pianoRange } = state;

    // Calculate current range span
    const currentSpan = pianoRange.endMidi - pianoRange.startMidi + 1;

    // Preset ranges for quick selection
    const presets = [
        { name: "2oct", ...PIANO_RANGES.twoOctaves },
        { name: "3oct", ...PIANO_RANGES.threeOctaves },
        { name: "4oct", ...PIANO_RANGES.fourOctaves },
        { name: "5oct", ...PIANO_RANGES.fiveOctaves },
        { name: "Full", ...PIANO_RANGES.full88 },
    ];

    const handlePresetClick = (start: number, end: number) => {
        actions.setPianoRange(start, end);
    };

    // Handle slider for start position (keeping span constant)
    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = parseInt(e.target.value);
        const newEnd = newStart + currentSpan - 1;

        // Ensure we don't exceed piano bounds
        if (newEnd <= 108) {
            actions.setPianoRange(newStart, newEnd);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.presets}>
                {presets.map((preset) => {
                    const isActive =
                        preset.start === pianoRange.startMidi &&
                        preset.end === pianoRange.endMidi;

                    return (
                        <button
                            key={preset.name}
                            onClick={() => handlePresetClick(preset.start, preset.end)}
                            style={{
                                ...styles.presetButton,
                                ...(isActive ? styles.activePreset : {}),
                            }}
                        >
                            {preset.name}
                        </button>
                    );
                })}
            </div>

            <div style={styles.sliderContainer}>
                <label style={styles.label}>Range Position</label>
                <input
                    type="range"
                    min={21}
                    max={108 - currentSpan + 1}
                    value={pianoRange.startMidi}
                    onChange={handleStartChange}
                    style={styles.slider}
                />
                <div style={styles.rangeInfo}>
                    {currentSpan} keys
                </div>
            </div>
        </div>
    );
}

// Minimal Japanese-inspired styles
const styles: Record<string, React.CSSProperties> = {
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        borderRadius: "4px",
        background: "rgba(0, 0, 0, 0.02)",
        maxWidth: "400px",
    },
    presets: {
        display: "flex",
        gap: "8px",
        justifyContent: "center",
    },
    presetButton: {
        padding: "6px 12px",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "2px",
        background: "white",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: 500,
        color: "rgba(0, 0, 0, 0.6)",
        transition: "all 0.15s ease",
    },
    activePreset: {
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        borderColor: "rgba(0, 0, 0, 0.9)",
    },
    sliderContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    label: {
        fontSize: "11px",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        color: "rgba(0, 0, 0, 0.5)",
    },
    slider: {
        width: "100%",
        height: "2px",
        appearance: "none",
        background: "rgba(0, 0, 0, 0.1)",
        outline: "none",
        borderRadius: "1px",
    },
    rangeInfo: {
        fontSize: "12px",
        color: "rgba(0, 0, 0, 0.6)",
        textAlign: "center",
    },
};
