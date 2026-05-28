import { Shield, Truck, Wrench, Headphones, CreditCard, Package } from "lucide-react";

const perks = [
  {
    icon: Shield,
    title: "100% Genuine Parts",
    description: "Every product is sourced directly from manufacturers. No counterfeits, ever.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Truck,
    title: "Fast Pan-India Delivery",
    description: "Same-day dispatch on orders before 3 PM. Free shipping above ₹2000.",
    color: "text-sky-600 bg-sky-50",
  },
  {
    icon: Wrench,
    title: "Free Repair Support",
    description: "Expert advice and free diagnostics to get your build flying again.",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    icon: Headphones,
    title: "Expert Consultation",
    description: "Speak to our drone engineers before purchasing — we help you build right.",
    color: "text-violet-600 bg-violet-50",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "UPI, cards, net banking, EMI options — all transactions fully secured.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Package,
    title: "Easy Returns",
    description: "7-day no-questions-asked return policy on all stocked products.",
    color: "text-cyan-600 bg-cyan-50",
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Why ASD Drones?</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            The ASD Drones Advantage
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            We&apos;re not just a store — we&apos;re your drone-building partners. Here&apos;s what sets us apart.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${perk.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <perk.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{perk.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{perk.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
