import "./SearchBar.css";

function SearchBar({ query, onQueryChange }) {
    return (
        <div className="search-bar">
            <input
                className="search-bar__input"
                type="text"
                placeholder="Search for movies..."
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
            />
        </div>
    );
}

export default SearchBar;
