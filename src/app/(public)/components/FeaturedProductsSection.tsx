import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/Button";
import { Product } from "@/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
type FeaturedProductsSectionProps = {
  featuredProducts: Product[];
  products: Product[];
};
export default function FeaturedProductsSection({
  featuredProducts,
  products,
}: FeaturedProductsSectionProps) {
  return (
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
          ).map((product: Product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
