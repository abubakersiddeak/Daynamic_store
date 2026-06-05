"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories } from "@/actions/category";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Category } from "@/types";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      try {
        const result = await getCategories();
        if (result.success && result.categories) {
          setCategories(result.categories);
        }
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-gray-600">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight size={16} />
          <span>Categories</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">Shop by Category</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-lg aspect-video animate-pulse"
              />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category._id} href={`/categories/${category.slug}`}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {category.image && (
                    <div className="relative w-full h-60 bg-gray-200">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    {category.description && (
                      <p className="text-gray-600 text-sm mb-4">
                        {category.description}
                      </p>
                    )}
                    <Button variant="outline" className="w-full">
                      Shop Now →
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
}
