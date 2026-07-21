import "./TypeFilter.css";

const filterOptions = [
    { label: "All", value: "" },
    { label: "Movies", value: "movie" },
    { label: "Series", value: "series" },
    { label: "Episodes", value: "episode" },
];

function TypeFilter({ value, onChange, disabled = false }) {
    return (
        <div
            className="type-filter"
            role="group"
            aria-label="Filter by content type"
        >
            {filterOptions.map((option) => {
                const isActive = value === option.value;

                return (
                    <button
                        className={`type-filter__button ${
                            isActive ? "type-filter__button--active" : ""
                        }`}
                        type="button"
                        key={option.value || "all"}
                        onClick={() => onChange(option.value)}
                        disabled={disabled}
                        aria-pressed={isActive}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

export default TypeFilter;
