import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "#data/products";

/**
 * GET /api/products
 *
 * Returns all products from inventory.
 * Optional query param: ?available=true|false to filter by availability
 */
export function GET(request: NextRequest) {
    const availableFilter = request.nextUrl.searchParams.get("available");

    const options = availableFilter !== null
        ? { available: availableFilter === "true" }
        : {};

    const products = getProducts(options);

    return NextResponse.json({
        products,
        total: products.length,
    });
}
