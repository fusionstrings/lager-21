import type { Product, VariantOption } from "#data/types";
import { toTitleCase } from "#data/variant-config";
import inventoryData from "#data/inventory.json";

type RawProduct = {
    id: number | string;
    name?: string;
    brand?: string;
    price?: string | number;
    available?: boolean;
    weight?: number;
    options?: unknown[];
};

function isRawProduct(item: unknown): item is RawProduct {
    if (typeof item !== "object" || item === null) {
        return false;
    }
    const obj = item as Record<string, unknown>;
    return (
        (typeof obj.id === "string" || typeof obj.id === "number") &&
        typeof obj.name === "string"
    );
}

function isRawOption(item: unknown): item is Record<string, unknown> {
    return typeof item === "object" && item !== null;
}

function normalizeProduct(raw: RawProduct) {
    const id = Number(raw.id);
    if (Number.isNaN(id)) {
        return undefined;
    }

    const price = Number(raw.price ?? 0);
    const options: VariantOption[] = Array.isArray(raw.options)
        ? raw.options.filter(isRawOption).map(normalizeOption)
        : [];

    return {
        id,
        name: raw.name!,
        brand: raw.brand ?? "Unknown",
        price: Number.isNaN(price) ? 0 : price,
        available: raw.available !== false,
        weight: Number(raw.weight ?? 0),
        options,
    };
}

function normalizeOption(raw: Record<string, unknown>): VariantOption {
    const attributes: Record<string, (string | number)[]> = {};

    for (const [key, value] of Object.entries(raw)) {
        if (key === "quantity") {
            continue;
        }

        const normalizedKey = toTitleCase(key);

        if (Array.isArray(value)) {
            attributes[normalizedKey] = value.map((item) => {
                if (typeof item === "string" || typeof item === "number") {
                    return item;
                }
                return String(item);
            });
        } else if (typeof value === "string" || typeof value === "number") {
            attributes[normalizedKey] = [value];
        }
    }

    return {
        attributes,
        quantity: Number(raw.quantity ?? 0),
    };
}

function loadProducts() {
    if (!inventoryData || !Array.isArray(inventoryData.items)) {
        return [];
    }

    return inventoryData.items
        .filter(isRawProduct)
        .map(normalizeProduct)
        .filter((product): product is Product => product !== undefined);
}

const products = loadProducts();

type GetProductsOptions = {
    available?: boolean;
};

/**
 * Returns all products, optionally filtered by availability.
 */
function getProducts(options: GetProductsOptions = {}) {
    if (options.available === undefined) {
        return products;
    }
    return products.filter((p) => p.available === options.available);
}

/**
 * Returns a product by its ID, or undefined if not found.
 */
function getProductById(id: number) {
    return products.find((p) => p.id === id);
}

/**
 * Returns products filtered by brand name (case-insensitive).
 */
function getProductsByBrand(brand: string) {
    return products.filter(
        (p) => p.brand.toLowerCase() === brand.toLowerCase(),
    );
}

/**
 * Returns products filtered by brand slug.
 */
function getProductsByBrandSlug(slug: string) {
    return products.filter(
        (p) => slugify(p.brand) === slug.toLowerCase(),
    );
}

/**
 * Returns all unique brand names.
 */
function getAllBrands() {
    return [...new Set(products.map((p) => p.brand))];
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getBrandSlug(brand: string) {
    return slugify(brand);
}

export {
    getAllBrands,
    getBrandSlug,
    getProductById,
    getProducts,
    getProductsByBrand,
    getProductsByBrandSlug,
};
export type { GetProductsOptions };
