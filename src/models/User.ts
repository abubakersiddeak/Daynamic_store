import { IUserModel } from "@/types/modelTyps";
import mongoose, { Schema, Model } from "mongoose";

// --- Main User Schema ---
const userSchema = new Schema<IUserModel>(
  {
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },

    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // ডাটাবেজ থেকে ডাটা কুয়েরি করার সময় পাসওয়ার্ড আসবে না
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    phone: { type: String }, // Number এর বদলে String (০ অক্ষুণ্ণ রাখতে)
  },

  { timestamps: true },
);

// --- Export Model ---
const UserModel: Model<IUserModel> =
  mongoose.models.User || mongoose.model<IUserModel>("User", userSchema);

export default UserModel;
