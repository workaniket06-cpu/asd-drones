import { ReactNode } from "react";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin Login – ASD Drones" };

// Separate layout — bypasses AdminLayout auth check
// But if already logged in, redirect to dashboard
export default async function AdminLoginLayout({ children }: { children: ReactNode }) {
  const loggedIn = await isAdminLoggedIn();
  if (loggedIn) redirect("/admin");
  return <>{children}</>;
}
