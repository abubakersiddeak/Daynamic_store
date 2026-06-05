"use server";

import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { productCreateSchema, productUpdateSchema } from "@/validations";
import { revalidatePath } from "next/cache";

interface ProductQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: "newest" | "price-asc" | "price-desc" | "rating";
}

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProduct(formData: FormData) {
  try {
    await connectDB();

    const data = {
      name: formData.get("name"),
      slug: formData.get("slug") || undefined,
      description: formData.get("description"),
      price: formData.get("price"),
      discountPrice: formData.get("discountPrice") || undefined,
      category: formData.get("category"),
      stock: formData.get("stock"),
      images: JSON.parse(formData.get("images") as string) || [],
      tags: JSON.parse(formData.get("tags") as string) || [],
      isFeatured: formData.get("isFeatured") === "true",
      isBestSeller: formData.get("isBestSeller") === "true",
    };

    const validated = productCreateSchema.parse(data);

    const product = new Product({
      ...validated,
      slug: validated.slug || createSlug(validated.name),
    });
    await product.save();

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true, product: product.toObject() };
  } catch (error) {
    console.error("Create product error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    await connectDB();

    const data = {
      name: formData.get("name"),
      slug: formData.get("slug") || undefined,
      description: formData.get("description"),
      price: formData.get("price"),
      discountPrice: formData.get("discountPrice") || undefined,
      category: formData.get("category"),
      stock: formData.get("stock"),
      images: JSON.parse(formData.get("images") as string) || [],
      tags: JSON.parse(formData.get("tags") as string) || [],
      isFeatured: formData.get("isFeatured") === "true",
      isBestSeller: formData.get("isBestSeller") === "true",
    };

    const validated = productUpdateSchema.parse(data);
    const payload = {
      ...validated,
      slug:
        validated.slug ||
        (validated.name ? createSlug(validated.name) : undefined),
    };

    const product = await Product.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);

    return { success: true, product: product.toObject() };
  } catch (error) {
    console.error("Update product error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    await connectDB();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("Delete product error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}

export async function getProducts(
  pageOrOptions: number | ProductQueryOptions = 1,
  limit: number = 12,
) {
  try {
    await connectDB();

    const options =
      typeof pageOrOptions === "number"
        ? { page: pageOrOptions, limit }
        : pageOrOptions;

    const pageValue = options.page ?? 1;
    const limitValue = options.limit ?? 12;
    const skip = (pageValue - 1) * limitValue;
    const query: Record<string, unknown> = {};

    if (options.search) {
      query.$or = [
        { name: { $regex: options.search, $options: "i" } },
        { description: { $regex: options.search, $options: "i" } },
        { tags: { $regex: options.search, $options: "i" } },
      ];
    }

    if (options.category) {
      query.category = options.category;
    }

    const sortMap = {
      newest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      rating: { rating: -1, reviews: -1 },
    } as const;

    const sort =
      sortMap[options.sortBy ?? "newest"] ?? sortMap.newest;

    const products = await Product.find(query)
      .skip(skip)
      .limit(limitValue)
      .sort(sort);
    const total = await Product.countDocuments(query);

    return {
      success: true,
      products: products.map((p) => p.toObject()),
      pagination: {
        page: pageValue,
        limit: limitValue,
        total,
        pages: Math.ceil(total / limitValue),
      },
    };
  } catch (error) {
    console.error("Get products error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch products",
    };
  }
}

export async function getProductById(id: string) {
  try {
    await connectDB();

    const product = await Product.findById(id);

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return { success: true, product: product.toObject() };
  } catch (error) {
    console.error("Get product error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch product",
    };
  }
}

export async function searchProducts(
  query: string,
  page: number = 1,
  limit: number = 12,
) {
  return getProducts({ search: query, page, limit });
}
