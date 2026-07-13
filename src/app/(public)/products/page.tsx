"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/actions/product";
import { getCategories } from "@/actions/category";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Product, Category } from "@/types";
import { ChevronRight } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts({
            page,
            limit: 12,
            search: searchQuery || undefined,
            category: selectedCategory || undefined,
            sortBy: sortBy as "newest" | "price-asc" | "price-desc" | "rating",
          }),
          getCategories(),
        ]);

        if (productsRes.success && productsRes.products) {
          setProducts(productsRes.products);
          if (productsRes.pagination) {
            setTotalPages(productsRes.pagination.pages);
          }
        }

        if (categoriesRes.success && categoriesRes.categories) {
          setCategories(categoriesRes.categories);
        }
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [page, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[#fdf6f3]">
      <div className="container mx-auto px-4 py-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50/80 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm">
          <Link href="/" className="hover:text-rose-900">
            Home
          </Link>
          <ChevronRight size={16} />
          <span>Products</span>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.5fr_0.7fr] lg:items-end">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">
              Curated beauty collection
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Discover your next favorite product
            </h1>
            <p className="mt-4 max-w-2xl text-gray-600">
              Browse premium skincare, makeup, and beauty essentials with quick
              filters and easy sorting.
            </p>
          </div>

          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm shadow-stone-200/60">
            <h3 className="mb-4 text-lg font-semibold text-stone-900">
              Shop with filters
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              Narrow your search by category, sort by price, or clear filters
              anytime.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search products
                </label>
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setPage(1);
                    setSearchQuery(e.target.value);
                  }}
                  className="bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select
                  value={selectedCategory}
                  onChange={(e) => {
                    setPage(1);
                    setSelectedCategory(e.target.value);
                  }}
                  options={[
                    { value: "", label: "All Categories" },
                    ...categories.map((cat) => ({
                      value: cat._id,
                      label: cat.name,
                    })),
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <Select
                  value={sortBy}
                  onChange={(e) => {
                    setPage(1);
                    setSortBy(e.target.value);
                  }}
                  options={[
                    { value: "newest", label: "Newest" },
                    { value: "price-asc", label: "Price: Low to High" },
                    { value: "price-desc", label: "Price: High to Low" },
                    { value: "rating", label: "Highest Rated" },
                  ]}
                />
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setPage(1);
                  setSearchQuery("");
                  setSelectedCategory("");
                  setSortBy("newest");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-6 shadow-sm shadow-stone-200/40">
          <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-stone-900">
                All Products
              </h2>
              <p className="mt-1 text-gray-500">
                Explore {products.length}{" "}
                {products.length === 1 ? "product" : "products"} on this page.
              </p>
            </div>
            <p className="text-sm text-gray-500">
              {loading
                ? "Updating catalog..."
                : `${products.length} product${products.length === 1 ? "" : "s"} shown`}
            </p>
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square animate-pulse rounded-[28px] bg-gray-200"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
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
              <div className="py-16 text-center">
                <p className="text-lg text-gray-600">No products found</p>
                <p className="mt-2 text-sm text-gray-500">
                  Try a different search term, category, or sort option.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
