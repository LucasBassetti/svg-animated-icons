import { watch } from "node:fs";
import { access } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { buildRegistry } from "./build.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_INDEX = join(
  __dirname,
  "..",
  "..",
  "apps",
  "docs",
  "public",
  "r",
  "index.json",
);
const IGNORED_DIRS = new Set(["node_modules", ".turbo", "dist"]);
const WATCHED_EXTENSIONS = new Set([".svg", ".css", ".json"]);

let timer: ReturnType<typeof setTimeout> | undefined;
let building = false;
let queued = false;

function shouldIgnore(relPath: string): boolean {
  const parts = relPath.split(sep);
  if (parts.some((part) => IGNORED_DIRS.has(part))) return true;
  if (parts[0] === "build.ts" || parts[0] === "watch.ts") return true;

  const extension = relPath.match(/\.[^.]+$/)?.[0];
  if (!extension) return false;
  return !WATCHED_EXTENSIONS.has(extension);
}

async function runBuild(reason: string): Promise<void> {
  if (building) {
    queued = true;
    return;
  }

  building = true;
  const started = Date.now();
  try {
    console.log(`↻ registry rebuild: ${reason}`);
    await buildRegistry();
    console.log(`✓ registry rebuilt in ${Date.now() - started}ms`);
  } catch (error) {
    console.error("✕ registry rebuild failed");
    console.error(error);
  } finally {
    building = false;
    if (queued) {
      queued = false;
      await runBuild("queued changes");
    }
  }
}

function scheduleBuild(reason: string): void {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    void runBuild(reason);
  }, 150);
}

async function registryExists(): Promise<boolean> {
  try {
    await access(REGISTRY_INDEX);
    return true;
  } catch {
    return false;
  }
}

async function watchIconSources(): Promise<void> {
  if (await registryExists()) {
    console.log("✓ registry already populated, skipping initial build");
  } else {
    await runBuild("initial");
  }

  watch(__dirname, { recursive: true }, (event, filename) => {
    const file = filename?.toString();
    if (!file) return;
    if (shouldIgnore(file)) return;

    scheduleBuild(`${event} ${relative(__dirname, join(__dirname, file))}`);
  });

  console.log("👀 watching icon sources (recursive)");
}

watchIconSources().catch((error) => {
  console.error(error);
  process.exit(1);
});
