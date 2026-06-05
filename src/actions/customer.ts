"use server";

import { connectDB } from "@/lib/db";
import { Customer } from "@/models/Customer";

export async function getCustomers() {
  try {
    await connectDB();

    const customers = await Customer.find()
      .sort({ lastOrderAt: -1, createdAt: -1 })
      .lean();

    return { success: true, customers: JSON.parse(JSON.stringify(customers)) };
  } catch (error) {
    console.error("Get customers error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch customers",
    };
  }
}
