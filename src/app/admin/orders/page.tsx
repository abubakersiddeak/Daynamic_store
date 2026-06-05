"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders, updateOrderStatus } from "@/actions/order";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Order } from "@/types";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { Eye } from "lucide-react";
import toast from "react-hot-toast";

const statusOptions = [
  "pending",
  "confirmed",
  "processing",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadOrders(currentPage: number) {
    setLoading(true);
    try {
      const result = await getOrders(currentPage, 10);
      if (result.success && result.orders) {
        setOrders(result.orders);
        if (result.pagination) {
          setTotalPages(result.pagination.pages);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadOrders(page);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [page]);

  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success("Order status updated");
        void loadOrders(page);
      } else {
        toast.error(result.error || "Failed to update order");
      }
    } catch {
      toast.error("Failed to update order");
    }
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-600">No orders found</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4">Order ID</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Total</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-xs">
                          {order._id.substring(0, 8)}...
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          {order.customerName}
                        </td>
                        <td className="py-3 px-4">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className={`px-3 py-1 rounded text-sm font-semibold border-none cursor-pointer ${
                              statusColors[
                                order.status as keyof typeof statusColors
                              ]
                            }`}
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/order-confirmation/${order._id}`}>
                            <Button variant="outline" size="sm">
                              <Eye size={16} />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(Math.max(1, page - 1))}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
