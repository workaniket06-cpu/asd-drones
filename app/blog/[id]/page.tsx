"use client";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { blogPosts } from "@/lib/data";

const FULL_CONTENT: Record<number, string> = {
  1: `Choosing the right flight controller (FC) is one of the most important decisions when building a drone. The FC is the brain of your build — it reads sensor data, runs stabilisation algorithms, and sends motor commands dozens of times per second.

**Processor & Firmware**
Look for an F7 or H7 processor for modern builds. These run Betaflight 4.x smoothly and have enough headroom for GPS rescue, RPM filtering, and logging. F4 FCs are still viable for budget builds.

**UART Count**
Count how many UARTs you need before buying. A typical 5" quad needs: 1 for ESC telemetry, 1 for VTX SmartAudio, 1 for GPS, 1 for receiver. Many cheap FCs only have 3 UARTs available.

**Gyro Placement**
A gyro sitting directly on the FC PCB will pick up vibrations from the board itself. Stacked designs (where the gyro is isolated on a separate layer) offer better filtering performance.

**Size Matters**
30×30 mm stacks are the standard for 5" builds. 20×20 for toothpicks and 3" quads. 16×16 for micro brushless. Make sure your frame supports the stack size before ordering.

**Budget Recommendations**
- Budget: SpeedyBee F405 (great value, solid app)
- Mid-range: HGLRC Zeus F7
- Pro: Matek F722-SE or Foxeer Reaper F7

Always cross-check the FC's pinout diagram against your other components before wiring.`,

  2: `LiPo (Lithium Polymer) batteries power everything from tiny whoops to long-range cruisers. But they demand respect — an improperly handled LiPo can start a fire in minutes.

**Storage Voltage**
Never store a fully charged or fully depleted LiPo. Storage voltage is 3.8V per cell (3S = 11.4V, 4S = 15.2V). Most smart chargers have a "Storage" mode that handles this automatically.

**Charging Rules**
- Always use a LiPo-rated balance charger (ISDT, iCharger, HOTA, etc.)
- Never leave a charging battery unattended
- Charge at 1C unless the battery is explicitly rated for faster charging
- Never charge a puffy or damaged battery

**Puffing**
A puffy LiPo has undergone internal decomposition. If your battery is visibly swollen, stop using it immediately. Puncture a small hole in a fireproof container (or bury it in dry sand) to discharge, then dispose at a battery recycling point.

**Storage**
Store in a fire-resistant LiPo bag, away from flammable materials. Never leave in a hot car — temperatures above 60°C can trigger thermal runaway.

**Disposal**
Discharge to ~1V per cell using a LiPo discharger or by connecting a resistor. Then dispose at an e-waste recycling facility. Never throw in regular trash or incinerate.

Following these rules will extend battery life and keep you and your workspace safe.`,

  3: `FPV (First Person View) and long-range systems serve very different purposes. Understanding the trade-offs will help you choose the right setup for your flying style.

**FPV Racing & Freestyle**
FPV quads are built for performance — low latency video feed, high-power motors, and aggressive flight. The DJI O3 or Walksnail Avatar systems give you HD video with ~20–30ms latency. Analogue systems (with VTX + camera) have sub-10ms latency and are still popular in racing.

Range is typically 500m–2km line of sight. These systems are not designed for beyond-visual-range (BVR) flight.

**Long-Range Systems**
Systems like ExpressLRS (ELRS) on 868/915 MHz can achieve 30–100+ km of control link range. Paired with a high-gain directional antenna, your RC link will outlast your battery many times over.

Video telemetry is the limiting factor for long range. HD systems like DJI or Walksnail work to ~10km. For ultra-long range, you need a dedicated video transmitter (Herelink, SIYI, etc.) or rely on FPV only up to 5km and GPS return-to-home beyond.

**The Hybrid Approach**
Many pilots run an ELRS receiver for control + DJI O3 for FPV up to ~10km. This gives crisp HD video while keeping the control link rock solid over the full range.

**Bottom Line**
If you want to race or do freestyle tricks: go FPV. If you want to cruise, map, or do search and rescue: go long-range. For the best of both worlds, budget for a hybrid build.`,
};

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const post = blogPosts.find(p => p.id === parseInt(id));

  if (!post) return (
    <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl font-bold text-slate-700 mb-2">Article not found</p>
        <Link href="/blog" className="text-blue-600 font-semibold hover:text-blue-800">← Back to Blog</Link>
      </div>
    </div>
  );

  const content = FULL_CONTENT[post.id] || post.excerpt;

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate">{post.title}</span>
        </nav>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {/* Header gradient */}
          <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-800 flex items-end p-8">
            <div>
              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                <Tag className="w-3 h-3" /> {post.category}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">{post.title}</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-4 text-xs text-slate-400 mb-6 pb-6 border-b border-slate-100">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
              <span>{post.date}</span>
              <span className="text-blue-600 font-semibold">{post.category}</span>
            </div>

            <div className="prose prose-slate max-w-none">
              {content.split("\n\n").map((para, i) => {
                if (para.startsWith("**") && para.endsWith("**")) {
                  return <h3 key={i} className="text-base font-bold text-slate-800 mt-5 mb-2">{para.replace(/\*\*/g, "")}</h3>;
                }
                if (para.includes("\n- ")) {
                  const [title, ...items] = para.split("\n- ");
                  return (
                    <div key={i}>
                      {title && <p className="text-sm text-slate-600 leading-relaxed mb-2">{title}</p>}
                      <ul className="list-disc list-inside space-y-1 mb-4">
                        {items.map((item, j) => <li key={j} className="text-sm text-slate-600">{item}</li>)}
                      </ul>
                    </div>
                  );
                }
                return <p key={i} className="text-sm text-slate-600 leading-relaxed mb-4">{para}</p>;
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:text-blue-800">
            <ArrowLeft className="w-4 h-4" /> All Articles
          </Link>
          <Link href="/shop" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
            Shop Products →
          </Link>
        </div>
      </div>
    </div>
  );
}
