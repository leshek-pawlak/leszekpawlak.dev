import {
  MAX_SCULPTURE_BLOCKS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  blockMaterials,
  blockShapes,
  type WorldBlock,
} from "./sculpture.ts";

export const BUILD_ZONE = { x: 70, y: 70, width: 550, height: 455 } as const;
export const SUPPLY_ZONE = { x: 665, y: 55, width: 300, height: 490 } as const;

const dimensions = {
  slab: { width: 108, height: 38 },
  pillar: { width: 46, height: 94 },
  cube: { width: 66, height: 66 },
  arch: { width: 96, height: 76 },
  crystal: { width: 54, height: 82 },
} as const;

function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.min(items.length - 1, Math.floor(random() * items.length))];
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function generateBlocks(
  random: () => number = Math.random,
  options: { count?: number; idPrefix?: string } = {},
): WorldBlock[] {
  const count = clamp(
    Math.round(options.count ?? 14),
    12,
    MAX_SCULPTURE_BLOCKS,
  );
  const prefix = options.idPrefix ?? "loose";

  return Array.from({ length: count }, (_, index) => {
    const shape = pick(blockShapes, random);
    const material = pick(blockMaterials, random);
    const size = dimensions[shape];
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = clamp(
      SUPPLY_ZONE.x + column * 96 + Math.round((random() - 0.5) * 18),
      SUPPLY_ZONE.x,
      WORLD_WIDTH - size.width,
    );
    const y = clamp(
      SUPPLY_ZONE.y + row * 94 + Math.round((random() - 0.5) * 14),
      SUPPLY_ZONE.y,
      WORLD_HEIGHT - size.height,
    );

    return {
      id: `${prefix}-${index + 1}`,
      shape,
      material,
      x,
      y,
      width: size.width,
      height: size.height,
      rotation: pick([-6, 0, 0, 0, 6] as const, random),
    };
  });
}

export function moveBlock(block: WorldBlock, x: number, y: number): WorldBlock {
  return {
    ...block,
    x: clamp(Math.round(x / 10) * 10, 0, WORLD_WIDTH - block.width),
    y: clamp(Math.round(y / 10) * 10, 0, WORLD_HEIGHT - block.height),
  };
}

export function rotateBlock(block: WorldBlock, direction: -1 | 1): WorldBlock {
  const nextRotation = block.rotation + direction * 15;
  return {
    ...block,
    rotation:
      nextRotation > 180 ? -180 : nextRotation < -180 ? 180 : nextRotation,
  };
}

export function blocksInsideBuildZone(blocks: WorldBlock[]): WorldBlock[] {
  return blocks.filter((block) => {
    const centerX = block.x + block.width / 2;
    const centerY = block.y + block.height / 2;
    return (
      centerX >= BUILD_ZONE.x &&
      centerX <= BUILD_ZONE.x + BUILD_ZONE.width &&
      centerY >= BUILD_ZONE.y &&
      centerY <= BUILD_ZONE.y + BUILD_ZONE.height
    );
  });
}
