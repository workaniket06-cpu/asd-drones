import Link from "next/link";
import { blogPosts } from "@/lib/data";
import { ArrowRight, Clock, BookOpen } from "lucide-react";

export default function BlogSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">Learn & Explore</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">From the Blog</h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors"
          >
            All articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Placeholder image */}
              <div className="h-40 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-blue-300" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{post.category}</span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{post.date}</span>
                  <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-800 flex items-center gap-1">
                    Read more <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm">
            All articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
