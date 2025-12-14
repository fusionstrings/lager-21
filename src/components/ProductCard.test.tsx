import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "./ProductCard";
import type { Product } from "#data/types";

const availableProduct: Product = {
    id: 1,
    name: "Test Speaker",
    brand: "TestBrand",
    price: 500,
    available: true,
    weight: 0.5,
    options: [],
};

const unavailableProduct: Product = {
    ...availableProduct,
    id: 2,
    available: false,
};

describe("ProductCard", () => {
    it("renders product name and brand", () => {
        render(<ProductCard product={availableProduct} />);

        expect(screen.getByText("Test Speaker")).toBeInTheDocument();
        expect(screen.getByText("TestBrand")).toBeInTheDocument();
    });

    it("renders formatted price", () => {
        render(<ProductCard product={availableProduct} />);

        expect(screen.getByText("500")).toBeInTheDocument();
        expect(screen.getByText("SEK")).toBeInTheDocument();
    });

    it("shows 'Sold Out' for unavailable products", () => {
        render(<ProductCard product={unavailableProduct} />);

        expect(screen.getByText("Sold Out")).toBeInTheDocument();
    });

    it("does not show 'Sold Out' for available products", () => {
        render(<ProductCard product={availableProduct} />);

        expect(screen.queryByText("Sold Out")).not.toBeInTheDocument();
    });

    it("links to product detail page", () => {
        render(<ProductCard product={availableProduct} />);

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/product/1");
    });
});
