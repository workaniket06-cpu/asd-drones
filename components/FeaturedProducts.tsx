"use client";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, ArrowRight, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

interface Product {
  id: number; name: string; category: string; sku: string;
  price: number; originalPrice: number; stock: number;
  status: string; description: string; image?: string;
}

// Deterministic pseudo-random from product id for rating/reviews
function seededVal(id: number, min: number, max: number) {
  return min + ((id * 37 + 11) % (max - min + 1));
}

function categoryEmoji(cat: string) {
  if (cat === "Electronics") return "⚡";
  if (cat === "Motors") return "🔄";
  if (cat === "Frames") return "🔩";
  if (cat === "FPV Equipment") return "📡";
  if (cat === "Battery & Charging") return "🔋";
  if (cat === "Radio & Receiver") return "📻";
  if (cat === "Propellers") return "🌀";
  return "🚁";
}

function categoryBadge(cat: string): { label: string; color: string } {
  if (cat === "Radio & Receiver") return { label: "HOT", color: "bg-orange-500" };
  if (cat === "FPV Equipment") return { label: "NEW", color: "bg-blue-600" };
  if (cat === "Electronics") return { label: "PRO", color: "bg-purple-600" };
  if (cat === "Motors") return { label: "FAST", color: "bg-red-600" };
  if (cat === "Battery & Charging") return { label: "POWER", color: "bg-green-600" };
  return { label: "PICK", color: "bg-slate-700" };
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const rating = 3.5 + (seededVal(product.id, 0, 15) / 10);
  const reviews = seededVal(product.id, 12, 87);
  const { label, color } = categoryBadge(product.category);
  const inStock = product.stock > 0;

  function handleAdd() {
    addToCart({ id: product.id, name: product.name, category: product.category, price: product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
      <div className="relative h-44 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <Image src={product.image} alt={product.name} fill className="object-contain p-3" sizes="300px" />
        ) : (
          <div className="text-6xl opacity-20 select-none">{categoryEmoji(product.category)}</div>
        )}
        <span className={`absolute top-3 left-3 ${color} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
          {label}
        </span>
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">{product.category}</span>
        <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}`} />
            ))}
          </div>
          <span className="text-xs text-slate-500">({reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-lg font-extrabold text-slate-900">₹{product.price.toLocaleString("en-IN")}</span>
            {discount > 0 && (
              <span className="text-xs text-slate-400 line-through ml-1.5">₹{product.originalPrice.toLocaleString("en-IN")}</span>
            )}
          </div>
          {inStock ? (
            <button
              onClick={handleAdd}
              className={`flex items-center gap-1.5 px-3 py-2 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-sm ${
                added ? "bg-green-600 hover:bg-green-700 scale-95" : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
              }`}
            >
              {added ? <><Check className="w-3.5 h-3.5" /> Added</> : <><ShoppingCart className="w-3.5 h-3.5" /> Add</>}
            </button>
          ) : (
            <Link href={`/shop/${product.id}`} className="text-xs font-semibold text-blue-600 hover:text-blue-800">
              Details →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/admin/products", { cache: "no-store" })
      .then(r => r.json())
      .then((all: Product[]) => {
        // Pick featured: highest-priced active products, one per category
        const active = all.filter(p => p.status !== "draft" && p.stock > 0);
        const seen = new Set<string>();
        const featured: Product[] = [];
        // First pass: one per category by highest price
        const sorted = [...active].sort((a, b) => b.price - a.price);
        for (const p of sorted) {
          if (!seen.has(p.category) && featured.length < 8) {
            seen.add(p.category);
            featured.push(p);
          }
        }
        // Fill remaining slots
        for (const p of sorted) {
          if (featured.length >= 8) break;
          if (!featured.find(f => f.id === p.id)) featured.push(p);
        }
        setProducts(featured);
      })
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">Trending Now</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Featured Products</h2>
          </div>
          <Link href="/shop" className="hidden sm:inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="sm:hidden mt-6 text-center">
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm">
            View all products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
