import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import SearchBar from "./components/SearchBar/SearchBar";
import MovieList from "./components/MovieList/MovieList";
import useDebounce from "./hooks/useDebounce";
import SkeletonList from "./components/SkeletonList/SkeletonList";
import useLocalStorage from "./hooks/useLocalStorage";
import Favorites from "./components/Favorites/Favorites";
import Pagination from "./components/Pagination/Pagination";
import TypeFilter from "./components/TypeFilter/TypeFilter";
import SearchHistory from "./components/SearchHistory/SearchHistory";
import "./App.css";

import { getMovieDetails, searchMovies } from "./services/api";
import MovieModal from "./components/MovieModal/MovieModal";

function App() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState("");
    const [totalResults, setTotalResults] = useState(0);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const debouncedQuery = useDebounce(query, 500);
    const totalPages = Math.ceil(totalResults / 10);
    const [favorites, setFavorites] = useLocalStorage("movie-favorites", []);
    const [searchHistory, setSearchHistory] = useLocalStorage(
        "movie-search-history",
        [],
    );
    const searchControllerRef = useRef(null);

    const resetSearchResults = () => {
        setMovies([]);
        setTotalResults(0);
        setError("");
        setIsLoading(false);
        setCurrentPage(1);
    };

    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);
        setCurrentPage(1);

        if (newQuery.trim().length < 3) {
            resetSearchResults();
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

    const handleTypeFilterChange = (type) => {
        setTypeFilter(type);
        setCurrentPage(1);

        if (query.trim().length >= 3) {
            setIsLoading(true);
            setError("");
        }
    };

    const handleHistorySelect = (historyQuery) => {
        handleQueryChange(historyQuery);
    };

    const handleClearHistory = () => {
        searchControllerRef.current?.abort();

        setSearchHistory([]);
        setQuery("");
        setTypeFilter("");
        resetSearchResults();
    };

    useEffect(() => {
        const normalizedQuery = debouncedQuery.trim();
        const currentQuery = query.trim();

        if (normalizedQuery.length < 3 || normalizedQuery !== currentQuery) {
            return;
        }

        searchControllerRef.current?.abort();

        const controller = new AbortController();
        searchControllerRef.current = controller;

        const loadMovies = async () => {
            try {
                setError("");

                const searchResult = await searchMovies(
                    normalizedQuery,
                    currentPage,
                    typeFilter,
                    controller.signal,
                );

                if (controller.signal.aborted) {
                    return;
                }

                setMovies(searchResult.movies);
                setTotalResults(searchResult.totalResults);

                if (searchResult.movies.length > 0) {
                    setSearchHistory((currentHistory) => {
                        const historyWithoutDuplicate = currentHistory.filter(
                            (item) =>
                                item.toLowerCase() !==
                                normalizedQuery.toLowerCase(),
                        );

                        return [
                            normalizedQuery,
                            ...historyWithoutDuplicate,
                        ].slice(0, 6);
                    });
                }
            } catch (error) {
                if (error.name === "AbortError") {
                    return;
                }

                setMovies([]);
                setTotalResults(0);
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
    }, [query, debouncedQuery, currentPage, typeFilter, setSearchHistory]);

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

                <TypeFilter
                    value={typeFilter}
                    onChange={handleTypeFilterChange}
                    disabled={query.trim().length < 3}
                />

                <SearchHistory
                    history={searchHistory}
                    onSelect={handleHistorySelect}
                    onClear={handleClearHistory}
                />

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

                {!isLoading &&
                    !error &&
                    query.trim().length >= 3 &&
                    movies.length > 0 && (
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

            <AnimatePresence>
                {isModalOpen && (
                    <MovieModal
                        key="movie-modal"
                        movie={selectedMovie}
                        isLoading={isDetailsLoading}
                        error={detailsError}
                        isFavorite={
                            selectedMovie
                                ? isFavorite(selectedMovie.imdbID)
                                : false
                        }
                        onToggleFavorite={toggleFavorite}
                        onClose={handleModalClose}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}

export default App;
