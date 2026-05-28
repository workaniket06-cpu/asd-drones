import { testimonials } from "@/lib/data";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">What Pilots Say</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Trusted by 25,000+ Drone Enthusiasts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-blue-200 mb-4" />
              <p className="text-slate-700 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role} · {t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
