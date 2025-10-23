import { useUI } from "../contexts/UIContext";

export function ViewToggle() {
    const { state: uiState, actions: uiActions } = useUI();
    const { viewMode: currentView } = uiState;
    return (
        <div className="view-toggle">
            <button
                className={`view-btn ${
                    currentView === "circular" ? "active" : ""
                }`}
                onClick={() => uiActions.setViewMode("circular")}
                title="Circular piano layout"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                </svg>
                <span>Circular</span>
            </button>
            <button
                className={`view-btn ${
                    currentView === "linear" ? "active" : ""
                }`}
                onClick={() => uiActions.setViewMode("linear")}
                title="Traditional piano layout"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <rect x="2" y="6" width="4" height="12" />
                    <rect x="7" y="6" width="4" height="12" />
                    <rect x="12" y="6" width="4" height="12" />
                    <rect x="17" y="6" width="4" height="12" />
                </svg>
                <span>Piano</span>
            </button>
        </div>
    );
}
