import Link from "next/link";
import { ArrowRight, Target, Users, Zap, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-24 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4">Our Story</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Building India&apos;s<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
              Drone Ecosystem
            </span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            ASD Drones was born from a simple belief: every Indian drone builder deserves access to premium, genuine components with expert support — at fair prices.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Our Mission</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                Powering the Future of Indian Drones
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We started as a small team of FPV enthusiasts who were tired of waiting weeks for parts or paying inflated prices for grey-market products. We wanted to change that.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Today, ASD Drones is India&apos;s fastest-growing drone components platform — serving hobbyists, professional pilots, agricultural operators, and defence contractors across the country.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                Get in touch <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, title: "Our Vision", desc: "Make India a global leader in drone technology by empowering builders at every level." },
                { icon: Users, title: "Our Team", desc: "25+ drone engineers, pilots, and tech enthusiasts passionate about flight." },
                { icon: Zap, title: "Our Speed", desc: "Same-day dispatch and delivery within 2-4 business days anywhere in India." },
                { icon: Globe, title: "Our Reach", desc: "Serving customers across all 28 states and 8 union territories." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <Icon className="w-6 h-6 text-blue-600 mb-3" />
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900">Our Journey</h2>
          </div>
          <div className="space-y-6">
            {[
              { year: "2019", title: "Founded", desc: "ASD Drones launched as a small online store for FPV enthusiasts in Bengaluru." },
              { year: "2020", title: "1,000 Customers", desc: "Crossed our first thousand happy customers despite a challenging year." },
              { year: "2021", title: "Warehouse & Expansion", desc: "Opened our first warehouse and expanded to 500+ SKUs." },
              { year: "2022", title: "Defence & Agriculture", desc: "Began supplying to defence contractors and agri-drone operators." },
              { year: "2023", title: "25,000+ Customers", desc: "Became India's most trusted drone component platform." },
              { year: "2025", title: "Custom Drones Division", desc: "Launched our bespoke drone design and manufacturing arm." },
            ].map((item) => (
              <div key={item.year} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {item.year.slice(2)}
                  </div>
                  <div className="w-0.5 bg-blue-100 flex-1 mt-2" />
                </div>
                <div className="pb-6">
                  <div className="text-xs font-bold text-blue-600 mb-0.5">{item.year}</div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
