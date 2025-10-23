import { CircularPiano } from "./components/CircularPiano";
import { LinearPiano } from "./components/LinearPiano";
import { ChordDisplay } from "./components/ChordDisplay";
import { ViewToggle } from "./components/ViewToggle";
import { InteractionModeToggle } from "./components/InteractionModeToggle";
import { ThemeToggle } from "./components/ThemeToggle";
import { InteractionProvider } from "./contexts/InteractionContext";
import { MusicProvider } from "./contexts/MusicContext";
import { UIProvider, useUI } from "./contexts/UIContext";

function AppContent() {
    const { state: uiState } = useUI();

    return (
        <InteractionProvider>
            <ThemeToggle />
            <div className="container">
                <div className="title">
                    <h1>円相 Enso Piano</h1>
                    <p className="subtitle">Circular Harmony Explorer</p>
                    {uiState.isAudioLoading && (
                        <p className="loading-message">
                            Loading piano sounds...
                        </p>
                    )}
                </div>

                <div className="control-toggles">
                    <ViewToggle />
                    <InteractionModeToggle />
                </div>

                {uiState.viewMode === "circular" ? (
                    <CircularPiano />
                ) : (
                    <LinearPiano />
                )}

                <ChordDisplay />
            </div>
        </InteractionProvider>
    );
}

function App() {
    return (
        <UIProvider>
            <MusicProvider>
                <AppContent />
            </MusicProvider>
        </UIProvider>
    );
}

export default App;
