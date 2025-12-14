import { getProducts } from "#data/products";
import { ProductCard } from "#components/ProductCard";
import { SITE_NAME } from "#config";

function HomePage() {
  const products = getProducts();

  return (
    <div className="min-h-screen bg-base-100">
      <header className="border-b-2 border-base-content">
        <div className="container mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="label text-secondary mb-8">{SITE_NAME}</p>
          <h1 className="display max-w-4xl">
            Quality<br />
            <span className="text-secondary">Products</span>
            <br />
            Delivered
          </h1>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-baseline justify-between border-b-2 border-base-content pb-6 mb-12">
          <h2 className="headline">Catalog</h2>
          <span className="label text-base-content/50">
            {products.length} Items
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default HomePage;
