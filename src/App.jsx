import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import Loader from "./components/Loader/Loader";
import MovieList from "./components/MovieList/MovieList";
import { searchMovies } from "./services/api";
import "./App.css";

function App() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);

        if (newQuery.trim().length < 3) {
            setMovies([]);
            setError("");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (query.trim().length < 3) {
            return;
        }

        const timerId = setTimeout(async () => {
            try {
                setError("");

                const moviesData = await searchMovies(query);

                setMovies(moviesData);
            } catch (error) {
                setMovies([]);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [query]);

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
            </section>

            <section className="results">
                {query.trim().length > 0 && query.trim().length < 3 && (
                    <p className="results__message">
                        Введите минимум 3 символа
                    </p>
                )}

                {isLoading && <Loader />}

                {error && (
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
                    <MovieList movies={movies} />
                )}
            </section>
        </main>
    );
}

export default App;
