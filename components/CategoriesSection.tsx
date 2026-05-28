import Link from "next/link";
import { categories } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">Browse by Category</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Everything You Need
              <br />
              to Build & Fly
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors"
          >
            View all products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?cat=${cat.id}`}
              className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-5"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-4 shadow-md`}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors mb-1">{cat.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">{cat.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600">{cat.count}+ items</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              {/* Hover accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cat.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
            </Link>
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm"
          >
            View all products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
