export const SCULPTURE_STORAGE_KEY = "lp:rpg-sculpture:v1";
export const SCULPTURE_VERSION = 1;
export const WORLD_WIDTH = 1000;
export const WORLD_HEIGHT = 600;
export const MAX_SCULPTURE_BLOCKS = 18;

export const blockShapes = [
  "slab",
  "pillar",
  "cube",
  "arch",
  "crystal",
] as const;
export const blockMaterials = ["stone", "wood", "rune", "ice"] as const;

export type BlockShape = (typeof blockShapes)[number];
export type BlockMaterial = (typeof blockMaterials)[number];

export type WorldBlock = {
  id: string;
  shape: BlockShape;
  material: BlockMaterial;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export type SculptureSnapshot = {
  version: typeof SCULPTURE_VERSION;
  createdAt: string;
  world: {
    width: typeof WORLD_WIDTH;
    height: typeof WORLD_HEIGHT;
  };
  blocks: WorldBlock[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isWorldBlock(value: unknown): value is WorldBlock {
  if (!isRecord(value)) return false;

  const { id, shape, material, x, y, width, height, rotation } = value;
  if (
    typeof id !== "string" ||
    id.length === 0 ||
    id.length > 80 ||
    !blockShapes.includes(shape as BlockShape) ||
    !blockMaterials.includes(material as BlockMaterial) ||
    !isFiniteNumber(x) ||
    !isFiniteNumber(y) ||
    !isFiniteNumber(width) ||
    !isFiniteNumber(height) ||
    !isFiniteNumber(rotation)
  ) {
    return false;
  }

  return (
    width >= 24 &&
    width <= 180 &&
    height >= 24 &&
    height <= 180 &&
    x >= 0 &&
    y >= 0 &&
    x + width <= WORLD_WIDTH &&
    y + height <= WORLD_HEIGHT &&
    rotation >= -180 &&
    rotation <= 180
  );
}

export function isSculptureSnapshot(
  value: unknown,
): value is SculptureSnapshot {
  if (!isRecord(value) || value.version !== SCULPTURE_VERSION) return false;
  if (
    typeof value.createdAt !== "string" ||
    !Number.isFinite(Date.parse(value.createdAt))
  ) {
    return false;
  }
  if (!isRecord(value.world)) return false;
  if (
    value.world.width !== WORLD_WIDTH ||
    value.world.height !== WORLD_HEIGHT ||
    !Array.isArray(value.blocks) ||
    value.blocks.length === 0 ||
    value.blocks.length > MAX_SCULPTURE_BLOCKS
  ) {
    return false;
  }

  const identifiers = new Set<string>();
  for (const block of value.blocks) {
    if (!isWorldBlock(block) || identifiers.has(block.id)) return false;
    identifiers.add(block.id);
  }

  return true;
}

export function createSculptureSnapshot(
  blocks: WorldBlock[],
  createdAt = new Date().toISOString(),
): SculptureSnapshot {
  const snapshot: SculptureSnapshot = {
    version: SCULPTURE_VERSION,
    createdAt,
    world: { width: WORLD_WIDTH, height: WORLD_HEIGHT },
    blocks: blocks.map((block) => ({ ...block })),
  };

  if (!isSculptureSnapshot(snapshot)) {
    throw new Error("Cannot create an invalid sculpture snapshot");
  }

  return snapshot;
}
