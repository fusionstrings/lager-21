"use client";

import { useEffect } from "react";
import { loadCart } from "#store/cart";

function CartLoader() {
    useEffect(() => {
        loadCart();
    }, []);

    return null;
}

export { CartLoader };
