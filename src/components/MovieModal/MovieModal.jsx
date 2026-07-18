import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import "./MovieModal.css";
import MovieModalSkeleton from "./MovieModalSkeleton";

function MovieModal({
    movie,
    isLoading,
    error,
    isFavorite,
    onToggleFavorite,
    onClose,
}) {
    const [posterError, setPosterError] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const hasPoster = movie?.Poster && movie.Poster !== "N/A" && !posterError;

    return (
        <motion.div
            className="movie-modal"
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.22,
                ease: "easeOut",
            }}
        >
            <motion.div
                className="movie-modal__content"
                role="dialog"
                aria-modal="true"
                aria-label="Подробная информация о фильме"
                initial={{
                    opacity: 0,
                    y: 12,
                    scale: 0.985,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                }}
                exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.99,
                }}
                transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                }}
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    className="movie-modal__close"
                    type="button"
                    onClick={onClose}
                    aria-label="Закрыть модальное окно"
                >
                    ✕
                </button>

                <AnimatePresence mode="wait" initial={false}>
                    {isLoading && (
                        <motion.div
                            key="skeleton"
                            className="movie-modal__state-wrapper"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                        >
                            <MovieModalSkeleton />
                        </motion.div>
                    )}

                    {!isLoading && error && (
                        <motion.div
                            key="error"
                            className="movie-modal__state-wrapper"
                            initial={{
                                opacity: 0,
                                y: 8,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.22,
                            }}
                        >
                            <p className="movie-modal__message movie-modal__message--error">
                                {error}
                            </p>
                        </motion.div>
                    )}

                    {!isLoading && !error && movie && (
                        <motion.div
                            key={movie.imdbID}
                            className="movie-modal__body"
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                        >
                            <div className="movie-modal__poster-wrapper">
                                {hasPoster ? (
                                    <img
                                        className="movie-modal__poster"
                                        src={movie.Poster}
                                        alt={`Постер фильма ${movie.Title}`}
                                        onError={() => setPosterError(true)}
                                    />
                                ) : (
                                    <div className="movie-modal__placeholder">
                                        Постер отсутствует
                                    </div>
                                )}
                            </div>

                            <div className="movie-modal__details">
                                <h2 className="movie-modal__title">
                                    {movie.Title}
                                </h2>

                                <div className="movie-modal__actions">
                                    <button
                                        className={`movie-modal__favorite ${
                                            isFavorite
                                                ? "movie-modal__favorite--active"
                                                : ""
                                        }`}
                                        type="button"
                                        onClick={() => onToggleFavorite(movie)}
                                        aria-pressed={isFavorite}
                                    >
                                        {isFavorite
                                            ? "♥ В избранном"
                                            : "♡ В избранное"}
                                    </button>

                                    <Link
                                        className="movie-modal__page-link"
                                        to={`/movie/${movie.imdbID}`}
                                        onClick={onClose}
                                    >
                                        Open full page →
                                    </Link>
                                </div>

                                <p className="movie-modal__meta">
                                    {movie.Year} · {movie.Runtime} ·{" "}
                                    {movie.Rated}
                                </p>

                                <div className="movie-modal__genres">
                                    {movie.Genre !== "N/A" &&
                                        movie.Genre.split(", ").map((genre) => (
                                            <span
                                                className="movie-modal__genre"
                                                key={genre}
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                </div>

                                <div className="movie-modal__rating">
                                    <span className="movie-modal__rating-star">
                                        ★
                                    </span>

                                    <div>
                                        <span className="movie-modal__rating-value">
                                            {movie.imdbRating !== "N/A"
                                                ? movie.imdbRating
                                                : "—"}
                                        </span>

                                        <span className="movie-modal__rating-scale">
                                            {" "}
                                            / 10
                                        </span>

                                        <p className="movie-modal__rating-label">
                                            IMDb rating
                                        </p>
                                    </div>
                                </div>

                                <div className="movie-modal__facts">
                                    <p>
                                        <strong>Режиссёр:</strong>{" "}
                                        {movie.Director}
                                    </p>

                                    <p>
                                        <strong>Актёры:</strong> {movie.Actors}
                                    </p>

                                    <p>
                                        <strong>Страна:</strong> {movie.Country}
                                    </p>

                                    <p>
                                        <strong>Язык:</strong> {movie.Language}
                                    </p>
                                </div>

                                <p className="movie-modal__plot">
                                    {movie.Plot}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}

export default MovieModal;
