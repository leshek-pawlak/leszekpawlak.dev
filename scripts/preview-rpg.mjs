import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Only these prototype assets are served. The repository and .env are not exposed.
const design = new URL("../docs/design/rpg/", import.meta.url);
const entries = [
  ["/", "prototype.html", "text/html; charset=utf-8"],
  ["/prototype.html", "prototype.html", "text/html; charset=utf-8"],
  ["/prototype.css", "prototype.css", "text/css; charset=utf-8"],
  ["/prototype.js", "prototype.js", "text/javascript; charset=utf-8"],
  ["/leszek-mage-card-v3.png", "leszek-mage-card-v3.png", "image/png"],
  [
    "/tavern-workshop-background-v1.png",
    "tavern-workshop-background-v1.png",
    "image/png",
  ],
  [
    "/arcane-runestone-card-v3.png",
    "arcane-runestone-card-v3.png",
    "image/png",
  ],
];
const routes = new Map(
  entries.map(([route, file, type]) => [
    route,
    { file: new URL(file, design), type },
  ]),
);
routes.set("/nda-leszek-pawlak.pdf", {
  file: new URL("../public/nda-leszek-pawlak.pdf", import.meta.url),
  type: "application/pdf",
});
const port = Number(process.env.RPG_PREVIEW_PORT || 4173);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error(
    "RPG_PREVIEW_PORT must be an integer between 1024 and 65535.",
  );

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Read-only design prototype");
    return;
  }
  let route;
  try {
    route = routes.get(new URL(request.url, "http://127.0.0.1").pathname);
  } catch {
    response.writeHead(400);
    response.end("Invalid URL");
    return;
  }
  if (!route) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  try {
    const info = await stat(route.file);
    response.writeHead(200, {
      "Content-Type": route.type,
      "Content-Length": info.size,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    });
    if (request.method === "HEAD") response.end();
    else
      createReadStream(fileURLToPath(route.file))
        .on("error", () => response.destroy())
        .pipe(response);
  } catch {
    response.writeHead(500);
    response.end("Prototype asset unavailable");
  }
});
server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.listen(port, "127.0.0.1", () =>
  console.log(`RPG design prototype: http://127.0.0.1:${port}`),
);
process.on("SIGINT", () => server.close(() => process.exit(0)));
process.on("SIGTERM", () => server.close(() => process.exit(0)));
