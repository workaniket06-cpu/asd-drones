import Link from "next/link";
import { Mail, Phone, MapPin, Play, Camera, MessageCircle, Globe } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

const footerLinks = {
  Shop: [
    { name: "Electronics", href: "/shop?cat=electronics" },
    { name: "FPV Equipment", href: "/shop?cat=fpv" },
    { name: "Motors", href: "/shop?cat=motors" },
    { name: "Frames", href: "/shop?cat=frames" },
    { name: "Propellers", href: "/shop?cat=propellers" },
    { name: "Battery & Charging", href: "/shop?cat=battery" },
  ],
  Segments: [
    { name: "Defence", href: "/segments/defence" },
    { name: "Agriculture", href: "/segments/agriculture" },
    { name: "Consumer", href: "/segments/consumer" },
    { name: "Custom Drone", href: "/segments/custom" },
  ],
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Partnership", href: "/partnership" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  Support: [
    { name: "FAQ", href: "/faq" },
    { name: "Shipping Policy", href: "/shipping" },
    { name: "Return Policy", href: "/returns" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* CTA Strip */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white text-2xl font-bold">Join the Indian Drone Ecosystem</h3>
            <p className="text-blue-100 mt-1 text-sm">Get exclusive deals, new arrivals, and drone tech updates in your inbox.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="5" cy="5" r="2" fill="white" />
                  <circle cx="19" cy="5" r="2" fill="white" />
                  <circle cx="5" cy="19" r="2" fill="white" />
                  <circle cx="19" cy="19" r="2" fill="white" />
                  <line x1="5" y1="5" x2="12" y2="12" stroke="white" strokeWidth="1" />
                  <line x1="19" y1="5" x2="12" y2="12" stroke="white" strokeWidth="1" />
                  <line x1="5" y1="19" x2="12" y2="12" stroke="white" strokeWidth="1" />
                  <line x1="19" y1="19" x2="12" y2="12" stroke="white" strokeWidth="1" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white">ASD <span className="text-blue-400">Drones</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              India&apos;s trusted source for premium drone components and FPV equipment. Quality parts, expert support, fast delivery.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>support@asddrones.in</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5">
              {[Play, Camera, MessageCircle, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ASD Drones. All rights reserved.</p>
          <p>Made with ❤️ in India 🇮🇳 — Building the Drone Ecosystem</p>
        </div>
      </div>
    </footer>
  );
}
