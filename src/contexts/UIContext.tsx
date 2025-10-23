import { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from "react";
import type { ViewMode, InteractionMode } from "../types/music";

// State interface
interface UIState {
    viewMode: ViewMode;
    interactionMode: InteractionMode;
    isDarkMode: boolean;
    circularPianoRotation: number;
    isAudioLoading: boolean;
}

// Action types
type UIAction =
    | { type: "SET_VIEW_MODE"; payload: ViewMode }
    | { type: "SET_INTERACTION_MODE"; payload: InteractionMode }
    | { type: "TOGGLE_DARK_MODE" }
    | { type: "SET_CIRCULAR_ROTATION"; payload: number }
    | { type: "SET_AUDIO_LOADING"; payload: boolean };

// Initial state
const initialState: UIState = {
    viewMode: "circular",
    interactionMode: "play",
    isDarkMode: false,
    circularPianoRotation: 0,
    isAudioLoading: true,
};

// Reducer
function uiReducer(state: UIState, action: UIAction): UIState {
    switch (action.type) {
        case "SET_VIEW_MODE":
            return { ...state, viewMode: action.payload };

        case "SET_INTERACTION_MODE":
            return { ...state, interactionMode: action.payload };

        case "TOGGLE_DARK_MODE":
            return { ...state, isDarkMode: !state.isDarkMode };

        case "SET_CIRCULAR_ROTATION":
            return { ...state, circularPianoRotation: action.payload };

        case "SET_AUDIO_LOADING":
            return { ...state, isAudioLoading: action.payload };

        default:
            return state;
    }
}

// Context interface
interface UIContextType {
    state: UIState;
    actions: {
        setViewMode: (mode: ViewMode) => void;
        setInteractionMode: (mode: InteractionMode) => void;
        toggleDarkMode: () => void;
        setCircularRotation: (rotation: number) => void;
        setAudioLoading: (loading: boolean) => void;
    };
}

// Create context
const UIContext = createContext<UIContextType | undefined>(undefined);

// Provider component
interface UIProviderProps {
    children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
    const [state, dispatch] = useReducer(uiReducer, initialState);

    // Apply theme to document when dark mode changes
    useEffect(() => {
        if (state.isDarkMode) {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
    }, [state.isDarkMode]);

    // Action creators
    const setViewMode = useCallback((mode: ViewMode) => {
        dispatch({ type: "SET_VIEW_MODE", payload: mode });
    }, []);

    const setInteractionMode = useCallback((mode: InteractionMode) => {
        dispatch({ type: "SET_INTERACTION_MODE", payload: mode });
    }, []);

    const toggleDarkMode = useCallback(() => {
        dispatch({ type: "TOGGLE_DARK_MODE" });
    }, []);

    const setCircularRotation = useCallback((rotation: number) => {
        dispatch({ type: "SET_CIRCULAR_ROTATION", payload: rotation });
    }, []);

    const setAudioLoading = useCallback((loading: boolean) => {
        dispatch({ type: "SET_AUDIO_LOADING", payload: loading });
    }, []);

    const value: UIContextType = {
        state,
        actions: {
            setViewMode,
            setInteractionMode,
            toggleDarkMode,
            setCircularRotation,
            setAudioLoading,
        },
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
}

// Custom hook for consuming context
export function useUI() {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error("useUI must be used within a UIProvider");
    }
    return context;
}