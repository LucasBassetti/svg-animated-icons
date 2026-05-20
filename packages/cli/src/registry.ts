export type IconPart = { id: string; d?: string };

export type IconMeta = {
  name: string;
  displayName: string;
  description: string;
  viewBox: string;
  parts: IconPart[];
  morphCompatibleWith?: string[];
};

export type RegistryEntry = {
  name: string;
  version: string;
  svg: string;
  css: string;
  meta: IconMeta;
};

const DEFAULT_REGISTRY = "http://localhost:3000";

export function getRegistryBase(override?: string): string {
  return override ?? process.env.SVG_ICONS_REGISTRY ?? DEFAULT_REGISTRY;
}

export async function fetchIcon(name: string, registry?: string): Promise<RegistryEntry> {
  const base = getRegistryBase(registry);
  const url = `${base.replace(/\/$/, "")}/r/${name}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch icon "${name}" from ${url} (HTTP ${res.status})`);
  }
  return (await res.json()) as RegistryEntry;
}
