import {Info} from "lucide-react";

interface InfoTooltip {
    text: string;
}

export default function InfoTooltip({text}: InfoTooltip) {
    return (
        <div className="relative flex items-center group z-10 px-2">
            <Info size={20} className ="text-gray-400 hover:text-blue-500 cursor-help transition-colors"/>

            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs">
        
                <div className="bg-yellow-100 dark:bg-black text-xs rounded py-1 px-2 shadow-lg text-center">
                    {text}
                </div>
      </div>
            
        </div>
    )
}