"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
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
    <div className="flex flex-col gap-3 group">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            Sale
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <Link href={`/products/${product._id}`} className="flex-1">
        <h3 className="font-semibold text-gray-900 group-hover:text-black line-clamp-2">
          {product.name}
        </h3>
      </Link>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < Math.floor(product.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="text-xs text-gray-600">({product.reviews})</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg text-gray-900">
          {formatCurrency(displayPrice)}
        </span>
        {hasDiscount && (
          <span className="text-sm text-gray-500 line-through">
            {formatCurrency(product.price)}
          </span>
        )}
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        variant={product.stock === 0 ? "secondary" : "default"}
        size="sm"
        className="w-full"
      >
        <ShoppingCart size={16} className="mr-2" />
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  );
}
