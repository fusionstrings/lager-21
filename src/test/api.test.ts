import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as getProducts } from "#app/api/products/route";
import { GET as getProduct } from "#app/api/products/[id]/route";

describe("Products API", () => {
    describe("GET /api/products", () => {
        it("returns all products", async () => {
            const request = new NextRequest(
                "http://localhost:3000/api/products",
            );
            const response = await getProducts(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveProperty("products");
            expect(data).toHaveProperty("total");
            expect(Array.isArray(data.products)).toBe(true);
            expect(data.products.length).toBeGreaterThan(0);
        });

        it("filters by availability", async () => {
            const request = new NextRequest(
                "http://localhost:3000/api/products?available=true",
            );
            const response = await getProducts(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            data.products.forEach((p: { available: boolean }) => {
                expect(p.available).toBe(true);
            });
        });
    });

    describe("GET /api/products/[id]", () => {
        it("returns a single product by ID", async () => {
            const request = new NextRequest(
                "http://localhost:3000/api/products/1",
            );
            const response = await getProduct(request, {
                params: Promise.resolve({ id: "1" }),
            });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveProperty("id", 1);
            expect(data).toHaveProperty("name");
            expect(data).toHaveProperty("price");
        });

        it("returns 404 for non-existent product", async () => {
            const request = new NextRequest(
                "http://localhost:3000/api/products/99999",
            );
            const response = await getProduct(request, {
                params: Promise.resolve({ id: "99999" }),
            });

            expect(response.status).toBe(404);
        });

        it("returns 400 for invalid ID format", async () => {
            const request = new NextRequest(
                "http://localhost:3000/api/products/invalid",
            );
            const response = await getProduct(request, {
                params: Promise.resolve({ id: "invalid" }),
            });

            expect(response.status).toBe(400);
        });
    });
});
