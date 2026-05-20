type Props = {
  svg: string;
  css: string;
  disableHover?: boolean;
};

function addContainerHoverTrigger(css: string): string {
  return css.replace(
    /(\.ai-[a-z0-9-]+-icon:not\(\.no-hover\)):hover/g,
    ":is($1:hover, .icon-hover-trigger:hover $1)",
  );
}

export function IconPreview({ svg, css, disableHover }: Props) {
  const finalSvg = disableHover
    ? svg.replace(/<svg([^>]*?)class="([^"]*)"/, '<svg$1class="$2 no-hover"')
    : svg;

  return (
    <>
      <style>{addContainerHoverTrigger(css)}</style>
      <span
        style={{ display: "inline-flex" }}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted local registry content
        dangerouslySetInnerHTML={{ __html: finalSvg }}
      />
    </>
  );
}
