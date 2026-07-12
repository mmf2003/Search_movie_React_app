import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import MovieList from "./components/MovieList/MovieList";
import useDebounce from "./hooks/useDebounce";
import SkeletonList from "./components/SkeletonList/SkeletonList";
import useLocalStorage from "./hooks/useLocalStorage";
import Favorites from "./components/Favorites/Favorites";
import Pagination from "./components/Pagination/Pagination";
import "./App.css";

import { getMovieDetails, searchMovies } from "./services/api";
import MovieModal from "./components/MovieModal/MovieModal";

function App() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const debouncedQuery = useDebounce(query, 500);
    const totalPages = Math.ceil(totalResults / 10);
    const [favorites, setFavorites] = useLocalStorage("movie-favorites", []);

    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);
        setCurrentPage(1);

        if (newQuery.trim().length < 3) {
            setMovies([]);
            setTotalResults(0);
            setError("");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError("");
    };

    const handleMovieSelect = async (imdbID) => {
        try {
            setIsModalOpen(true);
            setIsDetailsLoading(true);
            setDetailsError("");
            setSelectedMovie(null);

            const movieDetails = await getMovieDetails(imdbID);

            setSelectedMovie(movieDetails);
        } catch (error) {
            setDetailsError(error.message);
        } finally {
            setIsDetailsLoading(false);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
        setDetailsError("");
    };

    const isFavorite = (imdbID) => {
        return favorites.some((favorite) => favorite.imdbID === imdbID);
    };

    const toggleFavorite = (movie) => {
        setFavorites((currentFavorites) => {
            const movieIsFavorite = currentFavorites.some(
                (favorite) => favorite.imdbID === movie.imdbID,
            );

            if (movieIsFavorite) {
                return currentFavorites.filter(
                    (favorite) => favorite.imdbID !== movie.imdbID,
                );
            }

            return [...currentFavorites, movie];
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);

        window.scrollTo({
            top: 500,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const normalizedQuery = debouncedQuery.trim();

        if (normalizedQuery.length < 3) {
            return;
        }

        const controller = new AbortController();

        const loadMovies = async () => {
            try {
                setError("");

                const searchResult = await searchMovies(
                    normalizedQuery,
                    currentPage,
                    controller.signal,
                );

                setMovies(searchResult.movies);
                setTotalResults(searchResult.totalResults);
            } catch (error) {
                if (error.name === "AbortError") {
                    return;
                }

                setMovies([]);
                setError(error.message);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        loadMovies();

        return () => {
            controller.abort();
        };
    }, [debouncedQuery, currentPage]);

    return (
        <main className="app">
            <section className="hero">
                <p className="hero__label">OMDb Movie Database</p>

                <h1 className="hero__title">
                    Find your next
                    <span> favourite movie</span>
                </h1>

                <p className="hero__description">
                    Start typing a movie title to see search results in real
                    time.
                </p>

                <SearchBar query={query} onQueryChange={handleQueryChange} />

                {query.trim().length > 0 && query.trim().length < 3 && (
                    <p className="hero__message">Введите минимум 3 символа</p>
                )}
            </section>

            {favorites.length > 0 && (
                <Favorites
                    favorites={favorites}
                    onMovieSelect={handleMovieSelect}
                    onToggleFavorite={toggleFavorite}
                />
            )}

            <section className="results">
                {isLoading && <SkeletonList count={10} />}

                {!isLoading && error && (
                    <p className="results__message results__message--error">
                        {error}
                    </p>
                )}

                {!isLoading &&
                    !error &&
                    query.trim().length >= 3 &&
                    movies.length === 0 && (
                        <p className="results__message">Фильмы не найдены</p>
                    )}

                {!isLoading && !error && movies.length > 0 && (
                    <>
                        <MovieList
                            movies={movies}
                            onMovieSelect={handleMovieSelect}
                            favorites={favorites}
                            onToggleFavorite={toggleFavorite}
                        />

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </section>

            {isModalOpen && (
                <MovieModal
                    key={selectedMovie?.imdbID || "movie-modal"}
                    movie={selectedMovie}
                    isLoading={isDetailsLoading}
                    error={detailsError}
                    isFavorite={
                        selectedMovie ? isFavorite(selectedMovie.imdbID) : false
                    }
                    onToggleFavorite={toggleFavorite}
                    onClose={handleModalClose}
                />
            )}
        </main>
    );
}

export default App;
