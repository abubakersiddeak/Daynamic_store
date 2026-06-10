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
  console.log(typeof categories);
  return (
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
          {categories.slice(0, 3).map((category: Category) => (
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
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />
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
