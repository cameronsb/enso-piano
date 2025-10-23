import { useMusic } from "../contexts/MusicContext";
import { useProgressionPlayer } from "../hooks/useProgressionPlayer";

import type { NoteSubdivision } from "../contexts/MusicContext";

export function PlaybackControls() {
    const { state, actions } = useMusic();
    const { togglePlayPause, stop, isPlaying } = useProgressionPlayer();
    const { tempo, loop, subdivision } = state.playbackState;
    const { chordProgression } = state;

    const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        actions.setTempo(Number(e.target.value));
    };

    const handleSubdivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        actions.setSubdivision(e.target.value as NoteSubdivision);
    };

    const disabled = chordProgression.length === 0;

    return (
        <div className="playback-controls">
            <div className="playback-buttons">
                <button
                    className={`playback-btn ${isPlaying ? "playing" : ""}`}
                    onClick={togglePlayPause}
                    disabled={disabled}
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="none"
                        >
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="none"
                        >
                            <polygon points="5,3 19,12 5,21" />
                        </svg>
                    )}
                </button>

                <button
                    className="playback-btn"
                    onClick={stop}
                    disabled={disabled}
                    aria-label="Stop"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <rect x="6" y="6" width="12" height="12" />
                    </svg>
                </button>

                <button
                    className={`playback-btn loop-btn ${loop ? "active" : ""}`}
                    onClick={actions.toggleLoop}
                    disabled={disabled}
                    aria-label="Toggle loop"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M17 1l4 4-4 4" />
                        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                        <path d="M7 23l-4-4 4-4" />
                        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                </button>
            </div>

            <div className="tempo-control">
                <label htmlFor="tempo-slider" className="tempo-label">
                    <span className="tempo-icon">♩</span> = {tempo} BPM
                </label>
                <input
                    id="tempo-slider"
                    type="range"
                    min="40"
                    max="240"
                    value={tempo}
                    onChange={handleTempoChange}
                    className="tempo-slider"
                    disabled={disabled}
                />
            </div>

            <div className="subdivision-control">
                <label htmlFor="subdivision-select" className="subdivision-label">
                    Note Value
                </label>
                <select
                    id="subdivision-select"
                    value={subdivision}
                    onChange={handleSubdivisionChange}
                    className="subdivision-select"
                    disabled={disabled}
                >
                    <option value="whole">𝅝 Whole</option>
                    <option value="quarter">♩ Quarter</option>
                    <option value="eighth">♪ Eighth</option>
                </select>
            </div>
        </div>
    );
}
