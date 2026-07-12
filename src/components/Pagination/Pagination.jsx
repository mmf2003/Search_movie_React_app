import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        onPageChange(currentPage + 1);
    };

    return (
        <nav
            className="pagination"
            aria-label="Навигация по страницам результатов"
        >
            <button
                className="pagination__button"
                type="button"
                onClick={handlePrevious}
                disabled={currentPage === 1}
            >
                ← Назад
            </button>

            <span className="pagination__info">
                Страница <strong>{currentPage}</strong> из{" "}
                <strong>{totalPages}</strong>
            </span>

            <button
                className="pagination__button"
                type="button"
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                Вперёд →
            </button>
        </nav>
    );
}

export default Pagination;
