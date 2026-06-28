"use client";

import { useState } from "react";
import { IconPreview } from "./icons/[name]/icon-preview";

type IconPayload = { svg: string; css: string };
type Theme = "light" | "dark";

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return (document.documentElement.dataset.theme as Theme | undefined) ?? "dark";
}

export function ThemeToggle({
  sunIcon,
  moonIcon,
}: {
  sunIcon: IconPayload;
  moonIcon: IconPayload;
}) {
  const [theme, setTheme] = useState<Theme>(readTheme);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;
    root.classList.add("theme-transitioning");
    root.dataset.theme = next;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("theme-transitioning");
      });
    });
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  }

  const label =
    theme === "light" ? "Switch to dark theme" : "Switch to light theme";

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle icon-hover-trigger"
      aria-label={label}
      suppressHydrationWarning
    >
      {/* Both icons render server-side; CSS shows the one matching
          html[data-theme], set before paint by the theme init script.
          Avoids first-render flicker and hydration mismatch. */}
      <span className="theme-toggle-icon theme-toggle-icon--sun">
        <IconPreview svg={sunIcon.svg} css={sunIcon.css} />
      </span>
      <span className="theme-toggle-icon theme-toggle-icon--moon">
        <IconPreview svg={moonIcon.svg} css={moonIcon.css} />
      </span>
    </button>
  );
}
