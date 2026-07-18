import { useState } from "react";
import { motion } from "motion/react";
import "./MovieCard.css";

function MovieCard({ movie, index, isFavorite, onSelect, onToggleFavorite }) {
    const [posterError, setPosterError] = useState(false);

    const hasPoster = movie.Poster && movie.Poster !== "N/A" && !posterError;

    const openMovie = () => {
        onSelect(movie.imdbID);
    };

    const handleFavoriteClick = (event) => {
        event.stopPropagation();
        onToggleFavorite(movie);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openMovie();
        }
    };

    return (
        <motion.article
            className="movie-card"
            role="button"
            tabIndex={0}
            onClick={openMovie}
            onKeyDown={handleKeyDown}
            initial={{
                opacity: 0,
                y: 12,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.45,
                delay: index * 0.045,
                ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
                y: -5,
            }}
            whileTap={{
                scale: 0.98,
            }}
        >
            <button
                className={`movie-card__favorite ${
                    isFavorite ? "movie-card__favorite--active" : ""
                }`}
                type="button"
                onClick={handleFavoriteClick}
                aria-label={
                    isFavorite
                        ? `Удалить ${movie.Title} из избранного`
                        : `Добавить ${movie.Title} в избранное`
                }
                aria-pressed={isFavorite}
            >
                {isFavorite ? "♥" : "♡"}
            </button>

            {hasPoster ? (
                <img
                    className="movie-card__poster"
                    src={movie.Poster}
                    alt={`Постер фильма ${movie.Title}`}
                    onError={() => setPosterError(true)}
                />
            ) : (
                <div className="movie-card__placeholder">
                    Постер отсутствует
                </div>
            )}

            <div className="movie-card__content">
                <h2 className="movie-card__title">{movie.Title}</h2>

                <p className="movie-card__info">Год: {movie.Year}</p>

                <p className="movie-card__info">Тип: {movie.Type}</p>
            </div>
        </motion.article>
    );
}

export default MovieCard;
