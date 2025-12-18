import Session from "@/components/auth/Session";
import NavbarServer from "@/components/nav/NavServer";
import Footer from "@/components/section/footer";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
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
  title: "Form Zen AI - AI-Powered Form Builder",
  description:
    "Create, publish, and manage smart forms with AI. Build professional forms instantly, collect responses, and share with ease.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Session />
        </Suspense>
        <header>
          <NavbarServer />
        </header>
        <main className="pt-16">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
