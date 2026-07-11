import MovieCard from "../MovieCard/MovieCard";
import "./MovieList.css";

function MovieList({ movies, onMovieSelect }) {
    return (
        <div className="movies">
            {movies.map((movie) => (
                <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    onSelect={onMovieSelect}
                />
            ))}
        </div>
    );
}

export default MovieList;
