import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getMovieDetails, searchMovies } from "./api";

beforeEach(() => {
    globalThis.fetch = vi.fn();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe("searchMovies", () => {
    it("returns an empty result for an empty query", async () => {
        const result = await searchMovies("   ");

        expect(result).toEqual({
            movies: [],
            totalResults: 0,
        });

        expect(fetch).not.toHaveBeenCalled();
    });

    it("returns movies and total results after a successful request", async () => {
        const apiResponse = {
            Response: "True",
            Search: [
                {
                    Title: "The Matrix",
                    Year: "1999",
                    imdbID: "tt0133093",
                    Type: "movie",
                    Poster: "poster.jpg",
                },
            ],
            totalResults: "1",
        };

        fetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(apiResponse),
        });

        const result = await searchMovies("matrix", 2, "movie");

        expect(result).toEqual({
            movies: apiResponse.Search,
            totalResults: 1,
        });

        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("includes query, page and type in the request URL", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                Response: "True",
                Search: [],
                totalResults: "0",
            }),
        });

        await searchMovies("the matrix", 3, "movie");

        const [requestUrl] = fetch.mock.calls[0];
        const url = new URL(requestUrl);

        expect(url.searchParams.get("apikey")).toBe("test-api-key");
        expect(url.searchParams.get("s")).toBe("the matrix");
        expect(url.searchParams.get("page")).toBe("3");
        expect(url.searchParams.get("type")).toBe("movie");
    });

    it("passes AbortSignal to fetch", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                Response: "True",
                Search: [],
                totalResults: "0",
            }),
        });

        const controller = new AbortController();

        await searchMovies("matrix", 1, "", controller.signal);

        expect(fetch).toHaveBeenCalledWith(expect.any(String), {
            signal: controller.signal,
        });
    });

    it("returns an empty result when the API reports Movie not found", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                Response: "False",
                Error: "Movie not found!",
            }),
        });

        await expect(searchMovies("unknown movie")).resolves.toEqual({
            movies: [],
            totalResults: 0,
        });
    });

    it("throws an API error for other unsuccessful responses", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                Response: "False",
                Error: "Too many results.",
            }),
        });

        await expect(searchMovies("star")).rejects.toThrow("Too many results.");
    });

    it("throws when the HTTP response is not successful", async () => {
        fetch.mockResolvedValue({
            ok: false,
        });

        await expect(searchMovies("matrix")).rejects.toThrow(
            "Не удалось подключиться к серверу",
        );
    });
});

describe("getMovieDetails", () => {
    it("returns movie details after a successful request", async () => {
        const movie = {
            Title: "The Matrix",
            Year: "1999",
            imdbID: "tt0133093",
            Plot: "A computer hacker learns the truth.",
            Response: "True",
        };

        fetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(movie),
        });

        const result = await getMovieDetails("tt0133093");

        expect(result).toEqual(movie);
    });

    it("includes the movie ID and full plot in the URL", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                Response: "True",
                imdbID: "tt0133093",
            }),
        });

        await getMovieDetails("tt0133093");

        const [requestUrl] = fetch.mock.calls[0];
        const url = new URL(requestUrl);

        expect(url.searchParams.get("apikey")).toBe("test-api-key");
        expect(url.searchParams.get("i")).toBe("tt0133093");
        expect(url.searchParams.get("plot")).toBe("full");
    });

    it("passes AbortSignal to fetch", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                Response: "True",
                imdbID: "tt0133093",
            }),
        });

        const controller = new AbortController();

        await getMovieDetails("tt0133093", controller.signal);

        expect(fetch).toHaveBeenCalledWith(expect.any(String), {
            signal: controller.signal,
        });
    });

    it("throws when the HTTP response is not successful", async () => {
        fetch.mockResolvedValue({
            ok: false,
        });

        await expect(getMovieDetails("tt0133093")).rejects.toThrow(
            "Не удалось получить информацию о фильме",
        );
    });

    it("throws when the API reports an error", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                Response: "False",
                Error: "Incorrect IMDb ID.",
            }),
        });

        await expect(getMovieDetails("incorrect-id")).rejects.toThrow(
            "Incorrect IMDb ID.",
        );
    });
});
