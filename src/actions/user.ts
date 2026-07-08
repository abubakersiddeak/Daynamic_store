"use server";

import bcrypt from "bcryptjs";
import User, { UserRole } from "@/models/UserModel";
import { connectDB } from "@/lib/db";

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export async function createUser(payload: CreateUserPayload) {
  try {
    await connectDB();

    const { name, email, password, phone } = payload;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return {
        success: false,
        message: "User already exists.",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: UserRole.CUSTOMER,
      provider: "credentials",
    });

    return {
      success: true,
      message: "User created successfully.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Something went wrong.",
    };
  }
}
