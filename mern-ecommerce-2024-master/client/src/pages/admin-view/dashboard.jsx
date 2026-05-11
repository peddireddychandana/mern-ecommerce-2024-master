import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  DollarSign, ShoppingCart, Package, Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp,
  PlusCircle, ListOrdered, Loader2,
} from "lucide-react";
import { getDashboardStats } from "@/store/admin/dashboard-slice";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { formatPrice } from "@/lib/format-price";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">{label}</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, desc, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all text-left w-full group"
    >
      <div className={`p-2.5 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 truncate">{desc}</p>
      </div>
    </button>
  );
}

const PIE_COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#6b7280"];

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, isLoading } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  if (isLoading || !stats) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  const orderStatusData = [
    { name: "Pending", value: stats.pendingOrders },
    { name: "Awaiting Verification", value: stats.awaitingVerification },
    { name: "Delivered", value: stats.deliveredOrders },
    { name: "Cancelled", value: stats.cancelledOrders },
    { name: "Confirmed", value: stats.confirmedOrders },
  ].filter((d) => d.value > 0);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Your business at a glance</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={formatPrice(stats.totalRevenue)} color="bg-green-600" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} color="bg-blue-600" />
        <StatCard icon={Package} label="Total Products" value={stats.totalProducts} color="bg-orange-600" />
        <StatCard icon={Clock} label="Pending Orders" value={stats.pendingOrders} color="bg-yellow-500" />
        <StatCard icon={AlertTriangle} label="Awaiting Verification" value={stats.awaitingVerification} color="bg-amber-600" />
        <StatCard icon={CheckCircle} label="Delivered" value={stats.deliveredOrders} color="bg-green-500" />
        <StatCard icon={XCircle} label="Cancelled" value={stats.cancelledOrders} color="bg-red-500" />
      </div>

      {/* INVENTORY WARNINGS */}
      {(stats.lowStockProducts > 0 || stats.outOfStockProducts > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.lowStockProducts > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800 font-medium">
                {stats.lowStockProducts} product{stats.lowStockProducts > 1 ? "s are" : " is"} running low on stock
              </p>
            </div>
          )}
          {stats.outOfStockProducts > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <XCircle className="w-6 h-6 text-red-600 shrink-0" />
              <p className="text-sm text-red-800 font-medium">
                {stats.outOfStockProducts} product{stats.outOfStockProducts > 1 ? "s are" : " is"} out of stock
              </p>
            </div>
          )}
        </div>
      )}

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MONTHLY SALES */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => formatPrice(value)} />
              <Bar dataKey="revenue" fill="#6B1E2E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ORDER STATUS PIE */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
          {orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {orderStatusData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">No order data</div>
          )}
        </div>
      </div>

      {/* TOP PRODUCTS + CATEGORIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          {stats.topProducts?.length > 0 ? (
            <div className="space-y-3">
              {stats.topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-gray-400 w-5">#{i + 1}</span>
                    <span className="text-sm text-gray-700 truncate">{p.title}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs text-gray-500">{p.quantity} sold</span>
                    <span className="text-xs font-medium text-gray-700">{formatPrice(p.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No sales data yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Top Categories</h3>
          {stats.topCategories?.length > 0 ? (
            <div className="space-y-3">
              {stats.topCategories.map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 w-5">#{i + 1}</span>
                    <span className="text-sm text-gray-700 capitalize">{c.category.replace(/-/g, " ")}</span>
                  </div>
                  <span className="text-xs text-gray-500">{c.count} items</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No category data yet</p>
          )}
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recent Orders</h3>
          <button onClick={() => navigate("/admin/orders")} className="text-xs text-[#6B1E2E] hover:underline font-medium">View all</button>
        </div>
        {stats.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Order</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Customer</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Status</th>
                  <th className="text-right py-2 px-2 text-gray-500 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-2 text-xs text-gray-500 font-mono truncate max-w-[80px]">{o._id}</td>
                    <td className="py-2.5 px-2 text-gray-700">{o.userId?.userName || "N/A"}</td>
                    <td className="py-2.5 px-2">
                      <Badge className={`text-[10px] px-2 py-0.5 ${
                        o.orderStatus === "confirmed" ? "bg-green-500" :
                        o.orderStatus === "delivered" ? "bg-blue-500" :
                        o.orderStatus === "rejected" ? "bg-red-500" :
                        o.orderStatus === "awaiting_verification" ? "bg-yellow-500" :
                        "bg-gray-500"
                      }`}>
                        {o.orderStatus}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium">{formatPrice(o.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <QuickAction icon={PlusCircle} label="Add Product" desc="Create new product" onClick={() => navigate("/admin/products")} color="bg-blue-600" />
          <QuickAction icon={ListOrdered} label="Manage Orders" desc="View & update" onClick={() => navigate("/admin/orders")} color="bg-green-600" />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
