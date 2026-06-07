"use client";
import { useState, useEffect } from "react";
import { Search, Users, TrendingUp, ShoppingBag, Mail } from "lucide-react";

interface Customer {
  id: number; name: string; email: string; phone: string;
  city: string; state: string; orders: number;
  totalSpent: number; status: string; joinedAt: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/customers").then(r=>r.json()).then((data: Customer[]) =>
      setCustomers([...data].sort((a,b)=>new Date(b.joinedAt).getTime()-new Date(a.joinedAt).getTime()))
    );
  },[]);

  const totalRevenue = customers.reduce((s,c)=>s+c.totalSpent,0);
  const avgSpend = customers.length ? Math.round(totalRevenue/customers.length) : 0;
  const activeCount = customers.filter(c=>c.status==="active").length;

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter==="all" || c.status===filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Customers</h1>
        <p className="text-slate-500 text-sm mt-0.5">{customers.length} registered customers</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label:"Total Customers", value:customers.length, icon:Users, color:"bg-blue-600" },
          { label:"Active", value:activeCount, icon:TrendingUp, color:"bg-green-600" },
          { label:"Total Revenue", value:`₹${totalRevenue.toLocaleString("en-IN")}`, icon:ShoppingBag, color:"bg-violet-600" },
          { label:"Avg. Spend", value:`₹${avgSpend.toLocaleString("en-IN")}`, icon:TrendingUp, color:"bg-sky-600" },
        ].map(s=>(
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search by name, email or city..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
        </div>
        <div className="flex gap-2">
          {["all","active","inactive"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border capitalize ${filter===f?"bg-blue-600 text-white border-blue-600":"bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["#","Customer","Contact","Location","Orders","Total Spent","Status","Joined"].map(h=>(
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length===0 && <tr><td colSpan={8} className="px-5 py-10 text-center text-slate-400 text-sm">No customers found</td></tr>}
              {filtered.map((c,i)=>(
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-sm text-slate-400">{i+1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {c.name[0]}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
                      <Mail className="w-3 h-3" /> {c.email}
                    </div>
                    <div className="text-xs text-slate-400">{c.phone}</div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">{c.city}</p>
                    <p className="text-xs text-slate-400">{c.state}</p>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-slate-900">{c.orders}</td>
                  <td className="px-5 py-4 text-sm font-extrabold text-slate-900">₹{c.totalSpent.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.status==="active"?"bg-green-100 text-green-700":"bg-slate-100 text-slate-500"}`}>
                      {c.status==="active"?"Active":"Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                    {new Date(c.joinedAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
