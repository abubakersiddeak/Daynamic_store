"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { formatCurrency } from "@/utils/helpers";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity: 1,
      image: product.images[0],
    });
    toast.success("Added to cart!");
  };

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="group overflow-hidden rounded-2xl border border-transparent bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative w-full overflow-hidden bg-stone-100">
          <div className="aspect-square md:aspect-[4/5]">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {hasDiscount && (
            <div className="absolute top-3 right-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-lg">
              Sale
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-stone-900">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-3 p-4 md:p-5">
        <Link href={`/products/${product._id}`} className="block">
          <h3 className="text-sm md:text-base font-semibold text-stone-900 line-clamp-2 transition-colors duration-200 group-hover:text-rose-600">
            {product.name}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-base md:text-lg font-bold text-stone-900">
            {formatCurrency(displayPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-stone-500 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          variant={product.stock === 0 ? "secondary" : "default"}
          size="sm"
          className="w-full py-2"
        >
          <ShoppingCart size={16} className="mr-2" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
