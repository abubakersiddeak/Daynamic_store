"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { createOrder } from "@/actions/order";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/helpers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema } from "@/validations";

type OrderFormData = {
  customerName: string;
  phone: string;
  address: string;
  email?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shippingCharge = subtotal === 0 ? 0 : 200;
  const total = subtotal + shippingCharge;

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
        toast.success("Order placed successfully!");
        clearCart();
        router.push(`/order-confirmation/${result.order._id}`);
      } else {
        toast.error(result.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Please add items before checking out
            </p>
            <Link href="/products">
              <Button>Back to Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-600 mb-8">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight size={16} />
          <Link href="/cart" className="hover:text-black">
            Cart
          </Link>
          <ChevronRight size={16} />
          <span>Checkout</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <Input
                    label="Full Name *"
                    placeholder="John Doe"
                    {...register("customerName")}
                    error={errors.customerName?.message}
                  />

                  {/* Email */}
                  <Input
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    error={errors.email?.message}
                  />

                  {/* Phone */}
                  <Input
                    label="Phone Number *"
                    placeholder="+92 300 1234567"
                    {...register("phone")}
                    error={errors.phone?.message}
                  />

                  {/* Address */}
                  <TextArea
                    label="Address *"
                    placeholder="123 Main Street"
                    {...register("address")}
                    error={errors.address?.message}
                  />

                  {/* City */}
                  <Input
                    label="City"
                    placeholder="Karachi"
                    {...register("city")}
                    error={errors.city?.message}
                  />

                  {/* Postal Code */}
                  <Input
                    label="Postal Code"
                    placeholder="75500"
                    {...register("postalCode")}
                    error={errors.postalCode?.message}
                  />

                  {/* Notes */}
                  <TextArea
                    label="Additional Notes"
                    placeholder="Any special instructions..."
                    {...register("notes")}
                    error={errors.notes?.message}
                  />

                  {/* Payment Method */}
                  <Card className="border-2">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-4">Payment Method</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="payment"
                            value="cod"
                            defaultChecked
                          />
                          <div>
                            <p className="font-semibold">
                              Cash on Delivery (COD)
                            </p>
                            <p className="text-sm text-gray-600">
                              Pay when you receive your order
                            </p>
                          </div>
                        </label>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    isLoading={isSubmitting}
                  >
                    Place Order
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-3 pb-3 border-b"
                    >
                      <div className="relative w-16 h-16 rounded bg-gray-200 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-semibold text-sm">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {formatCurrency(shippingCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
