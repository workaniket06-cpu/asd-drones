"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
              <circle cx="12" cy="12" r="3"/>
              <circle cx="5"  cy="5"  r="2" fill="white"/>
              <circle cx="19" cy="5"  r="2" fill="white"/>
              <circle cx="5"  cy="19" r="2" fill="white"/>
              <circle cx="19" cy="19" r="2" fill="white"/>
              <path d="M5 5l2 2M19 5l-2 2M5 19l2-2M19 19l-2-2"
                stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">ASD Drones</h1>
          <p className="text-slate-400 text-sm mt-1">Admin Panel Login</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="admin"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg"
            >
              {loading ? "Logging in..." : "Login to Admin →"}
            </button>

          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          🔒 Authorized personnel only
        </p>
      </div>
    </div>
  );
}
