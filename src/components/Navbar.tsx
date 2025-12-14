"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartItemCount } from "#store/cart";
import { SITE_NAME } from "#config";

function Navbar() {
    const itemCount = useCartItemCount();

    return (
        <nav className="border-b-2 border-base-content bg-base-100 sticky top-0 z-50">
            <div className="container mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-xl font-black tracking-tight uppercase link-hover"
                >
                    {SITE_NAME}
                </Link>
                <Link
                    href="/checkout"
                    className="flex items-center gap-3 font-bold uppercase text-sm tracking-wider"
                    aria-label="Cart"
                >
                    <span className="hidden sm:inline">Cart</span>
                    <div className="relative">
                        <ShoppingCart className="h-5 w-5" strokeWidth={2.5} />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-secondary text-secondary-content text-[10px] font-black w-5 h-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </div>
                </Link>
            </div>
        </nav>
    );
}

export { Navbar };
