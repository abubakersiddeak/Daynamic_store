import mongoose, { Schema, Document } from "mongoose";
import { Order as IOrder } from "@/types";

export interface IOrderDocument extends Omit<IOrder, "_id">, Document {}

const orderItemSchema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  image: String,
});

const orderSchema = new Schema<IOrderDocument>(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    email: String,
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: String,
    postalCode: String,
    notes: String,
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingCharge: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

export const Order =
  mongoose.models.Order || mongoose.model<IOrderDocument>("Order", orderSchema);
