import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/actions/product";
import { getCategories } from "@/actions/category";
import { getStoreSettings } from "@/actions/settings";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight, BadgePercent } from "lucide-react";
import HeroSection from "./components/HeroSection";

export default async function HomePage() {
  const [productsRes, categoriesRes, settingsRes] = await Promise.all([
    getProducts({ page: 1, limit: 12 }),
    getCategories(),
    getStoreSettings(),
  ]);

  const products =
    productsRes.success && productsRes.products ? productsRes.products : [];
  const categories =
    categoriesRes.success && categoriesRes.categories
      ? categoriesRes.categories
      : [];
  const settings =
    settingsRes.success && settingsRes.settings ? settingsRes.settings : null;

  const featuredProducts = products
    .filter((product) => product.isFeatured)
    .slice(0, 4);
  const bestSellingProducts = products
    .filter((product) => product.isBestSeller || product.reviews > 120)
    .slice(0, 4);
  const newArrivals = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);
  const announcement =
    settings?.announcement || "Cash on delivery available nationwide";
  return (
    <>
      <section className="border-b border-rose-100 bg-rose-50">
        <div className="container mx-auto flex items-center justify-center gap-2 px-4 py-3 text-center text-sm font-medium text-rose-900">
          <BadgePercent size={16} />
          <span>{announcement}</span>
        </div>
      </section>

      <HeroSection />
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-4xl font-bold">Shop by Category</h2>
            <Link
              href="/categories"
              className="text-sm font-semibold text-gray-700"
            >
              View all categories
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {categories.slice(0, 3).map((category) => (
              <Link key={category._id} href={`/categories/${category.slug}`}>
                <div className="group relative h-72 overflow-hidden rounded-2xl bg-stone-100">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h3 className="text-2xl font-bold">{category.name}</h3>
                    <p className="mt-2 text-sm text-stone-200">
                      {category.description ||
                        "Curated essentials for your customers."}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rose-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-4xl font-bold">Featured Products</h2>
            <Link href="/products">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {(featuredProducts.length
              ? featuredProducts
              : products.slice(0, 4)
            ).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4 grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="mb-8 text-4xl font-bold">Best Selling Right Now</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {bestSellingProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-8 text-4xl font-bold">New Arrivals</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-950 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold">
              Loved by everyday beauty buyers
            </h2>
            <p className="mt-4 text-stone-300">
              Premium feel, reliable delivery, and an easy cash-on-delivery
              experience.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              "The product quality feels premium, and delivery is always smooth.",
              "Perfect mix of trendy makeup and regular skincare essentials.",
              "Customers love that they can confirm orders without payment gateway hassles.",
            ].map((quote) => (
              <div
                key={quote}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <p className="text-lg leading-7 text-stone-100">{quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rose-100 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Stay in the beauty loop</h2>
            <p className="mb-6 mt-4 text-gray-700">
              Get product drops, seasonal offers, and customer-favorite picks.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-rose-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
