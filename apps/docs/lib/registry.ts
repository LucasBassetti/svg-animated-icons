import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const REGISTRY_DIR = join(process.cwd(), "public", "r");

export type IconPart = { id: string; d?: string };

export type IconMeta = {
  name: string;
  displayName: string;
  description?: string;
  viewBox: string;
  parts: IconPart[];
  morphCompatibleWith?: string[];
  aliases?: string[];
};

export type RegistryEntry = {
  name: string;
  version: string;
  svg: string;
  css: string;
  meta: IconMeta;
};

export type IconIndexEntry = {
  name: string;
  displayName: string;
  aliases: string[];
};

export async function listIcons(): Promise<RegistryEntry[]> {
  const files = await readdir(REGISTRY_DIR);
  const iconFiles = files.filter((f) => f.endsWith(".json") && f !== "index.json").sort();
  return Promise.all(iconFiles.map((f) => readIcon(f.replace(/\.json$/, ""))));
}

export async function readIcon(name: string): Promise<RegistryEntry> {
  const content = await readFile(join(REGISTRY_DIR, `${name}.json`), "utf8");
  return JSON.parse(content) as RegistryEntry;
}

export async function readIconIndex(): Promise<IconIndexEntry[]> {
  const content = await readFile(join(REGISTRY_DIR, "index.json"), "utf8");
  const parsed = JSON.parse(content) as { icons: IconIndexEntry[] };
  return parsed.icons;
}
