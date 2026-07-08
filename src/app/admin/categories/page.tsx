"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "@/actions/category";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Category } from "@/types";
import { Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [submitting, setSubmitting] = useState(false); // UI state to block double submissions
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function loadCategories() {
    setLoading(true);
    try {
      const result = await getCategories();
      if (result.success && result.categories) {
        setCategories(result.categories);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadCategories();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  async function handleAddCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Creating category...");

    try {
      let imageUrl = "";

      // 1. If an image file was selected from the device, upload it first
      if (selectedFile) {
        imageUrl = await uploadImageToImgBB(selectedFile);
      }

      // 2. Prepare Form Data for the Server Action
      const formData = new FormData();
      formData.append("name", newCategory.name);
      formData.append("slug", newCategory.slug);
      formData.append("image", imageUrl); // Attaches the live hosted link

      // 3. Fire Server Action
      const result = await createCategory(formData);
      if (result.success) {
        toast.success("Category created successfully!", { id: toastId });
        loadCategories();

        // Reset state
        setNewCategory({ name: "", slug: "" });
        setSelectedFile(null);
        setIsAddingNew(false);
      } else {
        toast.error(result.error || "Failed to create category", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while uploading or saving.", {
        id: toastId,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;

    try {
      const result = await deleteCategory(id);
      if (result.success) {
        toast.success("Category deleted");
        loadCategories();
      } else {
        toast.error(result.error || "Failed to delete category");
      }
    } catch {
      toast.error("Failed to delete category");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => setIsAddingNew(!isAddingNew)}>
          <Plus className="mr-2" size={20} />
          New Category
        </Button>
      </div>

      {isAddingNew && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <Input
                label="Category Name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="E.g., Lipsticks"
                disabled={submitting}
              />
              <Input
                label="Slug"
                value={newCategory.slug}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, slug: e.target.value })
                }
                placeholder="E.g., lipsticks"
                disabled={submitting}
              />

              {/* Image Input field added here */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  disabled={submitting}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:opacity-90 cursor-pointer disabled:opacity-50"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Processing..." : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={submitting}
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewCategory({ name: "", slug: "" });
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories table stays exactly the same as you had it */}
      <Card>
        <CardHeader>
          <CardTitle>Categories List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-600">No categories found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4">Image</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Slug</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-md border object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
                            No Img
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        {category.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {category.slug}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(category._id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
