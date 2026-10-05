import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Spaceport Bazaar",
  description: "Operator dashboard for a Bazaar protocol run.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <nav className="site-nav" aria-label="Dashboard">
          <Link href="/live" className="brand">Spaceport Bazaar</Link>
          <Link href="/live">Live</Link>
          <Link href="/runs">Runs</Link>
          <Link href="/">Database mirror</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
