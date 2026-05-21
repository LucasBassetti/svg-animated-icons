const THEME_STYLE =
  "<style>:root{color:#000}@media (prefers-color-scheme:dark){:root{color:#fff}}</style>";

/**
 * Inject a small <style> block into an SVG so that `currentColor` resolves to
 * black in light mode and white in dark mode. Used when serving an icon as a
 * favicon, where there is no parent stylesheet to inherit color from.
 */
export function withFaviconTheme(svg: string): string {
  return svg.replace(/<svg\b([^>]*)>/, (_match, attrs) => `<svg${attrs}>${THEME_STYLE}`);
}
