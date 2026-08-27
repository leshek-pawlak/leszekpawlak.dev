import assert from "node:assert/strict";
import test from "node:test";
import {
  GAME_WORLD_HEIGHT,
  GAME_WORLD_WIDTH,
  PUZZLE_TARGET_COUNT,
  PUZZLE_TARGETS,
  applyBlockCut,
  blockWorldPolygon,
  createPuzzleTarget,
  createSquareBlock,
  getScoreBand,
  moveCuttingBlock,
  polygonArea,
  rotateCuttingBlock,
  scoreSimilarity,
} from "../src/lib/rpg/cuttingGame.ts";

test("the pool contains 100 unique targets that require several cuts", () => {
  assert.equal(PUZZLE_TARGETS.length, PUZZLE_TARGET_COUNT);
  assert.equal(new Set(PUZZLE_TARGETS.map((target) => target.id)).size, 100);
  assert.equal(
    new Set(
      PUZZLE_TARGETS.map((target) =>
        target.polygons
          .map((polygon) =>
            polygon.map((point) => `${point.x},${point.y}`).join(" "),
          )
          .join("|"),
      ),
    ).size,
    100,
  );

  for (const randomValue of [0, 0.26, 0.51, 0.76, 0.99]) {
    const target = createPuzzleTarget(() => randomValue);
    assert.ok(target.polygons.length >= 5 && target.polygons.length <= 8);
    assert.ok(
      target.polygons.every((polygon) => polygonArea(polygon) === 8_750),
    );
    assert.ok(
      target.polygons
        .flat()
        .every(
          (point) =>
            point.x >= 0 &&
            point.y >= 0 &&
            point.x <= GAME_WORLD_WIDTH &&
            point.y <= GAME_WORLD_HEIGHT,
        ),
    );
  }

  const first = createPuzzleTarget(() => 0);
  const next = createPuzzleTarget(() => 0, [first.id]);
  assert.notEqual(next.id, first.id);
});

test("skipped targets do not return before the full pool is exhausted", () => {
  const seen = [];
  for (let index = 0; index < PUZZLE_TARGET_COUNT; index += 1) {
    const target = createPuzzleTarget(() => 0, seen);
    assert.ok(!seen.includes(target.id));
    seen.push(target.id);
  }
  assert.equal(new Set(seen).size, PUZZLE_TARGET_COUNT);
});

test("a square can be cut repeatedly using perimeter anchors", () => {
  const square = createSquareBlock("piece");
  const triangle = applyBlockCut(square, "topLeft", "bottomRight", "left");
  assert.ok(triangle);
  assert.equal(polygonArea(triangle.polygon), 5_000);

  const trimmedAgain = applyBlockCut(triangle, "top", "bottom", "left");
  assert.ok(trimmedAgain);
  assert.ok(polygonArea(trimmedAgain.polygon) < polygonArea(triangle.polygon));

  assert.equal(applyBlockCut(square, "top", "top", "left"), null);
});

test("movement stays bounded and rotation uses predictable steps", () => {
  const block = createSquareBlock("piece");
  const minimum = moveCuttingBlock(block, -500, -500);
  const maximum = moveCuttingBlock(block, 5_000, 5_000);
  assert.deepEqual({ x: minimum.x, y: minimum.y }, { x: 0, y: 0 });
  assert.deepEqual(
    { x: maximum.x, y: maximum.y },
    { x: GAME_WORLD_WIDTH - 100, y: GAME_WORLD_HEIGHT - 100 },
  );
  assert.equal(rotateCuttingBlock(block, -1).rotation, 345);
  assert.equal(rotateCuttingBlock(block, 1).rotation, 15);

  const stagingSlots = Array.from({ length: 8 }, (_, index) =>
    createSquareBlock(`piece-${index}`, index + 1),
  );
  assert.equal(
    new Set(stagingSlots.map(({ x, y }) => `${x},${y}`)).size,
    stagingSlots.length,
  );
  assert.ok(
    stagingSlots.every(
      ({ x, y }) =>
        x >= 0 &&
        y >= 0 &&
        x + 100 <= GAME_WORLD_WIDTH &&
        y + 100 <= GAME_WORLD_HEIGHT,
    ),
  );
});

test("similarity measures overlap and penalizes missing or excess area", () => {
  const block = moveCuttingBlock(createSquareBlock("piece"), 250, 200);
  const target = {
    id: 1,
    polygons: [blockWorldPolygon(block)],
  };

  assert.equal(scoreSimilarity([block], target), 100);
  assert.equal(scoreSimilarity([], target), 0);

  const shifted = moveCuttingBlock(block, 300, 200);
  const shiftedScore = scoreSimilarity([shifted], target);
  assert.ok(shiftedScore > 0 && shiftedScore < 100);

  const excess = moveCuttingBlock(createSquareBlock("extra"), 350, 200);
  assert.ok(scoreSimilarity([block, excess], target) < 100);
});

test("score bands cover every requested result boundary", () => {
  assert.equal(getScoreBand(100), "excellent");
  assert.equal(getScoreBand(91), "excellent");
  assert.equal(getScoreBand(90), "details");
  assert.equal(getScoreBand(70), "details");
  assert.equal(getScoreBand(69), "effort");
  assert.equal(getScoreBand(50), "effort");
  assert.equal(getScoreBand(49), "ignored");
  assert.equal(getScoreBand(30), "ignored");
  assert.equal(getScoreBand(29), "hopeless");
  assert.equal(getScoreBand(0), "hopeless");
});
