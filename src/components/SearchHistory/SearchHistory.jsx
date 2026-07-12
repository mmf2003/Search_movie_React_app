import { useState } from "react";
import "./SearchHistory.css";

function SearchHistory({ history, onSelect, onClear }) {
    const [isOpen, setIsOpen] = useState(true);

    if (history.length === 0) {
        return null;
    }

    return (
        <section className="search-history">
            <button
                className="search-history__toggle"
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
            >
                <span>Recent searches</span>

                <svg
                    className={`search-history__chevron ${
                        isOpen ? "search-history__chevron--open" : ""
                    }`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        d="M6 9L12 15L18 9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div className="search-history__list">
                        {history.map((item) => (
                            <button
                                key={item}
                                className="search-history__item"
                                type="button"
                                onClick={() => onSelect(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <div className="search-history__footer">
                        <button
                            className="search-history__clear"
                            type="button"
                            onClick={onClear}
                        >
                            Clear
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}

export default SearchHistory;
