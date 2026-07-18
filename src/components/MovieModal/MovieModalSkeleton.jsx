import "./MovieModal.css";

function MovieModalSkeleton() {
    return (
        <div
            className="movie-modal__body movie-modal-skeleton"
            aria-label="Загрузка информации о фильме"
            aria-busy="true"
        >
            <div className="movie-modal-skeleton__poster" />

            <div className="movie-modal-skeleton__details">
                <div className="movie-modal-skeleton__title" />

                <div className="movie-modal-skeleton__favorite" />

                <div className="movie-modal-skeleton__meta" />

                <div className="movie-modal-skeleton__genres">
                    <div className="movie-modal-skeleton__genre" />
                    <div className="movie-modal-skeleton__genre" />
                    <div className="movie-modal-skeleton__genre" />
                </div>

                <div className="movie-modal-skeleton__rating" />

                <div className="movie-modal-skeleton__facts">
                    <div />
                    <div />
                    <div />
                    <div />
                </div>

                <div className="movie-modal-skeleton__plot">
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
            </div>
        </div>
    );
}

export default MovieModalSkeleton;
