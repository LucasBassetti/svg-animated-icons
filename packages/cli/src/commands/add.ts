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

type Framework = "react" | "vue" | "angular";

type Options = {
  icon: string;
  react?: boolean;
  vue?: boolean;
  angular?: boolean;
  dest?: string;
  registry?: string;
  force?: boolean;
};

const FRAMEWORK_FILE: Record<Framework, { template: string; ext: string }> = {
  react: { template: "react.tpl", ext: "tsx" },
  vue: { template: "vue.tpl", ext: "vue" },
  angular: { template: "angular.tpl", ext: "component.ts" },
};

export async function addCommand(opts: Options): Promise<void> {
  const framework = pickFramework(opts);

  console.log(kleur.bold(`Adding ${opts.icon} icon (${framework})`));

  const icon = await fetchIcon(opts.icon, opts.registry);
  const { inner, viewBox, outerClass } = extractSvgInner(icon.svg);
  const componentName = toComponentName(icon.name);
  const baseClass = outerClass || `ai-${icon.name}-icon`;
  const svgInner = framework === "react" ? transformInnerForReact(inner) : inner;

  const { template, ext } = FRAMEWORK_FILE[framework];
  const content = renderTemplate(readTemplate(template), {
    ComponentName: componentName,
    baseClass,
    css: icon.css,
    viewBox,
    svgInner,
    iconName: icon.name,
  });

  const dest = opts.dest ?? join("components", "animated-icons");
  await writeProjectFile(join(dest, `${icon.name}.${ext}`), content, { force: opts.force });
}

export function pickFramework(opts: {
  react?: boolean;
  vue?: boolean;
  angular?: boolean;
}): Framework {
  const picks: Framework[] = [];
  if (opts.react) picks.push("react");
  if (opts.vue) picks.push("vue");
  if (opts.angular) picks.push("angular");
  if (picks.length === 0) {
    throw new Error("Specify a framework: --react, --vue, or --angular");
  }
  if (picks.length > 1) {
    throw new Error(`Pick one framework flag, got: ${picks.map((p) => `--${p}`).join(", ")}`);
  }
  return picks[0] as Framework;
}
