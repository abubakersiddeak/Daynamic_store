export default function FaqPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-4xl font-bold">Frequently Asked Questions</h1>
        <div className="space-y-6 rounded-xl bg-white p-8 shadow-sm">
          <div>
            <h2 className="font-semibold">Do you offer cash on delivery?</h2>
            <p className="mt-2 text-gray-600">
              Yes. All orders are handled as cash on delivery.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">How long does delivery take?</h2>
            <p className="mt-2 text-gray-600">
              Delivery timing depends on location, but most orders are confirmed quickly by phone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
