const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

if (!API_KEY) {
    throw new Error("VITE_OMDB_API_KEY is not configured");
}

export async function searchMovies(query, page = 1, type = "", signal) {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        return {
            movies: [],
            totalResults: 0,
        };
    }

    const params = new URLSearchParams({
        apikey: API_KEY,
        s: trimmedQuery,
        page: String(page),
    });

    if (type) {
        params.set("type", type);
    }

    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
        signal,
    });

    if (!response.ok) {
        throw new Error("Unable to connect to the server");
    }

    const data = await response.json();

    if (data.Response === "False") {
        if (data.Error === "Movie not found!") {
            return {
                movies: [],
                totalResults: 0,
            };
        }

        throw new Error(data.Error || "An error occurred during the search");
    }

    return {
        movies: data.Search,
        totalResults: Number(data.totalResults),
    };
}

export async function getMovieDetails(imdbID, signal) {
    const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`,
        {
            signal,
        },
    );

    if (!response.ok) {
        throw new Error(
            "We were unable to find any information about the movie",
        );
    }

    const data = await response.json();

    if (data.Response === "False") {
        throw new Error(data.Error || "Информация о фильме не найдена");
    }

    return data;
}
