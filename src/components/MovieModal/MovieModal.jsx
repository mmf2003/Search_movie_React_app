import { useEffect, useState } from "react";
import "./MovieModal.css";

function MovieModal({ movie, isLoading, error, onClose }) {
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
        <div className="movie-modal" onClick={handleBackdropClick}>
            <div
                className="movie-modal__content"
                role="dialog"
                aria-modal="true"
                aria-label="Подробная информация о фильме"
            >
                <button
                    className="movie-modal__close"
                    type="button"
                    onClick={onClose}
                    aria-label="Закрыть модальное окно"
                >
                    ✕
                </button>

                {isLoading && (
                    <p className="movie-modal__message">
                        Загружаем информацию...
                    </p>
                )}

                {error && (
                    <p className="movie-modal__message movie-modal__message--error">
                        {error}
                    </p>
                )}

                {!isLoading && !error && movie && (
                    <div className="movie-modal__body">
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

                            <p className="movie-modal__meta">
                                {movie.Year} · {movie.Runtime} · {movie.Rated}
                            </p>

                            <p>
                                <strong>Жанр:</strong> {movie.Genre}
                            </p>

                            <p>
                                <strong>Режиссёр:</strong> {movie.Director}
                            </p>

                            <p>
                                <strong>Актёры:</strong> {movie.Actors}
                            </p>

                            <p>
                                <strong>Страна:</strong> {movie.Country}
                            </p>

                            <p>
                                <strong>IMDb:</strong> {movie.imdbRating}
                            </p>

                            <p className="movie-modal__plot">{movie.Plot}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieModal;
