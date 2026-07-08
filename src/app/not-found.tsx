import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-gray-950">
          Page not found
        </h1>
        <p className="mt-3 text-gray-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-md bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
