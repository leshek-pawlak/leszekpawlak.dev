const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 3;
const requestLog = new Map<string, number[]>();

type ContactRouteDependencies = {
  fetcher?: typeof fetch;
  now?: () => number;
  log?: (...data: unknown[]) => void;
  error?: (...data: unknown[]) => void;
};

type ContactRouteResult = {
  body: Record<string, unknown>;
  status: number;
};

export async function handleContactRequest(
  request: Request,
  dependencies: ContactRouteDependencies = {},
): Promise<ContactRouteResult> {
  const fetcher = dependencies.fetcher ?? fetch;
  const now = dependencies.now?.() ?? Date.now();
  const log = dependencies.log ?? console.log;
  const error = dependencies.error ?? console.error;

  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const timestamps = requestLog.get(ip) || [];
    const recentTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW,
    );

    if (recentTimestamps.length >= MAX_REQUESTS) {
      return { body: { error: "Too many requests" }, status: 429 };
    }

    recentTimestamps.push(now);
    requestLog.set(ip, recentTimestamps);

    const body = await request.json();
    const { name, email, message, website } = body;

    if (website) {
      return { body: { success: true }, status: 200 };
    }

    if (!name || !email || !message) {
      return { body: { error: "Missing required fields" }, status: 400 };
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return { body: { error: "Invalid email" }, status: 400 };
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      log("Contact form submission (no WEB3FORMS_ACCESS_KEY):", {
        name,
        email,
        message,
      });
      return { body: { success: true }, status: 200 };
    }

    const response = await fetcher("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        message,
        subject: `[Portfolio] Wiadomość od ${name}`,
      }),
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      error(
        "Web3Forms returned non-JSON response:",
        response.status,
        contentType,
      );
      return { body: { error: "Failed to send" }, status: 500 };
    }

    const data = await response.json();
    if (!data.success) {
      error("Web3Forms error:", data);
      return {
        body: { error: "Failed to send", details: data },
        status: 500,
      };
    }

    return { body: { success: true }, status: 200 };
  } catch (caughtError) {
    error("Contact route error:", caughtError);
    return { body: { error: "Internal server error" }, status: 500 };
  }
}
