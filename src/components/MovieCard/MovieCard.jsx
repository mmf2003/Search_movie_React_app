import { useState } from "react";
import "./MovieCard.css";

function MovieCard({ movie, isFavorite, onSelect, onToggleFavorite }) {
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
        <article
            className="movie-card"
            role="button"
            tabIndex={0}
            onClick={openMovie}
            onKeyDown={handleKeyDown}
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
        </article>
    );
}

export default MovieCard;
