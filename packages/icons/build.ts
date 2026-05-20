import { access, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = __dirname;
const OUTPUT_DIR = join(__dirname, "..", "..", "apps", "docs", "public", "r");
const MORPH_ENGINE_SRC = join(__dirname, "..", "cli", "templates", "morph-engine.tpl");
const MORPH_ENGINE_DEST = join(__dirname, "..", "..", "apps", "docs", "lib", "morph-engine.ts");

const VERSION = "1.0.0";

type IconPart = { id: string; d?: string };

type IconMeta = {
  name: string;
  displayName: string;
  description?: string;
  viewBox: string;
  parts: IconPart[];
  morphCompatibleWith?: string[];
  aliases?: string[];
};

type RegistryEntry = {
  name: string;
  version: string;
  svg: string;
  css: string;
  meta: IconMeta;
};

function nameToDisplayName(name: string): string {
  return name
    .split("-")
    .map((w) => {
      const first = w[0];
      return first ? first.toUpperCase() + w.slice(1) : "";
    })
    .join(" ");
}

function prepareSvg(svgRaw: string, className: string): string {
  return svgRaw.replace(/<svg\b[^>]*>/, (tag) => {
    const cleaned = tag.replace(/\s+(?:width|height)="[^"]*"/g, "");
    return cleaned.replace(/<svg/, `<svg class="${className}"`);
  });
}

function extractViewBox(svg: string): string {
  return svg.match(/\bviewBox="([^"]+)"/)?.[1] ?? "0 0 15 15";
}

async function readAliases(dir: string): Promise<string[] | undefined> {
  try {
    const raw = await readFile(join(dir, "aliases.json"), "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) {
      return parsed;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

async function buildIcon(name: string): Promise<RegistryEntry> {
  const dir = join(SOURCE_DIR, name);
  const svgRaw = (await readFile(join(dir, "icon.svg"), "utf8")).trim();
  const css = (await readFile(join(dir, "styles.css"), "utf8")).trim();
  const svg = prepareSvg(svgRaw, `ai-${name}-icon`);
  const aliases = await readAliases(dir);

  return {
    name,
    version: VERSION,
    svg,
    css,
    meta: {
      name,
      displayName: nameToDisplayName(name),
      viewBox: extractViewBox(svgRaw),
      parts: [],
      ...(aliases ? { aliases } : {}),
    },
  };
}

export async function buildRegistry(): Promise<void> {
  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  const entries = await readdir(SOURCE_DIR, { withFileTypes: true });
  const iconNames = entries
    .filter(
      (entry) =>
        entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules",
    )
    .map((entry) => entry.name)
    .sort();

  const built: RegistryEntry[] = [];
  const skipped: string[] = [];
  for (const iconName of iconNames) {
    const dir = join(SOURCE_DIR, iconName);
    const hasAllSources = await Promise.all(
      ["icon.svg", "styles.css"].map((f) =>
        access(join(dir, f))
          .then(() => true)
          .catch(() => false),
      ),
    ).then((results) => results.every(Boolean));

    if (!hasAllSources) {
      skipped.push(iconName);
      continue;
    }

    const entry = await buildIcon(iconName);
    await writeFile(join(OUTPUT_DIR, `${entry.name}.json`), `${JSON.stringify(entry, null, 2)}\n`);
    built.push(entry);
  }
  console.log(`✓ built ${built.length} icon entries`);
  if (skipped.length > 0) {
    console.log(`  skipped (incomplete): ${skipped.join(", ")}`);
  }

  const index = {
    version: VERSION,
    icons: built.map(({ name, meta }) => ({
      name,
      displayName: meta.displayName,
      aliases: meta.aliases ?? [],
    })),
  };
  await writeFile(join(OUTPUT_DIR, "index.json"), `${JSON.stringify(index, null, 2)}\n`);
  console.log("✓ built index.json");

  const engine = await readFile(MORPH_ENGINE_SRC, "utf8");
  await mkdir(dirname(MORPH_ENGINE_DEST), { recursive: true });
  await writeFile(MORPH_ENGINE_DEST, engine);
  console.log("✓ copied morph engine to apps/docs/lib/morph-engine.ts");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildRegistry().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
