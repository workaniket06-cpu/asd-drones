"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Mail,
  ExternalLink, ChevronRight, X, Menu,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
];

export default function AdminSidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string, exact?: boolean) {
    return exact ? path === href : path.startsWith(href);
  }

  const links = (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {nav.map(({ href, label, icon: Icon, exact }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
            isActive(href, exact)
              ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Icon className="w-4.5 h-4.5 flex-shrink-0" />
          <span className="flex-1">{label}</span>
          {isActive(href, exact) && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed bottom-5 right-5 z-50 w-12 h-12 bg-blue-600 text-white rounded-2xl shadow-lg flex items-center justify-center"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-slate-100 z-40 flex flex-col shadow-lg transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 leading-none">ASD Drones</div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">Admin Panel</div>
            </div>
          </Link>
        </div>

        {links}

        {/* Back to site */}
        <div className="px-3 py-4 border-t border-slate-100">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            View Store
          </Link>
        </div>
      </aside>
    </>
  );
}
