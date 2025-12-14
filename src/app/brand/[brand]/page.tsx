import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    getAllBrands,
    getBrandSlug,
    getProductsByBrandSlug,
} from "#data/products";
import { ProductCard } from "#components/ProductCard";
import { SITE_NAME } from "#config";

type Props = {
    params: Promise<{ brand: string }>;
};

export async function generateStaticParams() {
    const brands = getAllBrands();
    return brands.map((brand) => ({ brand: getBrandSlug(brand) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { brand: slug } = await params;
    const products = getProductsByBrandSlug(slug);

    if (products.length === 0) {
        return { title: `Brand Not Found | ${SITE_NAME}` };
    }

    const brandName = products[0].brand;
    return {
        title: `${brandName} Products | ${SITE_NAME}`,
        description: `Browse all ${brandName} products at ${SITE_NAME}`,
    };
}

async function BrandPage({ params }: Props) {
    const { brand: slug } = await params;
    const products = getProductsByBrandSlug(slug);

    if (products.length === 0) {
        notFound();
    }

    const brandName = products[0].brand;

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="text-sm breadcrumbs mb-8">
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li className="font-bold">{brandName}</li>
                </ul>
            </div>

            <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                    {brandName}
                </h1>
                <p className="text-base-content/60">
                    {products.length}{" "}
                    {products.length === 1 ? "product" : "products"}
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default BrandPage;
