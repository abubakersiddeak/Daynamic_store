"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { createOrder } from "@/actions/order";
import { getStoreSettings } from "@/actions/settings";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/helpers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  Package,
  MapPin,
  User,
  FileText,
  Banknote,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema } from "@/validations";

// ─── Types ─────────────────────────────────────────────────────────────────
type OrderFormData = {
  customerName: string;
  phone: string;
  address: string;
  email?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
};

interface StoreSettings {
  shippingCharge: number;
  currency: string;
}

// ─── Step Indicator ─────────────────────────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: "Cart", step: 1 },
    { label: "Checkout", step: 2 },
    { label: "Confirmation", step: 3 },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-6 sm:mb-8">
      {steps.map((s, index) => (
        <div key={s.step} className="flex items-center">
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                text-xs sm:text-sm font-bold transition-all duration-300
                ${
                  s.step < currentStep
                    ? "bg-green-500 text-white"
                    : s.step === currentStep
                      ? "bg-black text-white shadow-lg scale-110"
                      : "bg-gray-200 text-gray-500"
                }
              `}
            >
              {s.step < currentStep ? <CheckCircle2 size={16} /> : s.step}
            </div>
            <span
              className={`
                text-xs mt-1 font-medium hidden sm:block
                ${s.step === currentStep ? "text-black" : "text-gray-400"}
              `}
            >
              {s.label}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`
                w-12 sm:w-20 h-0.5 mx-1 sm:mx-2 transition-all duration-300
                ${s.step < currentStep ? "bg-green-500" : "bg-gray-200"}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Empty Cart State ───────────────────────────────────────────────────────
function EmptyCheckout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/cart" className="hover:text-black transition-colors">
              Cart
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Checkout</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-20">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-gray-400 sm:w-12 sm:h-12" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">
            Your Cart is Empty
          </h1>
          <p className="text-gray-500 mb-8 text-sm sm:text-base leading-relaxed">
            Please add items to your cart before checking out.
          </p>
          <Link href="/products" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              <ArrowLeft size={18} />
              Back to Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Section Header ─────────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-gray-600" />
      </div>
      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
        {title}
      </h3>
    </div>
  );
}

// ─── Main Checkout Page ─────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  // ── Form setup ────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(
      orderSchema.pick({
        customerName: true,
        phone: true,
        address: true,
        email: true,
        city: true,
        postalCode: true,
        notes: true,
      }),
    ),
  });

  // ── Fetch dynamic shipping charge ─────────────────────────────────────────
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
        setSettings({ shippingCharge: 50, currency: "BDT" });
      } finally {
        setSettingsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // ── Calculations ──────────────────────────────────────────────────────────
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shippingCharge = subtotal === 0 ? 0 : (settings?.shippingCharge ?? 0);
  const total = subtotal + shippingCharge;
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // ── Submit handler ────────────────────────────────────────────────────────
  const onSubmit = async (data: OrderFormData) => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      }));

      const formData = new FormData();
      formData.append("customerName", data.customerName);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("email", data.email || "");
      formData.append("city", data.city || "");
      formData.append("postalCode", data.postalCode || "");
      formData.append("notes", data.notes || "");
      formData.append("items", JSON.stringify(orderItems));
      formData.append("subtotal", subtotal.toString());
      formData.append("shippingCharge", shippingCharge.toString());
      formData.append("total", total.toString());

      const result = await createOrder(formData);

      if (result.success) {
        toast.success("🎉 Order placed successfully!");
        clearCart();
        router.push(`/order-confirmation/${result.order._id}`);
      } else {
        toast.error(result.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Empty state ───────────────────────────────────────────────────────────
  if (items.length === 0) return <EmptyCheckout />;

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Sticky Breadcrumb ── */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-black transition-colors">
                Home
              </Link>
              <ChevronRight size={14} />
              <Link href="/cart" className="hover:text-black transition-colors">
                Cart
              </Link>
              <ChevronRight size={14} />
              <span className="text-gray-900 font-medium">Checkout</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShoppingBag size={16} />
              <span>
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-10">
        {/* ── Step Indicator ── */}
        <StepIndicator currentStep={2} />

        {/* ── Page Title ── */}
        <div className="mb-5 lg:hidden">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete your order details below
          </p>
        </div>

        {/* ── Mobile: Collapsible Order Summary ── */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setOrderSummaryOpen((prev) => !prev)}
            className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Package size={16} className="text-gray-600" />
              <span>{orderSummaryOpen ? "Hide" : "Show"} Order Summary</span>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {totalItems} items
              </span>
            </div>
            <div className="flex items-center gap-2">
              {settingsLoading ? (
                <Loader2 size={14} className="animate-spin text-gray-400" />
              ) : (
                <span className="font-bold text-sm">
                  {formatCurrency(total)}
                </span>
              )}
              <ChevronRight
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${
                  orderSummaryOpen ? "rotate-90" : ""
                }`}
              />
            </div>
          </button>

          {/* Collapsible Content */}
          {orderSummaryOpen && (
            <div className="mt-2 bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0"
                  >
                    <div className="relative w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-1 text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-sm text-gray-900 flex-shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  {settingsLoading ? (
                    <Loader2 size={14} className="animate-spin text-gray-400" />
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
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total</span>
                  {settingsLoading ? (
                    <Loader2 size={14} className="animate-spin text-gray-400" />
                  ) : (
                    <span>{formatCurrency(total)}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Main Grid ── */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* ════════════════════════════════════════
              LEFT – Checkout Form
          ════════════════════════════════════════ */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Desktop title */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-500 mt-1">
                Fill in your details to complete the order
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              {/* ── Personal Information ── */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
                <SectionHeader icon={User} title="Personal Information" />
                <div className="space-y-4">
                  <Input
                    label="Full Name *"
                    placeholder="John Doe"
                    {...register("customerName")}
                    error={errors.customerName?.message}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      placeholder="john@example.com"
                      {...register("email")}
                      error={errors.email?.message}
                    />
                    <Input
                      label="Phone Number *"
                      placeholder="+880 1700 000000"
                      {...register("phone")}
                      error={errors.phone?.message}
                    />
                  </div>
                </div>
              </div>

              {/* ── Delivery Address ── */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
                <SectionHeader icon={MapPin} title="Delivery Address" />
                <div className="space-y-4">
                  <TextArea
                    label="Street Address *"
                    placeholder="123 Main Street, Apt 4B"
                    {...register("address")}
                    error={errors.address?.message}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="City"
                      placeholder="Dhaka"
                      {...register("city")}
                      error={errors.city?.message}
                    />
                    <Input
                      label="Postal Code"
                      placeholder="1000"
                      {...register("postalCode")}
                      error={errors.postalCode?.message}
                    />
                  </div>
                </div>
              </div>

              {/* ── Additional Notes ── */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
                <SectionHeader icon={FileText} title="Additional Notes" />
                <TextArea
                  label=""
                  placeholder="Any special delivery instructions or notes..."
                  {...register("notes")}
                  error={errors.notes?.message}
                />
              </div>

              {/* ── Payment Method ── */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
                <SectionHeader icon={Banknote} title="Payment Method" />
                <label className="flex items-start sm:items-center gap-3 p-3 sm:p-4 border-2 border-black rounded-xl cursor-pointer bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    defaultChecked
                    className="mt-0.5 sm:mt-0 accent-black w-4 h-4 flex-shrink-0"
                  />
                  <div className="flex items-start sm:items-center gap-3 flex-1">
                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Banknote size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Pay when you receive your order
                      </p>
                    </div>
                  </div>
                  <CheckCircle2
                    size={20}
                    className="text-black flex-shrink-0 hidden sm:block"
                  />
                </label>
              </div>

              {/* ── Mobile: Place Order CTA ── */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  isLoading={isSubmitting}
                  disabled={settingsLoading || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Placing Order...
                    </>
                  ) : settingsLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Place Order · {formatCurrency(total)}
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-gray-400 mt-2">
                  🔒 Your information is secure and encrypted
                </p>
              </div>

              {/* Back to cart (mobile) */}
              <div className="lg:hidden">
                <Link href="/cart">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    type="button"
                  >
                    <ArrowLeft size={16} />
                    Back to Cart
                  </Button>
                </Link>
              </div>
            </form>
          </div>

          {/* ════════════════════════════════════════
              RIGHT – Order Summary (Desktop)
          ════════════════════════════════════════ */}
          <div className="order-1 lg:order-2 lg:col-span-1 hidden lg:block">
            <div className="lg:sticky lg:top-20 space-y-4">
              <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package size={20} className="text-gray-600" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items list */}
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0"
                      >
                        <div className="relative w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold line-clamp-2 text-gray-900 leading-tight">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-semibold text-sm text-gray-900 flex-shrink-0">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Subtotal ({totalItems}{" "}
                        {totalItems === 1 ? "item" : "items"})
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      {settingsLoading ? (
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <Loader2 size={12} className="animate-spin" />
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

                    {!settingsLoading &&
                      shippingCharge === 0 &&
                      subtotal > 0 && (
                        <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
                          🎉 You qualify for free shipping!
                        </p>
                      )}

                    <div className="flex justify-between font-bold text-base border-t pt-3">
                      <span>Total</span>
                      {settingsLoading ? (
                        <Loader2
                          size={16}
                          className="animate-spin text-gray-400"
                        />
                      ) : (
                        <span>{formatCurrency(total)}</span>
                      )}
                    </div>

                    {settings?.currency && (
                      <p className="text-xs text-gray-400 text-center">
                        All prices in {settings.currency}
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="space-y-3 pt-1">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gap-2"
                      isLoading={isSubmitting}
                      disabled={settingsLoading || isSubmitting}
                      onClick={handleSubmit(onSubmit)}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Placing Order...
                        </>
                      ) : settingsLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          Place Order
                        </>
                      )}
                    </Button>

                    <Link href="/cart" className="block">
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        type="button"
                      >
                        <ArrowLeft size={16} />
                        Back to Cart
                      </Button>
                    </Link>
                  </div>

                  {/* Trust badges */}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-center gap-3 text-xs text-gray-400 flex-wrap">
                      <span>🔒 Secure Checkout</span>
                      <span>•</span>
                      <span>📦 Fast Delivery</span>
                      <span>•</span>
                      <span>✅ COD Available</span>
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
