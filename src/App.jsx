import { useState } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import "./App.css";

function App() {
    const [query, setQuery] = useState("");

    return (
        <main className="app">
            <section className="hero">
                <p className="hero__label">OMDb Movie Database</p>

                <h1 className="hero__title">
                    Find your next
                    <span> favourite movie</span>
                </h1>

                <p className="hero__description">
                    Start typing a movie title to see search results in real
                    time.
                </p>

                <SearchBar query={query} onQueryChange={setQuery} />

                {query && (
                    <p className="hero__query">
                        You are searching for: <strong>{query}</strong>
                    </p>
                )}
            </section>
        </main>
    );
}

export default App;
