import { useSyncExternalStore } from "react";
import type { CartItem, Product, SelectedVariant } from "#data/types";
import { createCartId } from "#data/types";

const CART_STORAGE_KEY = "cart";

let cart: CartItem[] = [];
const listeners = new Set<() => void>();
const EMPTY_CART: CartItem[] = [];

function emitChange() {
    listeners.forEach((fn) => fn());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return cart;
}

function getServerSnapshot() {
    return EMPTY_CART;
}

/**
 * Returns total item count across all cart entries.
 */
function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Returns total price of all cart items in SEK.
 */
function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function isCartItem(item: unknown): item is CartItem {
    if (typeof item !== "object" || item === null) {
        return false;
    }
    const obj = item as Record<string, unknown>;
    return (
        typeof obj.id === "number" &&
        typeof obj.name === "string" &&
        typeof obj.cartId === "string" &&
        typeof obj.quantity === "number" &&
        typeof obj.price === "number"
    );
}

function isCartArray(data: unknown): data is CartItem[] {
    return Array.isArray(data) && data.every(isCartItem);
}

function safeJsonParse(json: string) {
    try {
        return JSON.parse(json);
    } catch {
        return undefined;
    }
}

/**
 * Loads cart from localStorage.
 */
function loadCart() {
    if (typeof window === "undefined") {
        return;
    }
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
        return;
    }
    const parsed = safeJsonParse(stored);
    if (isCartArray(parsed)) {
        cart = parsed;
        emitChange();
    }
}

function saveCart() {
    if (typeof window !== "undefined") {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
}

/**
 * Adds a product to cart with the specified quantity.
 * @returns Number of items actually added (may be less if hitting max stock)
 */
function addToCart(
    product: Product,
    selectedVariant: SelectedVariant,
    quantity = 1,
    maxStock?: number,
) {
    const cartId = createCartId(product.id, selectedVariant);
    const existingIndex = cart.findIndex((item) => item.cartId === cartId);
    const currentQty = existingIndex > -1 ? cart[existingIndex].quantity : 0;

    const availableToAdd = maxStock !== undefined
        ? Math.min(quantity, maxStock - currentQty)
        : quantity;

    if (availableToAdd <= 0) {
        return 0;
    }

    if (existingIndex > -1) {
        cart = cart.map((item, i) =>
            i === existingIndex
                ? { ...item, quantity: item.quantity + availableToAdd }
                : item
        );
    } else {
        cart = [
            ...cart,
            {
                ...product,
                cartId,
                selectedVariant,
                quantity: availableToAdd,
            },
        ];
    }

    saveCart();
    emitChange();
    return availableToAdd;
}

/**
 * Decreases item quantity. Removes if quantity reaches 0.
 */
function decreaseQuantity(cartId: string) {
    const idx = cart.findIndex((item) => item.cartId === cartId);
    if (idx === -1) {
        return;
    }

    if (cart[idx].quantity > 1) {
        cart = cart.map((item, i) =>
            i === idx ? { ...item, quantity: item.quantity - 1 } : item
        );
    } else {
        cart = cart.filter((item) => item.cartId !== cartId);
    }

    saveCart();
    emitChange();
}

/**
 * Removes an item from cart entirely.
 */
function removeFromCart(cartId: string) {
    cart = cart.filter((item) => item.cartId !== cartId);
    saveCart();
    emitChange();
}

/**
 * Clears all items from cart.
 */
function clearCart() {
    cart = [];
    saveCart();
    emitChange();
}

/**
 * React hook that subscribes to cart state.
 */
function useCart() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * React hook returning total item count.
 */
function useCartItemCount() {
    const items = useCart();
    return items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * React hook returning total cart price.
 */
function useCartTotal() {
    const items = useCart();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Sets item quantity. Removes if quantity is 0 or negative.
 */
function setItemQuantity(cartId: string, quantity: number) {
    const qty = Math.max(0, quantity);
    if (qty === 0) {
        removeFromCart(cartId);
        return;
    }

    const idx = cart.findIndex((item) => item.cartId === cartId);
    if (idx === -1) {
        return;
    }

    cart = cart.map((
        item,
        i,
    ) => (i === idx ? { ...item, quantity: qty } : item));

    saveCart();
    emitChange();
}

export {
    addToCart,
    clearCart,
    decreaseQuantity,
    getCartItemCount,
    getCartTotal,
    loadCart,
    removeFromCart,
    setItemQuantity,
    useCart,
    useCartItemCount,
    useCartTotal,
};
