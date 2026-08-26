import assert from "node:assert/strict";
import { test } from "node:test";
import { handleContactRequest } from "../src/lib/contactRoute.ts";

function request(body, ip) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

test("contact endpoint validates input, honeypot, configuration and provider responses", async () => {
  const previousKey = process.env.WEB3FORMS_ACCESS_KEY;

  try {
    let fetchCalls = 0;
    let fetcher = async () => {
      fetchCalls += 1;
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    };
    const dependencies = {
      fetcher: (...args) => fetcher(...args),
      log: () => {},
      error: () => {},
    };

    let response = await handleContactRequest(
      request({}, "test-missing"),
      dependencies,
    );
    assert.equal(response.status, 400);

    response = await handleContactRequest(
      request(
        {
          name: "Bot",
          email: "bot@example.com",
          message: "Bot",
          website: "spam",
        },
        "test-honeypot",
      ),
      dependencies,
    );
    assert.equal(response.status, 200);
    assert.equal(fetchCalls, 0);

    response = await handleContactRequest(
      request(
        { name: "Test", email: "invalid", message: "Test" },
        "test-email",
      ),
      dependencies,
    );
    assert.equal(response.status, 400);

    delete process.env.WEB3FORMS_ACCESS_KEY;
    response = await handleContactRequest(
      request(
        { name: "Test", email: "test@example.com", message: "Test" },
        "test-no-config",
      ),
      dependencies,
    );
    assert.equal(response.status, 200);
    assert.equal(fetchCalls, 0);

    process.env.WEB3FORMS_ACCESS_KEY = "server-test-key";
    response = await handleContactRequest(
      request(
        { name: "Test", email: "test@example.com", message: "Test" },
        "test-provider-success",
      ),
      dependencies,
    );
    assert.equal(response.status, 200);
    assert.equal(fetchCalls, 1);

    fetcher = async () =>
      new Response(JSON.stringify({ success: false }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    response = await handleContactRequest(
      request(
        { name: "Test", email: "test@example.com", message: "Test" },
        "test-provider-error",
      ),
      dependencies,
    );
    assert.equal(response.status, 500);

    for (let attempt = 0; attempt < 3; attempt += 1) {
      response = await handleContactRequest(
        request({}, "test-rate-limit"),
        dependencies,
      );
      assert.equal(response.status, 400);
    }
    response = await handleContactRequest(
      request({}, "test-rate-limit"),
      dependencies,
    );
    assert.equal(response.status, 429);
  } finally {
    if (previousKey === undefined) {
      delete process.env.WEB3FORMS_ACCESS_KEY;
    } else {
      process.env.WEB3FORMS_ACCESS_KEY = previousKey;
    }
  }
});
