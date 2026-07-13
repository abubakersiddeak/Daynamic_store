"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductById, getProducts } from "@/actions/product";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cart";
import { Product } from "@/types";
import { formatCurrency } from "@/utils/helpers";
import { ChevronRight, Star, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setProductId(resolved.id);
    };

    void resolveParams();
  }, [params]);

  useEffect(() => {
    if (!productId) return;

    async function loadData() {
      setLoading(true);
      try {
        const [productRes, productsRes] = await Promise.all([
          getProductById(productId),
          getProducts(1, 4),
        ]);

        if (productRes.success) {
          setProduct(productRes.product);
          setSelectedImage(productRes.product.images[0]);
        }

        if (productsRes.success && productsRes.products) {
          setRelatedProducts(
            productsRes.products.filter((p: Product) => p._id !== productId),
          );
        }
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      productId: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity,
      image: product.images[0],
    });

    toast.success("Added to cart!");
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg aspect-square animate-pulse" />
            <div>
              <div className="h-8 bg-gray-200 rounded mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-8 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100,
      )
    : 0;

  return (
    <div className="min-h-screen bg-[#fdf6f3]">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm">
          <Link href="/" className="hover:text-rose-900">
            Home
          </Link>
          <ChevronRight size={16} />
          <Link href="/products" className="hover:text-rose-900">
            Products
          </Link>
          <ChevronRight size={16} />
          <span className="text-stone-900">{product.name}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-20">
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[28px] bg-stone-100 shadow-inner shadow-stone-200">
                <Image
                  key={selectedImage}
                  src={selectedImage || product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                {hasDiscount && (
                  <div className="absolute top-4 left-4 inline-flex rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-900/20">
                    -{discountPercentage}%
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`relative overflow-hidden rounded-2xl border transition duration-200 ${
                      selectedImage === image
                        ? "border-rose-500 shadow-lg shadow-rose-200/60"
                        : "border-gray-200 hover:border-rose-300"
                    }`}
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={image}
                        alt={`Product ${index}`}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl mb-4">
                {product.name}
              </h1>

              <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-600">
                <span className="font-semibold">Category:</span>
                <span>{product.category}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-stone-900">
                  {formatCurrency(displayPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <Badge variant="default">
                    In Stock ({product.stock} available)
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Tags:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Section */}
              {product.stock > 0 && (
                <div className="mb-8 space-y-4">
                  <div className="flex max-w-xs items-center rounded-full border border-gray-200 bg-stone-50 p-1 shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-lg text-gray-600 transition hover:bg-white"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 border-none bg-transparent text-center text-base font-semibold outline-none"
                    />
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-lg text-gray-600 transition hover:bg-white"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="w-full gap-2"
                  >
                    <ShoppingCart className="mr-2" size={20} />
                    Add to Cart
                  </Button>
                </div>
              )}

              {/* Additional Info */}
              <div className="border-t pt-8">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Category</p>
                    <p className="font-semibold">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">SKU</p>
                    <p className="font-semibold">
                      {product._id.substring(0, 8)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((related) => (
                  <ProductCard key={related._id} product={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
