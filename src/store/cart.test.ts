import { beforeEach, describe, expect, it } from "vitest";
import {
    addToCart,
    clearCart,
    decreaseQuantity,
    getCartItemCount,
    getCartTotal,
    loadCart,
    removeFromCart,
    setItemQuantity,
} from "#store/cart";
import type { Product } from "#data/types";
import { createCartId } from "#data/types";

const mockProduct: Product = {
    id: 1,
    name: "Test Product",
    brand: "Test Brand",
    price: 100,
    available: true,
    weight: 1,
    options: [],
};

const mockProductWithStock: Product = {
    id: 2,
    name: "Limited Stock",
    brand: "Test Brand",
    price: 200,
    available: true,
    weight: 1,
    options: [{ attributes: { Color: ["red"] }, quantity: 3 }],
};

beforeEach(() => {
    clearCart();
    localStorage.clear();
});

describe("Cart Store", () => {
    it("adds items to cart", () => {
        addToCart(mockProduct, { Color: "red" });
        expect(getCartItemCount()).toBe(1);
    });

    it("adds multiple items at once", () => {
        addToCart(mockProduct, { Color: "red" }, 5);
        expect(getCartItemCount()).toBe(5);
    });

    it("increments quantity for same variant", () => {
        addToCart(mockProduct, { Color: "red" });
        addToCart(mockProduct, { Color: "red" });
        expect(getCartItemCount()).toBe(2);
    });

    it("treats different variants as separate items", () => {
        addToCart(mockProduct, { Color: "red" });
        addToCart(mockProduct, { Color: "blue" });
        expect(getCartItemCount()).toBe(2);
    });

    it("calculates total price", () => {
        addToCart(mockProduct, { Color: "red" }, 2);
        expect(getCartTotal()).toBe(200);
    });

    it("decreases quantity", () => {
        addToCart(mockProduct, { Color: "red" }, 2);
        const cartId = createCartId(mockProduct.id, { Color: "red" });

        decreaseQuantity(cartId);
        expect(getCartItemCount()).toBe(1);

        decreaseQuantity(cartId);
        expect(getCartItemCount()).toBe(0);
    });

    it("removes item", () => {
        addToCart(mockProduct, { Color: "red" });
        const cartId = createCartId(mockProduct.id, { Color: "red" });
        removeFromCart(cartId);
        expect(getCartItemCount()).toBe(0);
    });

    it("clears cart", () => {
        addToCart(mockProduct, { Color: "red" });
        addToCart(mockProduct, { Color: "blue" });
        clearCart();
        expect(getCartItemCount()).toBe(0);
    });
});

describe("Cart Stock Limits", () => {
    it("respects maxStock limit", () => {
        const added = addToCart(mockProductWithStock, { Color: "red" }, 5, 3);
        expect(added).toBe(3);
        expect(getCartItemCount()).toBe(3);
    });

    it("returns 0 when already at max", () => {
        addToCart(mockProductWithStock, { Color: "red" }, 3, 3);
        const added = addToCart(mockProductWithStock, { Color: "red" }, 1, 3);
        expect(added).toBe(0);
        expect(getCartItemCount()).toBe(3);
    });

    it("allows unlimited adding without maxStock", () => {
        addToCart(mockProduct, { Color: "red" }, 10);
        expect(getCartItemCount()).toBe(10);
    });

    it("returns count of items added", () => {
        const added = addToCart(mockProductWithStock, { Color: "red" }, 2, 5);
        expect(added).toBe(2);
    });

    it("sets quantity directly", () => {
        addToCart(mockProduct, { Color: "red" });
        const cartId = createCartId(mockProduct.id, { Color: "red" });

        setItemQuantity(cartId, 5);
        expect(getCartItemCount()).toBe(5);

        setItemQuantity(cartId, 2);
        expect(getCartItemCount()).toBe(2);
    });

    it("removes item when quantity set to 0", () => {
        addToCart(mockProduct, { Color: "red" });
        const cartId = createCartId(mockProduct.id, { Color: "red" });
        setItemQuantity(cartId, 0);
        expect(getCartItemCount()).toBe(0);
    });

    it("clamps negative quantity to 0", () => {
        addToCart(mockProduct, { Color: "red" });
        const cartId = createCartId(mockProduct.id, { Color: "red" });
        setItemQuantity(cartId, -5);
        expect(getCartItemCount()).toBe(0);
    });
});

describe("Cart Persistence", () => {
    it("ignores corrupted localStorage data", () => {
        localStorage.setItem("cart", "not valid json");
        loadCart();
        expect(getCartItemCount()).toBe(0);
    });

    it("ignores invalid cart items", () => {
        localStorage.setItem("cart", JSON.stringify([{ invalid: "data" }]));
        loadCart();
        expect(getCartItemCount()).toBe(0);
    });

    it("loads valid cart data", () => {
        const validCart = [{
            id: 1,
            name: "Test",
            brand: "Brand",
            price: 100,
            available: true,
            weight: 1,
            options: [],
            cartId: "1-{}",
            selectedVariant: {},
            quantity: 2,
        }];
        localStorage.setItem("cart", JSON.stringify(validCart));
        loadCart();
        expect(getCartItemCount()).toBe(2);
    });
});
