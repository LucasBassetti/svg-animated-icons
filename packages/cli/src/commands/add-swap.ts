import { join } from "node:path";
import kleur from "kleur";
import {
  extractSvgInner,
  readTemplate,
  renderTemplate,
  toComponentName,
  transformInnerForReact,
} from "@svg-animated-icons/codegen";
import { fetchIcon } from "../registry.js";
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
  registry?: string;
  force?: boolean;
};

const FRAMEWORK_FILE: Record<Framework, { template: string; ext: string }> = {
  react: { template: "react-swap.tpl", ext: "tsx" },
  vue: { template: "vue-swap.tpl", ext: "vue" },
  angular: { template: "angular-swap.tpl", ext: "component.ts" },
};

export async function addSwapCommand(opts: Options): Promise<void> {
  const framework = pickFramework(opts);

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

  const fromSvgInner =
    framework === "react" ? transformInnerForReact(fromInner.inner) : fromInner.inner;
  const toSvgInner =
    framework === "react" ? transformInnerForReact(toInner.inner) : toInner.inner;

  const { template, ext } = FRAMEWORK_FILE[framework];
  const content = renderTemplate(readTemplate(template), {
    ComponentName: componentName,
    fromName: from.name,
    toName: to.name,
    fromViewBox: fromInner.viewBox,
    toViewBox: toInner.viewBox,
    fromSvgInner,
    toSvgInner,
    fromCss: from.css,
    toCss: to.css,
  });

  const dest = opts.dest ?? join("components", "animated-icons");
  await writeProjectFile(join(dest, `${from.name}-${to.name}-swap.${ext}`), content, {
    force: opts.force,
  });
}
