# Developer Quick Reference

## 🚀 Getting Started (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Start MongoDB locally OR use MongoDB Atlas connection string
# Edit .env.local with your MONGODB_URI and IMGBB API key

# 4. Seed database with demo data
npm run seed

# 5. Start development server
npm run dev

# Open http://localhost:3000
```

## 📦 Adding a New Feature

### 1. Add Database Model

```typescript
// src/models/YourModel.ts
import mongoose, { Schema } from "mongoose";

const yourSchema = new Schema(
  {
    name: { type: String, required: true },
    // ... fields
  },
  { timestamps: true },
);

export const YourModel =
  mongoose.models.YourModel || mongoose.model("YourModel", yourSchema);
```

### 2. Add Validation Schema

```typescript
// src/validations/index.ts
export const yourSchema = z.object({
  name: z.string().min(1),
  // ... fields
});
```

### 3. Create Server Action

```typescript
// src/actions/your.ts
"use server";
import { connectDB } from "@/lib/db";
import { YourModel } from "@/models/YourModel";

export async function createYour(formData: FormData) {
  try {
    await connectDB();
    const data = {
      /* ... */
    };
    const validated = yourSchema.parse(data);
    const model = new YourModel(validated);
    await model.save();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### 4. Create Admin Page

```typescript
// src/app/admin/yours/page.tsx
"use client";
import { useEffect, useState } from "react";
import { getYours, deleteYour } from "@/actions/your";
import { Card, Button } from "@/components/ui";

export default function AdminYourPage() {
  const [items, setItems] = useState([]);
  // ... implementation
}
```

## 🎨 UI Components

```typescript
// Import from components/ui
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
```

### Button Variants

```typescript
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="ghost">Ghost</Button>
<Button isLoading>Loading...</Button>
<Button disabled>Disabled</Button>
```

### Input with Error

```typescript
<Input
  label="Name"
  error={errors.name?.message}
  {...register('name')}
/>
```

## 🛒 Shopping Cart Usage

```typescript
import { useCartStore } from "@/store/cart";

const cart = useCartStore((state) => state.items);
const addItem = useCartStore((state) => state.addItem);
const removeItem = useCartStore((state) => state.removeItem);
const updateQuantity = useCartStore((state) => state.updateQuantity);
const total = useCartStore((state) => state.getTotal());

// Add item
addItem({
  productId: "123",
  name: "Product Name",
  price: 100,
  quantity: 1,
  image: "url",
});
```

## 🖼️ Image Upload

```typescript
import { uploadImageToImgBB, uploadMultipleImages } from "@/lib/imgbb";

// Single image
const url = await uploadImageToImgBB(file);

// Multiple images
const urls = await uploadMultipleImages(files);

// In form handling
formData.append("images", JSON.stringify(imageUrls));
```

## 🗄️ Database Operations

```typescript
// Connect to database
await connectDB();

// Create
const doc = await Model.create(data);

// Read
const doc = await Model.findById(id);
const docs = await Model.find().limit(10).skip(0);

// Update
const doc = await Model.findByIdAndUpdate(id, data);

// Delete
await Model.findByIdAndDelete(id);

// Pagination
const skip = (page - 1) * limit;
const docs = await Model.find().skip(skip).limit(limit);
const total = await Model.countDocuments();
```

## ✅ Form Validation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(yourSchema)
});

<form onSubmit={handleSubmit(onSubmit)}>
  <Input
    label="Name"
    {...register('name')}
    error={errors.name?.message}
  />
  <Button type="submit">Submit</Button>
</form>
```

## 🔍 Search & Filter

```typescript
// Search products
const searchProducts = (query: string) => {
  return products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );
};

// Filter by category
const filterByCategory = (categoryId: string) => {
  return products.filter((p) => p.category === categoryId);
};

// Combined
const filtered = products
  .filter((p) => p.category === selectedCategory)
  .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  .sort((a, b) => a.price - b.price); // Sort by price
```

## 🚨 Error Handling

```typescript
import toast from "react-hot-toast";

try {
  const result = await someAction();
  if (result.success) {
    toast.success("Success message");
  } else {
    toast.error(result.error || "Something went wrong");
  }
} catch (error) {
  console.error("Error:", error);
  toast.error("Failed to complete action");
}
```

## 📱 Responsive Design

```typescript
// Tailwind utilities
<div className="
  grid grid-cols-1          // 1 column on mobile
  md:grid-cols-2            // 2 columns on medium
  lg:grid-cols-4            // 4 columns on large
  gap-4
">
  {/* Content */}
</div>

// Hide/Show based on breakpoint
<div className="hidden md:block">Visible only on medium+</div>
<div className="md:hidden">Visible only on mobile</div>
```

## 🔗 Useful Utilities

```typescript
import {
  formatCurrency, // 1500 -> "Rs. 1,500"
  formatDate, // new Date() -> "Jan 1, 2024"
  slugify, // "My Product" -> "my-product"
  cn, // classname utility
} from "@/utils/helpers";

formatCurrency(1500, "PKR"); // "Rs. 1,500"
formatDate(new Date()); // "Jan 1, 2024"
slugify("My Category"); // "my-category"
cn("px-4", true && "py-2"); // "px-4 py-2"
```

## 📊 Admin Stats

```typescript
import { getOrderStats } from "@/actions/order";

const stats = await getOrderStats();
// {
//   totalOrders: 42,
//   totalRevenue: 125000,
//   byStatus: [
//     { _id: 'pending', count: 5 },
//     { _id: 'delivered', count: 37 }
//   ]
// }
```

## 🔐 Environment Variables

```env
# Database
MONGODB_URI=mongodb://...

# Image Upload
NEXT_PUBLIC_IMGBB_API_KEY=your_key

# Site Configuration
NEXT_PUBLIC_SITE_NAME=Cosmatics Store
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🐛 Common Issues & Solutions

**MongoDB Connection Error**

- Check MONGODB_URI in .env.local
- Ensure MongoDB is running (local) or accessible (Atlas)

**Image Upload Fails**

- Verify ImgBB API key is correct
- Check NEXT_PUBLIC_IMGBB_API_KEY in .env.local

**Components Not Found**

- Check import paths
- Ensure file is in src/components/

**Styling Issues**

- Rebuild Tailwind: `npm run build`
- Check className syntax
- Ensure globals.css is imported

**Build Fails**

- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install`
- Check TypeScript errors: `npx tsc --noEmit`

## 📚 File Structure Tips

```
Keep related files together:
src/
  models/              ← Database schemas
  validations/        ← Zod schemas (match models)
  actions/            ← Server functions (match models)
  app/admin/things/   ← Admin pages (match models)
```

## 🎯 Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push and create PR
git push origin feature/your-feature
```

## 🆘 Need Help?

1. Check [SETUP.md](../SETUP.md)
2. Review code comments
3. Check component implementations
4. Consult documentation: nextjs.org, mongodb.com, tailwindcss.com

---

Last updated: 2024
