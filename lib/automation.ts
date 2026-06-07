import { readDB, writeDB } from "@/lib/adminData";

/* ─── Shared interfaces ─── */
interface OrderItem { productId: number; name: string; qty: number; price: number; }
interface Order { id: string; customer: string; email: string; total: number; items: OrderItem[]; status: string; createdAt: string; }
interface Product { id: number; name: string; sku: string; stock: number; status: string; price: number; category: string; }
interface Customer { id: number; name: string; email: string; orders: number; totalSpent: number; status: string; }
interface Notification {
  id: string; type: "order" | "low_stock" | "out_of_stock" | "subscriber" | "report";
  title: string; message: string; read: boolean; createdAt: string;
  meta?: Record<string, unknown>;
}
interface Report {
  id: string; date: string; type: "daily" | "weekly";
  totalOrders: number; totalRevenue: number; newCustomers: number;
  topProducts: { name: string; qty: number; revenue: number }[];
  createdAt: string;
}

/* ─── 1. Deduct stock for each item in a new order ─── */
export async function deductStock(items: OrderItem[]) {
  const products = await readDB<Product>("products");
  const alerts: string[] = [];

  for (const item of items) {
    const idx = products.findIndex(p => p.id === item.productId);
    if (idx === -1) continue;

    products[idx].stock = Math.max(0, products[idx].stock - item.qty);

    if (products[idx].stock === 0) {
      products[idx].status = "out_of_stock";
      alerts.push(`out_of_stock:${products[idx].id}:${products[idx].name}`);
    } else if (products[idx].stock < 10) {
      alerts.push(`low_stock:${products[idx].id}:${products[idx].name}:${products[idx].stock}`);
    }
  }

  await writeDB("products", products);
  return alerts;
}

/* ─── 2. Update customer order count & total spent ─── */
export async function updateCustomerStats(email: string, orderTotal: number) {
  const customers = await readDB<Customer>("customers");
  const idx = customers.findIndex(c => c.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return;
  customers[idx].orders = (customers[idx].orders || 0) + 1;
  customers[idx].totalSpent = (customers[idx].totalSpent || 0) + orderTotal;
  await writeDB("customers", customers);
}

/* ─── 3. Create a notification ─── */
export async function createNotification(
  type: Notification["type"], title: string, message: string,
  meta?: Record<string, unknown>
) {
  const notifications = await readDB<Notification>("notifications");
  const n: Notification = {
    id: `NTF-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type, title, message, read: false,
    createdAt: new Date().toISOString(),
    ...(meta ? { meta } : {}),
  };
  notifications.unshift(n);
  // Keep only last 200 notifications
  await writeDB("notifications", notifications.slice(0, 200));
  return n;
}

/* ─── 4. Full order automation (call this after saving an order) ─── */
export async function onOrderCreated(order: Order) {
  // a) Deduct stock + check alerts
  const stockAlerts = await deductStock(order.items);

  // b) Update customer stats
  await updateCustomerStats(order.email, order.total);

  // c) Order notification
  await createNotification(
    "order",
    `New Order: ${order.id}`,
    `${order.customer} placed an order for ₹${order.total.toLocaleString("en-IN")}`,
    { orderId: order.id, email: order.email, total: order.total }
  );

  // d) Stock alert notifications
  for (const alert of stockAlerts) {
    const [alertType, , productName, stock] = alert.split(":");
    if (alertType === "out_of_stock") {
      await createNotification(
        "out_of_stock", `Out of Stock: ${productName}`,
        `${productName} is now out of stock. Restock immediately.`,
        { productName }
      );
    } else if (alertType === "low_stock") {
      await createNotification(
        "low_stock", `Low Stock: ${productName}`,
        `${productName} has only ${stock} units left.`,
        { productName, stock: Number(stock) }
      );
    }
  }
}

/* ─── 5. Subscriber notification ─── */
export async function onSubscriberAdded(email: string) {
  await createNotification(
    "subscriber",
    "New Newsletter Subscriber",
    `${email} subscribed to the newsletter.`,
    { email }
  );
}

/* ─── 6. Generate daily/weekly report ─── */
export async function generateReport(type: "daily" | "weekly" = "daily"): Promise<Report> {
  const now = new Date();
  const daysBack = type === "weekly" ? 7 : 1;
  const since = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

  const orders = await readDB<Order>("orders");
  const customers = await readDB<Customer>("customers");

  const periodOrders = orders.filter(o => new Date(o.createdAt) >= since);
  const totalRevenue = periodOrders.reduce((s, o) => s + (o.total || 0), 0);
  const newCustomers = customers.filter(c => {
    const joined = (c as unknown as { joinedAt?: string }).joinedAt;
    return joined && new Date(joined) >= since;
  }).length;

  // Top products by qty sold
  const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  for (const o of periodOrders) {
    for (const item of o.items || []) {
      if (!productMap[item.name]) productMap[item.name] = { name: item.name, qty: 0, revenue: 0 };
      productMap[item.name].qty += item.qty;
      productMap[item.name].revenue += item.price * item.qty;
    }
  }
  const topProducts = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const report: Report = {
    id: `RPT-${type.toUpperCase()}-${now.toISOString().slice(0, 10)}`,
    date: now.toISOString().slice(0, 10),
    type,
    totalOrders: periodOrders.length,
    totalRevenue,
    newCustomers,
    topProducts,
    createdAt: now.toISOString(),
  };

  const reports = await readDB<Report>("reports");
  // Replace existing report for same date+type if exists
  const filtered = reports.filter(r => r.id !== report.id);
  filtered.unshift(report);
  await writeDB("reports", filtered.slice(0, 90)); // keep 90 days

  await createNotification(
    "report",
    `${type === "daily" ? "Daily" : "Weekly"} Report Ready`,
    `${type === "daily" ? "Today" : "This week"}: ${periodOrders.length} orders, ₹${totalRevenue.toLocaleString("en-IN")} revenue`,
    { reportId: report.id, type }
  );

  return report;
}
