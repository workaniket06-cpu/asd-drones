"use client";
import Link from "next/link";
import { blogPosts } from "@/lib/data";
import { Clock, ArrowRight, BookOpen } from "lucide-react";

const allPosts = [
  ...blogPosts,
  {
    id: 4,
    title: "Best FPV Racing Frames for Beginners in 2025",
    excerpt: "Our top picks for entry-level racing frames that balance durability, performance, and price.",
    category: "Reviews",
    readTime: "7 min read",
    date: "May 2, 2025",
  },
  {
    id: 5,
    title: "Understanding Motor KV Ratings: A Simple Guide",
    excerpt: "Confused about KV ratings? This beginner-friendly guide explains what KV means and how to pick the right motor.",
    category: "Guides",
    readTime: "5 min read",
    date: "April 28, 2025",
  },
  {
    id: 6,
    title: "Agriculture Drones in India: Market Overview 2025",
    excerpt: "How precision agriculture is being transformed by drones across India's farmlands.",
    category: "Industry",
    readTime: "12 min read",
    date: "April 21, 2025",
  },
];

const tags = ["Guides", "Reviews", "Safety", "Industry", "Builds", "FPV", "Agriculture"];

export default function BlogPage() {
  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">Knowledge Hub</p>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">ASD Drones Blog</h1>
          <p className="text-slate-500">Guides, reviews, industry news, and tips from our team of drone experts.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button className="px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full">All</button>
          {tags.map((tag) => (
            <button key={tag} className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 text-sm font-medium rounded-full transition-colors">
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-44 bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                <BookOpen className="w-14 h-14 text-blue-200" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{post.category}</span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </div>
                </div>
                <h2 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{post.date}</span>
                  <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                    Read <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
