"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/user";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const result = await registerUser(form);

    setLoading(false);

    if (!result.success) {
      alert(result.message);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium">Name</label>

            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>

            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>

            <input
              required
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-black py-3 text-white hover:bg-gray-800"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
