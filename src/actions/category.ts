"use server";

import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { categorySchema } from "@/validations";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  try {
    await connectDB();

    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      image: formData.get("image"),
      parent: formData.get("parent") || undefined,
    };

    const validated = categorySchema.parse(data);

    const category = new Category(validated);
    await category.save();

    revalidatePath("/admin/categories");
    revalidatePath("/categories");

    return { success: true, category: category.toObject() };
  } catch (error) {
    console.error("Create category error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create category",
    };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    await connectDB();

    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      image: formData.get("image"),
      parent: formData.get("parent") || undefined,
    };

    const validated = categorySchema.parse(data);

    const category = await Category.findByIdAndUpdate(id, validated, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/categories");

    return { success: true, category: category.toObject() };
  } catch (error) {
    console.error("Update category error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update category",
    };
  }
}

export async function deleteCategory(id: string) {
  try {
    await connectDB();

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/categories");

    return { success: true };
  } catch (error) {
    console.error("Delete category error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}

export async function getCategories() {
  try {
    await connectDB();

    const categories = await Category.find().sort({ parent: 1, createdAt: -1 });

    return {
      success: true,
      categories: categories.map((c) => c.toObject()),
    };
  } catch (error) {
    console.error("Get categories error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch categories",
    };
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    await connectDB();

    const category = await Category.findOne({ slug });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    return { success: true, category: category.toObject() };
  } catch (error) {
    console.error("Get category error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch category",
    };
  }
}
