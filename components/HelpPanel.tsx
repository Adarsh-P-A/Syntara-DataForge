"use client";


import {X, BookOpen, Database, Code, UploadCloud} from "lucide-react"

interface HelpPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HelpPanel({isOpen, onClose}: HelpPanelProps) {
    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
                onClick={onClose}
                >
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-gray-300 dark:bg-gray-900 border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                    
            </div>
            </div>
        </>
    )
}