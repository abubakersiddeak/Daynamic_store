"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getProductById, updateProduct } from "@/actions/product"; // Assumes you have these
import { getCategories } from "@/actions/category";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { uploadMultipleImages } from "@/lib/imgbb";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { Category } from "@/types";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();

  // Component States
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isFetchingProduct, setIsFetchingProduct] = useState(true);

  // Form field states for pre-populating values
  const [product, setProduct] = useState({
    name: "",
    slug: "",
    description: "",
    tagList: "",
    price: "",
    discountPrice: "",
    category: "",
    stock: "",
    isFeatured: false,
    isBestSeller: false,
  });

  // Fetch both categories and the targeted product details on mount
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Fetch categories
        const catResult = await getCategories();
        if (catResult.success && catResult.categories) {
          setCategories(catResult.categories);
        }

        // 2. Fetch target product details
        const prodResult = await getProductById(id);
        if (prodResult.success && prodResult.product) {
          const p = prodResult.product;

          setProduct({
            name: p.name || "",
            slug: p.slug || "",
            description: p.description || "",
            tagList: Array.isArray(p.tags) ? p.tags.join(", ") : "",
            price: p.price?.toString() || "",
            discountPrice: p.discountPrice?.toString() || "",
            category: p.category || "",
            stock: p.stock?.toString() || "0",
            isFeatured: !!p.isFeatured,
            isBestSeller: !!p.isBestSeller,
          });

          if (p.images) setImages(p.images);
        } else {
          toast.error(prodResult.error || "Failed to load product data");
          router.push("/admin/products");
        }
      } catch {
        toast.error("Error loading page data");
      } finally {
        setIsFetchingProduct(false);
      }
    }
    void loadData();
  }, [id, router]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingImages(true);
    try {
      const uploadedUrls = await uploadMultipleImages(files);
      setImages((prev) => [...prev, ...uploadedUrls]);
      toast.success("Images uploaded successfully");
    } catch {
      toast.error("Failed to upload images");
    } finally {
      setIsUploadingImages(false);
    }
  }

  async function handleSubmit(formData: FormData) {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsLoading(true);
    try {
      const tagList = (formData.get("tagList") as string | null) || "";
      const tags = tagList
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      // Append modified structured elements
      formData.append("images", JSON.stringify(images));
      formData.append("tags", JSON.stringify(tags));

      // Execute update server action
      const result = await updateProduct(id, formData);

      if (result.success) {
        toast.success("Product updated successfully");
        router.push("/admin/products");
      } else {
        toast.error(result.error || "Failed to update product");
      }
    } catch {
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetchingProduct) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">Loading product information...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          ← Back
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

      <form
        action={async (formData: FormData) => {
          await handleSubmit(formData);
        }}
        className="max-w-2xl space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              label="Product Name *"
              name="name"
              defaultValue={product.name}
              required
            />
            <Input
              label="Slug"
              name="slug"
              placeholder="radiant-beauty-foundation"
              defaultValue={product.slug}
            />
            <TextArea
              label="Description *"
              name="description"
              defaultValue={product.description}
              required
            />
            <Input
              label="Tags"
              name="tagList"
              placeholder="foundation, hydrating, bestseller"
              defaultValue={product.tagList}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price *"
                name="price"
                type="number"
                step="0.01"
                defaultValue={product.price}
                required
              />
              <Input
                label="Discount Price"
                name="discountPrice"
                type="number"
                step="0.01"
                defaultValue={product.discountPrice}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Category *"
                name="category"
                defaultValue={product.category}
                options={categories.map((c) => ({
                  value: c._id,
                  label: c.name,
                }))}
                required
              />
              <Input
                label="Stock *"
                name="stock"
                type="number"
                defaultValue={product.stock}
                required
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium">
                <input
                  type="checkbox"
                  name="isFeatured"
                  value="true"
                  defaultChecked={product.isFeatured}
                />
                Feature on homepage
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium">
                <input
                  type="checkbox"
                  name="isBestSeller"
                  value="true"
                  defaultChecked={product.isBestSeller}
                />
                Mark as best seller
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <label className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                <Upload size={32} className="text-gray-400" />
                <div className="text-center">
                  <p className="font-semibold">Click to upload images</p>
                  <p className="text-sm text-gray-600">or drag and drop</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImages}
                  className="hidden"
                />
              </label>
            </div>

            {isUploadingImages && (
              <p className="text-gray-600 mb-4">Uploading images...</p>
            )}

            {images.length > 0 && (
              <div className="space-y-4">
                <p className="font-semibold">
                  Uploaded Images ({images.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
                        <Image
                          src={image}
                          alt={`Product ${index}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg" isLoading={isLoading}>
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
