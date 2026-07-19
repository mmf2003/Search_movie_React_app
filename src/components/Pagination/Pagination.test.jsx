import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Pagination from "./Pagination";

describe("Pagination", () => {
    it("does not render when there is only one page", () => {
        const { container } = render(
            <Pagination
                currentPage={1}
                totalPages={1}
                onPageChange={vi.fn()}
            />,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it("disables the previous button on the first page", () => {
        render(
            <Pagination
                currentPage={1}
                totalPages={5}
                onPageChange={vi.fn()}
            />,
        );

        expect(
            screen.getByRole("button", {
                name: "Предыдущая страница",
            }),
        ).toBeDisabled();
    });

    it("disables the next button on the last page", () => {
        render(
            <Pagination
                currentPage={5}
                totalPages={5}
                onPageChange={vi.fn()}
            />,
        );

        expect(
            screen.getByRole("button", {
                name: "Следующая страница",
            }),
        ).toBeDisabled();
    });

    it("calls onPageChange with the next page", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        render(
            <Pagination
                currentPage={2}
                totalPages={5}
                onPageChange={onPageChange}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Следующая страница",
            }),
        );

        expect(onPageChange).toHaveBeenCalledWith(3);
        expect(onPageChange).toHaveBeenCalledTimes(1);
    });

    it("calls onPageChange with the previous page", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        render(
            <Pagination
                currentPage={3}
                totalPages={5}
                onPageChange={onPageChange}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Предыдущая страница",
            }),
        );

        expect(onPageChange).toHaveBeenCalledWith(2);
        expect(onPageChange).toHaveBeenCalledTimes(1);
    });

    it("calls onPageChange when a page number is clicked", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        render(
            <Pagination
                currentPage={3}
                totalPages={5}
                onPageChange={onPageChange}
            />,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Перейти на страницу 4",
            }),
        );

        expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it("marks the current page with aria-current", () => {
        render(
            <Pagination
                currentPage={3}
                totalPages={5}
                onPageChange={vi.fn()}
            />,
        );

        expect(
            screen.getByRole("button", {
                name: "Перейти на страницу 3",
            }),
        ).toHaveAttribute("aria-current", "page");
    });

    it("shows ellipses when there are many pages", () => {
        render(
            <Pagination
                currentPage={10}
                totalPages={20}
                onPageChange={vi.fn()}
            />,
        );

        expect(screen.getAllByText("…")).toHaveLength(2);
    });

    it("shows the correct visible pages in the middle of the range", () => {
        render(
            <Pagination
                currentPage={10}
                totalPages={20}
                onPageChange={vi.fn()}
            />,
        );

        expect(
            screen.getByRole("button", {
                name: "Перейти на страницу 1",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Перейти на страницу 9",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Перейти на страницу 10",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Перейти на страницу 11",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Перейти на страницу 20",
            }),
        ).toBeInTheDocument();
    });
});
