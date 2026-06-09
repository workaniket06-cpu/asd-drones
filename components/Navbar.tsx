"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function openSearch() {
    setSearchOpen(true);
    setSearchQuery("");
    setTimeout(() => searchInputRef.current?.focus(), 50);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    closeSearch();
    router.push(`/shop?search=${encodeURIComponent(q)}`);
  }

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeSearch(); };
    if (searchOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

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


            <Link href="/about" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors rounded-lg hover:bg-blue-50">About</Link>
            <Link href="/blog" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors rounded-lg hover:bg-blue-50">Blog</Link>
            <Link href="/contact" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors rounded-lg hover:bg-blue-50">Contact</Link>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSearch}
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              title="Search products"
            >
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
            {/* Mobile search */}
            <button
              onClick={() => { setIsOpen(false); openSearch(); }}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            >
              <Search className="w-4 h-4" /> Search Products
            </button>
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

      {/* ── Search Overlay ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-sm flex flex-col items-center pt-24 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeSearch(); }}
        >
          <div className="w-full max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, SKUs, categories..."
                className="w-full pl-12 pr-14 py-4 text-lg bg-white rounded-2xl shadow-2xl border-0 outline-none text-slate-900 placeholder-slate-400"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </form>

            {/* Quick category links */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => { closeSearch(); router.push(cat.href); }}
                  className="px-3 py-1.5 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors border border-white/20"
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <p className="text-slate-400 text-sm mt-4 text-center">
              Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Enter</kbd> to search · <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Esc</kbd> to close
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
