"use client";

import { useEffect } from "react";
import {X, BookOpen, Database, Code, UploadCloud} from "lucide-react"

interface HelpPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HelpPanel({isOpen, onClose}: HelpPanelProps) {
    useEffect(()=> { // avoid background scrolling when help panel is open
        if(isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
                onClick={onClose}
            />
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] rounded-l-2xl bg-gray-300 dark:bg-gray-900 border-gray-800 shadow-2xl z-50 transform transition-transform  duration-500 ease-in-out overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full custom-scrollbar"}`}>
                    <div className="flex items-center justify-between mb-8 px-2 pt-2 pb-1 bg-gray-300 sticky top-0 backdrop-blur-lg border-white">
                        <h2 className="flex items-center gap-2 font-bold text-neutral-500 text-xl">
                            <BookOpen className="w-5 h-5 text-gray-500" />
                        About Syntara
                        </h2>
                        <button className="p-2 rounded-full text-gray-400 hover:text-red-600
                        transition-colors cursor-pointer">
                            <X className="w-5 h-5" onClick={onClose} />
                        </button>
                    </div>
                    <div className="space-y-8 pl-4">
                        
                        <section>
                            <h3 className="text-sm font-semibold text-blue-400 uppercase mb-2 tracking-wider">
                                1. What does Syntara do ?
                            </h3>
                            <p className="text-gray-500 text-sm mb-3">Syntara eases the task of manually writing fake data to test applications under construction by Generating a huge amount of fake data and provides it as SQL script to seed your database.</p>
                            <h3 className="text-sm font-semibold text-blue-400 uppercase mb-2 tracking-wider">
                                2. How to use Syntara?
                            </h3>
                            <h3 className="text-gray-500 text-sm font-semibold mb-2">
                                a) Use the predefined templates
                            </h3>
                            <p className="text-gray-500 text-sm mb-3">
                                    Select any of the predefined templates and customize it using the edit option. Give the number of fake data needed in the box near <b>Generate</b> button and generate
                                </p>
                            <h3 className="text-gray-500 text-sm font-semibold mb-2">
                                b) Design your own schema
                            </h3>
                            <p className="text-gray-500 text-sm mb-3">
                                    Before designing a schema, take a look at the key features of Syntara
                                </p>
                                <ul className="list-disc pl-6 text-gray-500 text-sm font-semibold">
                                    <li className="mb-2">
                                        Strings can be defined as required using choices and Regex patterns

                                    </li>
                                    <li className="mb-2">
                                        Constraints can be given to numerical values like integer and float
                                    </li>
                                    <li className="mb-2">
                                        Nested objects can be defined for complex data
                                    </li>
                                    <li className="mb-2">
                                        Arrays can be defined if a field can contain multiple values
                                    </li>
                                </ul>
                            <h3 className="text-gray-500 text-sm font-semibold mb-2">
                                c) Upload your schema
                            </h3>
                            <p className="text-gray-500 text-sm mb-3">
                                    If you already have a JSON schema, just upload it and click <b>Generate</b>
                                </p>
                            <h3 className="text-sm font-semibold text-blue-400 uppercase mb-2 tracking-wider">
                                2. How to Export the generated data ?
                            </h3>
                            <p className="text-gray-500 text-sm mb-3">
                                There are 3 ways to export the data
                            </p>
                            <h3 className="text-gray-500 text-sm font-semibold mb-2">
                                a) API push
                            </h3>
                            <p className="text-gray-500 text-sm mb-3">
                                Syntara can as a generic HTTP Client (like Postman). It sends your generated mock data directly to your running backend server or database via a POST request.<br/>
                                <b>Note:</b> Ensure your backend has <code className="bg-gray-200 rounded">CORS</code> enabled to accept requests from this origin.
                            </p>
                            <h3 className="text-gray-500 text-sm font-semibold mb-2">
                                a) SQL script
                            </h3>
                            <p className="text-gray-500 text-sm mb-3">
                                Download the SQL script and run it on your database. It will seed database with the generated data
                            </p>
                            <h3 className="text-gray-500 text-sm font-semibold mb-2">
                                a) Download JSON
                            </h3>
                            <p className="text-gray-500 text-sm mb-3">
                                Download it as a JSON file
                            </p>
                        </section>
                    </div>
            </div>
        </>
    )
}