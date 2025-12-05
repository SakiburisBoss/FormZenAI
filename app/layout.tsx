import NavbarServer from "@/components/nav/NavServer";
import { Toaster } from "@/components/ui/sonner";
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
        <header>
          <NavbarServer />
        </header>
        <main className="pt-16">{children}</main>
        <footer>
          <div className="w-full h-20 border-t flex items-center justify-center">
            <p className="text-sm text-gray-500">
              &copy; 2025 Form Zen AI. All rights reserved. Created by Sakibur.
            </p>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
