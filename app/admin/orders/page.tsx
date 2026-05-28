"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, ChevronDown, Eye, X } from "lucide-react";

interface OrderItem { productId: number; name: string; qty: number; price: number; }
interface Order { id: string; customer: string; email: string; phone: string; items: OrderItem[]; total: number; status: string; address: string; createdAt: string; updatedAt: string; }

const STATUSES = ["pending","processing","shipped","delivered","cancelled"];

function badge(s: string) {
  const m: Record<string,string> = {
    delivered:"bg-green-100 text-green-700 border-green-200",
    shipped:"bg-blue-100 text-blue-700 border-blue-200",
    processing:"bg-yellow-100 text-yellow-700 border-yellow-200",
    pending:"bg-orange-100 text-orange-700 border-orange-200",
    cancelled:"bg-red-100 text-red-700 border-red-200",
  };
  return m[s] ?? "bg-slate-100 text-slate-600";
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState<Order|null>(null);
  const [toast, setToast] = useState("");

  const load = useCallback(() => {
    fetch("/api/admin/orders").then(r=>r.json()).then((data: Order[]) =>
      setOrders([...data].sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()))
    );
  },[]);

  useEffect(()=>{ load(); },[load]);

  function showToast(msg: string){ setToast(msg); setTimeout(()=>setToast(""),2500); }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/orders",{ method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id,status}) });
    showToast(`Order status updated to ${status}`);
    load();
    if (detail?.id === id) setDetail(d => d ? {...d,status} : null);
  }

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const revenue = orders.filter(o=>o.status!=="cancelled").reduce((s,o)=>s+o.total,0);

  return (
    <div className="p-6 lg:p-8">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg">{toast}</div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Orders</h1>
        <p className="text-slate-500 text-sm mt-0.5">{orders.length} orders · ₹{revenue.toLocaleString("en-IN")} revenue</p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[{label:"All",value:"all"}, ...STATUSES.map(s=>({label:s.charAt(0).toUpperCase()+s.slice(1),value:s}))].map(opt=>(
          <button key={opt.value} onClick={()=>setFilter(opt.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
              filter===opt.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
            }`}>
            {opt.label}
            {opt.value!=="all" && <span className="ml-1.5 text-xs opacity-75">({orders.filter(o=>o.status===opt.value).length})</span>}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search by order ID, customer name or email..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Order ID","Customer","Items","Amount","Date","Status","Action"].map(h=>(
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length===0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">No orders found</td></tr>}
              {filtered.map(o=>(
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-xs font-mono text-slate-600 font-semibold">{o.id}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-900">{o.customer}</p>
                    <p className="text-xs text-slate-400">{o.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{o.items.length} item{o.items.length!==1?"s":""}</td>
                  <td className="px-5 py-4 text-sm font-extrabold text-slate-900">₹{o.total.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative group inline-block">
                      <button className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${badge(o.status)} cursor-pointer`}>
                        <span className="capitalize">{o.status}</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <div className="absolute z-20 top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 py-1 w-36 hidden group-hover:block">
                        {STATUSES.map(s=>(
                          <button key={s} onClick={()=>updateStatus(o.id,s)}
                            className={`w-full text-left px-3 py-2 text-xs font-medium capitalize hover:bg-slate-50 transition-colors ${o.status===s?"text-blue-600 font-bold":"text-slate-700"}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={()=>setDetail(o)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">{detail.id}</h2>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${badge(detail.status)}`}>{detail.status}</span>
              </div>
              <button onClick={()=>setDetail(null)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label:"Customer", value:detail.customer },
                  { label:"Email", value:detail.email },
                  { label:"Phone", value:detail.phone },
                  { label:"Ordered", value:new Date(detail.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) },
                ].map(({label,value})=>(
                  <div key={label}>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Delivery Address</p>
                <p className="text-sm text-slate-700">{detail.address}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Items Ordered</p>
                <div className="space-y-2">
                  {detail.items.map((item,i)=>(
                    <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-400">Qty: {item.qty} × ₹{item.price.toLocaleString("en-IN")}</p>
                      </div>
                      <p className="text-sm font-extrabold text-slate-900">₹{(item.qty*item.price).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-100 mt-3">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-extrabold text-blue-700 text-lg">₹{detail.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s=>(
                    <button key={s} onClick={()=>updateStatus(detail.id,s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors border ${detail.status===s?"bg-blue-600 text-white border-blue-600":"bg-white text-slate-600 border-slate-200 hover:border-blue-400"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
