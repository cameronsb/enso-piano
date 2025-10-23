import type { Note, ChordDefinition } from "../types/music";
import { getChordSymbol } from "../utils/musicTheory";

interface ChordItemProps {
    chordDef: ChordDefinition;
    rootNote: Note;
    onClick: (rootNote: Note, intervals: number[], numeral: string) => void;
    isSelected?: boolean;
}

export function ChordItem({
    chordDef,
    rootNote,
    onClick,
    isSelected = false,
}: ChordItemProps) {
    const chordSymbol = getChordSymbol(rootNote, chordDef.type);

    const handleClick = () => {
        onClick(rootNote, chordDef.intervals, chordDef.numeral);
    };

    return (
        <div
            className={`chord-item ${isSelected ? "selected" : ""}`}
            onClick={handleClick}
        >
            <div className="chord-numeral">{chordDef.numeral}</div>
            <div className="chord-name">{chordSymbol}</div>
        </div>
    );
}
