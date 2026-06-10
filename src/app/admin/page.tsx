import { getOrderStats } from "@/actions/order";
import { Product } from "@/models/Product";
import { connectDB } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ShoppingCart, Package, DollarSign, Users } from "lucide-react";
import { formatCurrency } from "@/utils/helpers";

export const dynamic = "force-dynamic";

interface StatusSummary {
  _id: string;
  count: number;
}

async function AdminDashboard() {
  let totalProducts = 0;
  const statsRes = await getOrderStats();

  try {
    await connectDB();
    totalProducts = await Product.countDocuments();
  } catch (error) {
    console.error("Admin dashboard DB connection error:", error);
  }

  const stats =
    statsRes.success && statsRes.stats
      ? statsRes.stats
      : {
          totalOrders: 0,
          totalCustomers: 0,
          totalRevenue: 0,
          byStatus: [] as StatusSummary[],
          recentOrders: [],
        };

  const statCards = [
    {
      title: "Total Sales",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(({ title, value, icon: Icon, color }) => (
          <Card key={title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{title}</p>
                  <p className="text-2xl font-bold mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Welcome Message */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <p className="text-gray-600">
              Manage your cosmetics store from this dashboard. Use the sidebar
              to navigate to different sections.
            </p>
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Recent Orders
              </h3>
              {stats.recentOrders.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No orders yet. New cash-on-delivery orders will appear here.
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.recentOrders.map((order) => (
                    <div
                      key={String(order._id)}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-gray-500 capitalize">
                          {order.status}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
