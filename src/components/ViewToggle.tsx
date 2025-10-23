import type { ViewMode } from "../types/music";

interface ViewToggleProps {
    currentView: ViewMode;
    onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
    return (
        <div className="view-toggle">
            <button
                className={`view-btn ${
                    currentView === "circular" ? "active" : ""
                }`}
                onClick={() => onViewChange("circular")}
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
                onClick={() => onViewChange("linear")}
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

