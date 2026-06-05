import mongoose, { Schema, Document } from "mongoose";
import { Review as IReview } from "@/types";

export interface IReviewDocument extends Omit<IReview, "_id">, Document {}

const reviewSchema = new Schema<IReviewDocument>(
  {
    productId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Product",
      required: true,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Review =
  mongoose.models.Review ||
  mongoose.model<IReviewDocument>("Review", reviewSchema);
