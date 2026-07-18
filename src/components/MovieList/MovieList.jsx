import MovieCard from "../MovieCard/MovieCard";
import "./MovieList.css";

function MovieList({ movies, onMovieSelect, favorites, onToggleFavorite }) {
    return (
        <div className="movies">
            {movies.map((movie, index) => {
                const movieIsFavorite = favorites.some(
                    (favorite) => favorite.imdbID === movie.imdbID,
                );

                return (
                    <MovieCard
                        key={movie.imdbID}
                        movie={movie}
                        index={index}
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
