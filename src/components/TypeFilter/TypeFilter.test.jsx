import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import TypeFilter from "./TypeFilter";

describe("TypeFilter", () => {
    it("renders all filter buttons", () => {
        render(<TypeFilter value="" onChange={vi.fn()} />);

        expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Movies" }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Series" }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Episodes" }),
        ).toBeInTheDocument();
    });

    it("marks the active filter", () => {
        render(<TypeFilter value="movie" onChange={vi.fn()} />);

        expect(screen.getByRole("button", { name: "Movies" })).toHaveAttribute(
            "aria-pressed",
            "true",
        );

        expect(screen.getByRole("button", { name: "Series" })).toHaveAttribute(
            "aria-pressed",
            "false",
        );
    });

    it("calls onChange when a filter is clicked", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<TypeFilter value="" onChange={onChange} />);

        await user.click(screen.getByRole("button", { name: "Series" }));

        expect(onChange).toHaveBeenCalledWith("series");
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("disables all buttons when disabled", () => {
        render(<TypeFilter value="" onChange={vi.fn()} disabled />);

        expect(screen.getByRole("button", { name: "All" })).toBeDisabled();

        expect(screen.getByRole("button", { name: "Movies" })).toBeDisabled();

        expect(screen.getByRole("button", { name: "Series" })).toBeDisabled();

        expect(screen.getByRole("button", { name: "Episodes" })).toBeDisabled();
    });

    it("does not call onChange when disabled", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<TypeFilter value="" onChange={onChange} disabled />);

        await user.click(screen.getByRole("button", { name: "Movies" }));

        expect(onChange).not.toHaveBeenCalled();
    });
});
