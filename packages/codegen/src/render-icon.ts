import { extractSvgInner, transformInnerForReact } from "./extract.js";
import { readTemplate, renderTemplate, toComponentName } from "./render.js";
import type { Framework, RegistryEntry } from "./types.js";

export function renderIconForFramework(entry: RegistryEntry, framework: Framework): string {
  const { inner, viewBox, outerClass } = extractSvgInner(entry.svg);
  const componentName = toComponentName(entry.name);
  const baseClass = outerClass || `ai-${entry.name}-icon`;
  const rawInner = framework === "react" ? transformInnerForReact(inner) : inner;

  const templateName = `${framework}.tpl`;
  const template = readTemplate(templateName);
  const svgInner = reindentToPlaceholder(rawInner, template, "svgInner");

  return renderTemplate(template, {
    ComponentName: componentName,
    baseClass,
    css: entry.css,
    viewBox,
    svgInner,
    iconName: entry.name,
  });
}

/**
 * Re-indents `content` so that, once substituted into `template` at `{{placeholder}}`,
 * every line aligns with the column where the placeholder appears.
 *
 * The first line is emitted with no leading whitespace (the template already places
 * it at the right column). Subsequent lines are prefixed with the placeholder's
 * column indent. Relative nesting within `content` is preserved by detecting the
 * minimum indent of the input lines and stripping that much before re-prefixing.
 */
export function reindentToPlaceholder(
  content: string,
  template: string,
  placeholder: string,
): string {
  const marker = `{{${placeholder}}}`;
  const idx = template.indexOf(marker);
  if (idx === -1) return content;

  const lineStart = template.lastIndexOf("\n", idx - 1) + 1;
  const indent = template.slice(lineStart, idx);
  if (indent.length === 0 || /\S/.test(indent)) return content;

  const lines = content.split("\n");
  if (lines.length <= 1) return content;

  const minIndent = lines
    .slice(1)
    .filter((l) => l.trim().length > 0)
    .reduce<number>((min, l) => {
      const leading = l.match(/^[ \t]*/)?.[0].length ?? 0;
      return Math.min(min, leading);
    }, Number.POSITIVE_INFINITY);

  const strip = Number.isFinite(minIndent) ? minIndent : 0;

  return lines
    .map((line, i) => {
      if (i === 0) return line;
      if (line.trim().length === 0) return "";
      return indent + line.slice(strip);
    })
    .join("\n");
}
