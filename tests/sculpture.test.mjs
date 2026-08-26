import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BUILD_ZONE,
  blocksInsideBuildZone,
  generateBlocks,
  moveBlock,
  rotateBlock,
} from "../src/lib/rpg/blocks.ts";
import {
  SCULPTURE_STORAGE_KEY,
  createSculptureSnapshot,
  isSculptureSnapshot,
} from "../src/lib/rpg/sculpture.ts";
import {
  loadSculpture,
  removeSculpture,
  saveSculpture,
} from "../src/lib/rpg/storage.ts";

function deterministicRandom() {
  let state = 42;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    values,
  };
}

test("block generation is deterministic, bounded and build-zone aware", () => {
  const first = generateBlocks(deterministicRandom(), {
    count: 14,
    idPrefix: "test",
  });
  const second = generateBlocks(deterministicRandom(), {
    count: 14,
    idPrefix: "test",
  });

  assert.deepEqual(first, second);
  assert.equal(first.length, 14);
  assert.ok(first.every((block) => block.x >= 0 && block.y >= 0));
  assert.ok(
    first.every(
      (block) => block.x + block.width <= 1000 && block.y + block.height <= 600,
    ),
  );

  const moved = moveBlock(first[0], BUILD_ZONE.x + 20, BUILD_ZONE.y + 20);
  assert.deepEqual(blocksInsideBuildZone([moved]), [moved]);
  assert.equal(rotateBlock(moved, 1).rotation, moved.rotation + 15);
});

test("snapshot validation rejects malformed, oversized and duplicate data", () => {
  const block = moveBlock(
    generateBlocks(deterministicRandom(), { count: 12 })[0],
    100,
    100,
  );
  const snapshot = createSculptureSnapshot([block], "2026-08-27T00:00:00.000Z");

  assert.equal(isSculptureSnapshot(snapshot), true);
  assert.equal(isSculptureSnapshot({ ...snapshot, version: 2 }), false);
  assert.equal(
    isSculptureSnapshot({ ...snapshot, blocks: [block, block] }),
    false,
  );
  assert.equal(
    isSculptureSnapshot({
      ...snapshot,
      blocks: [{ ...block, x: Number.POSITIVE_INFINITY }],
    }),
    false,
  );
});

test("storage preserves valid sculptures and removes only its own key", () => {
  const storage = memoryStorage();
  const block = moveBlock(
    generateBlocks(deterministicRandom(), { count: 12 })[0],
    100,
    100,
  );
  const snapshot = createSculptureSnapshot([block], "2026-08-27T00:00:00.000Z");

  storage.setItem("cookie-consent-accepted", "true");
  assert.deepEqual(loadSculpture(storage), { status: "empty" });
  assert.deepEqual(saveSculpture(storage, snapshot), { ok: true });
  assert.deepEqual(loadSculpture(storage), { status: "ready", snapshot });

  assert.deepEqual(removeSculpture(storage), { ok: true });
  assert.equal(storage.getItem(SCULPTURE_STORAGE_KEY), null);
  assert.equal(storage.getItem("cookie-consent-accepted"), "true");

  storage.setItem(SCULPTURE_STORAGE_KEY, "{broken");
  assert.deepEqual(loadSculpture(storage), {
    status: "invalid",
    reason: "json",
  });
  assert.equal(storage.getItem(SCULPTURE_STORAGE_KEY), "{broken");
});
