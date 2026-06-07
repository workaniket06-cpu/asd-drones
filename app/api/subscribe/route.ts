import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/adminData";
import { onSubscriberAdded } from "@/lib/automation";

interface Subscriber {
  email: string;
  subscribedAt: string;
  ip: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = (body.email || "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const subscribers = await readDB<Subscriber>("subscribers");

  if (subscribers.find((s) => s.email === email))
    return NextResponse.json({ message: "Already subscribed" });

  subscribers.push({
    email,
    subscribedAt: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for") ?? "unknown",
  });

  await writeDB("subscribers", subscribers);

  // 🤖 Automation: notify admin of new subscriber
  onSubscriberAdded(email).catch(console.error);

  return NextResponse.json({ message: "Subscribed successfully" });
}

export async function GET() {
  const subscribers = await readDB<Subscriber>("subscribers");
  return NextResponse.json({ count: subscribers.length, subscribers });
}
