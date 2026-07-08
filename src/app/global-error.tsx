"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center px-6 py-16">
          <div className="max-w-md text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Error
            </p>
            <h1 className="mt-3 text-3xl font-bold text-gray-950">
              Something went wrong
            </h1>
            <p className="mt-3 text-gray-600">
              Please try again. If the problem continues, check the server logs.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 inline-flex rounded-md bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
