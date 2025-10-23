export type Note =
    | "C"
    | "C#"
    | "D"
    | "D#"
    | "E"
    | "F"
    | "F#"
    | "G"
    | "G#"
    | "A"
    | "A#"
    | "B";

export type NoteWithOctave = `${Note}${number}`;

export type Mode = "major" | "minor";

export type ChordType =
    | "maj"
    | "min"
    | "dim"
    | "maj7"
    | "min7"
    | "dom7"
    | "half-dim7";

export interface ChordDefinition {
    numeral: string;
    type: ChordType;
    intervals: number[];
}

export interface ChordData {
    triads: ChordDefinition[];
    sevenths: ChordDefinition[];
}

export interface FrequencyMap {
    [key: string]: number;
}

export interface PianoKeyData {
    note: NoteWithOctave;
    baseNote: Note;
    angle: number;
    x: number;
    y: number;
    isBlack: boolean;
    octave: number;
}

export interface SelectedChord {
    rootNote: Note;
    intervals: number[];
    numeral: string;
}
