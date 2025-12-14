import { describe, expect, it } from "vitest";
import {
    getAllBrands,
    getProductById,
    getProducts,
    getProductsByBrand,
} from "./products";

describe("Product Service", () => {
    describe("getProducts", () => {
        it("returns all products", () => {
            const products = getProducts();

            expect(Array.isArray(products)).toBe(true);
            expect(products.length).toBeGreaterThan(0);
        });

        it("normalizes price from string to number", () => {
            const products = getProducts();

            products.forEach((product) => {
                expect(typeof product.price).toBe("number");
                expect(Number.isNaN(product.price)).toBe(false);
            });
        });

        it("normalizes id from string to number", () => {
            const products = getProducts();

            products.forEach((product) => {
                expect(typeof product.id).toBe("number");
                expect(Number.isNaN(product.id)).toBe(false);
            });
        });

        it("filters by availability", () => {
            const available = getProducts({ available: true });
            const unavailable = getProducts({ available: false });

            available.forEach((p) => expect(p.available).toBe(true));
            unavailable.forEach((p) => expect(p.available).toBe(false));
        });
    });

    describe("getProductById", () => {
        it("returns product by ID", () => {
            const product = getProductById(1);

            expect(product).toBeDefined();
            expect(product?.id).toBe(1);
        });

        it("returns undefined for non-existent ID", () => {
            const product = getProductById(99999);

            expect(product).toBeUndefined();
        });
    });

    describe("getProductsByBrand", () => {
        it("returns products matching brand", () => {
            const products = getProductsByBrand("Sony");

            expect(products.length).toBeGreaterThan(0);
            products.forEach((p) => expect(p.brand).toBe("Sony"));
        });

        it("is case-insensitive", () => {
            const lower = getProductsByBrand("sony");
            const upper = getProductsByBrand("SONY");

            expect(lower.length).toBe(upper.length);
            expect(lower.length).toBeGreaterThan(0);
        });

        it("returns empty array for non-existent brand", () => {
            const products = getProductsByBrand("NonExistentBrand");

            expect(products).toEqual([]);
        });
    });

    describe("getAllBrands", () => {
        it("returns unique brand names", () => {
            const brands = getAllBrands();

            expect(brands.length).toBeGreaterThan(0);
            expect(new Set(brands).size).toBe(brands.length);
        });

        it("includes known brands", () => {
            const brands = getAllBrands();

            expect(brands).toContain("Sony");
            expect(brands).toContain("Nintendo");
        });
    });
});
