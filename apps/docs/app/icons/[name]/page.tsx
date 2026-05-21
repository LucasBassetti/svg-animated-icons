import { renderPreviews } from "@/lib/code-preview";
import { highlight } from "@/lib/highlight";
import { listIcons, readIcon } from "@/lib/registry";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconCodeSection, type Preview } from "./icon-code-section";
import { IconShowcase } from "./icon-showcase";

type Params = { name: string };

export async function generateStaticParams(): Promise<Params[]> {
  const icons = await listIcons();
  return icons.map((i) => ({ name: i.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { name } = await params;
  return {
    icons: { icon: `/api/icon/${name}` },
  };
}

export default async function IconPage({ params }: { params: Promise<Params> }) {
  const { name } = await params;
  let icon: Awaited<ReturnType<typeof readIcon>>;
  try {
    icon = await readIcon(name);
  } catch {
    notFound();
  }

  const [copyIcon, checkIcon] = await Promise.all([readIcon("copy"), readIcon("check")]);

  const rawPreviews = renderPreviews(icon);
  const previews: Preview[] = await Promise.all(
    rawPreviews.map(async (p) => ({
      framework: p.framework,
      label: p.label,
      code: p.code,
      html: await highlight(p.code, p.language),
    })),
  );

  return (
    <main className="container">
      <p>
        <Link href="/">← Back</Link>
      </p>
      <h1>{icon.meta.displayName}</h1>
      {icon.meta.description ? <p className="lead">{icon.meta.description}</p> : null}

      <IconShowcase svg={icon.svg} css={icon.css} />

      <IconCodeSection
        iconName={icon.name}
        previews={previews}
        copyIcon={{ svg: copyIcon.svg, css: copyIcon.css }}
        checkIcon={{ svg: checkIcon.svg, css: checkIcon.css }}
      />
    </main>
  );
}
