"use client";

import { useState } from "react";
import { IconPreview } from "./icon-preview";

type IconAsset = { svg: string; css: string };

type Props = {
  text: string;
  copyIcon: IconAsset;
  checkIcon: IconAsset;
};

export function CopyButton({ text, copyIcon, checkIcon }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable; silently fail
    }
  }

  const asset = copied ? checkIcon : copyIcon;

  return (
    <button
      type="button"
      className="code-copy icon-hover-trigger"
      onClick={handleClick}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      <IconPreview svg={asset.svg} css={asset.css} />
    </button>
  );
}
