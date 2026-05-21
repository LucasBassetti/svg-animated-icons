import { readIcon } from "@/lib/registry";
import { IconPreview } from "./icons/[name]/icon-preview";

const AUTHOR_NAME = "Lucas Bassetti";
const AUTHOR_URL = "https://www.lucasbassetti.com/";

export async function SiteFooter() {
  const heart = await readIcon("heart-filled");

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span>Created with</span>
        <span className="site-footer-heart icon-hover-trigger">
          <IconPreview svg={heart.svg} css={heart.css} />
        </span>
        <span>by</span>
        <a
          href={AUTHOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="site-footer-author"
        >
          {AUTHOR_NAME}
        </a>
      </div>
    </footer>
  );
}
