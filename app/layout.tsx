import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "myDE - AIM-Themed IDE",
  description: "A fully customizable IDE powered by V0 SDK, styled after AOL Instant Messenger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
