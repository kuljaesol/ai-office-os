import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SANOOK AI OS — AI Workforce Command Center",
  description: "ศูนย์บัญชาการพนักงาน AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="bg-ink text-slate-100 antialiased">{children}</body>
    </html>
  );
}
