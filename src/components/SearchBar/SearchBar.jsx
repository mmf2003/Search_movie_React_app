import "./SearchBar.css";

function SearchBar({ query, onQueryChange }) {
    return (
        <div className="search-bar">
            <input
                className="search-bar__input"
                type="search"
                value={query}
                placeholder="Search for movies..."
                autoComplete="off"
                onChange={(event) => onQueryChange(event.target.value)}
            />
        </div>
    );
}

export default SearchBar;
