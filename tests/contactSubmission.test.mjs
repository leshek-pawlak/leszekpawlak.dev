import assert from "node:assert/strict";
import { test } from "node:test";
import { submitContact } from "../src/lib/contactSubmission.ts";

const submission = {
  name: "Test User",
  email: "test@example.com",
  message: "Local mocked test",
};

test("submitContact preserves the Web3Forms contract", async () => {
  const previousKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  let captured;
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY = "public-test-key";

  try {
    const success = await submitContact(submission, async (url, init) => {
      captured = { url: String(url), init };
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    });

    assert.equal(success, true);
    assert.equal(captured.url, "https://api.web3forms.com/submit");
    assert.equal(captured.init.method, "POST");
    assert.deepEqual(JSON.parse(captured.init.body), {
      access_key: "public-test-key",
      name: submission.name,
      email: submission.email,
      message: submission.message,
      subject: "[leszekpawlak.dev] Wiadomość od Test User",
    });
  } finally {
    if (previousKey === undefined) {
      delete process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    } else {
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY = previousKey;
    }
  }
});

test("submitContact reports provider failure and propagates network errors", async () => {
  const providerFailure = await submitContact(
    submission,
    async () =>
      new Response(JSON.stringify({ success: false }), {
        headers: { "Content-Type": "application/json" },
      }),
  );

  assert.equal(providerFailure, false);
  await assert.rejects(
    submitContact(submission, async () => {
      throw new Error("mocked network failure");
    }),
    /mocked network failure/,
  );
});
