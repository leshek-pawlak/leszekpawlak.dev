import assert from "node:assert/strict";
import { test } from "node:test";
import { getTimeOfDay } from "../src/lib/timeTheme.ts";

test("getTimeOfDay respects every theme boundary", () => {
  const cases = [
    { hour: 0, expected: "night" },
    { hour: 5.99, expected: "night" },
    { hour: 6, expected: "day" },
    { hour: 17.99, expected: "day" },
    { hour: 18, expected: "evening" },
    { hour: 21.99, expected: "evening" },
    { hour: 22, expected: "night" },
    { hour: 23.99, expected: "night" },
  ];

  for (const { hour, expected } of cases) {
    assert.equal(getTimeOfDay(hour), expected, `hour ${hour}`);
  }
});
