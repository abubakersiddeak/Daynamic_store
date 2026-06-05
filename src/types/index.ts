export interface Product {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  stock: number;
  images: string[];
  rating: number;
  reviews: number;
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parent?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  label?: string;
  fullName?: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  addresses: Address[];
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  _id: string;
  customerName: string;
  email?: string;
  phone: string;
  address: string;
  city?: string;
  postalCode?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Review {
  _id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface StoreSettings {
  _id: string;
  storeName: string;
  logo: string;
  storeDescription: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  currency: string;
  shippingCharge: number;
  bannerImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  announcement?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "delivered"
  | "cancelled";
