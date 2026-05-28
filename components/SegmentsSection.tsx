import Link from "next/link";
import { ArrowRight } from "lucide-react";

const segments = [
  {
    id: "defence",
    title: "Defence",
    description: "High-endurance drones for surveillance, reconnaissance, and critical missions with military-grade components.",
    icon: "🛡️",
    gradient: "from-slate-800 to-slate-900",
    accentColor: "border-blue-500",
    href: "/segments/defence",
  },
  {
    id: "agriculture",
    title: "Agriculture",
    description: "Precision agricultural drones for crop monitoring, spraying, and field analysis to boost yields.",
    icon: "🌾",
    gradient: "from-emerald-800 to-slate-900",
    accentColor: "border-emerald-500",
    href: "/segments/agriculture",
  },
  {
    id: "consumer",
    title: "Consumer",
    description: "FPV racing, freestyle flying, aerial photography — high-performance builds for passionate hobbyists.",
    icon: "🎮",
    gradient: "from-blue-800 to-slate-900",
    accentColor: "border-sky-500",
    href: "/segments/consumer",
  },
  {
    id: "custom",
    title: "Custom Drone",
    description: "Work with our engineers to design bespoke drone solutions tailored to your unique requirements.",
    icon: "⚙️",
    gradient: "from-violet-800 to-slate-900",
    accentColor: "border-violet-500",
    href: "/segments/custom",
  },
];

export default function SegmentsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">What We Serve</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Built for Every Mission
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base">
            From racing circuits to paddy fields to national security — ASD Drones powers every segment of India&apos;s growing drone ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {segments.map((seg) => (
            <Link
              key={seg.id}
              href={seg.href}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${seg.gradient} p-6 text-white border-b-4 ${seg.accentColor} hover:-translate-y-1 hover:shadow-2xl transition-all duration-300`}
            >
              <div className="text-4xl mb-4">{seg.icon}</div>
              <h3 className="text-xl font-extrabold mb-2">{seg.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">{seg.description}</p>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-300 group-hover:text-white transition-colors">
                Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
