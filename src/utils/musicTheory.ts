import type { Note, Mode, ChordData, FrequencyMap } from "../types/music";

export const NOTES: Note[] = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
];

export const FREQUENCIES: FrequencyMap = {
    C4: 261.63,
    "C#4": 277.18,
    D4: 293.66,
    "D#4": 311.13,
    E4: 329.63,
    F4: 349.23,
    "F#4": 369.99,
    G4: 392.0,
    "G#4": 415.3,
    A4: 440.0,
    "A#4": 466.16,
    B4: 493.88,
    C5: 523.25,
    "C#5": 554.37,
    D5: 587.33,
    "D#5": 622.25,
    E5: 659.25,
    F5: 698.46,
    "F#5": 739.99,
    G5: 783.99,
    "G#5": 830.61,
    A5: 880.0,
    "A#5": 932.33,
    B5: 987.77,
    C6: 1046.5,
    "C#6": 1108.73,
    D6: 1174.66,
    "D#6": 1244.51,
    E6: 1318.51,
    F6: 1396.91,
    "F#6": 1479.98,
    G6: 1567.98,
    "G#6": 1661.22,
    A6: 1760.0,
    "A#6": 1864.66,
    B6: 1975.53,
};

export const BASE_FREQUENCIES: FrequencyMap = {
    C: 261.63,
    "C#": 277.18,
    D: 293.66,
    "D#": 311.13,
    E: 329.63,
    F: 349.23,
    "F#": 369.99,
    G: 392.0,
    "G#": 415.3,
    A: 440.0,
    "A#": 466.16,
    B: 493.88,
};

export const SCALES = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
};

export const CHORD_TYPES: Record<Mode, ChordData> = {
    major: {
        triads: [
            { numeral: "I", type: "maj", intervals: [0, 4, 7] },
            { numeral: "ii", type: "min", intervals: [0, 3, 7] },
            { numeral: "iii", type: "min", intervals: [0, 3, 7] },
            { numeral: "IV", type: "maj", intervals: [0, 4, 7] },
            { numeral: "V", type: "maj", intervals: [0, 4, 7] },
            { numeral: "vi", type: "min", intervals: [0, 3, 7] },
            { numeral: "vii°", type: "dim", intervals: [0, 3, 6] },
        ],
        sevenths: [
            { numeral: "Imaj7", type: "maj7", intervals: [0, 4, 7, 11] },
            { numeral: "ii7", type: "min7", intervals: [0, 3, 7, 10] },
            { numeral: "iii7", type: "min7", intervals: [0, 3, 7, 10] },
            { numeral: "IVmaj7", type: "maj7", intervals: [0, 4, 7, 11] },
            { numeral: "V7", type: "dom7", intervals: [0, 4, 7, 10] },
            { numeral: "vi7", type: "min7", intervals: [0, 3, 7, 10] },
            { numeral: "viiø7", type: "half-dim7", intervals: [0, 3, 6, 10] },
        ],
    },
    minor: {
        triads: [
            { numeral: "i", type: "min", intervals: [0, 3, 7] },
            { numeral: "ii°", type: "dim", intervals: [0, 3, 6] },
            { numeral: "III", type: "maj", intervals: [0, 4, 7] },
            { numeral: "iv", type: "min", intervals: [0, 3, 7] },
            { numeral: "v", type: "min", intervals: [0, 3, 7] },
            { numeral: "VI", type: "maj", intervals: [0, 4, 7] },
            { numeral: "VII", type: "maj", intervals: [0, 4, 7] },
        ],
        sevenths: [
            { numeral: "i7", type: "min7", intervals: [0, 3, 7, 10] },
            { numeral: "iiø7", type: "half-dim7", intervals: [0, 3, 6, 10] },
            { numeral: "IIImaj7", type: "maj7", intervals: [0, 4, 7, 11] },
            { numeral: "iv7", type: "min7", intervals: [0, 3, 7, 10] },
            { numeral: "v7", type: "min7", intervals: [0, 3, 7, 10] },
            { numeral: "VImaj7", type: "maj7", intervals: [0, 4, 7, 11] },
            { numeral: "VII7", type: "dom7", intervals: [0, 4, 7, 10] },
        ],
    },
};

export function getChordName(
    rootNote: Note,
    scaleType: Mode,
    degree: number
): Note {
    const noteIndex = NOTES.indexOf(rootNote);
    const scale = SCALES[scaleType];
    const chordRootIndex = (noteIndex + scale[degree]) % 12;
    return NOTES[chordRootIndex];
}

export function getChordTypeFromIntervals(intervals: number[]): string {
    const intervalStr = intervals.join(",");

    // Triads
    if (intervalStr === "0,4,7") return "maj";
    if (intervalStr === "0,3,7") return "min";
    if (intervalStr === "0,3,6") return "dim";

    // Seventh chords
    if (intervalStr === "0,4,7,11") return "maj7";
    if (intervalStr === "0,3,7,10") return "min7";
    if (intervalStr === "0,4,7,10") return "dom7";
    if (intervalStr === "0,3,6,10") return "half-dim7";

    return "maj"; // default
}

export function getChordSymbol(rootNote: Note, chordType: string): string {
    let symbol = rootNote;

    switch (chordType) {
        case "min":
            symbol += "m";
            break;
        case "dim":
            symbol += "°";
            break;
        case "maj7":
            symbol += "maj7";
            break;
        case "min7":
            symbol += "m7";
            break;
        case "dom7":
            symbol += "7";
            break;
        case "half-dim7":
            symbol += "ø7";
            break;
    }

    return symbol;
}

export function getFullChordName(rootNote: Note, intervals: number[]): string {
    const chordType = getChordTypeFromIntervals(intervals);
    return getChordSymbol(rootNote, chordType);
}

export function getRomanNumeralForChord(
    chordRoot: Note,
    chordIntervals: number[],
    keyRoot: Note,
    mode: Mode
): string {
    const keyRootIndex = NOTES.indexOf(keyRoot);
    const chordRootIndex = NOTES.indexOf(chordRoot);
    const scale = SCALES[mode];

    // Find which scale degree this chord root is
    let scaleDegree = -1;
    for (let i = 0; i < scale.length; i++) {
        const scaleNoteIndex = (keyRootIndex + scale[i]) % 12;
        if (scaleNoteIndex === chordRootIndex) {
            scaleDegree = i;
            break;
        }
    }

    // If not in scale, return "?"
    if (scaleDegree === -1) return "?";

    // Get the chord type from intervals
    const chordType = getChordTypeFromIntervals(chordIntervals);
    const chords = CHORD_TYPES[mode];

    // Check triads - use index-based loop
    for (let i = 0; i < chords.triads.length; i++) {
        const chord = chords.triads[i];
        const expectedRoot = getChordName(keyRoot, mode, i);

        if (expectedRoot === chordRoot && chord.type === chordType) {
            return chord.numeral;
        }
    }

    // Check sevenths - use index-based loop
    for (let i = 0; i < chords.sevenths.length; i++) {
        const chord = chords.sevenths[i];
        const expectedRoot = getChordName(keyRoot, mode, i);

        if (expectedRoot === chordRoot && chord.type === chordType) {
            return chord.numeral;
        }
    }

    // Fallback: return basic Roman numeral based on scale degree
    const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII"];
    return romanNumerals[scaleDegree] || "?";
}

export function getChordFrequencies(
    rootNote: Note,
    intervals: number[]
): number[] {
    const rootIndex = NOTES.indexOf(rootNote);
    return intervals.map((interval) => {
        const noteIndex = (rootIndex + interval) % 12;
        const note = NOTES[noteIndex];
        return BASE_FREQUENCIES[note];
    });
}

export function getNotesForChord(
    keyRoot: Note,
    chordRoot: Note,
    intervals: number[]
): string[] {
    const chordRootIndex = NOTES.indexOf(chordRoot);
    const keyRootIndex = NOTES.indexOf(keyRoot);

    // Determine octave based on relationship to key root
    // If chord root is before key root in the chromatic scale, use octave 5, otherwise 4
    const baseOctave = chordRootIndex < keyRootIndex ? 5 : 4;

    return intervals.map((interval) => {
        const noteIndex = (chordRootIndex + interval) % 12;
        const note = NOTES[noteIndex];

        // Adjust octave if we wrapped around
        const octave = (chordRootIndex + interval) >= 12 ? baseOctave + 1 : baseOctave;

        return `${note}${octave}`;
    });
}

/**
 * Get all notes in a scale based on root note and mode
 * @param rootNote - The root note of the scale
 * @param mode - major or minor
 * @returns Array of Note objects in the scale
 */
export function getScaleNotes(rootNote: Note, mode: Mode): Note[] {
    const rootIndex = NOTES.indexOf(rootNote);
    const scaleIntervals = SCALES[mode];

    return scaleIntervals.map(interval => {
        const noteIndex = (rootIndex + interval) % 12;
        return NOTES[noteIndex];
    });
}

/**
 * Check if a note is in the current scale
 * @param note - The note to check
 * @param scaleNotes - Array of notes in the scale
 * @returns true if the note is in the scale
 */
export function isNoteInScale(note: Note, scaleNotes: Note[]): boolean {
    return scaleNotes.includes(note);
}

/**
 * Get the Roman numeral for a note's scale degree
 * @param note - The note to get the Roman numeral for
 * @param keyRoot - The root note of the key
 * @param mode - major or minor
 * @returns Roman numeral (I, ii, iii, etc.) or null if not in scale
 */
export function getScaleDegreeNumeral(
    note: Note,
    keyRoot: Note,
    mode: Mode
): string | null {
    const keyRootIndex = NOTES.indexOf(keyRoot);
    const noteIndex = NOTES.indexOf(note);
    const scale = SCALES[mode];

    // Find which scale degree this note is
    let scaleDegree = -1;
    for (let i = 0; i < scale.length; i++) {
        const scaleNoteIndex = (keyRootIndex + scale[i]) % 12;
        if (scaleNoteIndex === noteIndex) {
            scaleDegree = i;
            break;
        }
    }

    // If not in scale, return null
    if (scaleDegree === -1) return null;

    // Get the appropriate triad for this scale degree
    const chords = CHORD_TYPES[mode];
    if (scaleDegree < chords.triads.length) {
        return chords.triads[scaleDegree].numeral;
    }

    return null;
}
