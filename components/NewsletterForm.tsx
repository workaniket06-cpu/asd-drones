"use client";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Network error, please try again");
    }
    setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <form className="flex flex-col sm:flex-row w-full md:w-auto gap-2" onSubmit={handleSubmit}>
      {status === "success" ? (
        <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-100 px-4 py-2.5 rounded-xl text-sm font-semibold">
          <Check className="w-4 h-4" /> {message}
        </div>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 md:w-64 px-4 py-2.5 rounded-xl text-slate-900 text-sm bg-white border-0 outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl text-sm hover:bg-slate-800 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" /> Subscribing...</> : "Subscribe"}
          </button>
        </>
      )}
      {status === "error" && (
        <p className="text-red-300 text-xs mt-1 w-full">{message}</p>
      )}
    </form>
  );
}
