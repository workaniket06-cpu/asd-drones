"use client";
import { use } from "react";
import Link from "next/link";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";

export default function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const { orderId } = use(searchParams);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Order Placed!</h1>
        <p className="text-slate-500 text-sm mb-5">Thank you for your order. We&apos;ll start processing it right away.</p>

        {orderId && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 mb-6 inline-flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700">{orderId}</span>
          </div>
        )}

        <div className="space-y-2 text-sm text-slate-500 mb-8">
          <p>You&apos;ll receive updates on your delivery.</p>
          <p className="font-medium text-slate-700">Payment: Cash on Delivery</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/shop" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors">
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
          <Link href="/" className="flex-1 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
