import mongoose, { Schema, Document } from "mongoose";
import { Category as ICategory } from "@/types";

export interface ICategoryDocument extends Omit<ICategory, "_id">, Document {}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    image: String,
    description: String,
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.index({ parent: 1 });

export const Category =
  mongoose.models.Category ||
  mongoose.model<ICategoryDocument>("Category", categorySchema);
