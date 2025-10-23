import { useUI } from "../contexts/UIContext";

export function InteractionModeToggle() {
    const { state: uiState, actions: uiActions } = useUI();
    const { interactionMode: currentMode } = uiState;
    return (
        <div className="interaction-mode-toggle">
            <button
                className={`interaction-mode-btn ${
                    currentMode === "keySelection" ? "active" : ""
                }`}
                onClick={() => uiActions.setInteractionMode("keySelection")}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>Select Key</span>
            </button>
            <button
                className={`interaction-mode-btn ${
                    currentMode === "play" ? "active" : ""
                }`}
                onClick={() => uiActions.setInteractionMode("play")}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Play</span>
            </button>
        </div>
    );
}
