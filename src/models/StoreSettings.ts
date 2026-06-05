import mongoose, { Schema, Document } from "mongoose";
import { StoreSettings as IStoreSettings } from "@/types";

export interface IStoreSettingsDocument
  extends Omit<IStoreSettings, "_id">, Document {}

const storeSettingsSchema = new Schema<IStoreSettingsDocument>(
  {
    storeName: {
      type: String,
      required: true,
    },
    logo: String,

    storeDescription: String,
    phone: String,
    email: String,
    address: String,
    city: String,
    postalCode: String,
    currency: {
      type: String,
      default: "BTD",
    },
    shippingCharge: {
      type: Number,
      default: 0,
    },
    bannerImage: String,
    heroTitle: String,
    heroSubtitle: String,
    announcement: String,
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
    },
  },
  {
    timestamps: true,
  },
);

export const StoreSettings =
  mongoose.models.StoreSettings ||
  mongoose.model<IStoreSettingsDocument>("StoreSettings", storeSettingsSchema);
