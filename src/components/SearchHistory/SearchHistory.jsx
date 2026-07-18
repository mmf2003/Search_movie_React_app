import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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

                <motion.svg
                    className="search-history__chevron"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    animate={{
                        rotate: isOpen ? 180 : 0,
                    }}
                    transition={{
                        duration: 0.25,
                        ease: "easeInOut",
                    }}
                >
                    <path
                        d="M6 9L12 15L18 9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </motion.svg>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        className="search-history__content"
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            height: {
                                duration: 0.32,
                                ease: [0.22, 1, 0.36, 1],
                            },
                            opacity: {
                                duration: 0.2,
                            },
                        }}
                    >
                        <div className="search-history__list">
                            <AnimatePresence initial={false}>
                                {history.map((item) => (
                                    <motion.button
                                        key={item}
                                        className="search-history__item"
                                        type="button"
                                        onClick={() => onSelect(item)}
                                        initial={{
                                            opacity: 0,
                                            scale: 0.92,
                                            y: -5,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            scale: 0.92,
                                        }}
                                        transition={{
                                            duration: 0.2,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                    >
                                        {item}
                                    </motion.button>
                                ))}
                            </AnimatePresence>
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
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

export default SearchHistory;
