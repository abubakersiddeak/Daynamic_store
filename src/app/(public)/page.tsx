import { getProducts } from "@/actions/product";
import { getCategories } from "@/actions/category";
import { getStoreSettings } from "@/actions/settings";
import { BadgePercent } from "lucide-react";
import HeroSection from "./components/HeroSection";
import { Product } from "@/types";
import ShopByCategorySection from "./components/ShopByCategorySection";
import FeaturedProductsSection from "./components/FeaturedProductsSection";
import NewArrivalsSection from "./components/NewArrivalsSection";
import BannerSection from "./components/BannerSection";
import SubscribeSection from "./components/SubscribeSection";

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
    .filter((product: Product) => product.isFeatured)
    .slice(0, 4);
  const bestSellingProducts = products
    .filter((product: Product) => product.isBestSeller || product.reviews > 120)
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
      <ShopByCategorySection categories={categories} />
      <FeaturedProductsSection
        featuredProducts={featuredProducts}
        products={products}
      />
      <NewArrivalsSection
        bestSellingProducts={bestSellingProducts}
        newArrivals={newArrivals}
      />
      <BannerSection />
      <SubscribeSection />
    </>
  );
}
