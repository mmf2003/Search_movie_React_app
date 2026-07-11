import { useState } from "react";
import "./MovieCard.css";

function MovieCard({ movie, onSelect }) {
    const [posterError, setPosterError] = useState(false);

    const hasPoster = movie.Poster !== "N/A" && !posterError;

    return (
        <article
            className="movie-card"
            role="button"
            tabIndex={0}
            onClick={() => onSelect(movie.imdbID)}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    onSelect(movie.imdbID);
                }
            }}
        >
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
