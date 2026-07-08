import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createUser } from "@/actions/user";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface RegisterPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Enter a valid email"),
    phone: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value ? value : undefined)),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function getErrorMessage(error?: string) {
  if (error === "exists") {
    return "An account with this email already exists.";
  }

  if (error === "invalid") {
    return "Please check your details and try again.";
  }

  if (error) {
    return "Something went wrong. Please try again.";
  }

  return null;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);

  async function register(formData: FormData) {
    "use server";

    const parsed = registerSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      redirect("/register?error=invalid");
    }

    const result = await createUser({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      password: parsed.data.password,
    });

    if (!result.success) {
      const error = result.message === "User already exists." ? "exists" : "server";
      redirect(`/register?error=${error}`);
    }

    redirect("/login?registered=1&callbackUrl=/account");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto max-w-md px-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-950">Create account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Register to save your details for future orders.
          </p>

          {errorMessage && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <form action={register} className="mt-6 space-y-4">
            <Input
              label="Name"
              name="name"
              type="text"
              autoComplete="name"
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
            <Input
              label="Phone"
              name="phone"
              type="tel"
              autoComplete="tel"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login?callbackUrl=/account"
              className="font-medium text-gray-950 underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
