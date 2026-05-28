"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2, CheckCircle, User, Mail, Phone, MapPin, Lock } from "lucide-react";

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry","Other"];

export default function SignupPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "", city: "", state: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); setError(""); }

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    const result = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone, city: form.city, state: form.state });
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    setDone(true);
    setTimeout(() => router.push("/"), 2000);
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-16">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Account Created!</h2>
          <p className="text-slate-500">Welcome to ASD Drones. Redirecting you home…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <circle cx="12" cy="12" r="3" />
                <circle cx="5" cy="5" r="2" /><circle cx="19" cy="5" r="2" />
                <circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
                <line x1="5" y1="5" x2="12" y2="12" stroke="white" strokeWidth="1" />
                <line x1="19" y1="5" x2="12" y2="12" stroke="white" strokeWidth="1" />
                <line x1="5" y1="19" x2="12" y2="12" stroke="white" strokeWidth="1" />
                <line x1="19" y1="19" x2="12" y2="12" stroke="white" strokeWidth="1" />
              </svg>
            </div>
            <span className="text-xl font-extrabold text-slate-900">ASD <span className="text-blue-700">Drones</span></span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-500 text-sm">Join 25,000+ drone enthusiasts. Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-800">Sign in</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input required value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="e.g. Arjun Sharma"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input required type="email" value={form.email} onChange={e => set("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Phone Number <span className="text-slate-400 font-normal">(optional)</span></label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
            </div>
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">City <span className="text-slate-400 font-normal">(optional)</span></label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={form.city} onChange={e => set("city", e.target.value)}
                  placeholder="Bengaluru"
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">State</label>
              <select value={form.state} onChange={e => set("state", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 bg-white text-slate-700">
                <option value="">Select state</option>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input required type={showPw ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Strength bar */}
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? (strength <= 2 ? "bg-red-400" : strength <= 3 ? "bg-yellow-400" : "bg-green-500") : "bg-slate-100"}`} />
                  ))}
                </div>
                <p className={`text-xs mt-1 font-medium ${strength <= 2 ? "text-red-500" : strength <= 3 ? "text-yellow-600" : "text-green-600"}`}>
                  {strength <= 2 ? "Weak password" : strength <= 3 ? "Fair password" : "Strong password"}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Confirm Password *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input required type="password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)}
                placeholder="Re-enter your password"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50 ${form.confirmPassword && form.password !== form.confirmPassword ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`} />
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account…</> : "Create Account"}
          </button>

          <p className="text-xs text-slate-400 text-center">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
