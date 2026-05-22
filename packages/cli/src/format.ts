import kleur from "kleur";
import prettier from "prettier";

function parserForPath(targetPath: string): prettier.BuiltInParserName | null {
  if (targetPath.endsWith(".tsx") || targetPath.endsWith(".ts")) return "typescript";
  if (targetPath.endsWith(".vue")) return "vue";
  return null;
}

export async function formatGenerated(content: string, absolutePath: string): Promise<string> {
  const parser = parserForPath(absolutePath);
  if (!parser) return content;

  try {
    const projectConfig = await prettier.resolveConfig(absolutePath);
    return await prettier.format(content, {
      ...projectConfig,
      parser,
      filepath: absolutePath,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(kleur.yellow(`! prettier failed to format ${absolutePath}: ${msg}`));
    console.warn(kleur.gray("  writing unformatted output"));
    return content;
  }
}
