import { Button } from "@/components/ui/Button";
import React from "react";

export default function SubscribeSection() {
  return (
    <section className="bg-rose-100 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-rose-200 bg-white p-8 shadow-2xl shadow-rose-200/20">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Stay in the beauty loop
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-700">
              Get product drops, seasonal offers, and customer-favorite picks
              delivered straight to your inbox.
            </p>
          </div>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-[20px] border border-rose-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
            />
            <Button type="submit" className="w-full sm:w-auto">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
