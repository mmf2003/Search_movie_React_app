const API_KEY = "52d31e9";
const BASE_URL = "https://www.omdbapi.com/";

export async function searchMovies(query) {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        return [];
    }

    const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(trimmedQuery)}`,
    );

    if (!response.ok) {
        throw new Error("Не удалось подключиться к серверу");
    }

    const data = await response.json();

    if (data.Response === "False") {
        if (data.Error === "Movie not found!") {
            return [];
        }

        throw new Error(data.Error || "Произошла ошибка при поиске");
    }

    return data.Search;
}
