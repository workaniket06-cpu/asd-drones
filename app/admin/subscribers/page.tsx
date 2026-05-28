import { readJSON } from "@/lib/adminData";
import { Mail, Users, Download, TrendingUp } from "lucide-react";

interface Subscriber { email: string; subscribedAt: string; ip: string; }

export default function AdminSubscribers() {
  const subscribers = readJSON<Subscriber>("subscribers");
  const sorted = [...subscribers].sort((a,b)=>new Date(b.subscribedAt).getTime()-new Date(a.subscribedAt).getTime());

  const thisMonth = subscribers.filter(s => {
    const d = new Date(s.subscribedAt);
    const now = new Date();
    return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
  }).length;

  const domains: Record<string,number> = {};
  subscribers.forEach(s => {
    const d = s.email.split("@")[1];
    if (d) domains[d] = (domains[d]||0)+1;
  });
  const topDomains = Object.entries(domains).sort((a,b)=>b[1]-a[1]).slice(0,5);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Newsletter Subscribers</h1>
          <p className="text-slate-500 text-sm mt-0.5">Emails collected via the homepage newsletter form</p>
        </div>
        <a href="/api/subscribe" target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Export JSON
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label:"Total Subscribers", value:subscribers.length, icon:Users, color:"bg-blue-600" },
          { label:"This Month", value:thisMonth, icon:TrendingUp, color:"bg-green-600" },
          { label:"Email Domains", value:Object.keys(domains).length, icon:Mail, color:"bg-violet-600" },
        ].map(s=>(
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-xs font-medium text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscriber table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {subscribers.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 text-lg mb-1">No subscribers yet</h3>
              <p className="text-slate-400 text-sm">Emails collected from the newsletter form will appear here. Refresh after new signups.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">#</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Subscribed</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sorted.map((s,i)=>(
                  <tr key={s.email} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-sm text-slate-400">{i+1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                          {s.email[0].toUpperCase()}
                        </div>
                        <a href={`mailto:${s.email}`} className="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors">{s.email}</a>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                      {new Date(s.subscribedAt).toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400 font-mono">{s.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Domain breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Top Email Domains</h3>
          {topDomains.length===0 ? (
            <p className="text-slate-400 text-sm">No data yet</p>
          ) : (
            <div className="space-y-3">
              {topDomains.map(([domain,count])=>(
                <div key={domain} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 truncate">{domain}</span>
                      <span className="font-bold text-slate-900 ml-2">{count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width:`${(count/subscribers.length)*100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">Data stored in <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">data/subscribers.json</code></p>
            <p className="text-xs text-slate-400 mt-1">Refresh page to see new entries.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
