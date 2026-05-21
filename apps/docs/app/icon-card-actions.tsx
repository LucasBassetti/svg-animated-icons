"use client";

import { useState } from "react";
import type { RegistryEntry } from "@/lib/registry";
import { IconPreview } from "./icons/[name]/icon-preview";

export type IconAsset = { svg: string; css: string };

type Framework = "react" | "vue" | "angular";

type Props = {
  icon: RegistryEntry;
  framework: Framework;
  copyIcon: IconAsset;
  checkIcon: IconAsset;
  codeIcon: IconAsset;
  downloadIcon: IconAsset;
};

const DONE_RESET_MS = 1200;

export function IconCardActions({
  icon,
  framework,
  copyIcon,
  checkIcon,
  codeIcon,
  downloadIcon,
}: Props) {
  const cliCommand = `npx @svg-animated-icons/cli add ${icon.name} --${framework}`;

  return (
    <div className="card-actions">
      <CardActionButton
        tooltip={`Copy npx command (${framework})`}
        idle={codeIcon}
        done={checkIcon}
        action={() => copyToClipboard(cliCommand)}
      />
      <CardActionButton
        tooltip="Copy SVG"
        idle={copyIcon}
        done={checkIcon}
        action={() => copyToClipboard(icon.svg)}
      />
      <CardActionButton
        tooltip="Download SVG"
        idle={downloadIcon}
        done={checkIcon}
        action={() => downloadSvg(icon.name, icon.svg)}
      />
    </div>
  );
}

type ButtonProps = {
  tooltip: string;
  idle: IconAsset;
  done: IconAsset;
  action: () => Promise<void> | void;
};

function CardActionButton({ tooltip, idle, done, action }: ButtonProps) {
  const [finished, setFinished] = useState(false);

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    try {
      await action();
      setFinished(true);
      setTimeout(() => setFinished(false), DONE_RESET_MS);
    } catch {
      // ignore — clipboard or download may be denied by the user agent
    }
  }

  const asset = finished ? done : idle;

  return (
    <button
      type="button"
      className="card-action icon-hover-trigger"
      onClick={handleClick}
      data-tooltip={tooltip}
      aria-label={tooltip}
    >
      <IconPreview svg={asset.svg} css={asset.css} />
    </button>
  );
}

async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

function downloadSvg(name: string, svg: string): void {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
