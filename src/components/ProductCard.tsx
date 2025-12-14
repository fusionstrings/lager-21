import Link from "next/link";
import type { Product } from "#data/types";

type ProductCardProps = {
    product: Product;
};

function ProductCard({ product }: ProductCardProps) {
    const imageUrl =
        `https://placehold.co/600x400/0a0a0a/ffffff?font=oswald&text=${
            encodeURIComponent(product.name.toUpperCase())
        }`;

    return (
        <Link href={`/product/${product.id}`} className="group block h-full">
            <article className="card-brutal bg-base-100 h-full flex flex-col">
                <figure className="aspect-[4/3] relative overflow-hidden border-b-2 border-base-content">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="object-cover w-full h-full"
                    />
                    {!product.available && (
                        <div className="absolute inset-0 bg-base-100/95 flex items-center justify-center">
                            <span className="text-lg font-black uppercase tracking-[0.2em] text-secondary">
                                Sold Out
                            </span>
                        </div>
                    )}
                </figure>
                <div className="p-5 flex flex-col flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-base-content/40 mb-3">
                        {product.brand}
                    </p>
                    <h3 className="font-extrabold text-lg leading-tight mb-auto group-hover:text-secondary transition-colors duration-150">
                        {product.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-4 pt-4 border-t border-base-300">
                        <span className="price text-3xl">
                            {product.price.toLocaleString("sv-SE")}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                            SEK
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export { ProductCard };
