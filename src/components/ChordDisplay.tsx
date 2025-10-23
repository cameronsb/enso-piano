import { ModeToggle } from "./ModeToggle";
import { ChordGrid } from "./ChordGrid";
import { ChordDisplayModeToggle } from "./ChordDisplayModeToggle";
import { ChordProgressionTrack } from "./ChordProgressionTrack";
import { CHORD_TYPES } from "../utils/musicTheory";
import { useMusic } from "../contexts/MusicContext";
import { useChordPlayer } from "../hooks/useChordPlayer";

export function ChordDisplay() {
    const { state: musicState, actions: musicActions } = useMusic();
    const handleChordSelect = useChordPlayer();

    const {
        selectedKey,
        mode,
        selectedChords,
        chordDisplayMode,
        chordProgression,
    } = musicState;
    const chords = CHORD_TYPES[mode];

    return (
        <div className="chords-display">
            <div className="chord-display-header">
                <ModeToggle />
                <ChordDisplayModeToggle />
            </div>

            {chordDisplayMode === "build" && (
                <ChordProgressionTrack
                    chords={chordProgression}
                    timeSignature={{ beats: 4, noteValue: 4 }}
                    onRemoveChord={musicActions.removeFromProgression}
                    onClearAll={musicActions.clearProgression}
                    selectedKey={selectedKey}
                    mode={mode}
                />
            )}

            <ChordGrid
                title="Triads"
                chords={chords.triads}
                selectedKey={selectedKey}
                mode={mode}
                onChordSelect={handleChordSelect}
                selectedChords={selectedChords}
            />
            <ChordGrid
                title="Seventh Chords"
                chords={chords.sevenths}
                selectedKey={selectedKey}
                mode={mode}
                onChordSelect={handleChordSelect}
                selectedChords={selectedChords}
            />
        </div>
    );
}
