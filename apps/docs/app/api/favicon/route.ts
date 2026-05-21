import { NextResponse } from "next/server";
import { readIcon, readIconIndex } from "@/lib/registry";
import { withFaviconTheme } from "@/lib/themed-favicon";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const index = await readIconIndex();
  if (index.length === 0) {
    return new NextResponse("No icons", { status: 404 });
  }
  const pick = index[Math.floor(Math.random() * index.length)];
  if (!pick) {
    return new NextResponse("No icons", { status: 404 });
  }
  const entry = await readIcon(pick.name);
  return new NextResponse(withFaviconTheme(entry.svg), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}
