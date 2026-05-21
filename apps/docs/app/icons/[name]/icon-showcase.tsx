"use client";

import { IconPreview } from "./icon-preview";

type Props = {
  svg: string;
  css: string;
};

export function IconShowcase({ svg, css }: Props) {
  return (
    <div className="preview-large icon-hover-trigger">
      <IconPreview svg={svg} css={css} />
    </div>
  );
}
