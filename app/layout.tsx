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
      <body className={`${inter.className} bg-gray dark:bg-black transition-colors duration-300`}>
        <script // react takes time to render and produce white flash in dark mode
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

                  if (storedTheme === 'dark' || (!storedTheme && systemTheme)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
        {/*Navbar for the App */}
        <nav className="bg-white dark:bg-neutral-800/90 dark:backdrop-blur-md border-b border-neutral-200 dark:border-neutral-600 px-6 py-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="flex items-center select-none cursor-pointer" >
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight">
                Syn
              </span>
              <span className="text-2xl font-semibold text-gray-500 tracking-wide">
                  tara
              </span>
            </div>
          </div>
          <div className="flex gap-3 px-4 items-center justify-between">
            <ThemeToggle/>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}