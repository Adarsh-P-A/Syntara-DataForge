
"use client";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import HelpPanel from "./HelpPanel";
import { HelpCircle } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
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
                    <button
                    onClick={()=> setIsOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 hover-bg-gray-800 rounded-lg transition-all cursor-pointer"
                    >
                        <HelpCircle size={18}/>
                    </button>
                    <ThemeToggle/>
                  </div>
                </nav>
                <HelpPanel isOpen={isOpen} onClose={() => setIsOpen(false)}/>
            </>
    )
}