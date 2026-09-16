import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Spaceport Bazaar",
  description: "Operator dashboard for a Bazaar protocol run.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
