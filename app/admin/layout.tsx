import AdminSidebar from "@/components/admin/AdminSidebar";
import { ReactNode } from "react";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin – ASD Drones" };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const loggedIn = await isAdminLoggedIn();
  if (!loggedIn) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <div className="flex-1 lg:ml-60 min-h-screen flex flex-col">
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
