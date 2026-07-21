import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import MovieCard from "./MovieCard";

const movie = {
    Title: "The Matrix",
    Year: "1999",
    Type: "movie",
    Poster: "https://example.com/matrix.jpg",
    imdbID: "tt0133093",
};

function renderMovieCard(overrides = {}) {
    const props = {
        movie,
        index: 0,
        isFavorite: false,
        onSelect: vi.fn(),
        onToggleFavorite: vi.fn(),
        ...overrides,
    };

    render(<MovieCard {...props} />);

    return props;
}

describe("MovieCard", () => {
    it("renders movie information", () => {
        renderMovieCard();

        expect(
            screen.getByRole("heading", {
                name: "The Matrix",
            }),
        ).toBeInTheDocument();

        expect(screen.getByText("Year: 1999")).toBeInTheDocument();
        expect(screen.getByText("Type: movie")).toBeInTheDocument();
    });

    it("renders the movie poster when it is available", () => {
        renderMovieCard();

        const poster = screen.getByRole("img", {
            name: "Movie poster The Matrix",
        });

        expect(poster).toHaveAttribute("src", "https://example.com/matrix.jpg");
    });

    it("shows a placeholder when the poster is unavailable", () => {
        renderMovieCard({
            movie: {
                ...movie,
                Poster: "N/A",
            },
        });

        expect(screen.getByText("No poster")).toBeInTheDocument();

        expect(
            screen.queryByRole("img", {
                name: "Movie poster The Matrix",
            }),
        ).not.toBeInTheDocument();
    });

    it("shows a placeholder when the poster fails to load", () => {
        renderMovieCard();

        const poster = screen.getByRole("img", {
            name: "Movie poster The Matrix",
        });

        fireEvent.error(poster);

        expect(screen.getByText("No poster")).toBeInTheDocument();
        expect(poster).not.toBeInTheDocument();
    });

    it("calls onSelect with the movie ID when the card is clicked", async () => {
        const user = userEvent.setup();
        const { onSelect } = renderMovieCard();

        const card = screen
            .getByRole("heading", {
                name: "The Matrix",
            })
            .closest("article");

        await user.click(card);

        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(onSelect).toHaveBeenCalledWith("tt0133093");
    });

    it("opens the movie when Enter is pressed", async () => {
        const user = userEvent.setup();
        const { onSelect } = renderMovieCard();

        const card = screen
            .getByRole("heading", {
                name: "The Matrix",
            })
            .closest("article");

        card.focus();

        await user.keyboard("{Enter}");

        expect(onSelect).toHaveBeenCalledWith("tt0133093");
    });

    it("opens the movie when Space is pressed", async () => {
        const user = userEvent.setup();
        const { onSelect } = renderMovieCard();

        const card = screen
            .getByRole("heading", {
                name: "The Matrix",
            })
            .closest("article");

        card.focus();

        await user.keyboard(" ");

        expect(onSelect).toHaveBeenCalledWith("tt0133093");
    });

    it("adds the movie to favorites", async () => {
        const user = userEvent.setup();
        const { onSelect, onToggleFavorite } = renderMovieCard();

        await user.click(
            screen.getByRole("button", {
                name: "Add The Matrix to favorite",
            }),
        );

        expect(onToggleFavorite).toHaveBeenCalledTimes(1);
        expect(onToggleFavorite).toHaveBeenCalledWith(movie);

        expect(onSelect).not.toHaveBeenCalled();
    });

    it("shows the active favorite state", () => {
        renderMovieCard({
            isFavorite: true,
        });

        const favoriteButton = screen.getByRole("button", {
            name: "Remove The Matrix from favorite",
        });

        expect(favoriteButton).toHaveAttribute("aria-pressed", "true");

        expect(favoriteButton).toHaveTextContent("♥");
    });

    it("shows the inactive favorite state", () => {
        renderMovieCard({
            isFavorite: false,
        });

        const favoriteButton = screen.getByRole("button", {
            name: "Add The Matrix to favorite",
        });

        expect(favoriteButton).toHaveAttribute("aria-pressed", "false");

        expect(favoriteButton).toHaveTextContent("♡");
    });
});
