"use client";

import { useEffect } from "react";
import {
    addToCart,
    decreaseQuantity,
    removeFromCart,
    setItemQuantity,
    useCart,
    useCartTotal,
} from "#store/cart";
import { getAttributeDisplay, getVariantStock } from "#data/variant-config";
import type { SelectedVariant } from "#data/types";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

function formatVariant(variant: SelectedVariant) {
    return Object.entries(variant)
        .map(([key, value]) => `${value}${getAttributeDisplay(key).suffix}`)
        .join(" • ");
}

function CheckoutPage() {
    const cartItems = useCart();
    const total = useCartTotal();

    useEffect(() => {
        for (const item of cartItems) {
            const stock = getVariantStock(item.options, item.selectedVariant);
            if (stock !== undefined && item.quantity > stock) {
                setItemQuantity(item.cartId, stock);
            }
        }
    }, [cartItems]);

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 px-4">
                <ShoppingBag className="w-24 h-24 opacity-20" strokeWidth={1} />
                <h2 className="text-2xl font-bold opacity-50 text-center">
                    Your cart is empty
                </h2>
                <p className="text-sm opacity-40 text-center max-w-sm">
                    Discover our collection of premium products and add items to
                    your cart.
                </p>
                <Link href="/" className="btn btn-primary btn-lg">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 px-4 py-8">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-4">
                    {cartItems.map((item) => {
                        const imageUrl =
                            `https://placehold.co/150x150/e2e8f0/1e293b?text=${
                                encodeURIComponent(item.name)
                            }`;
                        const variantText = formatVariant(item.selectedVariant);
                        const maxStock = getVariantStock(
                            item.options,
                            item.selectedVariant,
                        );

                        return (
                            <div
                                key={item.cartId}
                                className="card bg-base-100 shadow-sm flex flex-col sm:flex-row overflow-hidden"
                            >
                                <figure className="w-full sm:w-32 h-32 flex-shrink-0">
                                    <img
                                        src={imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </figure>

                                <div className="card-body p-4 flex flex-col sm:flex-row w-full gap-4 sm:items-center sm:justify-between">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-lg">
                                            {item.name}
                                        </h3>
                                        {variantText && (
                                            <p className="text-sm opacity-70">
                                                {variantText}
                                            </p>
                                        )}
                                        <p className="font-mono text-primary">
                                            {item.price} SEK
                                        </p>
                                    </div>

                                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3">
                                        <div className="join">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-square join-item"
                                                onClick={() =>
                                                    decreaseQuantity(
                                                        item.cartId,
                                                    )}
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="btn btn-sm join-item pointer-events-none w-10 tabular-nums">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-square join-item"
                                                onClick={() =>
                                                    addToCart(
                                                        item,
                                                        item.selectedVariant,
                                                        1,
                                                        maxStock,
                                                    )}
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-xs text-error"
                                            onClick={() =>
                                                removeFromCart(item.cartId)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="lg:col-span-2">
                    <div className="card bg-base-100 shadow-lg sticky top-24">
                        <div className="card-body space-y-4">
                            <h2 className="card-title">Order Summary</h2>

                            <div className="flex justify-between text-lg">
                                <span>Total</span>
                                <span className="font-bold text-primary tabular-nums">
                                    {total.toLocaleString("sv-SE", {
                                        minimumFractionDigits: 2,
                                    })} SEK
                                </span>
                            </div>

                            <div className="divider my-0" />

                            <p className="text-xs opacity-50">
                                Taxes and shipping calculated at checkout.
                            </p>

                            <button
                                type="button"
                                className="btn btn-primary w-full shadow-lg hover:brightness-110"
                            >
                                Proceed to Checkout
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
