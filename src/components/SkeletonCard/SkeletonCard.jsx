import "./SkeletonCard.css";

function SkeletonCard() {
    return (
        <article className="skeleton-card" aria-hidden="true">
            <div className="skeleton-card__poster skeleton-animation" />

            <div className="skeleton-card__content">
                <div className="skeleton-card__title skeleton-animation" />
                <div className="skeleton-card__text skeleton-animation" />
                <div className="skeleton-card__text skeleton-card__text--short skeleton-animation" />
            </div>
        </article>
    );
}

export default SkeletonCard;
