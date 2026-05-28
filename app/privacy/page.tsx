export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-8">Last updated: May 2026</p>
        <div className="bg-white rounded-2xl border border-slate-100 p-8 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Information We Collect</h2>
            <p className="text-slate-600 text-sm leading-relaxed">We collect information you provide when creating an account, placing an order, or subscribing to our newsletter. This includes your name, email address, phone number, and delivery address.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">How We Use Your Information</h2>
            <ul className="text-slate-600 text-sm leading-relaxed space-y-1.5 list-disc list-inside">
              <li>To process and fulfil your orders</li>
              <li>To send order status updates and notifications</li>
              <li>To send newsletters (only if you subscribed)</li>
              <li>To improve our website and product offerings</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Data Security</h2>
            <p className="text-slate-600 text-sm leading-relaxed">Passwords are stored as bcrypt hashes and never in plain text. We use HTTPS for all data transmission. We do not sell or rent your personal information to third parties.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Cookies</h2>
            <p className="text-slate-600 text-sm leading-relaxed">We use session cookies to keep you logged in. These are httpOnly cookies and cannot be accessed by JavaScript. We do not use tracking or advertising cookies.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Your Rights</h2>
            <p className="text-slate-600 text-sm leading-relaxed">You may request deletion of your account and personal data by contacting us. We will process deletion requests within 30 days.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Contact</h2>
            <p className="text-slate-600 text-sm leading-relaxed">Questions about our privacy practices? Email us at <a href="mailto:privacy@asddrones.in" className="text-blue-600 hover:underline">privacy@asddrones.in</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
