"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/helpers";
import { getStoreSettings } from "@/actions/settings";
import {
  Trash2,
  ChevronRight,
  ArrowLeft,
  ShoppingCart,
  Loader2,
  Package,
  Minus,
  Plus,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StoreSettings {
  shippingCharge: number;
  currency: string;
  storeName?: string;
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function CartSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-4 sm:p-6 animate-pulse shadow-sm"
        >
          <div className="flex gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty Cart ───────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Cart</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-20">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          {/* Icon */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart size={40} className="text-gray-400 sm:w-12 sm:h-12" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">
            Your Cart is Empty
          </h1>
          <p className="text-gray-500 mb-8 text-sm sm:text-base leading-relaxed">
            Looks like you haven&apos;t added any products yet. Browse our
            collection and find something you love!
          </p>

          <Link href="/products" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              <ArrowLeft size={18} />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Cart Page ───────────────────────────────────────────────────────────
export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // ── Fetch shipping charge dynamically ──────────────────────────────────────
  useEffect(() => {
    async function fetchSettings() {
      try {
        setSettingsLoading(true);
        const result = await getStoreSettings("shippingCharge currency");
        if (result.success && result.settings) {
          setSettings({
            shippingCharge: result.settings.shippingCharge ?? 0,
            currency: result.settings.currency ?? "BDT",
          });
        }
      } catch (error) {
        console.error("Failed to fetch store settings:", error);
        // Fallback to default
        setSettings({ shippingCharge: 50, currency: "BDT" });
      } finally {
        setSettingsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // ── Calculations ───────────────────────────────────────────────────────────
  const subtotal = getSubtotal();
  const shippingCharge = subtotal === 0 ? 0 : (settings?.shippingCharge ?? 0);
  const total = subtotal + shippingCharge;
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    // Small delay for animation
    await new Promise((resolve) => setTimeout(resolve, 200));
    removeItem(productId);
    setRemovingId(null);
  };

  const handleQuantityChange = (productId: string, value: string) => {
    const parsed = parseInt(value);
    if (!isNaN(parsed) && parsed >= 1) {
      updateQuantity(productId, parsed);
    }
  };

  // ── Empty State ────────────────────────────────────────────────────────────
  if (items.length === 0) return <EmptyCart />;

  // ── Main Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-black transition-colors">
                Home
              </Link>
              <ChevronRight size={14} />
              <span className="text-gray-900 font-medium">Cart</span>
            </div>
            {/* Item count badge */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShoppingCart size={16} />
              <span>
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-10">
        {/* ── Page Title (mobile) ── */}
        <div className="mb-5 lg:hidden">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* ════════════════════════════════════════
              LEFT – Cart Items
          ════════════════════════════════════════ */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Title (desktop) */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-500">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </p>
            </div>

            {/* Items List */}
            <div className="space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className={`
                    bg-white rounded-xl shadow-sm border border-gray-100
                    transition-all duration-200
                    ${removingId === item.productId ? "opacity-50 scale-95" : "opacity-100 scale-100"}
                  `}
                >
                  <div className="p-4 sm:p-6">
                    {/* ── Mobile Layout ── */}
                    <div className="flex gap-3 sm:gap-6">
                      {/* Product Image */}
                      <Link
                        href={`/products/${item.productId}`}
                        className="flex-shrink-0"
                      >
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 80px, 96px"
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        {/* Name & Price row */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Link href={`/products/${item.productId}`}>
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 leading-tight">
                              {item.name}
                            </h3>
                          </Link>
                          {/* Remove button (top-right on mobile) */}
                          <button
                            onClick={() => handleRemove(item.productId)}
                            disabled={removingId === item.productId}
                            className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 sm:hidden"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Unit Price */}
                        <p className="text-sm text-gray-500 mb-3">
                          {formatCurrency(item.price)} each
                        </p>

                        {/* ── Bottom row: Qty + Subtotal + Remove ── */}
                        <div className="flex items-center justify-between gap-3">
                          {/* Quantity Control */}
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>

                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.productId,
                                  e.target.value,
                                )
                              }
                              min={1}
                              className="w-10 sm:w-12 h-8 sm:h-9 text-center text-sm font-medium bg-gray-50 border-none outline-none focus:bg-white transition-colors"
                              aria-label="Item quantity"
                            />

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <p className="font-bold text-sm sm:text-base text-gray-900">
                            {formatCurrency(item.price * item.quantity)}
                          </p>

                          {/* Remove (desktop) */}
                          <button
                            onClick={() => handleRemove(item.productId)}
                            disabled={removingId === item.productId}
                            className="hidden sm:flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link href="/products">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <ArrowLeft size={16} />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* ════════════════════════════════════════
              RIGHT – Order Summary
          ════════════════════════════════════════ */}
          <div className="order-1 lg:order-2 lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <Package size={20} className="text-gray-600" />
                    Order Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Line Items */}
                  <div className="space-y-3">
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">
                        Subtotal ({totalItems}{" "}
                        {totalItems === 1 ? "item" : "items"})
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Shipping</span>
                      {settingsLoading ? (
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <Loader2 size={14} className="animate-spin" />
                          <span className="text-xs">Calculating...</span>
                        </span>
                      ) : (
                        <span className="font-semibold">
                          {shippingCharge === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            formatCurrency(shippingCharge)
                          )}
                        </span>
                      )}
                    </div>

                    {/* Free shipping note */}
                    {!settingsLoading &&
                      settings?.shippingCharge === 0 &&
                      subtotal > 0 && (
                        <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
                          🎉 You qualify for free shipping!
                        </p>
                      )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100" />

                  {/* Total */}
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span>Total</span>
                    {settingsLoading ? (
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <Loader2 size={14} className="animate-spin" />
                      </span>
                    ) : (
                      <span>{formatCurrency(total)}</span>
                    )}
                  </div>

                  {/* Currency note */}
                  {settings?.currency && (
                    <p className="text-xs text-gray-400 text-center">
                      All prices in {settings.currency}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  <div className="space-y-3 pt-2">
                    <Link href="/checkout" className="block">
                      <Button
                        className="w-full gap-2"
                        size="lg"
                        disabled={settingsLoading}
                      >
                        {settingsLoading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Proceed to Checkout"
                        )}
                      </Button>
                    </Link>

                    <Link href="/products" className="block">
                      <Button variant="outline" className="w-full" size="lg">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>

                  {/* Trust badges */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                      <span>🔒 Secure Checkout</span>
                      <span>•</span>
                      <span>📦 Fast Delivery</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
