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
      <div className="absolute inset-0 opacity-35">
        <Image
          src={bannerImage}
          alt="Cosmetics collection"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.5),transparent_35%)]" />
      <div className="container relative mx-auto grid min-h-[78vh] items-center gap-10 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <Sparkles size={16} />
            Trusted local cosmetics store
          </p>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
            {heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-200">
            {heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/products">
              <Button size="lg">
                Shop Collection
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/categories">
              <Button size="lg" variant="outline">
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
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
              className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur"
            >
              <Icon size={18} className="mb-3 text-rose-200" />
              <p className="text-sm text-stone-300">{label}</p>
              <p className="mt-1 text-lg font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
