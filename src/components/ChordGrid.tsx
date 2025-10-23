import type {
    Note,
    Mode,
    ChordDefinition,
    SelectedChord,
} from "../types/music";
import { ChordItem } from "./ChordItem";
import { getChordName } from "../utils/musicTheory";

interface ChordGridProps {
    title: string;
    chords: ChordDefinition[];
    selectedKey: Note;
    mode: Mode;
    onChordSelect: (
        rootNote: Note,
        intervals: number[],
        numeral: string
    ) => void;
    selectedChords: SelectedChord[];
}

export function ChordGrid({
    title,
    chords,
    selectedKey,
    mode,
    onChordSelect,
    selectedChords,
}: ChordGridProps) {
    return (
        <div className="chord-section">
            <h3>{title}</h3>
            <div className="chord-grid">
                {chords.map((chord, index) => {
                    const rootNote = getChordName(selectedKey, mode, index);
                    const isSelected = selectedChords.some(
                        (sc) =>
                            sc.rootNote === rootNote &&
                            sc.numeral === chord.numeral &&
                            sc.intervals.length === chord.intervals.length
                    );
                    return (
                        <ChordItem
                            key={`${chord.numeral}-${index}`}
                            chordDef={chord}
                            rootNote={rootNote}
                            onClick={onChordSelect}
                            isSelected={isSelected}
                        />
                    );
                })}
            </div>
        </div>
    );
}
