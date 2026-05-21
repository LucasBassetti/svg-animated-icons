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
  const inner = (innerMatch?.[1] ?? "").trim();
  return { inner, viewBox, outerClass };
}

export function transformInnerForReact(inner: string): string {
  return inner
    .replace(/class=/g, "className=")
    .replace(/fill-rule=/g, "fillRule=")
    .replace(/clip-rule=/g, "clipRule=")
    .replace(/stroke-width=/g, "strokeWidth=")
    .replace(/stroke-linecap=/g, "strokeLinecap=")
    .replace(/stroke-linejoin=/g, "strokeLinejoin=");
}
