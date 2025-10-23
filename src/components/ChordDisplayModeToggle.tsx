import { useMusic } from "../contexts/MusicContext";

export function ChordDisplayModeToggle() {
    const { state: musicState, actions: musicActions } = useMusic();
    const { chordDisplayMode: currentMode } = musicState;
    return (
        <div className="chord-display-mode-toggle">
            <button
                className={`chord-display-mode-btn ${
                    currentMode === "select" ? "active" : ""
                }`}
                onClick={() => musicActions.setChordDisplayMode("select")}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span>Select</span>
            </button>
            <button
                className={`chord-display-mode-btn ${
                    currentMode === "build" ? "active" : ""
                }`}
                onClick={() => musicActions.setChordDisplayMode("build")}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Build</span>
            </button>
        </div>
    );
}
