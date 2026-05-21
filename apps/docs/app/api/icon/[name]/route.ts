import { NextResponse } from "next/server";
import { readIcon } from "@/lib/registry";
import { withFaviconTheme } from "@/lib/themed-favicon";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
): Promise<NextResponse> {
  const { name } = await params;
  try {
    const entry = await readIcon(name);
    return new NextResponse(withFaviconTheme(entry.svg), {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
