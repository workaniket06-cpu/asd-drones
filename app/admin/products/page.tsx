"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Plus, Search, Pencil, Trash2, Package, X, Check, AlertTriangle, Upload, ImageIcon, Loader2 } from "lucide-react";

interface Product {
  id: number; name: string; category: string; sku: string;
  price: number; originalPrice: number; stock: number;
  status: string; description: string; createdAt: string; image?: string;
}
type FormData = Omit<Product, "id" | "status" | "createdAt">;

const CATEGORIES = ["Electronics","FPV Equipment","Motors","Frames","Propellers","Battery & Charging","Radio & Receiver","Accessories"];
const empty: FormData = { name:"", category:"Electronics", sku:"", price:0, originalPrice:0, stock:0, description:"", image:"" };

function statusBadge(s: string) {
  if (s === "active") return "bg-green-100 text-green-700";
  if (s === "low_stock") return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}
function statusLabel(s: string) {
  if (s === "active") return "Active";
  if (s === "low_stock") return "Low Stock";
  return "Out of Stock";
}

function ProductThumb({ image, name }: { image?: string; name: string }) {
  if (image) {
    return (
      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0 relative">
        <Image src={image} alt={name} fill className="object-cover" sizes="40px" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
      <Package className="w-4.5 h-4.5 text-blue-400" />
    </div>
  );
}

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  async function upload(file: File) {
    setError("");
    if (!["image/jpeg","image/png","image/webp","image/gif"].includes(file.type)) {
      setError("Only JPG, PNG, WebP or GIF allowed"); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB"); return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) { setError(data.error || "Upload failed"); return; }
    onChange(data.url);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Product Image</label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
          <div className="relative h-48 w-full">
            <Image src={value} alt="Product" fill className="object-contain p-2" sizes="480px" />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="px-3 py-2 bg-white rounded-lg text-xs font-bold text-slate-900 hover:bg-slate-100 flex items-center gap-1.5 shadow">
              <Upload className="w-3.5 h-3.5" /> Replace
            </button>
            <button type="button" onClick={() => onChange("")}
              className="px-3 py-2 bg-red-600 rounded-lg text-xs font-bold text-white hover:bg-red-700 flex items-center gap-1.5 shadow">
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Uploading…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {dragOver ? "Drop image here" : "Click to upload or drag & drop"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WebP or GIF · Max 5 MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFile} />
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add"|"edit"|null>(null);
  const [editProduct, setEditProduct] = useState<Product|null>(null);
  const [form, setForm] = useState<FormData>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number|null>(null);
  const [toast, setToast] = useState("");

  const load = useCallback(() => {
    fetch("/api/admin/products").then(r=>r.json()).then(setProducts);
  }, []);
  useEffect(() => { load(); }, [load]);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  function openAdd() { setForm(empty); setModal("add"); }

  function openEdit(p: Product) {
    setEditProduct(p);
    setForm({ name:p.name, category:p.category, sku:p.sku, price:p.price, originalPrice:p.originalPrice, stock:p.stock, description:p.description, image:p.image||"" });
    setModal("edit");
  }

  async function save() {
    if (!form.name || !form.sku) return;
    setSaving(true);
    if (modal === "add") {
      await fetch("/api/admin/products", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      showToast("Product added!");
    } else if (editProduct) {
      await fetch(`/api/admin/products/${editProduct.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      showToast("Product updated!");
    }
    setSaving(false);
    setModal(null);
    load();
  }

  async function del(id: number) {
    await fetch(`/api/admin/products/${id}`, { method:"DELETE" });
    setDeleteConfirm(null);
    showToast("Product deleted");
    load();
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search by name, SKU or category..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Image","SKU","Product","Category","Price","Stock","Status","Actions"].map(h=>(
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-slate-400 text-sm">No products found</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <ProductThumb image={p.image} name={p.name} />
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{p.sku}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900 line-clamp-1">{p.name}</p>
                    <p className="text-xs text-slate-400 line-clamp-1">{p.description}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{p.category}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-bold text-slate-900">₹{p.price.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-slate-400 line-through">₹{p.originalPrice.toLocaleString("en-IN")}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {p.stock <= 10 && p.stock > 0 && <AlertTriangle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />}
                      <span className="text-sm font-semibold text-slate-900">{p.stock}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusBadge(p.status)}`}>{statusLabel(p.status)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(p)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirm(p.id)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-extrabold text-slate-900">{modal === "add" ? "Add Product" : "Edit Product"}</h2>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Image uploader */}
              <ImageUploader value={form.image || ""} onChange={url => setForm(f => ({ ...f, image: url }))} />

              {/* Name & SKU */}
              {[
                { label:"Product Name *", key:"name", placeholder:"e.g. F7 Flight Controller" },
                { label:"SKU *", key:"sku", placeholder:"e.g. ASD-FC-001" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                  <input type="text" value={(form as Record<string, unknown>)[key] as string} placeholder={placeholder}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
              ))}

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 bg-white">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Price / Original Price / Stock */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label:"Price (₹)", key:"price" },
                  { label:"Original (₹)", key:"originalPrice" },
                  { label:"Stock", key:"stock" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                    <input type="number" min="0" value={(form as Record<string, unknown>)[key] as number}
                      onChange={e => setForm(f => ({ ...f, [key]: parseFloat(e.target.value) || 0 }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Short product description…"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 resize-none" />
              </div>
            </div>

            <div className="px-6 pb-5 flex gap-3 sticky bottom-0 bg-white pt-3 border-t border-slate-100">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={save} disabled={saving || !form.name || !form.sku}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors">
                {saving ? "Saving…" : modal === "add" ? "Add Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 text-center mb-2">Delete Product?</h3>
            <p className="text-slate-500 text-sm text-center mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={() => del(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
