"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/actions/product";
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
import { useEffect } from "react";
import { Category } from "@/types";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const result = await getCategories();
      if (result.success && result.categories) {
        setCategories(result.categories);
      }
    }
    void loadCategories();
  }, []);

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

      formData.append("images", JSON.stringify(images));
      formData.append("tags", JSON.stringify(tags));

      const result = await createProduct(formData);

      if (result.success) {
        toast.success("Product created successfully");
        router.push("/admin/products");
      } else {
        toast.error(result.error || "Failed to create product");
      }
    } catch {
      toast.error("Failed to create product");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          ← Back
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Create New Product</h1>

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
            <Input label="Product Name *" name="name" required />
            <Input label="Slug" name="slug" placeholder="radiant-beauty-foundation" />
            <TextArea label="Description *" name="description" required />
            <Input
              label="Tags"
              name="tagList"
              placeholder="foundation, hydrating, bestseller"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price *"
                name="price"
                type="number"
                step="0.01"
                required
              />
              <Input
                label="Discount Price"
                name="discountPrice"
                type="number"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Category *"
                name="category"
                options={categories.map((c) => ({
                  value: c._id,
                  label: c.name,
                }))}
                required
              />
              <Input label="Stock *" name="stock" type="number" required />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium">
                <input type="checkbox" name="isFeatured" value="true" />
                Feature on homepage
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium">
                <input type="checkbox" name="isBestSeller" value="true" />
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
            Create Product
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
