import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useDebounce from "./useDebounce";

describe("useDebounce", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it("returns the initial value immediately", () => {
        const { result } = renderHook(() => useDebounce("matrix", 500));

        expect(result.current).toBe("matrix");
    });

    it("updates the value only after the delay", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            {
                initialProps: {
                    value: "matrix",
                },
            },
        );

        rerender({
            value: "batman",
        });

        expect(result.current).toBe("matrix");

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current).toBe("batman");
    });

    it("does not update before the delay ends", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            {
                initialProps: {
                    value: "matrix",
                },
            },
        );

        rerender({
            value: "batman",
        });

        act(() => {
            vi.advanceTimersByTime(499);
        });

        expect(result.current).toBe("matrix");
    });

    it("cancels the previous timer when value changes again", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            {
                initialProps: {
                    value: "matrix",
                },
            },
        );

        rerender({
            value: "batman",
        });

        act(() => {
            vi.advanceTimersByTime(300);
        });

        rerender({
            value: "avatar",
        });

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(result.current).toBe("matrix");

        act(() => {
            vi.advanceTimersByTime(200);
        });

        expect(result.current).toBe("avatar");
    });
});
