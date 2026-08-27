const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 3;
const MAX_RATE_LIMIT_KEYS = 10_000;
const MAX_BODY_BYTES = 16 * 1024;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5_000;
const requestLog = new Map<string, number[]>();

type ContactRouteDependencies = {
  fetcher?: typeof fetch;
  now?: () => number;
  getAccessKey?: () => string | undefined;
  error?: (...data: unknown[]) => void;
};

export type ContactRouteResult = {
  body: Record<string, unknown>;
  status: number;
  headers?: Record<string, string>;
};

function errorResult(error: string, status: number): ContactRouteResult {
  return { body: { error }, status };
}

function isTrustedBrowserRequest(request: Request): boolean {
  const requestOrigin = new URL(request.url).origin;
  const fetchSite = request.headers.get("sec-fetch-site");

  if (fetchSite && fetchSite !== "same-origin") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (origin) {
    return origin === requestOrigin;
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin === requestOrigin;
    } catch {
      return false;
    }
  }

  return fetchSite === "same-origin";
}

function getClientKey(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function checkRateLimit(clientKey: string, now: number): boolean {
  if (requestLog.size >= MAX_RATE_LIMIT_KEYS && !requestLog.has(clientKey)) {
    for (const [key, timestamps] of requestLog) {
      if (timestamps.every((timestamp) => now - timestamp >= RATE_LIMIT_WINDOW)) {
        requestLog.delete(key);
      }
    }

    if (requestLog.size >= MAX_RATE_LIMIT_KEYS) return false;
  }

  const timestamps = requestLog.get(clientKey) ?? [];
  const recent = timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW,
  );
  if (recent.length >= MAX_REQUESTS) return false;

  recent.push(now);
  requestLog.set(clientKey, recent);
  return true;
}

async function readJsonBody(request: Request): Promise<unknown> {
  if (!request.body) return null;

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    bytesRead += value.byteLength;
    if (bytesRead > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new RangeError("Request body is too large");
    }
    text += decoder.decode(value, { stream: true });
  }

  text += decoder.decode();
  return JSON.parse(text);
}

function hasForbiddenControlCharacters(
  value: string,
  allowWhitespace: boolean,
): boolean {
  const pattern = allowWhitespace
    ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/
    : /[\u0000-\u001F\u007F]/;
  return pattern.test(value);
}

function parseSubmission(body: unknown):
  | { name: string; email: string; message: string; website: unknown }
  | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;

  const { name, email, message, website } = body as Record<string, unknown>;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return null;
  }

  const normalized = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    website,
  };

  if (
    normalized.name.length === 0 ||
    normalized.name.length > MAX_NAME_LENGTH ||
    normalized.email.length === 0 ||
    normalized.email.length > MAX_EMAIL_LENGTH ||
    normalized.message.length === 0 ||
    normalized.message.length > MAX_MESSAGE_LENGTH ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email) ||
    hasForbiddenControlCharacters(normalized.name, false) ||
    hasForbiddenControlCharacters(normalized.email, false) ||
    hasForbiddenControlCharacters(normalized.message, true)
  ) {
    return null;
  }

  return normalized;
}

export async function handleContactRequest(
  request: Request,
  dependencies: ContactRouteDependencies = {},
): Promise<ContactRouteResult> {
  const fetcher = dependencies.fetcher ?? fetch;
  const now = dependencies.now?.() ?? Date.now();
  const getAccessKey =
    dependencies.getAccessKey ?? (() => process.env.WEB3FORMS_ACCESS_KEY);
  const logError = dependencies.error ?? console.error;

  if (!isTrustedBrowserRequest(request)) {
    return errorResult("Forbidden", 403);
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return errorResult("Unsupported media type", 415);
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return errorResult("Request body is too large", 413);
  }

  if (!checkRateLimit(getClientKey(request), now)) {
    return {
      body: { error: "Too many requests" },
      status: 429,
      headers: { "Retry-After": String(RATE_LIMIT_WINDOW / 1000) },
    };
  }

  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch (caughtError) {
    return caughtError instanceof RangeError
      ? errorResult("Request body is too large", 413)
      : errorResult("Invalid JSON", 400);
  }

  if (
    body &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    Boolean((body as Record<string, unknown>).website)
  ) {
    return { body: { success: true }, status: 200 };
  }

  const submission = parseSubmission(body);
  if (!submission) {
    return errorResult("Invalid form data", 400);
  }

  const accessKey = getAccessKey();
  if (!accessKey) {
    logError("Contact provider is not configured");
    return errorResult("Contact service unavailable", 503);
  }

  try {
    const response = await fetcher("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: submission.name,
        email: submission.email,
        message: submission.message,
        subject: `[Portfolio] Wiadomość od ${submission.name}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || !contentType.includes("application/json")) {
      logError("Contact provider rejected the request", response.status);
      return errorResult("Failed to send", 502);
    }

    const data = (await response.json()) as { success?: unknown };
    if (data.success !== true) {
      logError("Contact provider reported a failure");
      return errorResult("Failed to send", 502);
    }

    return { body: { success: true }, status: 200 };
  } catch (caughtError) {
    logError(
      "Contact provider request failed",
      caughtError instanceof Error ? caughtError.message : "Unknown error",
    );
    return errorResult("Failed to send", 502);
  }
}
