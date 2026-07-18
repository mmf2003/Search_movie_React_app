import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieDetails } from "../../services/api";
import "./MovieDetailsPage.css";

function MovieDetailsPage() {
    const { imdbID } = useParams();

    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [posterError, setPosterError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const loadMovie = async () => {
            try {
                setIsLoading(true);
                setError("");

                const movieDetails = await getMovieDetails(
                    imdbID,
                    controller.signal,
                );

                setMovie(movieDetails);
            } catch (error) {
                if (error.name === "AbortError") {
                    return;
                }

                setError(error.message);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        loadMovie();

        return () => {
            controller.abort();
        };
    }, [imdbID]);

    if (isLoading) {
        return (
            <main className="movie-page">
                <p className="movie-page__status">Loading movie...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="movie-page">
                <Link className="movie-page__back" to="/">
                    ← Back to search
                </Link>

                <p className="movie-page__status movie-page__status--error">
                    {error}
                </p>
            </main>
        );
    }

    if (!movie) {
        return null;
    }

    const hasPoster = movie.Poster && movie.Poster !== "N/A" && !posterError;

    return (
        <main className="movie-page">
            <Link className="movie-page__back" to="/">
                ← Back to search
            </Link>

            <article className="movie-page__card">
                <div className="movie-page__poster-wrapper">
                    {hasPoster ? (
                        <img
                            className="movie-page__poster"
                            src={movie.Poster}
                            alt={`Poster of ${movie.Title}`}
                            onError={() => setPosterError(true)}
                        />
                    ) : (
                        <div className="movie-page__poster-placeholder">
                            No poster
                        </div>
                    )}
                </div>

                <div className="movie-page__content">
                    <p className="movie-page__type">{movie.Type}</p>

                    <h1 className="movie-page__title">{movie.Title}</h1>

                    <div className="movie-page__meta">
                        <span>{movie.Year}</span>

                        {movie.Runtime !== "N/A" && (
                            <span>{movie.Runtime}</span>
                        )}

                        {movie.Rated !== "N/A" && <span>{movie.Rated}</span>}
                    </div>

                    {movie.imdbRating !== "N/A" && (
                        <p className="movie-page__rating">
                            <span>★</span>
                            IMDb {movie.imdbRating}
                        </p>
                    )}

                    {movie.Genre !== "N/A" && (
                        <div className="movie-page__genres">
                            {movie.Genre.split(", ").map((genre) => (
                                <span key={genre}>{genre}</span>
                            ))}
                        </div>
                    )}

                    {movie.Plot !== "N/A" && (
                        <p className="movie-page__plot">{movie.Plot}</p>
                    )}

                    <dl className="movie-page__details">
                        {movie.Director !== "N/A" && (
                            <>
                                <dt>Director</dt>
                                <dd>{movie.Director}</dd>
                            </>
                        )}

                        {movie.Writer !== "N/A" && (
                            <>
                                <dt>Writer</dt>
                                <dd>{movie.Writer}</dd>
                            </>
                        )}

                        {movie.Actors !== "N/A" && (
                            <>
                                <dt>Actors</dt>
                                <dd>{movie.Actors}</dd>
                            </>
                        )}

                        {movie.Country !== "N/A" && (
                            <>
                                <dt>Country</dt>
                                <dd>{movie.Country}</dd>
                            </>
                        )}

                        {movie.Language !== "N/A" && (
                            <>
                                <dt>Language</dt>
                                <dd>{movie.Language}</dd>
                            </>
                        )}
                    </dl>
                </div>
            </article>
        </main>
    );
}

export default MovieDetailsPage;
