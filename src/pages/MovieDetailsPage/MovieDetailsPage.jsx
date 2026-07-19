import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";

import { getMovieDetails } from "../../services/api";
import "./MovieDetailsPage.css";

function MovieDetailsPage() {
    const { imdbID } = useParams();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [posterError, setPosterError] = useState(false);
    const [isLinkCopied, setIsLinkCopied] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadMovie = async () => {
            try {
                setIsLoading(true);
                setError("");

                const movieDetails = await getMovieDetails(imdbID);

                if (!isMounted) {
                    return;
                }

                setPosterError(false);
                setMovie(movieDetails);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setMovie(null);
                setError(error.message);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadMovie();

        return () => {
            isMounted = false;
        };
    }, [imdbID]);

    useEffect(() => {
        if (!movie) {
            return;
        }

        document.title = `${movie.Title} | Movie Search`;

        return () => {
            document.title = "Movie Search";
        };
    }, [movie]);

    const hasValue = (value) => {
        return Boolean(value && value !== "N/A");
    };

    if (isLoading) {
        return (
            <main className="movie-page movie-page--centered">
                <div
                    className="movie-page__loader"
                    aria-label="Loading movie"
                />

                <p className="movie-page__status">Loading movie...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="movie-page movie-page--centered">
                <p className="movie-page__status movie-page__status--error">
                    {error}
                </p>

                <Link className="movie-page__error-link" to="/">
                    ← Back to search
                </Link>
            </main>
        );
    }

    if (!movie) {
        return null;
    }

    const hasPoster = hasValue(movie.Poster) && !posterError;

    const hasStatistics =
        hasValue(movie.imdbVotes) ||
        hasValue(movie.Metascore) ||
        hasValue(movie.Released) ||
        hasValue(movie.DVD) ||
        hasValue(movie.Runtime) ||
        hasValue(movie.Rated);

    const hasProductionDetails =
        hasValue(movie.Director) ||
        hasValue(movie.Writer) ||
        hasValue(movie.Actors) ||
        hasValue(movie.Production) ||
        hasValue(movie.Country) ||
        hasValue(movie.Language);

    const hasRecognition = hasValue(movie.Awards) || hasValue(movie.BoxOffice);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);

            setIsLinkCopied(true);

            window.setTimeout(() => {
                setIsLinkCopied(false);
            }, 2000);
        } catch {
            setError("Failed to copy the link");
        }
    };

    return (
        <main className="movie-page">
            <section className="movie-page__hero">
                {hasPoster && (
                    <div
                        className="movie-page__backdrop"
                        style={{
                            backgroundImage: `url("${movie.Poster}")`,
                        }}
                        aria-hidden="true"
                    />
                )}

                <div className="movie-page__overlay" aria-hidden="true" />

                <motion.div
                    className="movie-page__hero-content"
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                >
                    <button
                        className="movie-page__back"
                        type="button"
                        onClick={handleBack}
                    >
                        ← Back to search
                    </button>

                    <div className="movie-page__hero-grid">
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
                                    No poster available
                                </div>
                            )}
                        </div>

                        <div className="movie-page__intro">
                            {hasValue(movie.Type) && (
                                <p className="movie-page__type">{movie.Type}</p>
                            )}

                            <h1 className="movie-page__title">{movie.Title}</h1>

                            <div className="movie-page__meta">
                                {hasValue(movie.Year) && (
                                    <span>{movie.Year}</span>
                                )}

                                {hasValue(movie.Runtime) && (
                                    <span>{movie.Runtime}</span>
                                )}

                                {hasValue(movie.Rated) && (
                                    <span>{movie.Rated}</span>
                                )}

                                {hasValue(movie.Released) && (
                                    <span>{movie.Released}</span>
                                )}
                            </div>

                            {hasValue(movie.Genre) && (
                                <div className="movie-page__genres">
                                    {movie.Genre.split(", ").map((genre) => (
                                        <span key={genre}>{genre}</span>
                                    ))}
                                </div>
                            )}

                            <div className="movie-page__hero-rating">
                                <span className="movie-page__hero-rating-star">
                                    ★
                                </span>

                                <div>
                                    <div>
                                        <strong>
                                            {hasValue(movie.imdbRating)
                                                ? movie.imdbRating
                                                : "—"}
                                        </strong>

                                        <span>/ 10</span>
                                    </div>

                                    <p>IMDb rating</p>
                                </div>
                            </div>

                            <div className="movie-page__actions">
                                <a
                                    className="movie-page__action movie-page__action--primary"
                                    href={`https://www.imdb.com/title/${movie.imdbID}/`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    View on IMDb ↗
                                </a>

                                <button
                                    className="movie-page__action movie-page__copy"
                                    type="button"
                                    onClick={handleCopyLink}
                                >
                                    {isLinkCopied
                                        ? "Link copied ✓"
                                        : "Copy link"}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            <div className="movie-page__main-content">
                <motion.section
                    className="movie-page__section"
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                        amount: 0.2,
                    }}
                    transition={{
                        duration: 0.45,
                    }}
                >
                    <p className="movie-page__section-label">Storyline</p>

                    <h2 className="movie-page__section-title">
                        About the movie
                    </h2>

                    <p className="movie-page__storyline">
                        {hasValue(movie.Plot)
                            ? movie.Plot
                            : "No storyline is available for this title."}
                    </p>
                </motion.section>

                {(hasProductionDetails || hasStatistics) && (
                    <section className="movie-page__information">
                        {hasProductionDetails && (
                            <motion.article
                                className="movie-page__info-card"
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                    amount: 0.2,
                                }}
                                transition={{
                                    duration: 0.45,
                                }}
                            >
                                <p className="movie-page__section-label">
                                    Credits
                                </p>

                                <h2 className="movie-page__card-title">
                                    Production details
                                </h2>

                                <dl className="movie-page__details-list">
                                    {hasValue(movie.Director) && (
                                        <div>
                                            <dt>Director</dt>
                                            <dd>{movie.Director}</dd>
                                        </div>
                                    )}

                                    {hasValue(movie.Writer) && (
                                        <div>
                                            <dt>Writer</dt>
                                            <dd>{movie.Writer}</dd>
                                        </div>
                                    )}

                                    {hasValue(movie.Actors) && (
                                        <div>
                                            <dt>Actors</dt>
                                            <dd>{movie.Actors}</dd>
                                        </div>
                                    )}

                                    {hasValue(movie.Production) && (
                                        <div>
                                            <dt>Production</dt>
                                            <dd>{movie.Production}</dd>
                                        </div>
                                    )}

                                    {hasValue(movie.Country) && (
                                        <div>
                                            <dt>Country</dt>
                                            <dd>{movie.Country}</dd>
                                        </div>
                                    )}

                                    {hasValue(movie.Language) && (
                                        <div>
                                            <dt>Language</dt>
                                            <dd>{movie.Language}</dd>
                                        </div>
                                    )}
                                </dl>
                            </motion.article>
                        )}

                        {hasStatistics && (
                            <motion.article
                                className="movie-page__info-card"
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                    amount: 0.2,
                                }}
                                transition={{
                                    duration: 0.45,
                                    delay: 0.08,
                                }}
                            >
                                <p className="movie-page__section-label">
                                    Performance
                                </p>

                                <h2 className="movie-page__card-title">
                                    Movie statistics
                                </h2>

                                <dl className="movie-page__details-list">
                                    {hasValue(movie.imdbVotes) && (
                                        <div>
                                            <dt>IMDb votes</dt>
                                            <dd>{movie.imdbVotes}</dd>
                                        </div>
                                    )}

                                    {hasValue(movie.Metascore) && (
                                        <div>
                                            <dt>Metascore</dt>
                                            <dd>{movie.Metascore}</dd>
                                        </div>
                                    )}

                                    {hasValue(movie.Released) && (
                                        <div>
                                            <dt>Released</dt>
                                            <dd>{movie.Released}</dd>
                                        </div>
                                    )}

                                    {hasValue(movie.DVD) && (
                                        <div>
                                            <dt>DVD release</dt>
                                            <dd>{movie.DVD}</dd>
                                        </div>
                                    )}

                                    {hasValue(movie.Runtime) && (
                                        <div>
                                            <dt>Runtime</dt>
                                            <dd>{movie.Runtime}</dd>
                                        </div>
                                    )}

                                    {hasValue(movie.Rated) && (
                                        <div>
                                            <dt>Age rating</dt>
                                            <dd>{movie.Rated}</dd>
                                        </div>
                                    )}
                                </dl>
                            </motion.article>
                        )}
                    </section>
                )}

                {movie.Ratings?.length > 0 && (
                    <motion.section
                        className="movie-page__section movie-page__section--bordered"
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.2,
                        }}
                        transition={{
                            duration: 0.45,
                        }}
                    >
                        <p className="movie-page__section-label">
                            Critical response
                        </p>

                        <h2 className="movie-page__section-title">Ratings</h2>

                        <div className="movie-page__ratings-grid">
                            {movie.Ratings.map((rating) => (
                                <article
                                    className="movie-page__rating-card"
                                    key={rating.Source}
                                >
                                    <span>{rating.Source}</span>
                                    <strong>{rating.Value}</strong>
                                </article>
                            ))}
                        </div>
                    </motion.section>
                )}

                {hasRecognition && (
                    <motion.section
                        className="movie-page__highlight"
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.2,
                        }}
                        transition={{
                            duration: 0.45,
                        }}
                    >
                        <div>
                            <p className="movie-page__section-label">
                                Recognition
                            </p>

                            <h2>Success and achievements</h2>
                        </div>

                        <div className="movie-page__highlight-grid">
                            {hasValue(movie.Awards) && (
                                <article>
                                    <span>Awards</span>
                                    <p>{movie.Awards}</p>
                                </article>
                            )}

                            {hasValue(movie.BoxOffice) && (
                                <article>
                                    <span>Box office</span>
                                    <strong>{movie.BoxOffice}</strong>
                                </article>
                            )}
                        </div>
                    </motion.section>
                )}
            </div>
        </main>
    );
}

export default MovieDetailsPage;
