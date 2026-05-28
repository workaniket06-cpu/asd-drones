"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16 px-4">
      <div className="w-full max-w-md">
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
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-800">Create one free</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input required type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-600">Password</label>
              <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 font-medium">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input required type={showPw ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Your password"
                className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-slate-500">
          New to ASD Drones?{" "}
          <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-800">Create a free account</Link>
        </p>
      </div>
    </div>
  );
}
