"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Do you sell genuine / original parts?",
    a: "Yes. ASD Drones only sources products from verified manufacturers and authorised distributors. Every product listed on our site is 100% genuine.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery across India takes 5–7 business days. Remote areas (J&K, Ladakh, Andaman & Nicobar, etc.) may take 10–14 business days.",
  },
  {
    q: "Is shipping free?",
    a: "Yes! Orders above ₹999 qualify for free shipping. Orders under ₹999 carry a flat shipping fee of ₹99.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We currently accept Cash on Delivery (COD). You pay the delivery agent when your order arrives. Online payment options (UPI, cards, net banking) are coming soon.",
  },
  {
    q: "Can I return a product?",
    a: "Yes, within 7 days of delivery for unopened, unused items in their original packaging. Electronic components that have been opened or used are not eligible for return. See our Returns Policy for full details.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order ships, you will receive a tracking number via SMS/email. You can use this to track your package on the courier's website.",
  },
  {
    q: "Do you offer technical support?",
    a: "Yes. If you have questions about component compatibility or need help with your build, email us at support@asddrones.in. Our team includes experienced FPV pilots and drone builders.",
  },
  {
    q: "Can I cancel an order after placing it?",
    a: "Orders can be cancelled before they are shipped. Once shipped, you will need to initiate a return after delivery. To cancel, email orders@asddrones.in with your order ID as soon as possible.",
  },
  {
    q: "Are LiPo batteries safe to ship?",
    a: "Yes. We follow all courier guidelines for shipping LiPo batteries. All batteries are shipped at a safe storage charge level and packed with appropriate protection.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently, we only ship within India. International shipping is on our roadmap and will be announced when available.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4">
        <span className="text-sm font-semibold text-slate-800">{q}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="text-sm text-slate-600 leading-relaxed pb-4 pr-6">{a}</p>}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-slate-500 text-sm mb-8">Everything you need to know about ASD Drones</p>
        <div className="bg-white rounded-2xl border border-slate-100 px-6 divide-y divide-slate-100">
          {FAQS.map(faq => <FAQItem key={faq.q} {...faq} />)}
        </div>
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
          <p className="text-sm font-semibold text-slate-700 mb-1">Still have questions?</p>
          <p className="text-xs text-slate-500 mb-3">Our team is happy to help you</p>
          <a href="mailto:support@asddrones.in" className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
