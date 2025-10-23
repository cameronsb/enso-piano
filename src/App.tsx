import { useState, useCallback } from "react";
import type { Note, Mode, SelectedChord, ViewMode } from "./types/music";
import { CircularPiano } from "./components/CircularPiano";
import { LinearPiano } from "./components/LinearPiano";
import { ChordDisplay } from "./components/ChordDisplay";
import { ViewToggle } from "./components/ViewToggle";
import { useAudioEngine } from "./hooks/useAudioEngine";
import { getChordFrequencies } from "./utils/musicTheory";
import { InteractionProvider } from "./contexts/InteractionContext";

function App() {
    const [selectedKey, setSelectedKey] = useState<Note>("C");
    const [currentMode, setCurrentMode] = useState<Mode>("major");
    const [selectedChords, setSelectedChords] = useState<SelectedChord[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>("circular");
    const { playNote, playChord, isLoading } = useAudioEngine();

    const handleKeyPress = useCallback(
        (baseNote: Note, frequency: number) => {
            setSelectedKey(baseNote);
            playNote(frequency);
        },
        [playNote]
    );

    const handleModeChange = useCallback((mode: Mode) => {
        setCurrentMode(mode);
    }, []);

    const handleChordSelect = useCallback(
        (rootNote: Note, intervals: number[], numeral: string) => {
            // Radio button behavior - replace current selection
            setSelectedChords([{ rootNote, intervals, numeral }]);

            // Play the chord
            const frequencies = getChordFrequencies(rootNote, intervals);
            playChord(frequencies);
        },
        [playChord]
    );

    const handleChordDeselect = useCallback(() => {
        setSelectedChords([]);
    }, []);

    const handleViewChange = useCallback((view: ViewMode) => {
        setViewMode(view);
    }, []);

    const displayMode =
        currentMode.charAt(0).toUpperCase() + currentMode.slice(1);

    return (
        <InteractionProvider>
            <div className="container">
                <div className="title">
                    <h1>円相 Enso Piano</h1>
                    <p className="subtitle">Circular Harmony Explorer</p>
                    {isLoading && (
                        <p className="loading-message">
                            Loading piano sounds...
                        </p>
                    )}
                </div>

                <ViewToggle
                    currentView={viewMode}
                    onViewChange={handleViewChange}
                />

                {viewMode === "circular" ? (
                    <CircularPiano
                        selectedKey={selectedKey}
                        mode={displayMode}
                        onKeyPress={handleKeyPress}
                        selectedChords={selectedChords}
                        onDeselect={handleChordDeselect}
                    />
                ) : (
                    <LinearPiano
                        selectedKey={selectedKey}
                        mode={displayMode}
                        onKeyPress={handleKeyPress}
                        selectedChords={selectedChords}
                        onDeselect={handleChordDeselect}
                    />
                )}

                <ChordDisplay
                    selectedKey={selectedKey}
                    mode={currentMode}
                    onModeChange={handleModeChange}
                    onChordSelect={handleChordSelect}
                    selectedChords={selectedChords}
                />
            </div>
        </InteractionProvider>
    );
}

export default App;
