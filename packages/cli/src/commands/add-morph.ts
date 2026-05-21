import { join } from "node:path";
import kleur from "kleur";
import { readTemplate, renderTemplate, toComponentName } from "@svg-animated-icons/codegen";
import { type IconPart, fetchIcon } from "../registry.js";
import { writeProjectFile } from "../write-file.js";
import { pickFramework } from "./add.js";

type Framework = "react" | "vue" | "angular";

type Options = {
  from: string;
  to: string;
  react?: boolean;
  vue?: boolean;
  angular?: boolean;
  dest?: string;
  libDest?: string;
  registry?: string;
  force?: boolean;
};

const FRAMEWORK_FILE: Record<Framework, { template: string; ext: string }> = {
  react: { template: "react-morph.tpl", ext: "tsx" },
  vue: { template: "vue-morph.tpl", ext: "vue" },
  angular: { template: "angular-morph.tpl", ext: "component.ts" },
};

export async function addMorphCommand(opts: Options): Promise<void> {
  const framework = pickFramework(opts);

  console.log(kleur.bold(`Adding morph component ${opts.from} ↔ ${opts.to} (${framework})`));

  const [from, to] = await Promise.all([
    fetchIcon(opts.from, opts.registry),
    fetchIcon(opts.to, opts.registry),
  ]);

  const fromCompat = from.meta.morphCompatibleWith ?? [];
  if (!fromCompat.includes(opts.to)) {
    console.warn(
      kleur.yellow(
        `! Warning: ${opts.from} does not declare ${opts.to} as morph-compatible. The morph may look broken.`,
      ),
    );
  }
  if (!partsCompatible(from.meta.parts, to.meta.parts)) {
    throw new Error(
      `Icons ${opts.from} and ${opts.to} do not share the same path structure. Both must have parts with matching ids and identical SVG command sequences.`,
    );
  }

  const fromPaths = serializeParts(from.meta.parts);
  const toPaths = serializeParts(to.meta.parts);
  const fromName = toComponentName(from.name);
  const toName = toComponentName(to.name);
  const morphName = `${fromName.replace(/Icon$/, "")}${toName.replace(/Icon$/, "")}Morph`;
  const className = `ai-${from.name}-${to.name}-morph`;
  const partAttrs = from.meta.parts.map((p) => `data-part="${p.id}"`);

  const { template, ext } = FRAMEWORK_FILE[framework];
  const componentContent = renderTemplate(readTemplate(template), {
    ComponentName: morphName,
    fromName: from.name,
    toName: to.name,
    className,
    viewBox: from.meta.viewBox,
    fromPaths,
    toPaths,
    initialPaths: renderInitialPaths(from.meta.parts, partAttrs),
  });

  const dest = opts.dest ?? join("components", "svg-icons");
  await writeProjectFile(join(dest, `${from.name}-${to.name}-morph.${ext}`), componentContent, {
    force: opts.force,
  });

  const libDest = opts.libDest ?? join("lib", "svg-icons");
  const enginePath = join(libDest, "morph.ts");
  const engineTemplate = readTemplate("morph-engine.tpl");
  await writeProjectFile(enginePath, engineTemplate, { force: opts.force });
}

function partsCompatible(a: IconPart[], b: IconPart[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const partA = a[i];
    const partB = b[i];
    if (!partA || !partB || partA.id !== partB.id) return false;
    if (!partA.d || !partB.d) return false;
    if (!commandsMatch(partA.d, partB.d)) return false;
  }
  return true;
}

function commandsMatch(a: string, b: string): boolean {
  const cmdA = a.match(/[a-zA-Z]/g)?.join("") ?? "";
  const cmdB = b.match(/[a-zA-Z]/g)?.join("") ?? "";
  return cmdA === cmdB;
}

function serializeParts(parts: IconPart[]): string {
  return parts.map((p) => `  ${JSON.stringify(p.id)}: ${JSON.stringify(p.d)}`).join(",\n");
}

function renderInitialPaths(parts: IconPart[], attrs: string[]): string {
  return parts.map((p, i) => `        <path ${attrs[i]} d=${JSON.stringify(p.d)} />`).join("\n");
}
