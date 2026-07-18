import { AnimatePresence, motion } from "motion/react";
import FavoriteCard from "../FavoriteCard/FavoriteCard";
import "./Favorites.css";

function Favorites({ favorites, onMovieSelect, onToggleFavorite }) {
    return (
        <motion.section
            className="favorites"
            initial={{
                opacity: 0,
                y: 16,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                y: 10,
            }}
            transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            <div className="favorites__header">
                <div>
                    <p className="favorites__label">Your Collection</p>

                    <h2 className="favorites__title">Favorites</h2>
                </div>

                <div className="favorites__meta">
                    <motion.span
                        key={favorites.length}
                        className="favorites__count"
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            duration: 0.22,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        {favorites.length}
                    </motion.span>

                    <button className="favorites__see-all" type="button">
                        See all →
                    </button>
                </div>
            </div>

            <div className="favorites__track">
                <AnimatePresence initial={false} mode="popLayout">
                    {favorites.map((movie) => (
                        <motion.div
                            className="favorites__item"
                            key={movie.imdbID}
                            layout="position"
                            initial={{
                                opacity: 0,
                                scale: 0.96,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.96,
                            }}
                            transition={{
                                layout: {
                                    type: "spring",
                                    stiffness: 120,
                                    damping: 16,
                                },
                                opacity: {
                                    duration: 0.25,
                                },
                                scale: {
                                    duration: 0.25,
                                },
                            }}
                        >
                            <FavoriteCard
                                movie={movie}
                                onMovieSelect={onMovieSelect}
                                onToggleFavorite={onToggleFavorite}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.section>
    );
}

export default Favorites;
