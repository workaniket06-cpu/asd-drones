import { Truck, Clock, MapPin, Package } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Shipping Policy</h1>
        <p className="text-slate-400 text-sm mb-8">We ship genuine drone parts across India</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Truck, label: "Pan-India Shipping", sub: "All 28 states" },
            { icon: Clock, label: "5–7 Business Days", sub: "Standard delivery" },
            { icon: Package, label: "Free Shipping", sub: "Orders over ₹999" },
            { icon: MapPin, label: "Live Tracking", sub: "Via courier partner" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col items-center text-center gap-2">
              <Icon className="w-6 h-6 text-blue-600" />
              <p className="text-xs font-bold text-slate-800">{label}</p>
              <p className="text-xs text-slate-400">{sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-8 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Shipping Rates</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left pb-2 text-slate-500 font-semibold">Order Value</th>
                    <th className="text-left pb-2 text-slate-500 font-semibold">Shipping Fee</th>
                    <th className="text-left pb-2 text-slate-500 font-semibold">Estimated Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr>
                    <td className="py-2.5 text-slate-700">Under ₹999</td>
                    <td className="py-2.5 font-semibold text-slate-900">₹99</td>
                    <td className="py-2.5 text-slate-500">5–7 business days</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-slate-700">₹999 and above</td>
                    <td className="py-2.5 font-semibold text-green-600">FREE</td>
                    <td className="py-2.5 text-slate-500">5–7 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Order Processing</h2>
            <p className="text-slate-600 text-sm leading-relaxed">Orders are processed within 1–2 business days of placement. You will receive a tracking number via email or SMS once your order is shipped. Orders placed on weekends or public holidays are processed on the next business day.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Packaging</h2>
            <p className="text-slate-600 text-sm leading-relaxed">All items are carefully packed to prevent damage during transit. Fragile electronics are wrapped in anti-static bubble wrap. If your package arrives visibly damaged, please photograph it before opening and contact us within 24 hours.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Remote Areas</h2>
            <p className="text-slate-600 text-sm leading-relaxed">Delivery to remote and hilly areas (J&K, Ladakh, Arunachal Pradesh, Andaman & Nicobar Islands, etc.) may take up to 10–14 business days and may incur additional shipping charges communicated at checkout.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
