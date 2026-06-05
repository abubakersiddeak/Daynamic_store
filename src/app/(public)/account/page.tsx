import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AccountPlaceholderPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto max-w-2xl px-4 text-center">
        <h1 className="text-4xl font-bold">Customer Account</h1>
        <p className="mt-4 text-gray-600">
          This route is intentionally in place for future authentication and
          account history features. The storefront currently supports full guest
          checkout with cash on delivery.
        </p>
        <div className="mt-8">
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
