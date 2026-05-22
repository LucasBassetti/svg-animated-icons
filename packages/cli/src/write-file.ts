import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import kleur from "kleur";
import { formatGenerated } from "./format.js";

export async function writeProjectFile(
  targetPath: string,
  content: string,
  opts: { force?: boolean } = {},
): Promise<{ written: boolean; path: string }> {
  const absolute = resolve(process.cwd(), targetPath);
  const exists = await access(absolute).then(
    () => true,
    () => false,
  );
  if (exists && !opts.force) {
    console.log(kleur.yellow(`• skipped (already exists): ${targetPath}`));
    console.log(kleur.gray("  pass --force to overwrite"));
    return { written: false, path: absolute };
  }
  const formatted = await formatGenerated(content, absolute);
  await mkdir(dirname(absolute), { recursive: true });
  await writeFile(absolute, formatted);
  console.log(kleur.green(`✓ wrote ${targetPath}`));
  return { written: true, path: absolute };
}
