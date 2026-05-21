import angularMorphTpl from "../templates/angular-morph.tpl";
import angularSwapTpl from "../templates/angular-swap.tpl";
import angularTpl from "../templates/angular.tpl";
import morphEngineTpl from "../templates/morph-engine.tpl";
import reactMorphTpl from "../templates/react-morph.tpl";
import reactSwapTpl from "../templates/react-swap.tpl";
import reactTpl from "../templates/react.tpl";
import vueMorphTpl from "../templates/vue-morph.tpl";
import vueSwapTpl from "../templates/vue-swap.tpl";
import vueTpl from "../templates/vue.tpl";

const TEMPLATES: Record<string, string> = {
  "react.tpl": reactTpl,
  "react-morph.tpl": reactMorphTpl,
  "react-swap.tpl": reactSwapTpl,
  "vue.tpl": vueTpl,
  "vue-morph.tpl": vueMorphTpl,
  "vue-swap.tpl": vueSwapTpl,
  "angular.tpl": angularTpl,
  "angular-morph.tpl": angularMorphTpl,
  "angular-swap.tpl": angularSwapTpl,
  "morph-engine.tpl": morphEngineTpl,
};

export function readTemplate(name: string): string {
  const tpl = TEMPLATES[name];
  if (tpl === undefined) {
    throw new Error(`Template not found: ${name}`);
  }
  return tpl;
}

export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (!(key in vars)) {
      throw new Error(`Template missing variable: ${key}`);
    }
    return vars[key] ?? "";
  });
}

export function toComponentName(iconName: string): string {
  const camel = iconName
    .split(/[-_]/)
    .map((s) => {
      const first = s[0];
      return first ? first.toUpperCase() + s.slice(1) : "";
    })
    .join("");
  return `${camel}Icon`;
}
