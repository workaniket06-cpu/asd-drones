"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, ChevronRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh","Puducherry","Chandigarh"];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    addressLine: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pinStatus, setPinStatus] = useState<"idle" | "loading" | "found" | "error">("idle");
  const pinDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function lookupPin(pin: string) {
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setPinStatus("idle");
      return;
    }
    setPinStatus("loading");
    try {
      const res = await fetch(`/api/pincode/${pin}`);
      const data = await res.json();
      if (data.found && data.city) {
        // Match state to our STATES list (case-insensitive)
        const matchedState = STATES.find(
          s => s.toLowerCase() === (data.state || "").toLowerCase()
        ) || data.state;
        setForm(f => ({
          ...f,
          city: data.city,
          state: matchedState || f.state,
        }));
        setPinStatus("found");
      } else {
        setPinStatus("error");
      }
    } catch {
      setPinStatus("error");
    }
  }

  function handlePincodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    set("pincode", val);
    if (pinDebounce.current) clearTimeout(pinDebounce.current);
    if (val.length === 6) {
      pinDebounce.current = setTimeout(() => lookupPin(val), 400);
    } else {
      setPinStatus("idle");
    }
  }

  if (items.length === 0) return (
    <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
      <div className="text-center">
        <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-lg font-bold text-slate-700 mb-2">Your cart is empty</p>
        <Link href="/shop" className="text-blue-600 font-semibold hover:text-blue-800">Browse Products →</Link>
      </div>
    </div>
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { name, email, phone, addressLine, city, state, pincode } = form;
    if (!name || !email || !phone || !addressLine || !city || !pincode) {
      setError("Please fill all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: name,
          email,
          phone,
          address: `${addressLine}, ${city}, ${state} ${pincode}`,
          items: items.map(i => ({ productId: i.id, name: i.name, qty: i.qty, price: i.price })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");
      clearCart();
      router.push(`/checkout/success?orderId=${data.orderId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  const shipping = total >= 999 ? 0 : 99;

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/cart" className="hover:text-blue-600">Cart</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-semibold">Checkout</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Delivery Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-bold text-slate-900 mb-5">Delivery Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
                    <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full name"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email *</label>
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone *</label>
                    <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 98765 43210"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                  </div>

                  {/* PIN Code with auto-lookup */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">PIN Code *</label>
                    <div className="relative">
                      <input
                        value={form.pincode}
                        onChange={handlePincodeChange}
                        placeholder="e.g. 400001"
                        maxLength={6}
                        inputMode="numeric"
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none pr-9 transition-colors ${
                          pinStatus === "found" ? "border-green-400 bg-green-50/40 focus:border-green-500" :
                          pinStatus === "error" ? "border-red-300 focus:border-red-400" :
                          "border-slate-200 focus:border-blue-400"
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {pinStatus === "loading" && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
                        {pinStatus === "found" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        {pinStatus === "error" && <AlertCircle className="w-4 h-4 text-red-400" />}
                      </div>
                    </div>
                    {pinStatus === "error" && (
                      <p className="text-xs text-red-500 mt-1">PIN not found — please enter city &amp; state manually.</p>
                    )}
                    {pinStatus === "found" && (
                      <p className="text-xs text-green-600 mt-1">✓ City &amp; state auto-filled</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Address *</label>
                    <input value={form.addressLine} onChange={e => set("addressLine", e.target.value)} placeholder="Flat/House No, Street, Area"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      City *
                      {pinStatus === "found" && <span className="ml-1.5 text-green-600 font-normal">(auto-filled)</span>}
                    </label>
                    <input
                      value={form.city}
                      onChange={e => set("city", e.target.value)}
                      placeholder="Mumbai"
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors ${
                        pinStatus === "found" ? "border-green-300 bg-green-50/40 focus:border-green-400" : "border-slate-200 focus:border-blue-400"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      State
                      {pinStatus === "found" && <span className="ml-1.5 text-green-600 font-normal">(auto-filled)</span>}
                    </label>
                    <select
                      value={form.state}
                      onChange={e => set("state", e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none bg-white transition-colors ${
                        pinStatus === "found" ? "border-green-300 bg-green-50/40 focus:border-green-400" : "border-slate-200 focus:border-blue-400"
                      }`}
                    >
                      {STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-bold text-slate-900 mb-2">Payment</h2>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-3 h-3 rounded-full border-2 border-blue-600 bg-blue-600" />
                  <span className="text-sm font-semibold text-slate-700">Cash on Delivery (COD)</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 ml-1">Pay when your order arrives. No online payment required.</p>
              </div>

              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-24">
                <h2 className="font-bold text-slate-900 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{item.name}</p>
                        <p className="text-xs text-slate-400">Qty: {item.qty}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-800 whitespace-nowrap">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-semibold">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-semibold" : "font-semibold"}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex justify-between font-extrabold text-slate-900">
                    <span>Total</span>
                    <span>₹{(total + shipping).toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="mt-5 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order…</> : "Place Order"}
                </button>
                <p className="text-xs text-slate-400 text-center mt-2">Pay on delivery · No online payment</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
