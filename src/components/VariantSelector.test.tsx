import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
    getInitialVariantState,
    VariantSelector,
} from "#components/VariantSelector";
import type { Product } from "#data/types";

const productWithOptions: Product = {
    id: 1,
    name: "Test Light",
    brand: "TestBrand",
    price: 300,
    available: true,
    weight: 0.2,
    options: [
        { attributes: { Color: ["white"], Power: [6.5, 9.5] }, quantity: 5 },
        { attributes: { Color: ["red"], Power: [6.5] }, quantity: 0 },
    ],
};

const productWithSingleOption: Product = {
    id: 2,
    name: "Single Option",
    brand: "TestBrand",
    price: 100,
    available: true,
    weight: 0.1,
    options: [{ attributes: { Color: ["black"] }, quantity: 10 }],
};

const productNoOptions: Product = {
    id: 3,
    name: "No Options",
    brand: "TestBrand",
    price: 200,
    available: true,
    weight: 0.3,
    options: [],
};

const productWithStorage: Product = {
    id: 4,
    name: "Switch",
    brand: "Nintendo",
    price: 3500,
    available: true,
    weight: 0.5,
    options: [
        { attributes: { Color: ["black"], Storage: [32, 250] }, quantity: 0 },
        { attributes: { Color: ["red"], Storage: [32, 250] }, quantity: 5 },
    ],
};

describe("VariantSelector", () => {
    it("renders nothing for products without options", () => {
        const onVariantChange = vi.fn();
        const { container } = render(
            <VariantSelector
                product={productNoOptions}
                onVariantChange={onVariantChange}
            />,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it("renders color options", () => {
        const onVariantChange = vi.fn();
        render(
            <VariantSelector
                product={productWithOptions}
                onVariantChange={onVariantChange}
            />,
        );

        expect(screen.getByText("Color")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /white/i }))
            .toBeInTheDocument();
        expect(screen.getByRole("button", { name: /red/i }))
            .toBeInTheDocument();
    });

    it("renders power options when available", () => {
        const onVariantChange = vi.fn();
        render(
            <VariantSelector
                product={productWithOptions}
                onVariantChange={onVariantChange}
            />,
        );

        expect(screen.getByText("Power")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /6\.5W/i }))
            .toBeInTheDocument();
        expect(screen.getByRole("button", { name: /9\.5W/i }))
            .toBeInTheDocument();
    });

    it("auto-selects when only one option exists", () => {
        const onVariantChange = vi.fn();
        render(
            <VariantSelector
                product={productWithSingleOption}
                onVariantChange={onVariantChange}
            />,
        );

        const blackButton = screen.getByRole("button", { name: /black/i });
        expect(blackButton).toHaveClass("btn-primary");
    });

    it("calls onVariantChange when selection made", () => {
        const onVariantChange = vi.fn();
        render(
            <VariantSelector
                product={productWithOptions}
                onVariantChange={onVariantChange}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: /white/i }));

        expect(onVariantChange).toHaveBeenCalled();
    });

    it("getInitialVariantState returns valid variant for single-option product", () => {
        const result = getInitialVariantState(productWithSingleOption);
        expect(result.variant).toEqual({ Color: "black" });
        expect(result.isValid).toBe(true);
    });

    it("returns isValid=false but variant when stock is 0", async () => {
        const onVariantChange = vi.fn();
        render(
            <VariantSelector
                product={productWithStorage}
                onVariantChange={onVariantChange}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: /black/i }));
        fireEvent.click(screen.getByRole("button", { name: /^32$/ }));

        await waitFor(() => {
            const validCall = onVariantChange.mock.calls.find((call) => {
                const variant = call[0];
                return variant?.Color === "black" && variant?.Storage === 32;
            });
            expect(validCall).toBeDefined();
            expect(validCall![1]).toBe(false);
        });
    });

    it("returns isValid=true when in-stock variant selected", async () => {
        const onVariantChange = vi.fn();
        render(
            <VariantSelector
                product={productWithStorage}
                onVariantChange={onVariantChange}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: /red/i }));
        fireEvent.click(screen.getByRole("button", { name: /^32$/ }));

        await waitFor(() => {
            const lastCall = onVariantChange.mock.calls[
                onVariantChange.mock.calls.length - 1
            ];
            expect(lastCall[0]).toEqual(
                expect.objectContaining({ Color: "red", Storage: 32 }),
            );
            expect(lastCall[1]).toBe(true);
        });
    });
});
