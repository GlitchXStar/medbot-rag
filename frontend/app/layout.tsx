import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MedBot AI — AI-Powered Medical Intelligence",
  description:
    "Ask medical questions and receive evidence-backed answers powered by RAG and trusted medical knowledge retrieval. Built for clinical reliability.",
  keywords: [
    "medical AI",
    "healthcare AI",
    "RAG",
    "medical assistant",
    "evidence-based medicine",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
