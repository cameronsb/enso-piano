import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import type { NoteWithOctave } from "../types/music";

interface InteractionContextType {
    isPointerDown: boolean;
    lastPlayedNote: NoteWithOctave | null;
    setPointerDown: (down: boolean) => void;
    setLastPlayedNote: (note: NoteWithOctave | null) => void;
    shouldPlayNote: (note: NoteWithOctave) => boolean;
}

const InteractionContext = createContext<InteractionContextType | undefined>(
    undefined
);

export function InteractionProvider({ children }: { children: ReactNode }) {
    const [isPointerDown, setIsPointerDown] = useState(false);
    const [lastPlayedNote, setLastPlayedNote] = useState<NoteWithOctave | null>(
        null
    );

    const setPointerDown = useCallback((down: boolean) => {
        setIsPointerDown(down);
        if (!down) {
            // Reset last played note when pointer is released
            setLastPlayedNote(null);
        }
    }, []);

    const shouldPlayNote = useCallback(
        (note: NoteWithOctave): boolean => {
            // Always play if it's a new press (pointer just went down)
            // Or if dragging and it's a different note than last played
            return lastPlayedNote !== note;
        },
        [lastPlayedNote]
    );

    return (
        <InteractionContext.Provider
            value={{
                isPointerDown,
                lastPlayedNote,
                setPointerDown,
                setLastPlayedNote,
                shouldPlayNote,
            }}
        >
            {children}
        </InteractionContext.Provider>
    );
}

export function useInteraction() {
    const context = useContext(InteractionContext);
    if (!context) {
        throw new Error(
            "useInteraction must be used within an InteractionProvider"
        );
    }
    return context;
}
