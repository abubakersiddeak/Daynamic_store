import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/actions/product";
import { getStoreSettings } from "@/actions/settings";
import { Button } from "@/components/ui/Button";
import { ArrowRight, BadgePercent, Sparkles, Truck } from "lucide-react";
import { Product } from "@/types";

export default async function HeroSection() {
  const [productsRes, settingsRes] = await Promise.all([
    getProducts({ page: 1, limit: 12 }),
    getStoreSettings(),
  ]);

  const products =
    productsRes.success && productsRes.products ? productsRes.products : [];

  const settings =
    settingsRes.success && settingsRes.settings ? settingsRes.settings : null;

  const bestSellingProducts = products
    .filter((product: Product) => product.isBestSeller || product.reviews > 120)
    .slice(0, 4);

  const heroTitle = settings?.heroTitle || "Luxury beauty, delivered locally";
  const heroSubtitle =
    settings?.heroSubtitle ||
    "Daily-wear skincare, statement makeup, and reliable cash-on-delivery service for your regular customers.";
  const bannerImage = settings?.bannerImage || "";

  return (
    <section className="relative overflow-hidden bg-stone-950 text-white">
      <div className="absolute inset-0">
        {bannerImage ? (
          <Image
            src={bannerImage}
            alt="Cosmetics collection"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-stone-900 via-rose-950 to-stone-800" />
        )}
      </div>
      <div className="absolute inset-0 bg-black/50" />
      <div className="container relative mx-auto grid min-h-[75vh] items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
            <Sparkles size={16} />
            Trusted local cosmetics store
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-stone-200 sm:text-lg">
            {heroSubtitle}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Link href="/products" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Shop Collection
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/categories" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {[
            {
              label: "Fast dispatch",
              value: "Orders prepared daily",
              icon: Truck,
            },
            {
              label: "Best sellers",
              value: `${bestSellingProducts.length}+ top picks ready`,
              icon: BadgePercent,
            },
            {
              label: "COD checkout",
              value: "No online payment friction",
              icon: Sparkles,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl shadow-black/10 backdrop-blur"
            >
              <Icon size={18} className="mb-3 text-rose-200" />
              <p className="text-sm text-stone-200">{label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
