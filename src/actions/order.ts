"use server";

import { connectDB } from "@/lib/db";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { orderSchema } from "@/validations";
import { revalidatePath } from "next/cache";

async function syncCustomerFromOrder(orderData: {
  customerName: string;
  email?: string;
  phone: string;
  address: string;
  city?: string;
  postalCode?: string;
  total: number;
  createdAt?: Date;
}) {
  const existingCustomer = await Customer.findOne({ phone: orderData.phone });

  if (!existingCustomer) {
    await Customer.create({
      name: orderData.customerName,
      email: orderData.email,
      phone: orderData.phone,
      addresses: [
        {
          label: "Primary",
          fullName: orderData.customerName,
          phone: orderData.phone,
          addressLine1: orderData.address,
          city: orderData.city,
          postalCode: orderData.postalCode,
        },
      ],
      totalOrders: 1,
      totalSpent: orderData.total,
      lastOrderAt: orderData.createdAt ?? new Date(),
    });
    return;
  }

  existingCustomer.name = orderData.customerName;
  existingCustomer.email = orderData.email || existingCustomer.email;
  existingCustomer.totalOrders += 1;
  existingCustomer.totalSpent += orderData.total;
  existingCustomer.lastOrderAt = orderData.createdAt ?? new Date();

  if (
    !existingCustomer.addresses.some(
      (entry: {
        addressLine1?: string;
        phone?: string;
      }) =>
        entry.addressLine1 === orderData.address &&
        entry.phone === orderData.phone,
    )
  ) {
    existingCustomer.addresses.unshift({
      label: "Saved",
      fullName: orderData.customerName,
      phone: orderData.phone,
      addressLine1: orderData.address,
      city: orderData.city,
      postalCode: orderData.postalCode,
    });
  }

  await existingCustomer.save();
}

export async function createOrder(formData: FormData) {
  try {
    await connectDB();

    const data = {
      customerName: formData.get("customerName"),
      email: formData.get("email") || undefined,
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      postalCode: formData.get("postalCode"),
      notes: formData.get("notes"),
      items: JSON.parse(formData.get("items") as string),
      subtotal: parseFloat(formData.get("subtotal") as string),
      shippingCharge: parseFloat(formData.get("shippingCharge") as string),
      total: parseFloat(formData.get("total") as string),
    };

    const validated = orderSchema.parse(data);

    const order = new Order(validated);
    await order.save();
    await syncCustomerFromOrder({
      customerName: validated.customerName,
      email: validated.email,
      phone: validated.phone,
      address: validated.address,
      city: validated.city,
      postalCode: validated.postalCode,
      total: validated.total,
      createdAt: order.createdAt,
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/customers");

    return { success: true, order: order.toObject() };
  } catch (error) {
    console.error("Create order error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
}

export async function getOrders(page: number = 1, limit: number = 10) {
  try {
    await connectDB();

    const skip = (page - 1) * limit;
    const orders = await Order.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Order.countDocuments();

    return {
      success: true,
      orders: orders.map((o) => o.toObject()),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Get orders error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
    };
  }
}

export async function getOrderById(id: string) {
  try {
    await connectDB();

    const order = await Order.findById(id);

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    return { success: true, order: order.toObject() };
  } catch (error) {
    console.error("Get order error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order",
    };
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    await connectDB();

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Invalid status" };
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    revalidatePath("/admin/orders");

    return { success: true, order: order.toObject() };
  } catch (error) {
    console.error("Update order status error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update order",
    };
  }
}

export async function getOrderStats() {
  try {
    await connectDB();

    const [totalOrders, totalRevenue, ordersByStatus, totalCustomers] =
      await Promise.all([
        Order.countDocuments(),
        Order.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: "$total" },
            },
          },
        ]),
        Order.aggregate([
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ]),
        Customer.countDocuments(),
      ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return {
      success: true,
      stats: {
        totalOrders,
        totalCustomers,
        totalRevenue: totalRevenue[0]?.total || 0,
        byStatus: ordersByStatus,
        recentOrders,
      },
    };
  } catch (error) {
    console.error("Get order stats error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch stats",
    };
  }
}
