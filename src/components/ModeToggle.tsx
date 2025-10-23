import type { Mode } from "../types/music";

interface ModeToggleProps {
    currentMode: Mode;
    onModeChange: (mode: Mode) => void;
}

export function ModeToggle({ currentMode, onModeChange }: ModeToggleProps) {
    return (
        <div className="mode-toggle">
            <button
                className={`mode-btn ${
                    currentMode === "major" ? "active" : ""
                }`}
                onClick={() => onModeChange("major")}
            >
                Major
            </button>
            <button
                className={`mode-btn ${
                    currentMode === "minor" ? "active" : ""
                }`}
                onClick={() => onModeChange("minor")}
            >
                Minor
            </button>
        </div>
    );
}
