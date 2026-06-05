"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, deleteProduct } from "@/actions/product";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Product } from "@/types";
import { formatCurrency } from "@/utils/helpers";
import { Trash2, Edit, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadProducts(currentPage: number) {
    setLoading(true);
    try {
      const result = await getProducts(currentPage, 10);
      if (result.success && result.products) {
        setProducts(result.products);
        if (result.pagination) {
          setTotalPages(result.pagination.pages);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProducts(page);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [page]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success("Product deleted");
        void loadProducts(page);
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch {
      toast.error("Failed to delete product");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2" size={20} />
            New Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600">No products found</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Stock</th>
                      <th className="text-left py-3 px-4">Rating</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-semibold">
                          {product.name}
                        </td>
                        <td className="py-3 px-4">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="py-3 px-4">{product.stock}</td>
                        <td className="py-3 px-4">{product.rating}/5</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Link href={`/admin/products/${product._id}`}>
                              <Button variant="outline" size="sm">
                                <Edit size={16} />
                              </Button>
                            </Link>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(product._id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(Math.max(1, page - 1))}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2">
                    {page} / {totalPages}
                  </span>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
