import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, "..", "templates");

export async function readTemplate(name: string): Promise<string> {
  return readFile(join(TEMPLATES_DIR, name), "utf8");
}

export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (!(key in vars)) {
      throw new Error(`Template missing variable: ${key}`);
    }
    return vars[key] ?? "";
  });
}

export function toComponentName(iconName: string): string {
  const camel = iconName
    .split(/[-_]/)
    .map((s) => {
      const first = s[0];
      return first ? first.toUpperCase() + s.slice(1) : "";
    })
    .join("");
  return `${camel}Icon`;
}

export function extractSvgInner(svg: string): {
  inner: string;
  viewBox: string;
  outerClass: string;
} {
  const viewBoxMatch = svg.match(/viewBox=["']([^"']+)["']/);
  const viewBox = viewBoxMatch?.[1] ?? "0 0 24 24";
  const outerClassMatch = svg.match(/<svg[^>]*?\bclass=["']([^"']+)["']/);
  const outerClass = outerClassMatch?.[1] ?? "";
  const innerMatch = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  const raw = innerMatch?.[1] ?? "";
  const inner = raw
    .replace(/class=/g, "className=")
    .replace(/fill-rule=/g, "fillRule=")
    .replace(/clip-rule=/g, "clipRule=")
    .replace(/stroke-width=/g, "strokeWidth=")
    .replace(/stroke-linecap=/g, "strokeLinecap=")
    .replace(/stroke-linejoin=/g, "strokeLinejoin=")
    .trim();
  return { inner, viewBox, outerClass };
}
