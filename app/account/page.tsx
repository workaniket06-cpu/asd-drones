"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { User, Mail, LogOut, ShoppingBag, Settings } from "lucide-react";

export default function AccountPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">My Account</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your ASD Drones account</p>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold flex-shrink-0">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{user.name}</h2>
              <p className="text-slate-500 text-sm">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: User, label: "Full Name", value: user.name },
              { icon: Mail, label: "Email", value: user.email },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Icon className="w-3.5 h-3.5" /> {label}
                </div>
                <p className="text-sm font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <Link href="/shop" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:border-blue-200 hover:shadow-md transition-all group">
            <ShoppingBag className="w-6 h-6 text-blue-600 mb-3" />
            <h3 className="font-bold text-slate-900 text-sm mb-1">Continue Shopping</h3>
            <p className="text-xs text-slate-400">Browse 1,200+ drone parts</p>
          </Link>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <Settings className="w-6 h-6 text-slate-400 mb-3" />
            <h3 className="font-bold text-slate-900 text-sm mb-1">Account Settings</h3>
            <p className="text-xs text-slate-400">Update profile & password</p>
          </div>
        </div>

        <button onClick={() => { logout(); router.push("/"); }}
          className="flex items-center gap-2 px-5 py-3 text-red-600 hover:bg-red-50 rounded-xl border border-red-200 text-sm font-semibold transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
