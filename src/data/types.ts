/**
 * Core domain types for the product catalog and shopping cart.
 */

type AttributeValue = string | number;

type AttributeValues = AttributeValue[];

export type VariantOption = {
    attributes: Record<string, AttributeValues>;
    quantity: number;
};

export type Product = {
    id: number;
    name: string;
    brand: string;
    price: number;
    available: boolean;
    weight: number;
    options: VariantOption[];
};

export type SelectedVariant = Record<string, AttributeValue>;

export type CartItem = Product & {
    cartId: string;
    selectedVariant: SelectedVariant;
    quantity: number;
};

/**
 * Extracts attribute keys from a product's options.
 */
export function getProductAttributeKeys(product: Product) {
    if (product.options.length === 0) {
        return [];
    }
    return Object.keys(product.options[0].attributes);
}

/**
 * Creates a stable identifier for a product+variant combination.
 * Uses sorted JSON keys for deterministic ordering.
 */
export function createCartId(productId: number, variant: SelectedVariant) {
    return `${productId}-${
        JSON.stringify(variant, Object.keys(variant).sort())
    }`;
}
