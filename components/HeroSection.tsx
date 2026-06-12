"use client";
import Link from "next/link";
import { ArrowRight, Shield, Truck, Headphones, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/shop?search=${encodeURIComponent(q)}`);
    else router.push("/shop");
  }

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden pt-24">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Drone SVG illustration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 hidden xl:flex items-center justify-center opacity-20">
        <svg viewBox="0 0 400 400" className="w-full max-w-lg" fill="none">
          <rect x="160" y="160" width="80" height="80" rx="12" fill="#3b82f6" />
          <rect x="60" y="185" width="100" height="8" rx="4" fill="#475569" />
          <rect x="240" y="185" width="100" height="8" rx="4" fill="#475569" />
          <rect x="185" y="60" width="8" height="100" rx="4" fill="#475569" />
          <rect x="185" y="240" width="8" height="100" rx="4" fill="#475569" />
          <ellipse cx="80" cy="80" rx="50" ry="12" fill="#3b82f6" opacity="0.6" />
          <ellipse cx="320" cy="80" rx="50" ry="12" fill="#3b82f6" opacity="0.6" />
          <ellipse cx="80" cy="320" rx="50" ry="12" fill="#3b82f6" opacity="0.6" />
          <ellipse cx="320" cy="320" rx="50" ry="12" fill="#3b82f6" opacity="0.6" />
          <circle cx="80" cy="80" r="10" fill="#60a5fa" />
          <circle cx="320" cy="80" r="10" fill="#60a5fa" />
          <circle cx="80" cy="320" r="10" fill="#60a5fa" />
          <circle cx="320" cy="320" r="10" fill="#60a5fa" />
          <circle cx="200" cy="220" r="14" fill="#1e40af" />
          <circle cx="200" cy="220" r="8" fill="#93c5fd" />
          <circle cx="175" cy="175" r="5" fill="#38bdf8" />
          <circle cx="225" cy="175" r="5" fill="#38bdf8" />
          <circle cx="175" cy="225" r="5" fill="#38bdf8" />
          <circle cx="225" cy="225" r="5" fill="#ef4444" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            India&apos;s Premier Drone Component Store
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
            Precision
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
              in Every
            </span>
            <br />
            Flight
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
            Premium drone parts, FPV equipment, and electronics — everything you need to build, fly, and innovate.
          </p>

          {/* ── SEARCH BAR ── */}
          <form onSubmit={handleSearch} className="flex items-center w-full max-w-lg bg-white rounded-2xl shadow-2xl shadow-blue-900/40 overflow-hidden mb-8 border-2 border-transparent focus-within:border-blue-400 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-4 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search motors, frames, FPV cameras..."
              className="flex-1 px-3 py-4 text-slate-800 placeholder-slate-400 text-sm sm:text-base outline-none bg-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-4 text-sm sm:text-base transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>

          {/* Popular searches */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <span className="text-slate-500 text-xs font-medium">Popular:</span>
            {["Motors", "FPV Camera", "Flight Controller", "LiPo Battery", "Frames"].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => router.push(`/shop?search=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-slate-300 text-xs rounded-full border border-white/15 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 text-base"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-200 text-base"
            >
              Our Story
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6">
            {[
              { icon: Shield, text: "100% Genuine Parts" },
              { icon: Truck, text: "Free Shipping All Over India" },
              { icon: Headphones, text: "Expert Support" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-slate-400 text-sm">
                <Icon className="w-4 h-4 text-blue-400" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full fill-white" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
