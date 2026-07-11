import { useState } from "react";
import "./FavoriteCard.css";

function FavoriteCard({ movie, onMovieSelect, onToggleFavorite }) {
    const [posterError, setPosterError] = useState(false);

    const hasPoster = movie.Poster && movie.Poster !== "N/A" && !posterError;

    const handleOpenMovie = () => {
        onMovieSelect(movie.imdbID);
    };

    const handleFavoriteRemove = (event) => {
        event.stopPropagation();
        onToggleFavorite(movie);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOpenMovie();
        }
    };

    return (
        <article
            className="favorite-card"
            role="button"
            tabIndex={0}
            onClick={handleOpenMovie}
            onKeyDown={handleKeyDown}
        >
            <button
                className="favorite-card__remove"
                type="button"
                onClick={handleFavoriteRemove}
                aria-label={`Удалить ${movie.Title} из избранного`}
            >
                ♥
            </button>

            <div className="favorite-card__poster-wrapper">
                {hasPoster ? (
                    <img
                        className="favorite-card__poster"
                        src={movie.Poster}
                        alt={`Постер фильма ${movie.Title}`}
                        onError={() => setPosterError(true)}
                    />
                ) : (
                    <div className="favorite-card__placeholder">
                        Нет постера
                    </div>
                )}
            </div>

            <h3 className="favorite-card__title">{movie.Title}</h3>
        </article>
    );
}

export default FavoriteCard;
