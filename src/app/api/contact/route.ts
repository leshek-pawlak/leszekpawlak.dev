import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3;
const requestLog = new Map<string, number[]>();

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const timestamps = requestLog.get(ip) || [];
    const recentTimestamps = timestamps.filter(
      (t) => now - t < RATE_LIMIT_WINDOW,
    );

    if (recentTimestamps.length >= MAX_REQUESTS) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    recentTimestamps.push(now);
    requestLog.set(ip, recentTimestamps);

    const body = await request.json();
    const { name, email, message, website } = body;

    // Honeypot check
    if (website) {
      return NextResponse.json({ success: true });
    }

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Send email via Resend (configure RESEND_API_KEY in env)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "contact@leszekpawlak.dev",
          to: "leshekpawlak@gmail.com",
          subject: `[Portfolio] Wiadomość od ${name}`,
          text: `Imię: ${name}\nEmail: ${email}\n\nWiadomość:\n${message}`,
        }),
      });
    } else {
      // Fallback: log to console in development
      console.log("Contact form submission:", { name, email, message });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
