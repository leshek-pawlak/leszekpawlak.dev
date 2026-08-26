import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputDirectory = path.join(projectRoot, "public/images/rpg");

const assets = [
  {
    key: "background",
    input: "docs/design/rpg/tavern-workshop-background-v1.png",
    output: "tavern-workshop-background.webp",
    quality: 80,
  },
  {
    key: "portrait",
    input: "docs/design/rpg/leszek-mage-card-v3.png",
    output: "leszek-mage-card.webp",
    quality: 86,
  },
  {
    key: "runestone",
    input: "docs/design/rpg/arcane-runestone-card-v3.png",
    output: "arcane-runestone-card.webp",
    quality: 82,
    width: 720,
  },
];

await mkdir(outputDirectory, { recursive: true });

const optimizedAssets = {};

for (const asset of assets) {
  const inputPath = path.join(projectRoot, asset.input);
  const outputPath = path.join(outputDirectory, asset.output);
  const pipeline = sharp(inputPath).rotate();

  if (asset.width) {
    pipeline.resize({ width: asset.width, withoutEnlargement: true });
  }

  await pipeline
    .webp({ quality: asset.quality, effort: 6, smartSubsample: true })
    .toFile(outputPath);

  const [metadata, outputStats, sourceStats, blurBuffer] = await Promise.all([
    sharp(outputPath).metadata(),
    stat(outputPath),
    stat(inputPath),
    sharp(outputPath)
      .resize({ width: 24, withoutEnlargement: true })
      .blur(1)
      .webp({ quality: 30, effort: 4 })
      .toBuffer(),
  ]);

  optimizedAssets[asset.key] = {
    src: `/images/rpg/${asset.output}`,
    width: metadata.width,
    height: metadata.height,
    bytes: outputStats.size,
    sourceBytes: sourceStats.size,
    blurDataURL: `data:image/webp;base64,${blurBuffer.toString("base64")}`,
  };
}

const manifest = {
  generatedBy: "scripts/optimize-rpg-assets.mjs",
  format: "webp",
  assets: optimizedAssets,
};

await writeFile(
  path.join(outputDirectory, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

for (const [key, asset] of Object.entries(optimizedAssets)) {
  const reduction = Math.round((1 - asset.bytes / asset.sourceBytes) * 100);
  console.log(`${key}: ${asset.bytes} B (${reduction}% smaller)`);
}
