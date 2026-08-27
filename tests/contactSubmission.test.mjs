import assert from "node:assert/strict";
import { test } from "node:test";
import { submitContact } from "../src/lib/contactSubmission.ts";

const submission = {
  name: "Test User",
  email: "test@example.com",
  message: "Local mocked test",
};

test("submitContact uses the protected same-origin endpoint", async () => {
  let captured;
  const success = await submitContact(submission, async (url, init) => {
    captured = { url: String(url), init };
    return Response.json({ success: true });
  });

  assert.equal(success, true);
  assert.equal(captured.url, "/api/contact");
  assert.equal(captured.init.method, "POST");
  assert.equal(captured.init.credentials, "same-origin");
  assert.deepEqual(captured.init.headers, {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  });
  assert.deepEqual(JSON.parse(captured.init.body), submission);
  assert.equal(captured.init.body.includes("access_key"), false);
});

test("submitContact reports endpoint failures and propagates network errors", async () => {
  const httpFailure = await submitContact(
    submission,
    async () => Response.json({ success: true }, { status: 503 }),
  );
  const applicationFailure = await submitContact(
    submission,
    async () => Response.json({ success: false }),
  );

  assert.equal(httpFailure, false);
  assert.equal(applicationFailure, false);
  await assert.rejects(
    submitContact(submission, async () => {
      throw new Error("mocked network failure");
    }),
    /mocked network failure/,
  );
});
