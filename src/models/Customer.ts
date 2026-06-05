import mongoose, { Document, Schema } from "mongoose";
import { Customer as ICustomer } from "@/types";

const addressSchema = new Schema(
  {
    label: String,
    fullName: String,
    phone: String,
    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine2: String,
    city: String,
    postalCode: String,
    country: {
      type: String,
      default: "Bangladesh",
    },
  },
  { _id: false },
);

export interface ICustomerDocument extends Omit<ICustomer, "_id">, Document {}

const customerSchema = new Schema<ICustomerDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    addresses: {
      type: [addressSchema],
      default: [],
    },
    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastOrderAt: Date,
  },
  {
    timestamps: true,
  },
);

customerSchema.index({ phone: 1 }, { unique: true });
customerSchema.index({ email: 1 }, { sparse: true });
customerSchema.index({ lastOrderAt: -1 });

export const Customer =
  mongoose.models.Customer ||
  mongoose.model<ICustomerDocument>("Customer", customerSchema);
