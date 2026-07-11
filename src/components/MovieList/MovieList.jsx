import MovieCard from "../MovieCard/MovieCard";
import "./MovieList.css";

function MovieList({ movies, onMovieSelect, favorites, onToggleFavorite }) {
    return (
        <div className="movies">
            {movies.map((movie) => {
                const movieIsFavorite = favorites.some(
                    (favorite) => favorite.imdbID === movie.imdbID,
                );

                return (
                    <MovieCard
                        key={movie.imdbID}
                        movie={movie}
                        isFavorite={movieIsFavorite}
                        onSelect={onMovieSelect}
                        onToggleFavorite={onToggleFavorite}
                    />
                );
            })}
        </div>
    );
}

export default MovieList;
