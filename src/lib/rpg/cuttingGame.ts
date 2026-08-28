export const GAME_WORLD_WIDTH = 800;
export const GAME_WORLD_HEIGHT = 600;
export const GAME_BLOCK_SIZE = 100;
export const MAX_GAME_BLOCKS = 14;
export const PUZZLE_TARGET_COUNT = 100;

export type GamePoint = { x: number; y: number };
export type CutSide = "left" | "right";
export type CutAnchorId =
  | "topLeft"
  | "top"
  | "topRight"
  | "right"
  | "bottomRight"
  | "bottom"
  | "bottomLeft"
  | "left";

export type CuttingBlock = {
  id: string;
  x: number;
  y: number;
  rotation: number;
  polygon: GamePoint[];
};

export type PuzzleTarget = {
  id: number;
  polygons: GamePoint[][];
  pieceKinds: BlockShapeKind[];
  pieceCutCounts: number[];
};

export type BlockShapeKind =
  | "square"
  | "rectangle"
  | "triangle"
  | "trapezoid"
  | "parallelogram"
  | "rhombus"
  | "pentagon"
  | "hexagon"
  | "irregular";

export type ScoreBand =
  | "excellent"
  | "details"
  | "effort"
  | "ignored"
  | "hopeless";

export const CUT_ANCHORS: Record<CutAnchorId, GamePoint> = {
  topLeft: { x: 0, y: 0 },
  top: { x: 50, y: 0 },
  topRight: { x: 100, y: 0 },
  right: { x: 100, y: 50 },
  bottomRight: { x: 100, y: 100 },
  bottom: { x: 50, y: 100 },
  bottomLeft: { x: 0, y: 100 },
  left: { x: 0, y: 50 },
};

export const CUT_ANCHOR_IDS = Object.keys(CUT_ANCHORS) as CutAnchorId[];

const square: GamePoint[] = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
];

type CutOperation = {
  start: CutAnchorId;
  end: CutAnchorId;
  side: CutSide;
};

export type BlockShapeTemplate = {
  name: string;
  kind: BlockShapeKind;
  cuts: CutOperation[];
  polygon: GamePoint[];
};

function createBlockShapeTemplate(
  name: string,
  kind: BlockShapeKind,
  cuts: CutOperation[],
): BlockShapeTemplate {
  const polygon = cuts.reduce(
    (current, cut) =>
      clipPolygon(
        current,
        CUT_ANCHORS[cut.start],
        CUT_ANCHORS[cut.end],
        cut.side,
      ),
    square,
  );

  if (polygon.length < 3 || polygonArea(polygon) < 1_500) {
    throw new Error(`Invalid block shape template: ${name}`);
  }

  return { name, kind, cuts, polygon };
}

export const BLOCK_SHAPE_TEMPLATES: BlockShapeTemplate[] = [
  createBlockShapeTemplate("square", "square", []),
  createBlockShapeTemplate("half-rectangle", "rectangle", [
    { start: "top", end: "bottom", side: "left" },
  ]),
  createBlockShapeTemplate("diagonal-triangle", "triangle", [
    { start: "topLeft", end: "bottomRight", side: "left" },
  ]),
  createBlockShapeTemplate("small-triangle", "triangle", [
    { start: "topLeft", end: "right", side: "right" },
  ]),
  createBlockShapeTemplate("slanted-trapezoid", "trapezoid", [
    { start: "top", end: "bottomLeft", side: "right" },
  ]),
  createBlockShapeTemplate("corner-pentagon", "pentagon", [
    { start: "top", end: "right", side: "left" },
  ]),
  createBlockShapeTemplate("centered-triangle", "triangle", [
    { start: "topLeft", end: "right", side: "left" },
    { start: "right", end: "bottomLeft", side: "left" },
  ]),
  createBlockShapeTemplate("parallelogram", "parallelogram", [
    { start: "top", end: "bottomLeft", side: "right" },
    { start: "topRight", end: "bottom", side: "left" },
  ]),
  createBlockShapeTemplate("slanted-parallelogram", "parallelogram", [
    { start: "topLeft", end: "right", side: "left" },
    { start: "bottomRight", end: "left", side: "left" },
  ]),
  createBlockShapeTemplate("opposite-corner-hexagon", "hexagon", [
    { start: "top", end: "right", side: "left" },
    { start: "bottom", end: "left", side: "left" },
  ]),
  createBlockShapeTemplate("double-corner-pentagon", "pentagon", [
    { start: "top", end: "left", side: "right" },
    { start: "top", end: "right", side: "left" },
  ]),
  createBlockShapeTemplate("arrow-quadrilateral", "irregular", [
    { start: "topLeft", end: "right", side: "left" },
    { start: "right", end: "bottom", side: "left" },
  ]),
  createBlockShapeTemplate("skewed-quadrilateral", "irregular", [
    { start: "topLeft", end: "right", side: "left" },
    { start: "top", end: "bottomRight", side: "left" },
  ]),
  createBlockShapeTemplate("narrow-triangle", "triangle", [
    { start: "topLeft", end: "bottomRight", side: "left" },
    { start: "topRight", end: "bottomLeft", side: "left" },
  ]),
  createBlockShapeTemplate("rhombus", "rhombus", [
    { start: "top", end: "left", side: "right" },
    { start: "top", end: "right", side: "left" },
    { start: "right", end: "bottom", side: "left" },
    { start: "bottom", end: "left", side: "left" },
  ]),
  createBlockShapeTemplate("faceted-hexagon", "hexagon", [
    { start: "top", end: "right", side: "left" },
    { start: "topRight", end: "bottom", side: "left" },
    { start: "right", end: "bottomLeft", side: "left" },
    { start: "bottom", end: "left", side: "left" },
  ]),
];

type GridCell = {
  x: number;
  y: number;
  shape: number;
  rotation: number;
};

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function createGridCells(seed: number, targetId: number): GridCell[] {
  const random = seededRandom(seed * 97 + 31);
  const difficulty = targetId <= 30 ? 0 : targetId <= 70 ? 1 : 2;
  const desiredCount =
    difficulty === 0
      ? 5 + (seed % 2)
      : difficulty === 1
        ? 6 + (seed % 2)
        : 7 + (seed % 2);
  const cells = new Map<string, Pick<GridCell, "x" | "y">>();
  cells.set("1,1", { x: 1, y: 1 });
  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  for (
    let attempt = 0;
    cells.size < desiredCount && attempt < 200;
    attempt += 1
  ) {
    const existing = Array.from(cells.values());
    const origin = existing[Math.floor(random() * existing.length)];
    const direction = directions[Math.floor(random() * directions.length)];
    const next = { x: origin.x + direction.x, y: origin.y + direction.y };
    if (next.x < 0 || next.x > 3 || next.y < 0 || next.y > 3) continue;
    cells.set(`${next.x},${next.y}`, next);
  }

  if (cells.size < desiredCount) {
    for (let y = 0; y < 4 && cells.size < desiredCount; y += 1) {
      for (let x = 0; x < 4 && cells.size < desiredCount; x += 1) {
        cells.set(`${x},${y}`, { x, y });
      }
    }
  }

  const normalized = Array.from(cells.values()).sort(
    (first, second) => first.y - second.y || first.x - second.x,
  );
  const minimumX = Math.min(...normalized.map((cell) => cell.x));
  const minimumY = Math.min(...normalized.map((cell) => cell.y));

  const easyShapes = BLOCK_SHAPE_TEMPLATES.map((template, index) => ({
    template,
    index,
  })).filter(({ template }) => template.cuts.length <= 1);
  const doubleCutShapes = BLOCK_SHAPE_TEMPLATES.map((template, index) => ({
    template,
    index,
  })).filter(({ template }) => template.cuts.length === 2);
  const advancedShapes = BLOCK_SHAPE_TEMPLATES.map((template, index) => ({
    template,
    index,
  })).filter(({ template }) => template.cuts.length >= 3);

  return normalized.map((cell, index) => {
    let pool = easyShapes;
    if (difficulty === 2 && index < 2) pool = advancedShapes;
    else if (difficulty >= 1 && index < 2) pool = doubleCutShapes;
    else if (difficulty === 1 && random() > 0.42) pool = doubleCutShapes;
    else if (difficulty === 2 && random() > 0.28) pool = doubleCutShapes;

    const selected = pool[Math.floor(random() * pool.length)] ?? easyShapes[0];
    return {
      x: cell.x - minimumX,
      y: cell.y - minimumY,
      shape: selected.index,
      rotation: Math.floor(random() * 4),
    };
  });
}

function cellsSignature(cells: GridCell[]): string {
  return cells
    .map(
      (cell) => `${cell.x},${cell.y},${cell.shape},${cell.rotation}`,
    )
    .join("|");
}

function rotatePolygonQuarterTurns(
  polygon: GamePoint[],
  quarterTurns: number,
): GamePoint[] {
  let rotated = polygon.map((point) => ({ ...point }));
  for (let turn = 0; turn < quarterTurns % 4; turn += 1) {
    rotated = rotated.map((point) => ({
      x: GAME_BLOCK_SIZE - point.y,
      y: point.x,
    }));
  }
  return rotated;
}

function targetFromCells(id: number, cells: GridCell[]): PuzzleTarget {
  const width = Math.max(...cells.map((cell) => cell.x)) + 1;
  const height = Math.max(...cells.map((cell) => cell.y)) + 1;
  const originX = 110 + (400 - width * GAME_BLOCK_SIZE) / 2;
  const originY = 75 + (450 - height * GAME_BLOCK_SIZE) / 2;

  return {
    id,
    polygons: cells.map((cell) =>
      translatePolygon(
        rotatePolygonQuarterTurns(
          BLOCK_SHAPE_TEMPLATES[cell.shape].polygon,
          cell.rotation,
        ),
        originX + cell.x * GAME_BLOCK_SIZE,
        originY + cell.y * GAME_BLOCK_SIZE,
      ),
    ),
    pieceKinds: cells.map(
      (cell) => BLOCK_SHAPE_TEMPLATES[cell.shape].kind,
    ),
    pieceCutCounts: cells.map(
      (cell) => BLOCK_SHAPE_TEMPLATES[cell.shape].cuts.length,
    ),
  };
}

function createTargetPool(): PuzzleTarget[] {
  const targets: PuzzleTarget[] = [];
  const signatures = new Set<string>();

  for (let seed = 1; targets.length < PUZZLE_TARGET_COUNT; seed += 1) {
    const targetId = targets.length + 1;
    const cells = createGridCells(seed, targetId);
    const signature = cellsSignature(cells);
    if (signatures.has(signature)) continue;
    signatures.add(signature);
    targets.push(targetFromCells(targetId, cells));
  }

  return targets;
}

export const PUZZLE_TARGETS = createTargetPool();

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function translatePolygon(polygon: GamePoint[], x: number, y: number) {
  return polygon.map((point) => ({ x: point.x + x, y: point.y + y }));
}

export function createPuzzleTarget(
  random: () => number = Math.random,
  excludedIds: Iterable<number> = [],
): PuzzleTarget {
  const excluded = new Set(excludedIds);
  const available = PUZZLE_TARGETS.filter((target) => !excluded.has(target.id));
  const candidates = available.length > 0 ? available : PUZZLE_TARGETS;
  const index = Math.min(
    candidates.length - 1,
    Math.floor(random() * candidates.length),
  );
  const target = candidates[index] ?? candidates[0];

  return {
    id: target.id,
    polygons: target.polygons.map((polygon) =>
      polygon.map((point) => ({ ...point })),
    ),
    pieceKinds: [...target.pieceKinds],
    pieceCutCounts: [...target.pieceCutCounts],
  };
}

export function createSquareBlock(id: string, index = 0): CuttingBlock {
  const slot = Math.max(0, index - 1) % 8;
  const column = slot % 2;
  const row = Math.floor(slot / 2);
  return {
    id,
    x: 590 + column * 110,
    y: 95 + row * 125,
    rotation: 0,
    polygon: square.map((point) => ({ ...point })),
  };
}

export function moveCuttingBlock(
  block: CuttingBlock,
  x: number,
  y: number,
): CuttingBlock {
  return {
    ...block,
    x: clamp(Math.round(x / 5) * 5, 0, GAME_WORLD_WIDTH - GAME_BLOCK_SIZE),
    y: clamp(Math.round(y / 5) * 5, 0, GAME_WORLD_HEIGHT - GAME_BLOCK_SIZE),
  };
}

export function rotateCuttingBlock(
  block: CuttingBlock,
  direction: -1 | 1,
): CuttingBlock {
  const rotation = block.rotation + direction * 15;
  return {
    ...block,
    rotation:
      rotation >= 360
        ? rotation - 360
        : rotation < 0
          ? rotation + 360
          : rotation,
  };
}

function signedDistance(point: GamePoint, start: GamePoint, end: GamePoint) {
  return (
    (end.x - start.x) * (point.y - start.y) -
    (end.y - start.y) * (point.x - start.x)
  );
}

function lineIntersection(
  from: GamePoint,
  to: GamePoint,
  fromDistance: number,
  toDistance: number,
): GamePoint {
  const denominator = fromDistance - toDistance;
  const ratio =
    Math.abs(denominator) < 0.000001 ? 0 : fromDistance / denominator;
  return {
    x: from.x + (to.x - from.x) * ratio,
    y: from.y + (to.y - from.y) * ratio,
  };
}

export function polygonArea(polygon: GamePoint[]): number {
  return Math.abs(
    polygon.reduce((area, point, index) => {
      const next = polygon[(index + 1) % polygon.length];
      return area + point.x * next.y - next.x * point.y;
    }, 0) / 2,
  );
}

export function clipPolygon(
  polygon: GamePoint[],
  start: GamePoint,
  end: GamePoint,
  side: CutSide,
): GamePoint[] {
  if (start.x === end.x && start.y === end.y) return [];

  const result: GamePoint[] = [];
  const isInside = (distance: number) =>
    side === "left" ? distance >= -0.0001 : distance <= 0.0001;

  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const next = polygon[(index + 1) % polygon.length];
    const currentDistance = signedDistance(current, start, end);
    const nextDistance = signedDistance(next, start, end);
    const currentInside = isInside(currentDistance);
    const nextInside = isInside(nextDistance);

    if (currentInside) result.push(current);
    if (currentInside !== nextInside) {
      result.push(
        lineIntersection(current, next, currentDistance, nextDistance),
      );
    }
  }

  return result.filter((point, index, points) => {
    const previous = points[(index - 1 + points.length) % points.length];
    return Math.hypot(point.x - previous.x, point.y - previous.y) > 0.01;
  });
}

export function previewBlockCut(
  block: CuttingBlock,
  startId: CutAnchorId,
  endId: CutAnchorId,
  side: CutSide,
): GamePoint[] | null {
  const clipped = clipPolygon(
    block.polygon,
    CUT_ANCHORS[startId],
    CUT_ANCHORS[endId],
    side,
  );
  const beforeArea = polygonArea(block.polygon);
  const afterArea = polygonArea(clipped);

  if (clipped.length < 3 || afterArea < 350 || beforeArea - afterArea < 100) {
    return null;
  }
  return clipped;
}

export function applyBlockCut(
  block: CuttingBlock,
  startId: CutAnchorId,
  endId: CutAnchorId,
  side: CutSide,
): CuttingBlock | null {
  const polygon = previewBlockCut(block, startId, endId, side);
  return polygon ? { ...block, polygon } : null;
}

export function blockWorldPolygon(block: CuttingBlock): GamePoint[] {
  const angle = (block.rotation * Math.PI) / 180;
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const center = GAME_BLOCK_SIZE / 2;

  return block.polygon.map((point) => {
    const localX = point.x - center;
    const localY = point.y - center;
    return {
      x: block.x + center + localX * cosine - localY * sine,
      y: block.y + center + localX * sine + localY * cosine,
    };
  });
}

function pointInPolygon(point: GamePoint, polygon: GamePoint[]): boolean {
  let inside = false;
  for (
    let current = 0, previous = polygon.length - 1;
    current < polygon.length;
    previous = current++
  ) {
    const from = polygon[current];
    const to = polygon[previous];
    const crosses =
      from.y > point.y !== to.y > point.y &&
      point.x <
        ((to.x - from.x) * (point.y - from.y)) / (to.y - from.y) + from.x;
    if (crosses) inside = !inside;
  }
  return inside;
}

export function scoreSimilarity(
  blocks: CuttingBlock[],
  target: PuzzleTarget,
  sampleStep = 4,
): number {
  const playerPolygons = blocks.map(blockWorldPolygon);
  let intersection = 0;
  let union = 0;

  for (let y = sampleStep / 2; y < GAME_WORLD_HEIGHT; y += sampleStep) {
    for (let x = sampleStep / 2; x < GAME_WORLD_WIDTH; x += sampleStep) {
      const point = { x, y };
      const inTarget = target.polygons.some((polygon) =>
        pointInPolygon(point, polygon),
      );
      const inPlayer = playerPolygons.some((polygon) =>
        pointInPolygon(point, polygon),
      );
      if (inTarget || inPlayer) union += 1;
      if (inTarget && inPlayer) intersection += 1;
    }
  }

  return union === 0 ? 0 : Math.round((intersection / union) * 100);
}

export function getScoreBand(score: number): ScoreBand {
  if (score > 90) return "excellent";
  if (score >= 70) return "details";
  if (score >= 50) return "effort";
  if (score >= 30) return "ignored";
  return "hopeless";
}

export function pointsToSvg(polygon: GamePoint[]): string {
  return polygon.map((point) => `${point.x},${point.y}`).join(" ");
}
