"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, SlidersHorizontal, Check, Search, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number; name: string; category: string; sku: string;
  price: number; originalPrice: number; stock: number;
  status: string; description: string; image?: string;
}

const CATEGORIES = ["All","Electronics","FPV Equipment","Motors","Frames","Propellers","Battery & Charging","Radio & Receiver","Accessories"];

function AddButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  function handle() {
    addToCart({ id: product.id, name: product.name, category: product.category, price: product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }
  return (
    <button onClick={handle}
      className={`flex items-center gap-1 px-2.5 py-1.5 text-white text-xs font-bold rounded-lg transition-all duration-200 ${added ? "bg-green-600 scale-95" : "bg-blue-600 hover:bg-blue-700"}`}>
      {added ? <><Check className="w-3 h-3" /> Done</> : <><ShoppingCart className="w-3 h-3" /> Add</>}
    </button>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [catFilter, setCatFilter] = useState(searchParams.get("cat") || "All");
  const [priceMax, setPriceMax] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("popular");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync URL params when they change (e.g. from navbar search)
  useEffect(() => {
    const q = searchParams.get("search") || "";
    const c = searchParams.get("cat") || "All";
    setSearch(q);
    setCatFilter(c);
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/admin/products", { cache: "no-store" })
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  let filtered = products.filter(p => {
    if (p.status === "draft") return false;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || p.category === catFilter;
    const matchPrice = !priceMax || p.price <= parseInt(priceMax);
    const matchStock = !inStockOnly || p.stock > 0;
    return matchSearch && matchCat && matchPrice && matchStock;
  });

  if (sort === "price_asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === "newest") filtered = [...filtered].sort((a, b) => b.id - a.id);

  const Sidebar = () => (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Category</div>
        <div className="space-y-1.5">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setCatFilter(cat); setSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${catFilter === cat ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-slate-100 pt-5">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Max Price (₹)</div>
        <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="e.g. 5000"
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
      </div>
      <div className="border-t border-slate-100 pt-5">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="rounded text-blue-600 w-4 h-4" />
          <span className="text-sm font-medium text-slate-700">In Stock Only</span>
        </label>
      </div>
      {(catFilter !== "All" || priceMax || inStockOnly) && (
        <button onClick={() => { setCatFilter("All"); setPriceMax(""); setInStockOnly(false); }}
          className="w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-red-100">
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Shop All Products</h1>
          <p className="text-slate-500 text-sm">{products.length} genuine drone parts & accessories</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <button onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm">
            <SlidersHorizontal className="w-4 h-4" /> Filters {catFilter !== "All" && `· ${catFilter}`}
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative bg-white w-72 h-full p-5 overflow-y-auto ml-auto shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <span className="font-bold text-slate-900">Filters</span>
                <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-24">
              <div className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </div>
              <Sidebar />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
              </div>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 bg-white">
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <p className="text-xs text-slate-400 mb-4">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 h-64 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <p className="text-slate-400 text-sm">No products match your filters.</p>
                <button onClick={() => { setSearch(""); setCatFilter("All"); setPriceMax(""); setInStockOnly(false); }}
                  className="mt-3 text-blue-600 text-sm font-semibold hover:text-blue-800">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(product => {
                  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                  const inStock = product.stock > 0;
                  return (
                    <div key={product.id} className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
                      <Link href={`/shop/${product.id}`} className="block">
                        <div className="relative h-40 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center overflow-hidden">
                          {product.image ? (
                            <Image src={product.image} alt={product.name} fill className="object-contain p-2" sizes="250px" />
                          ) : (
                            <div className="text-5xl opacity-20 select-none">
                              {product.category === "Electronics" ? "⚡" : product.category === "Motors" ? "🔄" : product.category === "Frames" ? "🔩" : product.category === "FPV Equipment" ? "📡" : product.category === "Battery & Charging" ? "🔋" : product.category === "Radio & Receiver" ? "📻" : "🌀"}
                            </div>
                          )}
                          {discount > 0 && <span className="absolute top-2 right-2 bg-slate-900 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">-{discount}%</span>}
                          {!inStock && <div className="absolute inset-0 bg-white/70 flex items-center justify-center"><span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">Out of Stock</span></div>}
                        </div>
                      </Link>
                      <div className="p-3 flex flex-col flex-1">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">{product.category}</span>
                        <Link href={`/shop/${product.id}`}>
                          <h3 className="font-bold text-slate-900 text-xs leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">{product.name}</h3>
                        </Link>
                        <div className="flex items-center justify-between mt-auto">
                          <div>
                            <span className="text-sm font-extrabold text-slate-900">₹{product.price.toLocaleString("en-IN")}</span>
                            {discount > 0 && <span className="text-xs text-slate-400 line-through ml-1">₹{product.originalPrice.toLocaleString("en-IN")}</span>}
                          </div>
                          {inStock ? <AddButton product={product} /> : <span className="text-xs text-slate-400">—</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
