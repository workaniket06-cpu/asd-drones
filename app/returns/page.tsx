import { RotateCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Returns & Refunds</h1>
        <p className="text-slate-400 text-sm mb-8">7-day return policy on eligible items</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-green-800">7-Day Returns</p>
              <p className="text-xs text-green-600">For eligible unused items</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-800">Easy Process</p>
              <p className="text-xs text-blue-600">Just email us to initiate</p>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-orange-800">5–7 Days Refund</p>
              <p className="text-xs text-orange-600">After item is received</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-8 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Eligible for Return</h2>
            <ul className="space-y-2">
              {["Unopened items in original manufacturer packaging","Items received in damaged or defective condition","Wrong item shipped — we cover return shipping","Items that do not match the listing description"].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Not Eligible for Return</h2>
            <ul className="space-y-2">
              {["Items returned after 7 days of delivery","Opened or used electronic components (ESCs, flight controllers, motors)","Items damaged due to improper installation or use","LiPo batteries that have been charged or used","Custom or special-order items"].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">How to Initiate a Return</h2>
            <ol className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>Email <a href="mailto:returns@asddrones.in" className="text-blue-600 hover:underline">returns@asddrones.in</a> with your order ID and reason for return</li>
              <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>Our team will review and respond within 1–2 business days</li>
              <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>Ship the item back in original packaging using a trackable courier</li>
              <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>Refund is processed within 5–7 business days of receiving the item</li>
            </ol>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Refund Method</h2>
            <p className="text-slate-600 text-sm leading-relaxed">Since we offer Cash on Delivery, refunds are issued via bank transfer (NEFT/IMPS) to the account details you provide. Please share your bank account number and IFSC code when initiating the return.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
