import assert from "node:assert/strict";
import { test } from "node:test";
import { handleContactRequest } from "../src/lib/contactRoute.ts";

const endpoint = "https://leszekpawlak.dev/api/contact";
const validSubmission = {
  name: "Test User",
  email: "test@example.com",
  message: "Local mocked test",
};
let requestNumber = 0;

function request(body = validSubmission, options = {}) {
  requestNumber += 1;
  const headers = new Headers({
    "Content-Type": "application/json",
    Origin: "https://leszekpawlak.dev",
    "Sec-Fetch-Site": "same-origin",
    "X-Requested-With": "XMLHttpRequest",
    "x-forwarded-for": `test-${requestNumber}`,
    ...options.headers,
  });

  return new Request(endpoint, {
    method: "POST",
    headers,
    body: options.rawBody ?? JSON.stringify(body),
  });
}

const successfulProvider = async () => Response.json({ success: true });
const dependencies = {
  fetcher: successfulProvider,
  getAccessKey: () => "server-test-key",
  error: () => {},
};

test("contact endpoint rejects cross-origin and unverifiable requests", async () => {
  let result = await handleContactRequest(
    request(validSubmission, {
      headers: {
        Origin: "https://attacker.example",
        "Sec-Fetch-Site": "cross-site",
      },
    }),
    dependencies,
  );
  assert.equal(result.status, 403);

  result = await handleContactRequest(
    request(validSubmission, {
      headers: {
        Origin: "https://attacker.example",
        "Sec-Fetch-Site": "same-origin",
      },
    }),
    dependencies,
  );
  assert.equal(result.status, 403);

  const unverifiable = request();
  unverifiable.headers.delete("origin");
  unverifiable.headers.delete("sec-fetch-site");
  result = await handleContactRequest(unverifiable, dependencies);
  assert.equal(result.status, 403);
});

test("contact endpoint enforces content type, JSON syntax and body size", async () => {
  let result = await handleContactRequest(
    request(validSubmission, { headers: { "Content-Type": "text/plain" } }),
    dependencies,
  );
  assert.equal(result.status, 415);

  result = await handleContactRequest(
    request(undefined, { rawBody: "{invalid" }),
    dependencies,
  );
  assert.equal(result.status, 400);

  result = await handleContactRequest(
    request(validSubmission, { headers: { "Content-Length": "20000" } }),
    dependencies,
  );
  assert.equal(result.status, 413);

  result = await handleContactRequest(
    request(undefined, { rawBody: JSON.stringify({ value: "x".repeat(17_000) }) }),
    dependencies,
  );
  assert.equal(result.status, 413);
});

test("contact endpoint validates and normalizes every form field", async () => {
  const invalidBodies = [
    {},
    { ...validSubmission, name: 123 },
    { ...validSubmission, email: "invalid" },
    { ...validSubmission, email: `${"a".repeat(245)}@example.com` },
    { ...validSubmission, name: "Header\r\nInjection" },
    { ...validSubmission, message: "Bad\u0000message" },
    { ...validSubmission, message: "x".repeat(5_001) },
  ];

  for (const body of invalidBodies) {
    const result = await handleContactRequest(request(body), dependencies);
    assert.equal(result.status, 400);
  }
});

test("contact endpoint accepts multiline messages and keeps the access key server-side", async () => {
  let captured;
  const result = await handleContactRequest(
    request({ ...validSubmission, name: "  Test User  ", message: "Line 1\nLine 2" }),
    {
      ...dependencies,
      fetcher: async (url, init) => {
        captured = { url: String(url), init };
        return successfulProvider();
      },
    },
  );

  assert.equal(result.status, 200);
  assert.equal(captured.url, "https://api.web3forms.com/submit");
  assert.equal(captured.init.method, "POST");
  const providerBody = JSON.parse(captured.init.body);
  assert.equal(providerBody.access_key, "server-test-key");
  assert.equal(providerBody.name, "Test User");
  assert.equal(providerBody.message, "Line 1\nLine 2");
});

test("contact endpoint handles honeypot and missing configuration without sending data", async () => {
  let fetchCalls = 0;
  const fetcher = async () => {
    fetchCalls += 1;
    return successfulProvider();
  };

  let result = await handleContactRequest(
    request({ ...validSubmission, website: "spam" }),
    { ...dependencies, fetcher },
  );
  assert.equal(result.status, 200);
  assert.equal(fetchCalls, 0);

  result = await handleContactRequest(request(), {
    ...dependencies,
    fetcher,
    getAccessKey: () => undefined,
  });
  assert.equal(result.status, 503);
  assert.deepEqual(result.body, { error: "Contact service unavailable" });
  assert.equal(fetchCalls, 0);
});

test("contact endpoint conceals provider errors", async () => {
  const responses = [
    new Response("upstream secret", {
      status: 502,
      headers: { "Content-Type": "text/plain" },
    }),
    Response.json({ success: false, details: "upstream secret" }),
  ];

  for (const response of responses) {
    const result = await handleContactRequest(request(), {
      ...dependencies,
      fetcher: async () => response,
    });
    assert.equal(result.status, 502);
    assert.deepEqual(result.body, { error: "Failed to send" });
    assert.equal(JSON.stringify(result.body).includes("upstream secret"), false);
  }
});

test("contact endpoint rate-limits repeated requests", async () => {
  const headers = { "x-forwarded-for": "rate-limit-test" };
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const result = await handleContactRequest(
      request(validSubmission, { headers }),
      dependencies,
    );
    assert.equal(result.status, 200);
  }

  const result = await handleContactRequest(
    request(validSubmission, { headers }),
    dependencies,
  );
  assert.equal(result.status, 429);
  assert.equal(result.headers["Retry-After"], "60");
});
