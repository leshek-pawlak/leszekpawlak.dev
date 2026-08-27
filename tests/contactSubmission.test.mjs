import assert from "node:assert/strict";
import { test } from "node:test";
import { submitContact } from "../src/lib/contactSubmission.ts";

const submission = {
  name: "Test User",
  email: "test@example.com",
  message: "Local mocked test",
};

test("submitContact loads the public form key and submits from the browser", async () => {
  const calls = [];
  const success = await submitContact(submission, async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url) === "/api/contact") {
      return Response.json({ accessKey: "public-test-key" });
    }
    return Response.json({ success: true });
  });

  assert.equal(success, true);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "/api/contact");
  assert.equal(calls[0].init.method, "GET");
  assert.equal(calls[0].init.credentials, "same-origin");
  assert.equal(calls[0].init.cache, "no-store");
  assert.equal(calls[1].url, "https://api.web3forms.com/submit");
  assert.equal(calls[1].init.method, "POST");
  assert.deepEqual(JSON.parse(calls[1].init.body), {
    access_key: "public-test-key",
    ...submission,
    subject: "[leszekpawlak.dev] Wiadomość od Test User",
    botcheck: false,
  });
});

test("submitContact stops when the form key is unavailable", async () => {
  let calls = 0;
  const missingConfig = await submitContact(submission, async () => {
    calls += 1;
    return Response.json({ error: "unavailable" }, { status: 503 });
  });
  assert.equal(missingConfig, false);
  assert.equal(calls, 1);

  calls = 0;
  const invalidConfig = await submitContact(submission, async () => {
    calls += 1;
    return Response.json({ accessKey: null });
  });
  assert.equal(invalidConfig, false);
  assert.equal(calls, 1);
});

test("submitContact reports Web3Forms failures and propagates network errors", async () => {
  const providerFailure = await submitContact(submission, async (url) => {
    if (String(url) === "/api/contact") {
      return Response.json({ accessKey: "public-test-key" });
    }
    return Response.json({ success: false }, { status: 400 });
  });

  assert.equal(providerFailure, false);
  await assert.rejects(
    submitContact(submission, async (url) => {
      if (String(url) === "/api/contact") {
        return Response.json({ accessKey: "public-test-key" });
      }
      throw new Error("mocked network failure");
    }),
    /mocked network failure/,
  );
});
