"use client";
import Link from "next/link";
import { Search, ShoppingCart, Wrench, Zap } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Browse & Discover",
    description:
      "Explore 500+ genuine FPV parts — motors, frames, flight controllers, cameras, and more. Filter by category, price, or compatibility.",
    color: "from-blue-500 to-blue-700",
    iconBg: "bg-blue-100 text-blue-600",
    href: "/shop",
    cta: "Browse Shop",
  },
  {
    step: "02",
    icon: ShoppingCart,
    title: "Pick Your Parts",
    description:
      "Add components to your cart with confidence. Every item is hand-verified — 100% genuine, no duplicates, no fakes.",
    color: "from-sky-500 to-cyan-700",
    iconBg: "bg-sky-100 text-sky-600",
    href: "/shop",
    cta: "Shop Now",
  },
  {
    step: "03",
    icon: Wrench,
    title: "Build Your Drone",
    description:
      "Need help assembling? Our expert engineers offer free consultation and step-by-step guidance to get your build flying.",
    color: "from-indigo-500 to-indigo-700",
    iconBg: "bg-indigo-100 text-indigo-600",
    href: "/contact",
    cta: "Get Help",
  },
  {
    step: "04",
    icon: Zap,
    title: "Fly & Dominate",
    description:
      "Take off with a machine built for performance. Whether you race, freestyle, or shoot aerial — ASD parts deliver every time.",
    color: "from-violet-500 to-violet-700",
    iconBg: "bg-violet-100 text-violet-600",
    href: "/shop",
    cta: "Start Building",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Simple Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            From Parts to the Sky — In 4 Steps
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base">
            Whether you&apos;re a first-time builder or a seasoned FPV pilot, ASD Drones makes getting airborne simple, fast, and reliable.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">

          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200 z-0" />

          {steps.map((s) => (
            <div
              key={s.step}
              className="relative z-10 bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-200 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Step number bubble */}
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-xs font-extrabold shadow-md mx-auto`}>
                {s.step}
              </div>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110`}>
                <s.icon className="w-6 h-6" />
              </div>

              {/* Text */}
              <div className="text-center">
                <h3 className="font-extrabold text-slate-900 text-base mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.description}</p>
              </div>

              {/* CTA */}
              <Link
                href={s.href}
                className={`mt-auto mx-auto text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r ${s.color} text-white hover:opacity-90 transition-opacity`}
              >
                {s.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom banner */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-white font-extrabold text-xl mb-1">
              Ready to start your build?
            </h3>
            <p className="text-blue-200 text-sm">
              500+ genuine parts · Fast pan-India delivery · Free expert support
            </p>
          </div>
          <Link
            href="/shop"
            className="flex-shrink-0 bg-white text-blue-700 font-extrabold px-7 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm shadow"
          >
            Shop All Parts →
          </Link>
        </div>

      </div>
    </section>
  );
}
