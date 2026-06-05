import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto max-w-2xl px-4 text-center">
        <h1 className="text-4xl font-bold">Track Your Order</h1>
        <p className="mt-4 text-gray-600">
          Order tracking is ready for future integration. For now, customers can
          confirm status from the order confirmation page or by phone.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/contact">
            <Button>Contact Support</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
