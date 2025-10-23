import type { ChordInProgression, Note, Mode } from "../types/music";
import { getFullChordName, getRomanNumeralForChord } from "../utils/musicTheory";

interface ChordProgressionTrackProps {
    chords: ChordInProgression[];
    timeSignature: { beats: number; noteValue: number };
    onRemoveChord: (id: string) => void;
    onClearAll: () => void;
    selectedKey: Note;
    mode: Mode;
}

export function ChordProgressionTrack({
    chords,
    timeSignature,
    onRemoveChord,
    onClearAll,
    selectedKey,
    mode,
}: ChordProgressionTrackProps) {
    if (chords.length === 0) {
        return (
            <div className="chord-track-empty">
                <p>Click chords above to build your progression</p>
            </div>
        );
    }

    return (
        <div className="chord-track-container">
            <div className="chord-track-header">
                <div className="track-info">
                    <span className="track-label">Progression</span>
                    <span className="track-time-signature">
                        {timeSignature.beats}/{timeSignature.noteValue}
                    </span>
                </div>
                <button className="track-clear-btn" onClick={onClearAll}>
                    Clear
                </button>
            </div>
            <div className="chord-track">
                {chords.map((chord) => (
                    <div
                        key={chord.id}
                        className="chord-block"
                        style={{
                            width: `${chord.duration * 60}px`,
                        }}
                        onClick={() => onRemoveChord(chord.id)}
                    >
                        <div className="chord-block-content">
                            <div className="chord-block-name">
                                {getFullChordName(chord.rootNote, chord.intervals)}
                            </div>
                            <div className="chord-block-numeral">
                                {getRomanNumeralForChord(
                                    chord.rootNote,
                                    chord.intervals,
                                    selectedKey,
                                    mode
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
