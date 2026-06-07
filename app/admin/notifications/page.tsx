"use client";
import { useEffect, useState } from "react";

interface Notification {
  id: string; type: string; title: string; message: string;
  read: boolean; createdAt: string; meta?: Record<string, unknown>;
}

const TYPE_ICON: Record<string, string> = {
  order: "🛒", low_stock: "⚠️", out_of_stock: "🔴", subscriber: "✉️", report: "📊",
};
const TYPE_COLOR: Record<string, string> = {
  order: "bg-blue-50 border-blue-200", low_stock: "bg-yellow-50 border-yellow-200",
  out_of_stock: "bg-red-50 border-red-200", subscriber: "bg-green-50 border-green-200",
  report: "bg-purple-50 border-purple-200",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/notifications");
    const data = await res.json();
    setNotifications(data.notifications || []);
    setUnreadCount(data.unreadCount || 0);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markAllRead = async () => {
    await fetch("/api/admin/notifications", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    load();
  };

  const clearRead = async () => {
    await fetch("/api/admin/notifications", { method: "DELETE" });
    load();
  };

  const generateReport = async (type: string) => {
    const res = await fetch(`/api/cron/daily-report?type=${type}`);
    if (res.ok) { alert(`${type} report generated!`); load(); }
  };

  const filtered = filter === "all" ? notifications
    : filter === "unread" ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="text-sm text-blue-600 font-medium">{unreadCount} unread</span>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => generateReport("daily")}
            className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            📊 Daily Report
          </button>
          <button onClick={() => generateReport("weekly")}
            className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            📈 Weekly Report
          </button>
          <button onClick={markAllRead}
            className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            ✓ Mark All Read
          </button>
          <button onClick={clearRead}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
            🗑 Clear Read
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "unread", "order", "low_stock", "out_of_stock", "subscriber", "report"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1 text-sm rounded-full border ${filter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}>
            {TYPE_ICON[f] || ""} {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">🔔</div>
          <p>No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => (
            <div key={n.id}
              className={`border rounded-xl p-4 flex gap-3 items-start transition-all ${TYPE_COLOR[n.type] || "bg-gray-50 border-gray-200"} ${!n.read ? "shadow-sm" : "opacity-70"}`}>
              <span className="text-2xl flex-shrink-0">{TYPE_ICON[n.type] || "🔔"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-medium text-gray-900 ${!n.read ? "font-semibold" : ""}`}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
