import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types";
import React from "react";
type NewArrivalsSectionProps = {
  bestSellingProducts: Product[];
  newArrivals: Product[];
};

export default function NewArrivalsSection({
  bestSellingProducts,
  newArrivals,
}: NewArrivalsSectionProps) {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 grid gap-16 lg:grid-cols-2">
        <div>
          <h2 className="mb-8 text-4xl font-bold">Best Selling Right Now</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {bestSellingProducts.slice(0, 4).map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-8 text-4xl font-bold">New Arrivals</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
