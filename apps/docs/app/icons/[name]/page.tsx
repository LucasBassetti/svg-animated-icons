import { listIcons, readIcon } from "@/lib/registry";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconShowcase } from "./icon-showcase";

type Params = { name: string };

export async function generateStaticParams(): Promise<Params[]> {
  const icons = await listIcons();
  return icons.map((i) => ({ name: i.name }));
}

export default async function IconPage({ params }: { params: Promise<Params> }) {
  const { name } = await params;
  let icon: Awaited<ReturnType<typeof readIcon>>;
  try {
    icon = await readIcon(name);
  } catch {
    notFound();
  }

  return (
    <main className="container">
      <p>
        <Link href="/">← Back</Link>
      </p>
      <h1>{icon.meta.displayName}</h1>
      {icon.meta.description ? <p className="lead">{icon.meta.description}</p> : null}

      <IconShowcase svg={icon.svg} css={icon.css} />

      <h2>Install</h2>
      <pre className="code">{`npx @svg-animated-icons/cli add ${icon.name} --react`}</pre>
    </main>
  );
}
