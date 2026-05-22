"use client";

import { useEffect, useState } from "react";
import { IconPreview } from "./icons/[name]/icon-preview";

type IconPayload = { svg: string; css: string };
type Theme = "light" | "dark";

export function ThemeToggle({
  sunIcon,
  moonIcon,
}: {
  sunIcon: IconPayload;
  moonIcon: IconPayload;
}) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const initial =
      (document.documentElement.dataset.theme as Theme | undefined) ?? "dark";
    setTheme(initial);
  }, []);

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

  const isLight = theme === "light";
  const icon = isLight ? moonIcon : sunIcon;
  const label = isLight ? "Switch to dark theme" : "Switch to light theme";

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle icon-hover-trigger"
      aria-label={label}
      suppressHydrationWarning
    >
      {theme === null ? (
        <span style={{ width: "1em", height: "1em" }} aria-hidden />
      ) : (
        <IconPreview svg={icon.svg} css={icon.css} />
      )}
    </button>
  );
}
