import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import kleur from "kleur";

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
  await mkdir(dirname(absolute), { recursive: true });
  await writeFile(absolute, content);
  console.log(kleur.green(`✓ wrote ${targetPath}`));
  return { written: true, path: absolute };
}
