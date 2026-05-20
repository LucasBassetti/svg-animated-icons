"use client";

import { useState } from "react";
import { IconPreview } from "./icon-preview";

type Props = {
  svg: string;
  css: string;
};

export function IconShowcase({ svg, css }: Props) {
  const [disableHover, setDisableHover] = useState(false);

  return (
    <>
      <div className="preview-large icon-hover-trigger">
        <IconPreview svg={svg} css={css} disableHover={disableHover} />
      </div>
      <p style={{ marginTop: 16 }}>
        <label className="toggle">
          <input
            type="checkbox"
            checked={disableHover}
            onChange={(e) => setDisableHover(e.target.checked)}
          />
          Disable hover animation
        </label>
      </p>
    </>
  );
}
