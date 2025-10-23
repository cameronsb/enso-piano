import { createContext, useContext, useReducer, useCallback, ReactNode } from "react";
import type { Note, Mode, SelectedChord, ChordDisplayMode, ChordInProgression } from "../types/music";

// State interface
interface MusicState {
    selectedKey: Note;
    mode: Mode;
    selectedChords: SelectedChord[];
    chordDisplayMode: ChordDisplayMode;
    chordProgression: ChordInProgression[];
}

// Action types
type MusicAction =
    | { type: "SELECT_KEY"; payload: Note }
    | { type: "SET_MODE"; payload: Mode }
    | { type: "SELECT_CHORD"; payload: SelectedChord }
    | { type: "DESELECT_CHORDS" }
    | { type: "SET_CHORD_DISPLAY_MODE"; payload: ChordDisplayMode }
    | { type: "ADD_TO_PROGRESSION"; payload: ChordInProgression }
    | { type: "REMOVE_FROM_PROGRESSION"; payload: string }
    | { type: "CLEAR_PROGRESSION" };

// Initial state
const initialState: MusicState = {
    selectedKey: "C",
    mode: "major",
    selectedChords: [],
    chordDisplayMode: "select",
    chordProgression: [],
};

// Reducer
function musicReducer(state: MusicState, action: MusicAction): MusicState {
    switch (action.type) {
        case "SELECT_KEY":
            return { ...state, selectedKey: action.payload };

        case "SET_MODE":
            return { ...state, mode: action.payload };

        case "SELECT_CHORD":
            // In select mode, replace selection; in build mode, keep selection
            return {
                ...state,
                selectedChords: [action.payload],
            };

        case "DESELECT_CHORDS":
            return { ...state, selectedChords: [] };

        case "SET_CHORD_DISPLAY_MODE":
            return { ...state, chordDisplayMode: action.payload };

        case "ADD_TO_PROGRESSION":
            return {
                ...state,
                chordProgression: [...state.chordProgression, action.payload],
            };

        case "REMOVE_FROM_PROGRESSION":
            return {
                ...state,
                chordProgression: state.chordProgression.filter(
                    chord => chord.id !== action.payload
                ),
            };

        case "CLEAR_PROGRESSION":
            return { ...state, chordProgression: [] };

        default:
            return state;
    }
}

// Context interface with state and actions
interface MusicContextType {
    state: MusicState;
    actions: {
        selectKey: (key: Note) => void;
        setMode: (mode: Mode) => void;
        selectChord: (rootNote: Note, intervals: number[], numeral: string) => void;
        deselectChords: () => void;
        setChordDisplayMode: (mode: ChordDisplayMode) => void;
        removeFromProgression: (id: string) => void;
        clearProgression: () => void;
    };
}

// Create context
const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Provider component
interface MusicProviderProps {
    children: ReactNode;
}

export function MusicProvider({ children }: MusicProviderProps) {
    const [state, dispatch] = useReducer(musicReducer, initialState);

    // Action creators
    const selectKey = useCallback((key: Note) => {
        dispatch({ type: "SELECT_KEY", payload: key });
    }, []);

    const setMode = useCallback((mode: Mode) => {
        dispatch({ type: "SET_MODE", payload: mode });
    }, []);

    const selectChord = useCallback(
        (rootNote: Note, intervals: number[], numeral: string) => {
            if (state.chordDisplayMode === "select") {
                // Select mode - replace current selection
                dispatch({
                    type: "SELECT_CHORD",
                    payload: { rootNote, intervals, numeral },
                });
            } else {
                // Build mode - add to progression
                const newChord: ChordInProgression = {
                    id: `${Date.now()}-${Math.random()}`,
                    rootNote,
                    intervals,
                    numeral,
                    duration: 4, // Default to 4 beats
                };
                dispatch({
                    type: "ADD_TO_PROGRESSION",
                    payload: newChord,
                });

                // Also select it for highlighting
                dispatch({
                    type: "SELECT_CHORD",
                    payload: { rootNote, intervals, numeral },
                });
            }
        },
        [state.chordDisplayMode]
    );

    const deselectChords = useCallback(() => {
        dispatch({ type: "DESELECT_CHORDS" });
    }, []);

    const setChordDisplayMode = useCallback((mode: ChordDisplayMode) => {
        dispatch({ type: "SET_CHORD_DISPLAY_MODE", payload: mode });
    }, []);

    const removeFromProgression = useCallback((id: string) => {
        dispatch({ type: "REMOVE_FROM_PROGRESSION", payload: id });
    }, []);

    const clearProgression = useCallback(() => {
        dispatch({ type: "CLEAR_PROGRESSION" });
    }, []);

    const value: MusicContextType = {
        state,
        actions: {
            selectKey,
            setMode,
            selectChord,
            deselectChords,
            setChordDisplayMode,
            removeFromProgression,
            clearProgression,
        },
    };

    return (
        <MusicContext.Provider value={value}>
            {children}
        </MusicContext.Provider>
    );
}

// Custom hook for consuming context
export function useMusic() {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error("useMusic must be used within a MusicProvider");
    }
    return context;
}