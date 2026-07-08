"use server";

import { auth } from "@/auth";
import { UserRole } from "@/models/UserModel";

export async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== UserRole.ADMIN && role !== UserRole.SUPER_ADMIN) {
    throw new Error("Unauthorized");
  }

  return session;
}
