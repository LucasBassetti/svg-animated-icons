"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { RegistryEntry } from "@/lib/registry";
import { type IconAsset, IconCardActions } from "./icon-card-actions";
import { IconPreview } from "./icons/[name]/icon-preview";
import { InstallSection } from "./install-section";

type Framework = "react" | "vue" | "angular";

type Props = {
  icons: RegistryEntry[];
  copyIcon: IconAsset;
  checkIcon: IconAsset;
  codeIcon: IconAsset;
  downloadIcon: IconAsset;
};

export function HomeView({
  icons,
  copyIcon,
  checkIcon,
  codeIcon,
  downloadIcon,
}: Props) {
  const [framework, setFramework] = useState<Framework>("react");
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(icons, {
        keys: [
          { name: "name", weight: 2 },
          { name: "meta.displayName", weight: 2 },
          { name: "meta.aliases", weight: 1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [icons],
  );

  const trimmed = query.trim();
  const visible = trimmed === "" ? icons : fuse.search(trimmed).map((r) => r.item);

  return (
    <>
      <InstallSection
        framework={framework}
        onFrameworkChange={setFramework}
        copyIcon={copyIcon}
        checkIcon={checkIcon}
      />

      <h2>Icons</h2>

      <input
        type="search"
        className="search-input"
        placeholder={`Search ${icons.length} icons — try "delete" or "settings"`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search icons"
      />

      {visible.length === 0 ? (
        <p className="lead">No icons match "{trimmed}".</p>
      ) : (
        <div className="grid">
          {visible.map((icon) => (
            <div key={icon.name} className="card">
              <Link href={`/icons/${icon.name}`} className="card-link icon-hover-trigger">
                <div className="preview">
                  <IconPreview svg={icon.svg} css={icon.css} />
                </div>
                <span className="card-name">{icon.meta.displayName}</span>
              </Link>
              <IconCardActions
                icon={icon}
                framework={framework}
                copyIcon={copyIcon}
                checkIcon={checkIcon}
                codeIcon={codeIcon}
                downloadIcon={downloadIcon}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
