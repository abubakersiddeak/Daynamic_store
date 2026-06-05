import { z } from "zod";

const optionalText = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional(),
);

const optionalEmail = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().email("Invalid email").optional(),
);

export const productCreateSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  discountPrice: z
    .union([z.coerce.number().min(0), z.literal(""), z.undefined()])
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().int().min(0, "Stock must be non-negative"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  tags: z.array(z.string()).optional().default([]),
  isFeatured: z.coerce.boolean().optional().default(false),
  isBestSeller: z.coerce.boolean().optional().default(false),
});

export const productUpdateSchema = productCreateSchema.partial();

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
  parent: z.string().optional(),
});

export const orderSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 characters")
    .regex(/^[0-9\s\-\+\(\)]+$/, "Invalid phone format"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  email: optionalEmail,
  city: optionalText,
  postalCode: optionalText,
  notes: optionalText,
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      quantity: z.coerce.number().int().min(1),
      price: z.coerce.number().min(0),
      image: z.string(),
    }),
  ),
  subtotal: z.coerce.number().min(0),
  shippingCharge: z.coerce.number().default(0),
  total: z.coerce.number().min(0),
});

export const reviewSchema = z.object({
  customerName: z.string().min(2),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10),
});

export const storeSettingsSchema = z.object({
  storeName: z.string().min(2),
  storeDescription: optionalText,
  phone: optionalText,
  email: optionalEmail,
  address: optionalText,
  city: optionalText,
  postalCode: optionalText,
  currency: z.string().default("PKR"),
  shippingCharge: z.coerce.number().default(0),
  bannerImage: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().url().optional(),
  ),
  heroTitle: optionalText,
  heroSubtitle: optionalText,
  announcement: optionalText,
  socialLinks: z
    .object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      twitter: z.string().optional(),
    })
    .optional(),
});

export type ProductFormData = z.infer<typeof productCreateSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;
