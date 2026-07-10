"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserInput {
  name: string;
  email: string;
  phone?: string;
  role?: "user" | "admin";
  password?: string;
}

// ==============================
// Register User
// ==============================

export async function registerUser(data: RegisterUserInput) {
  try {
    await connectDB();

    const { name, email, password } = data;

    if (!name || !email || !password) {
      return {
        success: false,
        message: "All fields are required.",
      };
    }

    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email already exists.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
    });

    revalidatePath("/");

    return {
      success: true,
      user: JSON.parse(JSON.stringify(user)),
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Registration failed.",
    };
  }
}

// ==============================
// Update User
// ==============================

export async function updateUser(userId: string, data: UpdateUserInput) {
  try {
    await connectDB();

    const updateData: Record<string, unknown> = {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone ?? "",
      role: data.role,
    };

    if (data.password && data.password.trim() !== "") {
      updateData.password = await bcrypt.hash(data.password, 12);
    }

    const user = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    revalidatePath("/admin/users");

    return {
      success: true,
      user: JSON.parse(JSON.stringify(user)),
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Update failed.",
    };
  }
}

// ==============================
// Get Users
// ==============================

export async function getUsers(page = 1, limit = 10) {
  try {
    await connectDB();

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      UserModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),

      UserModel.countDocuments(),
    ]);

    return {
      success: true,
      users: JSON.parse(JSON.stringify(users)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch users.",
    };
  }
}

// ==============================
// Get User By ID
// ==============================

export async function getUserById(id: string) {
  try {
    await connectDB();

    const user = await UserModel.findById(id).lean();

    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    return {
      success: true,
      user: JSON.parse(JSON.stringify(user)),
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch user.",
    };
  }
}

// ==============================
// Delete User
// ==============================

export async function deleteUser(id: string) {
  try {
    await connectDB();

    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Delete failed.",
    };
  }
}

// ==============================
// User Stats
// ==============================

export async function getUserStats() {
  try {
    await connectDB();

    const [totalUsers, usersByRole] = await Promise.all([
      UserModel.countDocuments(),

      UserModel.aggregate([
        {
          $group: {
            _id: "$role",
            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    const recentUsers = await UserModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return {
      success: true,
      stats: {
        totalUsers,
        byRole: usersByRole,
        recentUsers: JSON.parse(JSON.stringify(recentUsers)),
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch stats.",
    };
  }
}
