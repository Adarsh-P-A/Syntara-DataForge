"use client";

import { Sparkles } from "lucide-react";

interface BannerProps {
    onScrollClick: () => void;
}

export default function HelperBanner ({onScrollClick}: BannerProps) {
    return (
        <div className="text-center">
        <div
        onClick={onScrollClick}
        title="Ready-made templates"
        className="inline-flex bg-gradient-to-r from-gray-400 to-gray-700  text-blue-50 text-sm font-medium py-1 px-3 text-center rounded-2xl cursor-pointer hover:opacity-90 transition-opacity"
        >
            
                <Sparkles size={16} className="animate-pulse text-yellow-300"/>
                <span>Explore templates</span>
        </div>
        </div>
    );
}