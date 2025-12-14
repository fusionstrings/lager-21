"use client";

import { useState } from "react";
import type { Product, SelectedVariant, VariantOption } from "#data/types";
import { createCartId } from "#data/types";
import {
    getInitialVariantState,
    VariantSelector,
} from "#components/VariantSelector";
import { getVariantStock } from "#data/variant-config";
import { addToCart, useCart } from "#store/cart";
import { useToast } from "#components/Toast";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";

const LOW_STOCK_THRESHOLD = 3;
const ADDED_FEEDBACK_DURATION = 2000;

type AddToCartProps = {
    product: Product;
};

function getMissingSelections(
    options: VariantOption[],
    variant: SelectedVariant | undefined,
    isValid: boolean,
    maxStock: number | undefined,
) {
    if (options.length === 0 || isValid) {
        return undefined;
    }

    if (maxStock === 0) {
        return "Sold out for this combination";
    }

    const keys = Object.keys(options[0].attributes);
    const missing = keys.filter((key) => variant?.[key] === undefined);

    if (missing.length === 0) {
        return "This combination doesn't exist — try a different selection";
    }

    if (missing.length === 1) {
        return `Select a ${missing[0].toLowerCase()}`;
    }

    const formatted = missing.map((key) => key.toLowerCase());
    return `Select ${formatted.slice(0, -1).join(", ")} and ${
        formatted[formatted.length - 1]
    }`;
}

function AddToCartButton({ product }: AddToCartProps) {
    const hasOptions = product.options.length > 0;
    const { showToast } = useToast();
    const cartItems = useCart();

    const initialState = getInitialVariantState(product);

    const [selectedVariant, setSelectedVariant] = useState<
        SelectedVariant | undefined
    >(
        initialState.variant,
    );
    const [isValid, setIsValid] = useState(initialState.isValid);
    const [quantity, setQuantity] = useState(1);
    const [justAdded, setJustAdded] = useState(false);

    const maxStock = getVariantStock(product.options, selectedVariant);

    const cartId = selectedVariant
        ? createCartId(product.id, selectedVariant)
        : undefined;
    const inCartQuantity = cartId
        ? cartItems.find((item) => item.cartId === cartId)?.quantity ?? 0
        : 0;
    const remainingStock = maxStock !== undefined
        ? Math.max(0, maxStock - inCartQuantity)
        : undefined;

    const missingSelections = getMissingSelections(
        product.options,
        selectedVariant,
        isValid,
        maxStock,
    );

    function handleVariantChange(
        variant: SelectedVariant | undefined,
        valid: boolean,
    ) {
        setSelectedVariant(variant);
        setIsValid(valid);
        setJustAdded(false);
        setQuantity(1);
    }

    const canAdd = product.available && (!hasOptions || isValid);
    const atMaxStock = remainingStock !== undefined && remainingStock === 0;
    const lowStock = remainingStock !== undefined &&
        remainingStock > 0 &&
        remainingStock <= LOW_STOCK_THRESHOLD;

    function handleAddToCart() {
        if (!canAdd || atMaxStock) {
            return;
        }

        const added = addToCart(
            product,
            selectedVariant ?? {},
            quantity,
            maxStock,
        );

        if (added > 0) {
            showToast("success", `${added} × ${product.name} added to cart`);
            setJustAdded(true);
            setQuantity(1);
            setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_DURATION);
        }
    }

    return (
        <div className="space-y-6">
            <VariantSelector
                product={product}
                onVariantChange={handleVariantChange}
            />

            <div className="flex flex-col gap-4">
                {canAdd && remainingStock !== undefined && remainingStock > 0 &&
                    (
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Quantity</span>
                            <div className="join">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-square join-item"
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="btn btn-sm join-item pointer-events-none w-12 tabular-nums">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-square join-item"
                                    onClick={() =>
                                        setQuantity(
                                            Math.min(
                                                remainingStock,
                                                quantity + 1,
                                            ),
                                        )}
                                    disabled={quantity >= remainingStock}
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                {inCartQuantity > 0 && (
                    <p className="text-info text-sm font-medium">
                        {inCartQuantity} already in your cart
                    </p>
                )}

                {lowStock && (
                    <p className="text-warning text-sm font-medium">
                        Only {remainingStock} more available
                    </p>
                )}

                <button
                    type="button"
                    className={`btn btn-lg w-full transition-all duration-150 ${
                        justAdded ? "btn-success text-white" : "btn-primary"
                    }`}
                    disabled={!canAdd || atMaxStock}
                    onClick={handleAddToCart}
                >
                    {justAdded
                        ? (
                            <>
                                <Check className="w-5 h-5" />
                                Added!
                            </>
                        )
                        : (
                            <>
                                <ShoppingCart className="w-5 h-5" />
                                {!product.available
                                    ? "Out of Stock"
                                    : atMaxStock
                                    ? "Max Stock Reached"
                                    : quantity > 1
                                    ? `Add ${quantity} to Cart`
                                    : "Add to Cart"}
                            </>
                        )}
                </button>

                {missingSelections && product.available && (
                    <p className="text-warning text-sm text-center font-medium">
                        {missingSelections}
                    </p>
                )}
            </div>
        </div>
    );
}

export { AddToCartButton };
