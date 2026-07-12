import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) {
        return null;
    }

    const getVisiblePages = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, "...", totalPages];
        }

        if (currentPage >= totalPages - 3) {
            return [
                1,
                "...",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        }

        return [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
        ];
    };

    const visiblePages = getVisiblePages();

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <nav
            className="pagination"
            aria-label="Навигация по страницам результатов"
        >
            <button
                className="pagination__button pagination__button--arrow"
                type="button"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                aria-label="Предыдущая страница"
            >
                <svg
                    className="pagination__icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        d="M15 18L9 12L15 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            <div className="pagination__pages">
                {visiblePages.map((page, index) => {
                    if (page === "...") {
                        return (
                            <span
                                className="pagination__ellipsis"
                                key={`ellipsis-${index}`}
                                aria-hidden="true"
                            >
                                …
                            </span>
                        );
                    }

                    const isActive = page === currentPage;

                    return (
                        <button
                            className={`pagination__page ${
                                isActive ? "pagination__page--active" : ""
                            }`}
                            type="button"
                            key={page}
                            onClick={() => onPageChange(page)}
                            aria-label={`Перейти на страницу ${page}`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <button
                className="pagination__button pagination__button--arrow"
                type="button"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                aria-label="Следующая страница"
            >
                <svg
                    className="pagination__icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        d="M9 18L15 12L9 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </nav>
    );
}

export default Pagination;
