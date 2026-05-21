import { type Framework, renderIconForFramework } from "@svg-animated-icons/codegen";
import type { RegistryEntry } from "./registry";

export type FrameworkPreview = {
  framework: Framework;
  label: string;
  language: string;
  code: string;
};

const FRAMEWORK_META: Record<Framework, { label: string; language: string }> = {
  react: { label: "React", language: "tsx" },
  vue: { label: "Vue", language: "vue" },
  angular: { label: "Angular", language: "typescript" },
};

export function renderPreviews(entry: RegistryEntry): FrameworkPreview[] {
  const frameworks: Framework[] = ["react", "vue", "angular"];
  return frameworks.map((framework) => ({
    framework,
    label: FRAMEWORK_META[framework].label,
    language: FRAMEWORK_META[framework].language,
    code: renderIconForFramework(entry, framework),
  }));
}
