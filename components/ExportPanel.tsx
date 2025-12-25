"use client";

import { useState } from "react";
import { CloudUpload, Database, Download } from "lucide-react";
import { jsonToSql } from "@/app/utils/jsonToSql";

interface ExportPanelProps {
  generatedData: any[];
  targetUrl: string;
  setTargetUrl: (url: string) => void;
  onPush: () => void;
  isPushing: boolean;

}

export default function ExportPanel({
  generatedData,
  targetUrl,
  setTargetUrl,
  onPush,
  isPushing,
}: ExportPanelProps) {
  // Local state for this component (removes clutter from page.tsx)
  const [exportMode, setExportMode] = useState<'api' | 'sql' | 'download'>('api');
  const [tableName, setTableName] = useState("users");
  const[jsonName, setjsonName] = useState('mockdata');

  const handleDownloadSQL = () => {
    if (!generatedData || generatedData.length === 0) {
      alert("Generate some data first!");
      return;
    }
    const sqlContent = jsonToSql(generatedData, tableName);
    const blob = new Blob([sqlContent], { type: "application/sql" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tableName}_seed.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    if(!generatedData) return;

    const jsonString = JSON.stringify(generatedData, null, 2);
    const blob = new Blob([jsonString], { type : "application/json"});

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${jsonName}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 mb-6 backdrop-blur-sm">
      {/* Header and Toggle Switch */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Export Options
        </h3>

        <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700 ">
          <button
            onClick={() => setExportMode('api')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer active:scale-95 ${
              exportMode === 'api'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <CloudUpload className="w-3.5 h-3.5" />
            API Push
          </button>
          <button
            onClick={() => setExportMode('sql')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer active:scale-95 ${
              exportMode === 'sql'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            SQL Script
          </button>
          <button
            onClick={() => setExportMode('download')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer active:scale-95 ${
              exportMode === 'download'
                ? 'bg-orange-500/90 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5"/>
            Download
          </button>
        </div>
      </div>

      {/* Input Fields */}
      <div className="flex gap-2">
        {exportMode === 'api' ? (
          <input
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="target API endpoint URL"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
          />
        ) : (exportMode === 'sql' ? (
          <div className="flex-1 relative">
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Enter table name"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-3 pr-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span className="absolute right-3 top-2.5 text-xs text-gray-500 pointer-events-none">
              .sql
            </span>
          </div>
        ): (
            <div className="flex-1 relative">
            <input
              type="text"
              value={jsonName}
              onChange={(e) => setjsonName(e.target.value)}
              placeholder="Enter file name"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-3 pr-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span className="absolute right-3 top-2.5 text-xs text-gray-500 pointer-events-none">
              .json
            </span>
          </div>
        ))}

        {/* push /export/dowload buttons */}
        {exportMode === 'api' ? (
          <button
            onClick={onPush}
            disabled={isPushing || !generatedData}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 min-w-[100px] justify-center cursor-pointer"
          >
            {isPushing ? 'Pushing...' : 'Push'}
          </button>
        ) : ( exportMode === 'sql' ? (
          <button
            onClick={handleDownloadSQL}
            disabled={!generatedData}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 min-w-[100px] justify-center cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        ): (
            <button
            onClick={handleDownloadJSON}
            disabled={!generatedData}
            className="bg-orange-500/90 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 min-w-[100px] justify-center cursor-pointer"
          >
            <Download className="w-4 h-4" />
            download
          </button>
        ))}
      </div>
      
      <p className="mt-2 text-xs text-gray-500">
        {exportMode === 'api' 
          ? "Sends a POST request with the JSON array to your endpoint." 
          :exportMode === 'sql'? "Generates an SQL INSERT script compatible with PostgreSQL & MySQL." :
          "download the generated json file"}
      </p>
    </div>
  );
}