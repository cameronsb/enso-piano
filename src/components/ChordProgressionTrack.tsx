import type { ChordInProgression, Note, Mode } from "../types/music";
import type { NoteSubdivision } from "../contexts/MusicContext";
import { getFullChordName, getRomanNumeralForChord } from "../utils/musicTheory";

interface ChordProgressionTrackProps {
    chords: ChordInProgression[];
    timeSignature: { beats: number; noteValue: number };
    onRemoveChord: (id: string) => void;
    onClearAll: () => void;
    onUpdateDuration: (id: string, duration: number) => void;
    selectedKey: Note;
    mode: Mode;
    currentBeat?: number;
    isPlaying?: boolean;
    tempo?: number;
    subdivision?: NoteSubdivision;
}

const DURATION_OPTIONS = [1, 2, 4, 8, 16];

export function ChordProgressionTrack({
    chords,
    timeSignature,
    onRemoveChord,
    onClearAll,
    onUpdateDuration,
    selectedKey,
    mode,
    currentBeat = 0,
    isPlaying = false,
    tempo = 120,
    subdivision = "quarter",
}: ChordProgressionTrackProps) {
    if (chords.length === 0) {
        return (
            <div className="chord-track-empty">
                <p>Click chords above to build your progression</p>
            </div>
        );
    }

    // Calculate which chord is currently playing
    let accumulatedBeats = 0;
    const activeChordId = chords.find((chord) => {
        const start = accumulatedBeats;
        const end = accumulatedBeats + chord.duration;
        accumulatedBeats = end;
        return isPlaying && currentBeat >= start && currentBeat < end;
    })?.id;

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
                {chords.map((chord) => {
                    const isActive = chord.id === activeChordId;

                    // Calculate pulse duration based on subdivision
                    const subdivisionBeats = subdivision === "whole" ? 4 : subdivision === "quarter" ? 1 : 0.5;
                    const pulseDuration = (subdivisionBeats * 60) / tempo;

                    return (
                        <div
                            key={chord.id}
                            className={`chord-block ${isActive ? "active-chord" : ""}`}
                            style={{
                                width: `${chord.duration * 60}px`,
                                ['--pulse-duration' as string]: `${pulseDuration}s`,
                            }}
                        >
                            <button
                                className="chord-remove-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveChord(chord.id);
                                }}
                                aria-label="Remove chord"
                            >
                                ×
                            </button>
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
                            <div className="chord-block-duration">
                                <select
                                    value={chord.duration}
                                    onChange={(e) => {
                                        onUpdateDuration(chord.id, Number(e.target.value));
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className="duration-picker"
                                >
                                    {DURATION_OPTIONS.map((duration) => (
                                        <option key={duration} value={duration}>
                                            {duration}♩
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
