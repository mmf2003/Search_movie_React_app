import FavoriteCard from "../FavoriteCard/FavoriteCard";
import "./Favorites.css";

function Favorites({ favorites, onMovieSelect, onToggleFavorite }) {
    return (
        <section className="favorites">
            <div className="favorites__header">
                <div>
                    <p className="favorites__label">Your Collection</p>

                    <h2 className="favorites__title">Favorites</h2>
                </div>

                <div className="favorites__meta">
                    <span className="favorites__count">{favorites.length}</span>

                    <button className="favorites__see-all" type="button">
                        See all →
                    </button>
                </div>
            </div>

            <div className="favorites__track">
                {favorites.map((movie) => (
                    <FavoriteCard
                        key={movie.imdbID}
                        movie={movie}
                        onMovieSelect={onMovieSelect}
                        onToggleFavorite={onToggleFavorite}
                    />
                ))}
            </div>
        </section>
    );
}

export default Favorites;
