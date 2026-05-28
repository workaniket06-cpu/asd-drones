import { readJSON } from "@/lib/adminData";
import Link from "next/link";
import {
  Package, ShoppingCart, Users, Mail, TrendingUp,
  AlertTriangle, CheckCircle, Clock, XCircle, ArrowRight,
} from "lucide-react";

interface Product { id: number; name: string; stock: number; status: string; price: number; }
interface Order { id: string; customer: string; total: number; status: string; createdAt: string; }
interface Customer { id: number; name: string; email: string; totalSpent: number; orders: number; joinedAt: string; }
interface Subscriber { email: string; subscribedAt: string; }

function statusBadge(s: string) {
  const map: Record<string, string> = {
    delivered: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    processing: "bg-yellow-100 text-yellow-700",
    pending: "bg-orange-100 text-orange-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return map[s] ?? "bg-slate-100 text-slate-600";
}

export default function AdminDashboard() {
  const products = readJSON<Product>("products");
  const orders = readJSON<Order>("orders");
  const customers = readJSON<Customer>("customers");
  const subscribers = readJSON<Subscriber>("subscribers");

  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;
  const lowStock = products.filter((p) => p.status === "low_stock" || p.status === "out_of_stock");
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const recentCustomers = [...customers].sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()).slice(0, 4);

  const ordersByStatus = {
    delivered: orders.filter((o) => o.status === "delivered").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    processing: orders.filter((o) => o.status === "processing").length,
    pending: orders.filter((o) => o.status === "pending").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const statCards = [
    { label: "Total Revenue", value: `₹${revenue.toLocaleString("en-IN")}`, icon: TrendingUp, color: "bg-blue-600", change: "+12% this month" },
    { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "bg-violet-600", change: `${todayOrders} today` },
    { label: "Products", value: products.length, icon: Package, color: "bg-sky-600", change: `${lowStock.length} low/out of stock` },
    { label: "Customers", value: customers.length, icon: Users, color: "bg-teal-600", change: `${subscribers.length} subscribers` },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back — here&apos;s what&apos;s happening with ASD Drones.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mb-0.5">{s.value}</div>
            <div className="text-xs font-semibold text-slate-500">{s.label}</div>
            <div className="text-xs text-blue-600 mt-1 font-medium">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Order status breakdown + low stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Order status */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Order Status Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: "Delivered", count: ordersByStatus.delivered, icon: CheckCircle, color: "text-green-600" },
              { label: "Shipped", count: ordersByStatus.shipped, icon: ShoppingCart, color: "text-blue-600" },
              { label: "Processing", count: ordersByStatus.processing, icon: Clock, color: "text-yellow-600" },
              { label: "Pending", count: ordersByStatus.pending, icon: Clock, color: "text-orange-500" },
              { label: "Cancelled", count: ordersByStatus.cancelled, icon: XCircle, color: "text-red-500" },
            ].map(({ label, count, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-sm text-slate-600">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(count / orders.length) * 100}%` }} />
                  </div>
                  <span className="text-sm font-bold text-slate-900 w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock alert */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Stock Alerts</h3>
            <Link href="/admin/products" className="text-xs text-blue-600 font-semibold hover:text-blue-800">View all →</Link>
          </div>
          {lowStock.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">All products are well stocked</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStock.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">{p.name}</p>
                    <p className="text-xs text-slate-400">₹{p.price.toLocaleString("en-IN")}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.status === "out_of_stock" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                    {p.status === "out_of_stock" ? "Out" : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent subscribers */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Recent Subscribers</h3>
            <Link href="/admin/subscribers" className="text-xs text-blue-600 font-semibold hover:text-blue-800">View all →</Link>
          </div>
          <div className="space-y-3">
            {subscribers.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No subscribers yet</p>
            ) : (
              subscribers.slice(-4).reverse().map((s) => (
                <div key={s.email} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                    {s.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{s.email}</p>
                    <p className="text-[10px] text-slate-400">{new Date(s.subscribedAt).toLocaleDateString("en-IN")}</p>
                  </div>
                  <Mail className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 ml-auto" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent orders + customers */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Orders table */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Order</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono text-slate-500">{o.id}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{o.customer}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-slate-900">₹{o.total.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusBadge(o.status)}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent customers */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">New Customers</h3>
            <Link href="/admin/customers" className="text-xs text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentCustomers.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                  <p className="text-xs text-slate-400 truncate">{c.email ?? ""}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-slate-900">₹{c.totalSpent.toLocaleString("en-IN")}</p>
                  <p className="text-[10px] text-slate-400">{c.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
