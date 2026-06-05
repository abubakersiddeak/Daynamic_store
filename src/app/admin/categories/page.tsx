"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "@/actions/category";
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
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" });

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
      toast.error("Please fill all fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newCategory.name);
      formData.append("slug", newCategory.slug);

      const result = await createCategory(formData);
      if (result.success) {
        toast.success("Category created");
        loadCategories();
        setNewCategory({ name: "", slug: "" });
        setIsAddingNew(false);
      } else {
        toast.error(result.error || "Failed to create category");
      }
    } catch {
      toast.error("Failed to create category");
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
              />
              <Input
                label="Slug"
                value={newCategory.slug}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, slug: e.target.value })
                }
                placeholder="E.g., lipsticks"
              />
              <div className="flex gap-2">
                <Button type="submit">Create</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewCategory({ name: "", slug: "" });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
