import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useLocalStorage from "./useLocalStorage";

describe("useLocalStorage", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns the initial value when localStorage is empty", () => {
        const { result } = renderHook(() => useLocalStorage("favorites", []));

        expect(result.current[0]).toEqual([]);
    });

    it("reads an existing value from localStorage", () => {
        localStorage.setItem(
            "favorites",
            JSON.stringify([{ imdbID: "tt0133093" }]),
        );

        const { result } = renderHook(() => useLocalStorage("favorites", []));

        expect(result.current[0]).toEqual([
            {
                imdbID: "tt0133093",
            },
        ]);
    });

    it("updates the value and saves it to localStorage", () => {
        const { result } = renderHook(() => useLocalStorage("favorites", []));

        act(() => {
            result.current[1]([
                {
                    imdbID: "tt0133093",
                },
            ]);
        });

        expect(result.current[0]).toEqual([
            {
                imdbID: "tt0133093",
            },
        ]);

        expect(JSON.parse(localStorage.getItem("favorites"))).toEqual([
            {
                imdbID: "tt0133093",
            },
        ]);
    });

    it("supports a functional state update", () => {
        const { result } = renderHook(() =>
            useLocalStorage("history", ["matrix"]),
        );

        act(() => {
            result.current[1]((currentValue) => ["batman", ...currentValue]);
        });

        expect(result.current[0]).toEqual(["batman", "matrix"]);

        expect(JSON.parse(localStorage.getItem("history"))).toEqual([
            "batman",
            "matrix",
        ]);
    });

    it("returns the initial value when stored JSON is invalid", () => {
        localStorage.setItem("favorites", "{invalid-json}");

        const { result } = renderHook(() => useLocalStorage("favorites", []));

        expect(result.current[0]).toEqual([]);
    });
});
