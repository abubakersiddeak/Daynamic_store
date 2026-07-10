import { Document } from "mongoose";
export interface IUserModel extends Document {
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  phone?: string;

  pushToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
