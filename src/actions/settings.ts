"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { StoreSettings } from "@/models/StoreSettings";
import { storeSettingsSchema } from "@/validations";

export async function getStoreSettings(fields: string = "") {
  try {
    await connectDB();

    let settings = await StoreSettings.findOne()
      .select(fields || "")
      .lean();

    if (!settings) {
      settings = await StoreSettings.create({
        storeName: "My Store",
        storeDescription: "Premium cosmetics and beauty products",
        currency: "BDT",
        shippingCharge: 0,
        heroTitle: "",
        heroSubtitle: "",
        announcement: "",
      }).then((doc) => doc.toObject());
    }

    return {
      success: true,
      settings: JSON.parse(JSON.stringify(settings)),
    };
  } catch (error) {
    console.error("Get store settings error:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch settings",
    };
  }
}

export async function updateStoreSettings(formData: FormData) {
  try {
    await connectDB();

    const data = {
      storeName: formData.get("storeName"),
      storeDescription: formData.get("storeDescription"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      city: formData.get("city"),
      postalCode: formData.get("postalCode"),
      currency: formData.get("currency"),
      shippingCharge: formData.get("shippingCharge"),
      bannerImage: formData.get("bannerImage"),
      heroTitle: formData.get("heroTitle"),
      heroSubtitle: formData.get("heroSubtitle"),
      announcement: formData.get("announcement"),
      socialLinks: {
        facebook: formData.get("facebook"),
        instagram: formData.get("instagram"),
        twitter: formData.get("twitter"),
      },
    };

    const validated = storeSettingsSchema.parse(data);

    const settings = await StoreSettings.findOneAndUpdate({}, validated, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/admin/settings");

    return { success: true, settings: settings.toObject() };
  } catch (error) {
    console.error("Update store settings error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update settings",
    };
  }
}
