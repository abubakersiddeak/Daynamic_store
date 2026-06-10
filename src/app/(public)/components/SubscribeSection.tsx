import { Button } from "@/components/ui/Button";
import React from "react";

export default function SubscribeSection() {
  return (
    <section className="bg-rose-100 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Stay in the beauty loop</h2>
          <p className="mb-6 mt-4 text-gray-700">
            Get product drops, seasonal offers, and customer-favorite picks.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-rose-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
