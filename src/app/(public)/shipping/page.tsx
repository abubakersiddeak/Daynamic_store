export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-4xl font-bold">Shipping Information</h1>
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <p className="text-gray-700">
            Orders are processed locally and dispatched after confirmation.
            Shipping charges are calculated during checkout and can be managed
            from the admin settings page.
          </p>
        </div>
      </div>
    </div>
  );
}
