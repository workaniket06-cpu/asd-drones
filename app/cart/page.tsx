"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 999;

export default function CartPage() {
  const { items, count, total, removeFromCart, updateQty, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-6">Add some products and they&apos;ll appear here.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Your Cart <span className="text-blue-600">({count})</span>
          </h1>
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
            Clear all
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items list */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {item.category === "Electronics" ? "⚡" :
                   item.category === "Motors" ? "🔄" :
                   item.category === "Frames" ? "🔩" :
                   item.category === "FPV Equipment" ? "📡" :
                   item.category === "Battery" ? "🔋" :
                   item.category === "Radio" ? "📻" : "🌀"}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{item.category}</span>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{item.name}</h3>
                  <p className="text-base font-extrabold text-slate-900 mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                </div>
                {/* Qty controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {/* Subtotal */}
                <div className="text-right flex-shrink-0 min-w-[80px]">
                  <p className="font-extrabold text-slate-900 text-sm">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 mt-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <Link href="/shop" className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors mt-2">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
              <h2 className="font-extrabold text-slate-900 text-lg mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({count} items)</span>
                  <span className="font-semibold">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">{total >= FREE_SHIPPING_THRESHOLD ? "FREE" : "₹99"}</span>
                </div>
                {total < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                    Add ₹{(FREE_SHIPPING_THRESHOLD - total).toLocaleString("en-IN")} more for free shipping!
                  </p>
                )}
                <div className="border-t border-slate-100 pt-3 flex justify-between font-extrabold text-slate-900 text-base">
                  <span>Total</span>
                  <span>₹{(total + (total >= FREE_SHIPPING_THRESHOLD ? 0 : 99)).toLocaleString("en-IN")}</span>
                </div>
              </div>
              <Link href="/checkout" className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm mb-3">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-xs text-slate-400">Cash on Delivery · Free returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
