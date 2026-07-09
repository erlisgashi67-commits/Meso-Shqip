import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mëso Shqip🦅 — Mëso gjuhën shqipe",
  description:
    "Platforma edukative interaktive për mësimin e gjuhës shqipe për fëmijët e diasporës shqiptare. Mësime, ushtrime, progres, certifikata dhe AI.",
  keywords: [
    "Mëso Shqip",
    "Albanian language",
    "shqip",
    "diaspora shqiptare",
    "learn Albanian",
    "Albanisch lernen",
    "imparare l'albanese",
    "apprendre l'albanais",
    "aprender albanés",
  ],
  authors: [{ name: "Mëso Shqip" }],
  openGraph: {
    title: "Mëso Shqip🦅",
    description: "Mëso gjuhën shqipe në një mënyrë të re dhe interaktive.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sq" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
