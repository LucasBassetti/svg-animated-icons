import { listIcons } from "@/lib/registry";
import Link from "next/link";
import { IconPreview } from "./icons/[name]/icon-preview";

export default async function Home() {
  const icons = await listIcons();
  return (
    <main className="container">
      <h1>svg-animated-icons</h1>
      <p className="lead">
        Animated SVG icons you copy into your project. No runtime dependency — the CLI writes
        framework-specific component source into your repo, shadcn-style.
      </p>

      <pre className="code">npx @svg-animated-icons/cli add accessibility --react</pre>

      <h2>Icons ({icons.length})</h2>
      <div className="grid">
        {icons.map((icon) => (
          <Link key={icon.name} href={`/icons/${icon.name}`} className="card icon-hover-trigger">
            <div className="preview">
              <IconPreview svg={icon.svg} css={icon.css} />
            </div>
            <span className="card-name">{icon.meta.displayName}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
