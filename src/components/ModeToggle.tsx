import { useMusic } from "../contexts/MusicContext";

export function ModeToggle() {
    const { state: musicState, actions: musicActions } = useMusic();
    const { mode: currentMode } = musicState;

    return (
        <div className="mode-toggle">
            <button
                className={`mode-btn ${
                    currentMode === "major" ? "active" : ""
                }`}
                onClick={() => musicActions.setMode("major")}
            >
                Major
            </button>
            <button
                className={`mode-btn ${
                    currentMode === "minor" ? "active" : ""
                }`}
                onClick={() => musicActions.setMode("minor")}
            >
                Minor
            </button>
        </div>
    );
}
