import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveWeb3FormsAccessKey } from "../src/lib/contactConfig.ts";

test("contact config prefers the server-side variable and trims its value", () => {
  assert.equal(
    resolveWeb3FormsAccessKey({
      WEB3FORMS_ACCESS_KEY: "  server-key  ",
      NEXT_PUBLIC_WEB3FORMS_KEY: "legacy-key",
    }),
    "server-key",
  );
});

test("contact config remains compatible with the previous variable name", () => {
  assert.equal(
    resolveWeb3FormsAccessKey({ NEXT_PUBLIC_WEB3FORMS_KEY: "legacy-key" }),
    "legacy-key",
  );
});

test("contact config rejects missing and blank keys", () => {
  assert.equal(resolveWeb3FormsAccessKey({}), null);
  assert.equal(resolveWeb3FormsAccessKey({ WEB3FORMS_ACCESS_KEY: "  " }), null);
});
