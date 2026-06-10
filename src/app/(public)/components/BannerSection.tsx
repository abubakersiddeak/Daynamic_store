import React from "react";

export default function BannerSection() {
  return (
    <section className="bg-stone-950 py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold">
            Loved by everyday beauty buyers
          </h2>
          <p className="mt-4 text-stone-300">
            Premium feel, reliable delivery, and an easy cash-on-delivery
            experience.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            "The product quality feels premium, and delivery is always smooth.",
            "Perfect mix of trendy makeup and regular skincare essentials.",
            "Customers love that they can confirm orders without payment gateway hassles.",
          ].map((quote) => (
            <div
              key={quote}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-lg leading-7 text-stone-100">{quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
