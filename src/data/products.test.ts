import { describe, expect, it } from "vitest";
import { getProductById, getProducts } from "./products";

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
});
