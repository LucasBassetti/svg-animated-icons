import { join } from "node:path";
import kleur from "kleur";
import { fetchIcon } from "../registry.js";
import { extractSvgInner, readTemplate, renderTemplate, toComponentName } from "../template.js";
import { writeProjectFile } from "../write-file.js";

type Options = {
  icon: string;
  react?: boolean;
  vue?: boolean;
  svelte?: boolean;
  dest?: string;
  registry?: string;
  force?: boolean;
};

export async function addCommand(opts: Options): Promise<void> {
  const framework = pickFramework(opts);
  if (framework !== "react") {
    throw new Error(`Framework "${framework}" is not yet supported. Only --react works today.`);
  }

  console.log(kleur.bold(`Adding ${opts.icon} icon (${framework})`));

  const icon = await fetchIcon(opts.icon, opts.registry);
  const { inner, viewBox, outerClass } = extractSvgInner(icon.svg);
  const componentName = toComponentName(icon.name);
  const baseClass = outerClass || `ai-${icon.name}-icon`;

  const template = await readTemplate("react.tpl");
  const content = renderTemplate(template, {
    ComponentName: componentName,
    baseClass,
    css: icon.css,
    viewBox,
    svgInner: inner,
  });

  const dest = opts.dest ?? join("components", "svg-icons");
  await writeProjectFile(join(dest, `${icon.name}.tsx`), content, { force: opts.force });
}

function pickFramework(opts: Options): "react" | "vue" | "svelte" {
  if (opts.vue) return "vue";
  if (opts.svelte) return "svelte";
  return "react";
}
