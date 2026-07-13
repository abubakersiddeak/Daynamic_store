import { Category } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface ShopByCategorySectionProps {
  categories: Category[];
}

export default function ShopByCategorySection({
  categories,
}: ShopByCategorySectionProps) {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-bold sm:text-4xl">Shop by Category</h2>
          <Link
            href="/categories"
            className="inline-flex items-center text-sm font-semibold text-gray-700 transition hover:text-black"
          >
            View all categories
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 3).map((category: Category) => (
            <Link key={category._id} href={`/categories/${category.slug}`}>
              <div className="group relative min-h-[22rem] overflow-hidden rounded-[28px] bg-stone-100 shadow-lg shadow-stone-200/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-rose-200 to-stone-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
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
  );
}
