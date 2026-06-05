"use client";

import { useEffect, useState } from "react";
import { getCustomers } from "@/actions/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Customer } from "@/types";
import { formatCurrency, formatDate } from "@/utils/helpers";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const result = await getCustomers();
        if (result.success && result.customers) {
          setCustomers(result.customers as unknown as Customer[]);
        }
      } finally {
        setLoading(false);
      }
    };

    void loadCustomers();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Customers</h1>

      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-600">Loading customers...</p>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Customers will appear here automatically after their first order.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Phone</th>
                    <th className="text-left py-3 px-4">Orders</th>
                    <th className="text-left py-3 px-4">Spent</th>
                    <th className="text-left py-3 px-4">Last Order</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-gray-500">{customer.email || "Guest checkout"}</p>
                      </td>
                      <td className="py-3 px-4">{customer.phone}</td>
                      <td className="py-3 px-4">{customer.totalOrders}</td>
                      <td className="py-3 px-4 font-semibold">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {customer.lastOrderAt
                          ? formatDate(customer.lastOrderAt)
                          : "No orders yet"}
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
