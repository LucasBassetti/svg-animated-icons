import { join } from "node:path";
import kleur from "kleur";
import { fetchIcon } from "../registry.js";
import { extractSvgInner, readTemplate, renderTemplate, toComponentName } from "../template.js";
import { writeProjectFile } from "../write-file.js";

type Options = {
  from: string;
  to: string;
  react?: boolean;
  vue?: boolean;
  svelte?: boolean;
  dest?: string;
  registry?: string;
  force?: boolean;
};

export async function addSwapCommand(opts: Options): Promise<void> {
  const framework = pickFramework(opts);
  if (framework !== "react") {
    throw new Error(`Framework "${framework}" is not yet supported. Only --react works today.`);
  }

  console.log(kleur.bold(`Adding swap component ${opts.from} → ${opts.to} (${framework})`));

  const [from, to] = await Promise.all([
    fetchIcon(opts.from, opts.registry),
    fetchIcon(opts.to, opts.registry),
  ]);

  const fromInner = extractSvgInner(from.svg);
  const toInner = extractSvgInner(to.svg);
  const fromComp = toComponentName(from.name).replace(/Icon$/, "");
  const toComp = toComponentName(to.name).replace(/Icon$/, "");
  const componentName = `${fromComp}${toComp}Swap`;

  const template = await readTemplate("react-swap.tpl");
  const content = renderTemplate(template, {
    ComponentName: componentName,
    fromName: from.name,
    toName: to.name,
    fromViewBox: fromInner.viewBox,
    toViewBox: toInner.viewBox,
    fromSvgInner: fromInner.inner,
    toSvgInner: toInner.inner,
    fromCss: from.css,
    toCss: to.css,
  });

  const dest = opts.dest ?? join("components", "svg-icons");
  await writeProjectFile(join(dest, `${from.name}-${to.name}-swap.tsx`), content, {
    force: opts.force,
  });
}

function pickFramework(opts: Options): "react" | "vue" | "svelte" {
  if (opts.vue) return "vue";
  if (opts.svelte) return "svelte";
  return "react";
}
