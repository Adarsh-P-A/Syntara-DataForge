import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body className={inter.className}>
        {/*Navbar for the App */}
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              PA
            </div>
            <span className="font-sans text-gray-700 font-bold">Fake Data Generator</span>
          </div>
          <div className="text-sm text-gray-500">v1.0</div>
        </nav>

        {children}
      </body>
    </html>
  );
}