"use client";

import { useState } from "react";
import { InstallSection } from "@/app/install-section";
import { CopyButton } from "./copy-button";

type Framework = "react" | "vue" | "angular";

type IconAsset = { svg: string; css: string };

export type Preview = {
  framework: Framework;
  label: string;
  code: string;
  html: string;
};

type Props = {
  iconName: string;
  previews: Preview[];
  copyIcon: IconAsset;
  checkIcon: IconAsset;
};

export function IconCodeSection({ iconName, previews, copyIcon, checkIcon }: Props) {
  const [framework, setFramework] = useState<Framework>("react");

  const active = previews.find((p) => p.framework === framework) ?? previews[0];
  if (!active) return null;

  const cliCommand = `npx @svg-animated-icons/cli add ${iconName} --${framework}`;

  return (
    <div className="icon-tabs">
      <InstallSection
        framework={framework}
        onFrameworkChange={setFramework}
        copyIcon={copyIcon}
        checkIcon={checkIcon}
      />

      <h2>Or copy the component with the CLI</h2>
      <div className="code-card">
        <div className="code-card-header">
          <span className="code-card-label">CLI</span>
          <CopyButton text={cliCommand} copyIcon={copyIcon} checkIcon={checkIcon} />
        </div>
        <pre className="code-card-body plain">
          <code>{cliCommand}</code>
        </pre>
      </div>

      <h2>Code</h2>
      <div className="code-card">
        <div className="code-card-header">
          <span className="code-card-label">{active.label}</span>
          <CopyButton text={active.code} copyIcon={copyIcon} checkIcon={checkIcon} />
        </div>
        <div
          className="code-card-body shiki-wrap"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is built from our own template strings server-side
          dangerouslySetInnerHTML={{ __html: active.html }}
        />
      </div>
    </div>
  );
}
