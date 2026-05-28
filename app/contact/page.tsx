"use client";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">Get in Touch</p>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">We&apos;d Love to Hear From You</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Have a question about a product, need build advice, or want to explore a partnership? Our team is here to help.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info */}
          <div className="lg:col-span-2 space-y-5">
            {[
              { icon: Mail, title: "Email Us", lines: ["support@asddrones.in", "sales@asddrones.in"] },
              { icon: Phone, title: "Call Us", lines: ["+91 98765 43210", "+91 98765 43211"] },
              { icon: MapPin, title: "Visit Us", lines: ["ASD Drones HQ", "Electronics City, Bengaluru", "Karnataka 560100, India"] },
              { icon: Clock, title: "Business Hours", lines: ["Mon–Sat: 9 AM – 7 PM", "Sunday: 10 AM – 3 PM"] },
            ].map(({ icon: Icon, title, lines }) => (
              <div key={title} className="bg-white rounded-2xl border border-slate-100 p-5 flex gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm mb-1">{title}</div>
                  {lines.map((line) => (
                    <div key={line} className="text-slate-500 text-sm">{line}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Send a Message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email *</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subject *</label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 bg-white">
                  <option>Product Inquiry</option>
                  <option>Build Consultation</option>
                  <option>Order Support</option>
                  <option>Partnership / B2B</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message *</label>
                <textarea
                  rows={5}
                  placeholder="Tell us how we can help you..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
