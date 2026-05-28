"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, ChevronDown, Search, User, LogOut, LogIn, UserPlus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const categories = [
  { name: "Electronics", href: "/shop?cat=electronics", sub: ["Flight Controllers", "ESCs", "GPS Modules", "Stacks"] },
  { name: "FPV Equipment", href: "/shop?cat=fpv", sub: ["Cameras", "Goggles", "Antennas", "VTX"] },
  { name: "Motors", href: "/shop?cat=motors", sub: ["Micro Motors", "Long Range", "Professional"] },
  { name: "Frames", href: "/shop?cat=frames", sub: ["3-5 Inch", "6-8 Inch", "10+ Inch"] },
  { name: "Propellers", href: "/shop?cat=propellers", sub: ["2-3 Inch", "5 Inch", "7+ Inch"] },
  { name: "Battery & Charging", href: "/shop?cat=battery", sub: ["LiPo Cells", "Chargers", "Battery Straps"] },
  { name: "Radio & Receiver", href: "/shop?cat=radio", sub: ["Controllers", "Receivers", "Modules"] },
  { name: "Accessories", href: "/shop?cat=accessories", sub: ["Cables", "Connectors", "Tools"] },
];

const segments = [
  { name: "Defence", href: "/segments/defence" },
  { name: "Agriculture", href: "/segments/agriculture" },
  { name: "Consumer", href: "/segments/consumer" },
  { name: "Custom Drone", href: "/segments/custom" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [segOpen, setSegOpen] = useState(false);
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-md"
      }`}
    >
      {/* Top bar */}
      <div className="bg-blue-700 text-white text-xs py-1.5 text-center">
        Free shipping on orders above ₹2000 &nbsp;|&nbsp; Priority support &nbsp;|&nbsp; 100% genuine parts
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:bg-blue-800 transition-colors">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 2L8 6H4v4l-2 2 2 2v4h4l4 4 4-4h4v-4l2-2-2-2V6h-4L12 2z" opacity="0.3" />
                <circle cx="12" cy="12" r="3" />
                <path d="M5 5l2 2M19 5l-2 2M5 19l2-2M19 19l-2-2" strokeWidth="1.5" stroke="white" fill="none" strokeLinecap="round" />
                <circle cx="5" cy="5" r="2" fill="white" />
                <circle cx="19" cy="5" r="2" fill="white" />
                <circle cx="5" cy="19" r="2" fill="white" />
                <circle cx="19" cy="19" r="2" fill="white" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">ASD</span>
              <span className="text-xl font-extrabold text-blue-700 tracking-tight"> Drones</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Shop dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors rounded-lg hover:bg-blue-50">
                Shop <ChevronDown className="w-4 h-4" />
              </button>
              {shopOpen && (
                <div className="absolute top-full left-0 w-[600px] bg-white shadow-2xl rounded-2xl border border-slate-100 p-6 grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="group p-3 rounded-xl hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-semibold text-slate-800 group-hover:text-blue-700 text-sm">{cat.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{cat.sub.join(" · ")}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Segments dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setSegOpen(true)}
              onMouseLeave={() => setSegOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors rounded-lg hover:bg-blue-50">
                Segments <ChevronDown className="w-4 h-4" />
              </button>
              {segOpen && (
                <div className="absolute top-full left-0 w-48 bg-white shadow-2xl rounded-xl border border-slate-100 py-2">
                  {segments.map((seg) => (
                    <Link
                      key={seg.name}
                      href={seg.href}
                      className="block px-4 py-2.5 text-sm text-slate-700 hover:text-blue-700 hover:bg-blue-50 font-medium transition-colors"
                    >
                      {seg.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors rounded-lg hover:bg-blue-50">About</Link>
            <Link href="/blog" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors rounded-lg hover:bg-blue-50">Blog</Link>
            <Link href="/contact" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors rounded-lg hover:bg-blue-50">Contact</Link>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors">
              <Search className="w-4.5 h-4.5" />
            </button>
            {/* User menu */}
            <div className="hidden sm:block relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-1.5 w-9 h-9 justify-center rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                {user ? (
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                ) : (
                  <User className="w-4.5 h-4.5" />
                )}
              </button>
              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        <User className="w-4 h-4" /> My Account
                      </Link>
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium">
                        <LogIn className="w-4 h-4" /> Sign In
                      </Link>
                      <Link href="/signup" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-bold">
                        <UserPlus className="w-4 h-4" /> Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            <Link href="/cart" className="relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors">
              <ShoppingCart className="w-4.5 h-4.5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{count > 9 ? "9+" : count}</span>
              )}
            </Link>
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider px-3 mb-2">Shop by Category</div>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <div className="border-t border-slate-100 my-3" />
            <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider px-3 mb-2">Segments</div>
            {segments.map((seg) => (
              <Link
                key={seg.name}
                href={seg.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                {seg.name}
              </Link>
            ))}
            <div className="border-t border-slate-100 my-3" />
            {["About", "Blog", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                {item}
              </Link>
            ))}
            <div className="border-t border-slate-100 my-3" />
            {user ? (
              <>
                <div className="px-3 py-2">
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <Link href="/account" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors">My Account</Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors">Sign In</Link>
                <Link href="/signup" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors">Create Account</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
