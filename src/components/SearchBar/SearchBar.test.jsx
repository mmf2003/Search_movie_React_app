import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import SearchBar from "./SearchBar";

describe("SearchBar", () => {
    it("renders the input with the current query", () => {
        render(<SearchBar query="matrix" onQueryChange={vi.fn()} />);

        expect(screen.getByDisplayValue("matrix")).toBeInTheDocument();
    });

    it("renders the placeholder", () => {
        render(<SearchBar query="" onQueryChange={vi.fn()} />);

        expect(
            screen.getByPlaceholderText("Search for movies..."),
        ).toBeInTheDocument();
    });

    it("calls onQueryChange when the user types", async () => {
        const user = userEvent.setup();
        const onQueryChange = vi.fn();

        function TestWrapper() {
            const [query, setQuery] = useState("");

            const handleQueryChange = (newQuery) => {
                onQueryChange(newQuery);
                setQuery(newQuery);
            };

            return (
                <SearchBar query={query} onQueryChange={handleQueryChange} />
            );
        }

        render(<TestWrapper />);

        const input = screen.getByRole("searchbox");

        await user.type(input, "batman");

        expect(onQueryChange).toHaveBeenCalledTimes(6);
        expect(onQueryChange).toHaveBeenLastCalledWith("batman");
        expect(input).toHaveValue("batman");
    });

    it("is a controlled component", () => {
        render(<SearchBar query="interstellar" onQueryChange={vi.fn()} />);

        const input = screen.getByRole("searchbox");

        expect(input).toHaveValue("interstellar");
    });
});
