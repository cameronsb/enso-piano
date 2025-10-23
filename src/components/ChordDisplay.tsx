import type { Note, Mode, SelectedChord } from "../types/music";
import { ModeToggle } from "./ModeToggle";
import { ChordGrid } from "./ChordGrid";
import { CHORD_TYPES } from "../utils/musicTheory";

interface ChordDisplayProps {
    selectedKey: Note;
    mode: Mode;
    onModeChange: (mode: Mode) => void;
    onChordSelect: (
        rootNote: Note,
        intervals: number[],
        numeral: string
    ) => void;
    selectedChords: SelectedChord[];
}

export function ChordDisplay({
    selectedKey,
    mode,
    onModeChange,
    onChordSelect,
    selectedChords,
}: ChordDisplayProps) {
    const chords = CHORD_TYPES[mode];

    return (
        <div className="chords-display">
            <ModeToggle currentMode={mode} onModeChange={onModeChange} />
            <ChordGrid
                title="Triads"
                chords={chords.triads}
                selectedKey={selectedKey}
                mode={mode}
                onChordSelect={onChordSelect}
                selectedChords={selectedChords}
            />
            <ChordGrid
                title="Seventh Chords"
                chords={chords.sevenths}
                selectedKey={selectedKey}
                mode={mode}
                onChordSelect={onChordSelect}
                selectedChords={selectedChords}
            />
        </div>
    );
}
