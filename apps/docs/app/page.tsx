import { listIcons } from "@/lib/registry";
import { IconGrid } from "./icon-grid";

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
      <IconGrid icons={icons} />
    </main>
  );
}
