import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JobPilot AI",
  description: "AI job application copilot"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
