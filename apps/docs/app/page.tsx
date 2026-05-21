import { listIcons, readIcon } from "@/lib/registry";
import { HomeView } from "./home-view";

export default async function Home() {
  const [icons, copyIcon, checkIcon, codeIcon, downloadIcon] = await Promise.all([
    listIcons(),
    readIcon("copy"),
    readIcon("check"),
    readIcon("code"),
    readIcon("download"),
  ]);

  return (
    <main className="container">
      <h1>Animated SVG icons</h1>
      <p className="lead">
        Animated SVG icons you copy into your project. No runtime dependency — the CLI writes
        framework-specific component source into your repo, shadcn-style.
      </p>

      <HomeView
        icons={icons}
        copyIcon={{ svg: copyIcon.svg, css: copyIcon.css }}
        checkIcon={{ svg: checkIcon.svg, css: checkIcon.css }}
        codeIcon={{ svg: codeIcon.svg, css: codeIcon.css }}
        downloadIcon={{ svg: downloadIcon.svg, css: downloadIcon.css }}
      />
    </main>
  );
}
