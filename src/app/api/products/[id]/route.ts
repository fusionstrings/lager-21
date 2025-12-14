import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "#data/products";

type RouteParams = {
    params: Promise<{ id: string }>;
};

/**
 * GET /api/products/[id]
 *
 * Returns a single product by ID.
 * Returns 404 if product not found.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const productId = parseInt(id, 10);

    if (Number.isNaN(productId)) {
        return NextResponse.json(
            { error: "Invalid product ID" },
            { status: 400 },
        );
    }

    const product = getProductById(productId);

    if (!product) {
        return NextResponse.json(
            { error: "Product not found" },
            { status: 404 },
        );
    }

    return NextResponse.json(product);
}
