"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { User } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserButton } from "../auth/UserButton";

export default function Navbar({ user }: { user: User | null | undefined }) {
  const isAuthenticated = Boolean(user && user.isAnonymous === false);
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: "/forms", label: "Forms" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="w-full fixed top-0 left-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 dark:from-violet-500/20 dark:via-purple-500/20 dark:to-fuchsia-500/20 animate-gradient-x"></div>

      <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b-2 border-transparent bg-clip-padding"></div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x"></div>

      <div className="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2 text-2xl font-extrabold"
        >
          <div className="relative">
            <Sparkles className="w-6 h-6 text-purple-500 dark:text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 bg-purple-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          </div>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-300 animate-gradient-x bg-[length:200%_auto]">
            FormZenAI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden group",
                pathname === link.href
                  ? "text-white shadow-lg shadow-purple-500/50 dark:shadow-purple-500/30"
                  : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:shadow-lg hover:scale-105",
              )}
            >
              {pathname === link.href && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x bg-[length:200%_auto]"></div>
              )}

              {pathname !== link.href && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div
                    className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  ></div>
                </>
              )}

              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}

          {!isAuthenticated && (
            <Link
              href="/auth"
              className="relative px-6 py-2.5 rounded-xl font-bold text-white overflow-hidden group shadow-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 group-hover:from-green-600 group-hover:via-emerald-600 group-hover:to-teal-600 animate-gradient-x bg-[length:200%_auto]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                Sign In
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </Link>
          )}

          {isAuthenticated && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-75 blur transition-opacity duration-300"></div>
              <div className="relative">
                <UserButton callbackURL={pathname} user={user ?? undefined} />
              </div>
            </div>
          )}
        </div>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={22} className="text-purple-600 dark:text-purple-400" />
              ) : (
                <Menu
                  size={22}
                  className="text-purple-600 dark:text-purple-400"
                />
              )}
            </Button>
          </SheetTrigger>

          {/* Mobile Menu */}
          <SheetContent
            side="left"
            className="w-80 p-6 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-r-2 border-purple-500/20"
          >
            <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>

            {/* Mobile menu header */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Menu
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "relative px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden group",
                    pathname === link.href
                      ? "text-white shadow-lg shadow-purple-500/50"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:shadow-md hover:scale-102",
                  )}
                >
                  {pathname === link.href && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x bg-[length:200%_auto]"></div>
                  )}

                  {pathname !== link.href && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}

                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}

              {!isAuthenticated && (
                <Link
                  href="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="relative mt-2 px-5 py-3.5 rounded-xl font-bold text-center text-white overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 group-hover:from-green-600 group-hover:via-emerald-600 group-hover:to-teal-600 animate-gradient-x bg-[length:200%_auto]"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Sign In
                    <Sparkles className="w-4 h-4" />
                  </span>
                </Link>
              )}

              {isAuthenticated && (
                <div className="px-2 pt-4 mt-2 border-t-2 border-purple-500/20">
                  <UserButton callbackURL={pathname} user={user ?? undefined} />
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </nav>
  );
}
