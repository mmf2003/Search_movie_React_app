import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import { searchMovies } from "./services/api";
import "./App.css";
import MovieCard from "./components/MovieCard/MovieCard";

function App() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (query.trim().length < 3) {
            setMovies([]);
            setError("");
            setIsLoading(false);
            return;
        }

        const loadMovies = async () => {
            try {
                setIsLoading(true);
                setError("");

                const moviesData = await searchMovies(query);

                setMovies(moviesData);
            } catch (error) {
                setMovies([]);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadMovies();
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

                <SearchBar query={query} onQueryChange={setQuery} />
            </section>

            <section className="results">
                {query.trim().length > 0 && query.trim().length < 3 && (
                    <p className="results__message">
                        Введите минимум 3 символа
                    </p>
                )}

                {isLoading && <p className="results__message">Загрузка...</p>}

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

                <div className="movies">
                    {movies.map((movie) => (
                        <MovieCard key={movie.imdbID} movie={movie} />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default App;
