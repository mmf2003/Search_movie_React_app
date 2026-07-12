const API_KEY = "52d31e9";
const BASE_URL = "https://www.omdbapi.com/";

export async function searchMovies(query, page = 1, signal) {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        return {
            movies: [],
            totalResults: 0,
        };
    }

    const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
            trimmedQuery,
        )}&page=${page}`,
        { signal },
    );

    if (!response.ok) {
        throw new Error("Не удалось подключиться к серверу");
    }

    const data = await response.json();

    if (data.Response === "False") {
        if (data.Error === "Movie not found!") {
            return {
                movies: [],
                totalResults: 0,
            };
        }

        throw new Error(data.Error || "Произошла ошибка при поиске");
    }

    return {
        movies: data.Search,
        totalResults: Number(data.totalResults),
    };
}

export async function getMovieDetails(imdbID) {
    const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`,
    );

    if (!response.ok) {
        throw new Error("Не удалось получить информацию о фильме");
    }

    const data = await response.json();

    if (data.Response === "False") {
        throw new Error(data.Error || "Информация о фильме не найдена");
    }

    return data;
}
