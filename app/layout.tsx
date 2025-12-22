import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JSON Schema Builder",
  description: "A dynamic form builder for JSON schemas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/*Navbar for the App */}
        <nav className="bg-white dark:bg-neutral-800/90 dark:backdrop-blur-md border-b border-neutral-200 dark:border-neutral-600 px-6 py-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              PA
            </div>
            <span className="font-sans text-gray-700 dark:text-zinc-200 font-bold">Fake Data Generator</span>
          </div>
          <div className="flex gap-3 items-center justify-between">
            <ThemeToggle/>
          <div className="text-sm text-gray-500 pt-2">v1.0</div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}