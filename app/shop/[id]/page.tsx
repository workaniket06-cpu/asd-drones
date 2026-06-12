"use client";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Check, ArrowLeft, Package, Truck, Shield, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number; name: string; category: string; sku: string;
  price: number; originalPrice: number; stock: number;
  status: string; description: string; image?: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  function handleAdd() {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addToCart({ id: product.id, name: product.name, category: product.category, price: product.price });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl h-80 animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded-xl animate-pulse w-1/3" />
            <div className="h-8 bg-slate-200 rounded-xl animate-pulse" />
            <div className="h-6 bg-slate-200 rounded-xl animate-pulse w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );

  if (notFound || !product) return (
    <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl font-bold text-slate-700 mb-2">Product not found</p>
        <Link href="/shop" className="text-blue-600 font-semibold hover:text-blue-800">← Back to Shop</Link>
      </div>
    </div>
  );

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-blue-600">Shop</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="bg-white rounded-2xl border border-slate-100 flex items-center justify-center p-8 relative min-h-72">
            {product.image ? (
              <Image src={product.image} alt={product.name} fill className="object-contain p-6" sizes="500px" />
            ) : (
              <div className="text-8xl opacity-20 select-none">
                {product.category === "Electronics" ? "⚡" : product.category === "Motors" ? "🔄" : product.category === "Frames" ? "🔩" : product.category === "FPV Equipment" ? "📡" : product.category === "Battery & Charging" ? "🔋" : product.category === "Radio & Receiver" ? "📻" : "🌀"}
              </div>
            )}
            {discount > 0 && (
              <span className="absolute top-4 right-4 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full">-{discount}%</span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">{product.category}</span>
            <h1 className="text-2xl font-extrabold text-slate-900 leading-snug mb-3">{product.name}</h1>

            <div className="flex items-center gap-1.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}`} />
              ))}
              <span className="text-sm text-slate-500 ml-1">(4.7)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-extrabold text-slate-900">₹{product.price.toLocaleString("en-IN")}</span>
              {discount > 0 && <span className="text-lg text-slate-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>}
              {discount > 0 && <span className="text-sm font-bold text-green-600">{discount}% off</span>}
            </div>

            <div className="flex items-center gap-2 mb-5">
              {inStock ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> In Stock ({product.stock} left)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
              <span className="text-xs text-slate-400">SKU: {product.sku}</span>
            </div>

            {product.description && (
              <div className="mb-6 border-t border-slate-100 pt-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Product Description</h3>
                <div className="text-sm text-slate-600 leading-relaxed space-y-2">
                  {product.description.split(/\n+/).map((line, i) => {
                    const trimmed = line.trim();
                    if (!trimmed) return null;
                    // Section headings (e.g. "Features", "Specifications", "Overview")
                    if (/^(Overview|Features|Specifications?|Applications?|Key Features?|Description|Highlights?|What['']s in the Box|In the Box|Package Contents?)$/i.test(trimmed)) {
                      return <p key={i} className="font-bold text-slate-800 mt-3 first:mt-0">{trimmed}</p>;
                    }
                    // Bullet lines starting with - or •
                    if (/^[-•*]\s/.test(trimmed)) {
                      return (
                        <div key={i} className="flex gap-2">
                          <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                          <span>{trimmed.replace(/^[-•*]\s+/, "")}</span>
                        </div>
                      );
                    }
                    // Key: Value lines (specs)
                    if (/^[^:]+:\s+\S/.test(trimmed) && trimmed.length < 100) {
                      const [key, ...rest] = trimmed.split(":");
                      return (
                        <div key={i} className="flex gap-2">
                          <span className="font-semibold text-slate-700 flex-shrink-0">{key}:</span>
                          <span>{rest.join(":").trim()}</span>
                        </div>
                      );
                    }
                    return <p key={i}>{trimmed}</p>;
                  })}
                </div>
              </div>
            )}

            {inStock && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-slate-600 hover:bg-slate-50 font-bold">−</button>
                  <span className="px-4 py-2 text-sm font-bold border-x border-slate-200">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-2 text-slate-600 hover:bg-slate-50 font-bold">+</button>
                </div>
                <button onClick={handleAdd}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-white font-bold rounded-xl transition-all duration-200 ${added ? "bg-green-600 scale-[0.98]" : "bg-blue-600 hover:bg-blue-700"}`}>
                  {added ? <><Check className="w-4 h-4" /> Added to Cart</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
                </button>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
              <div className="flex flex-col items-center text-center gap-1.5">
                <Truck className="w-5 h-5 text-blue-600" />
                <span className="text-xs text-slate-600 font-medium">Free shipping over ₹999</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-xs text-slate-600 font-medium">Genuine parts</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="text-xs text-slate-600 font-medium">Easy returns</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:text-blue-800">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
