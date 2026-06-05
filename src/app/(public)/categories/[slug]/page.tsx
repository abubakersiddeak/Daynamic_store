"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategoryBySlug } from "@/actions/category";
import { getProducts } from "@/actions/product";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ProductCard";
import { Product, Category } from "@/types";
import { ChevronRight } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setSlug(resolved.slug);
    };

    void resolveParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const categoryRes = await getCategoryBySlug(slug);
        if (!categoryRes.success || !categoryRes.category) {
          setCategory(null);
          setProducts([]);
          return;
        }

        setCategory(categoryRes.category);

        const productsRes = await getProducts({
          page,
          limit: 12,
          category: categoryRes.category._id,
        });

        if (productsRes.success && productsRes.products) {
          setProducts(productsRes.products);
          if (productsRes.pagination) {
            setTotalPages(productsRes.pagination.pages);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [slug, page]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 h-10 animate-pulse rounded bg-gray-200" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-2xl font-bold">Category not found</h1>
          <Link href="/categories">
            <Button>Back to Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-gray-600">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight size={16} />
          <Link href="/categories" className="hover:text-black">
            Categories
          </Link>
          <ChevronRight size={16} />
          <span>{category.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-4 text-4xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="mb-8 max-w-3xl text-gray-600">{category.description}</p>
        )}

        {products.length > 0 ? (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(Math.max(1, page - 1))}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={page === i + 1 ? "default" : "outline"}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-600">No products in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
