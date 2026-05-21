import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "@svg-animated-icons",
  description: "Animated SVG icons you copy into your project — shadcn-style.",
  icons: { icon: "/api/favicon" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
