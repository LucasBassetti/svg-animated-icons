import Link from "next/link";
import { readIcon } from "@/lib/registry";
import { IconPreview } from "./icons/[name]/icon-preview";

const REPO = "LucasBassetti/svg-animated-icons";
const STAR_REVALIDATE_SECONDS = 3600;

async function fetchStarCount(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      next: { revalidate: STAR_REVALIDATE_SECONDS },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}

function formatStars(count: number): string {
  if (count < 1000) return count.toString();
  return `${(count / 1000).toFixed(1)}k`;
}

export async function SiteHeader() {
  const [githubIcon, starIcon, stars] = await Promise.all([
    readIcon("github-logo"),
    readIcon("star"),
    fetchStarCount(),
  ]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand">
          @svg-animated-icons
        </Link>
        <a
          href={`https://github.com/${REPO}`}
          target="_blank"
          rel="noopener noreferrer"
          className="site-github icon-hover-trigger"
          aria-label="Star on GitHub"
        >
          <span className="site-github-logo">
            <IconPreview svg={githubIcon.svg} css={githubIcon.css} />
          </span>
          {stars !== null ? (
            <>
              <span className="site-github-star">
                <IconPreview svg={starIcon.svg} css={starIcon.css} />
              </span>
              <span className="site-github-count">{formatStars(stars)}</span>
            </>
          ) : null}
        </a>
      </div>
    </header>
  );
}
