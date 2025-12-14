import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, getProducts } from "#data/products";
import { AddToCartButton } from "#components/AddToCartButton";
import { SITE_NAME } from "#config";

type Props = {
    params: Promise<{ id: string }>;
};

async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = getProductById(Number(id));

    if (!product) {
        return {
            title: `Product Not Found | ${SITE_NAME}`,
        };
    }

    return {
        title: `${product.name} | ${SITE_NAME}`,
        description:
            `${product.name} by ${product.brand} - ${product.price} SEK`,
    };
}

async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = getProductById(Number(id));

    if (!product) {
        notFound();
    }

    const imageUrl = `https://placehold.co/800x600/e2e8f0/1e293b?text=${
        encodeURIComponent(product.name)
    }`;

    return (
        <div className="max-w-6xl mx-auto space-y-8 py-8 px-4">
            <div className="text-sm breadcrumbs">
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>{product.brand}</li>
                    <li className="font-bold">{product.name}</li>
                </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="card bg-base-100 shadow-2xl overflow-hidden self-start">
                    <figure className="relative aspect-square">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="object-cover w-full h-full"
                        />
                        {!product.available && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white px-4 py-2 font-bold text-xl uppercase tracking-widest bg-error transform -rotate-12">
                                    Out of Stock
                                </span>
                            </div>
                        )}
                    </figure>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="badge badge-primary badge-outline text-sm font-medium">
                            {product.brand}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-3xl font-medium text-primary">
                            {product.price} SEK
                        </p>
                    </div>

                    <div className="divider" />

                    <div className="prose prose-lg text-base-content/80">
                        <p>
                            Premium quality {product.brand} product. Weight:
                            {" "}
                            {product.weight} kg.
                        </p>
                    </div>

                    <div className="card bg-base-200 p-6 rounded-xl shadow-inner">
                        <AddToCartButton product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export { generateMetadata };
export default ProductPage;
