"use client";

import { useState, useEffect} from "react";
import {Moon, Sun} from "lucide-react";

export default function ThemeToggle () { //runs only once
    const [theme, setTheme] = useState<"light" | "dark">("light");
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === 'dark') {
            setTheme("dark");
            document.documentElement.classList.add("dark");
        } else {
            setTheme("light");
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        if(theme === "light") {
            setTheme("dark");
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            setTheme("light");
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }

    return (
        <button
            onClick={toggleTheme}
            className = "p-2 rounded-lg transition-all cursor-pointer active:scale-80 hover:bg-gray-300 hover:text-blue-500 dark:bg-gray-900 dark:text-gray-200 dark:hover:text-yellow-500 dark:hover:bg-black "
            title = {theme === 'light' ? 'Dark mode' : 'Light mode'}
        >
            {theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}
        </button>
    );
}

