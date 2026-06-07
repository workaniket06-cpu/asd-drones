import AdminSidebar from "@/components/admin/AdminSidebar";
import { ReactNode } from "react";

export const metadata = { title: "Admin – ASD Drones" };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <div className="flex-1 lg:ml-60 min-h-screen flex flex-col">
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
