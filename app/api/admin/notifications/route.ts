import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/adminData";
import { requireAdmin } from "@/lib/adminAuth";

interface Notification {
  id: string; type: string; title: string; message: string;
  read: boolean; createdAt: string; meta?: Record<string, unknown>;
}

// GET all notifications (optionally ?unread=true)
export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;
  const notifications = await readDB<Notification>("notifications");
  const unreadOnly = req.nextUrl.searchParams.get("unread") === "true";
  const result = unreadOnly ? notifications.filter(n => !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.read).length;
  return NextResponse.json({ notifications: result, unreadCount });
}

// PATCH — mark notifications as read
export async function PATCH(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;
  const { ids, all } = await req.json().catch(() => ({}));
  const notifications = await readDB<Notification>("notifications");

  if (all) {
    notifications.forEach(n => { n.read = true; });
  } else if (Array.isArray(ids)) {
    notifications.forEach(n => { if (ids.includes(n.id)) n.read = true; });
  }

  await writeDB("notifications", notifications);
  return NextResponse.json({ message: "Marked as read" });
}

// DELETE — clear all read notifications
export async function DELETE(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;
  const notifications = await readDB<Notification>("notifications");
  const unread = notifications.filter(n => !n.read);
  await writeDB("notifications", unread);
  return NextResponse.json({ message: "Cleared read notifications" });
}
