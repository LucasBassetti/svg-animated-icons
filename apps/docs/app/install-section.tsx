"use client";

import { useState } from "react";
import { CopyButton } from "./icons/[name]/copy-button";

type Framework = "react" | "vue" | "angular";
type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

type IconAsset = { svg: string; css: string };

type Props = {
  framework: Framework;
  onFrameworkChange: (framework: Framework) => void;
  copyIcon: IconAsset;
  checkIcon: IconAsset;
};

const FRAMEWORK_LABELS: Record<Framework, string> = {
  react: "React",
  vue: "Vue",
  angular: "Angular",
};

const FRAMEWORK_ORDER: Framework[] = ["react", "vue", "angular"];

const PM_INSTALL_PREFIX: Record<PackageManager, string> = {
  npm: "npm install",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add",
};

const PM_ORDER: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

export function InstallSection({ framework, onFrameworkChange, copyIcon, checkIcon }: Props) {
  const [pm, setPm] = useState<PackageManager>("npm");
  const installCommand = `${PM_INSTALL_PREFIX[pm]} @svg-animated-icons/${framework}`;

  return (
    <>
      <div className="framework-tabs" role="tablist" aria-label="Framework">
        {FRAMEWORK_ORDER.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={f === framework}
            className={`framework-tab${f === framework ? " active" : ""}`}
            onClick={() => onFrameworkChange(f)}
          >
            {FRAMEWORK_LABELS[f]}
          </button>
        ))}
      </div>

      <h2>Install</h2>
      <div className="code-card">
        <div className="code-card-header">
          <div className="pm-tabs" role="tablist" aria-label="Package manager">
            {PM_ORDER.map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={key === pm}
                className={`pm-tab${key === pm ? " active" : ""}`}
                onClick={() => setPm(key)}
              >
                {key}
              </button>
            ))}
          </div>
          <CopyButton text={installCommand} copyIcon={copyIcon} checkIcon={checkIcon} />
        </div>
        <pre className="code-card-body plain">
          <code>{installCommand}</code>
        </pre>
      </div>
    </>
  );
}
