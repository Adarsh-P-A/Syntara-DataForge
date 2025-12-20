"use client";
import {useState} from 'react';
import FieldEditor from '../components/fieldEditor';
import { JSONtoSchemaFields,generateSchema, SchemaField } from './utils/schemaUtils';
import {Copy, Check, Trash2, Edit2, X, Upload, RotateCcw, Send, Loader2, CheckCheck, AlertCircle, Link} from 'lucide-react';

export default function Home() {
  const [fields, setFields] = useState<SchemaField[]>([]); // State to hold the list of schema fields
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recordCount, setRecordCount] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const [targetURL, setTargetURL] = useState("");
  const [pushStatus, setPushstatus] = useState<"idle" | "sending" | "error" | "success">("idle");


  const handlePush = async () => {
    if(!targetURL || !generatedData) return;
    setPushstatus("sending");

    try {
      const res = await fetch('api/push', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            targetURL: targetURL,
            data: generatedData
          })
        }
      );
      const result = await res.json();

      if(result.success) {
        setPushstatus("success");
        setTimeout(() => setPushstatus("idle"), 3000)
      } else {
        console.error(result.error);
        setPushstatus("error");
        setTimeout(() => setPushstatus("idle"), 3000)
      }
    } catch(e) {
      setPushstatus("error");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
      const jsonContent = JSON.parse(e.target?.result as string);
      const convertedFields = JSONtoSchemaFields(jsonContent);
      setFields(convertedFields);
      event.target.value = ''; // Reset file input to allow re-uploading the same file
    }
    catch(error) {
      console.error("Invalid JSON file", error);
      alert("Failed to parse JSON file. Please ensure it is valid JSON.");  
    };
    
  };
  reader.readAsText(file);
};


  const handleNewField = (FieldData: SchemaField) => {
    if(editingIndex !== null) {
      setFields(prev => {
        const newFields = [...prev];
        newFields[editingIndex] = FieldData;
        return newFields;
      });
      setEditingIndex(null); //editing complete
    } 
    else {
      setFields((prev) => [...prev, FieldData]); // Add new
    }
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index); // set the editing index
  }

  const handleCancelEdit = () => {
    setEditingIndex(null); // cancel editing
  }

  const handleCopy = () => {
    if(!generatedData) return;
    navigator.clipboard.writeText(JSON.stringify(generatedData, null, 2));
    setIsCopied(true);
    setTimeout(()=> setIsCopied(false), 2000);
  }

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
    if(editingIndex !== null && index < editingIndex) {
      setEditingIndex(editingIndex - 1); // adjust editing index if we are removing while editing
    } else if (editingIndex === index) {
      setEditingIndex(null); // cancel editing if the editing field is removed
    }
  };

  const handleGenerateData = async () => {
    setIsGenerating(true);
    setGeneratedData(null); // clear previous result

    try {
      const cleanSchema = generateSchema(fields);
      const response = await fetch (
        '/api/generate', 
        {
          method : 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({schema: cleanSchema, count: recordCount})
      });
      const data = await response.json();
      setGeneratedData(data);
    } 
    catch (error) {
      alert("Error generating data!!!");
    }
    finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setFields([]);
    setRecordCount(1);
  }

{/*generateSchema is defined in schemaUtils*/}
  const schemaObject = generateSchema(fields);

  const showResults = !!generatedData || isGenerating;

  return (
    <div className='min-h-screen bg-gray-100 py-12 px-4 transition-colors duration-500'>
    <main className={`p-8 mx-auto transition-all duration-700 ease-in-out flex gap-8 ${showResults ? 'max-w-8xl' : 'max-w-4xl'}`}>
     
      {/*left column*/}
      <div className={`flex flex-col transition-all duration-500 ${showResults ? 'w-1/2' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">JSON Schema Builder</h1>
            <div className="relative group">
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                title="Upload JSON Schema File"
              />
              <button className="bg-gray-700 group-hover:bg-blue-900 text-white px-4 py-2 rounded shadow flex items-center gap-2 transition">
                <Upload size={18}/>
                <span>Upload JSON</span>
              </button>
            </div>
        </div>

        {/*input section*/}
        <div className="bg-white p-6 rounded shadow-md border mb-8">
          <h2 className="text-lg font-semibold mb-4 justify-between flex items-center">
            {editingIndex !== null ? "Edit Field" : "Add New Field"}
            {editingIndex !== null && <span className="text-sm text-blue-600 font-normal">Editing item #{editingIndex + 1}</span>}
          </h2>
          <FieldEditor 
              onAddField={handleNewField}
              initialData={editingIndex !== null ? (fields[editingIndex] as any): null}
              onCancel={handleCancelEdit as any}
          />
        </div>
        {/*display section*/}
        <div className="bg-gray-50 p-6 rounded border">
          <h2 className="text-lg font-semibold mb-4">Current Schema Fields</h2>
          {fields.length === 0 ? (<p className="text-gray-500">No fields added yet</p>)
          : (
            <div className="space-y-2">
              {fields.map((field, index) =>(
                <div key={index} className="flex justify-between items-center bg-white p-3 border rounded"> 
                  <div> 
                    <span className="font-mono font-bold text-blue-600">{field.keyName}</span>
                    <span className= "mx-2 text-gray-400">:</span>
                    <span className="text-green-600 badge bg-gray-100 px-2 py-1 rounded text-sm">
                      {field.type}{(field.type === 'object' || field.type === 'array') && `(${field.subFields?.length || 0} items)`}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleEditClick(index)}
                      className ="text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-90 cursor-pointer"
                      title = "Edit Field"
                      >
                      <Edit2 className="w-4 h-4"/>
                      </button>
                    <button 
                        onClick={() => removeField(index)}
                        className="text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all active-scale-90 cursor-pointer"
                        title="Remove Field">
                      <Trash2 className="w-4 h-4"/>
                      </button>
                  </div>
                </div>
              ))}
            </div>
          )}
            {/*JSON preview*/}
          <div className= "mt-8">
            <h3 className= "text-sm font-bold uppercase text-gray-500 mb-2">JSON Preview</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto">
              {JSON.stringify(schemaObject, null, 2)}
            </pre>
          </div>
          <div className="mt-6 pt-2 sticky bottom-0 gap-2 flex w-full justify-between">

              <div className="gap-2 flex justify-between">
                <button
                  onClick = {handleGenerateData}
                  disabled = { isGenerating || fields.length === 0}
                  className = "bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-3 cursor-pointer rounded-lg transition-all flex-none justify-center items-center gap-2 shadow-lg"
                >
                  {isGenerating ? (<><span>Generating</span></>):(<><span>Generate</span></>)}
                
                </button>
                <div className="flex flex-row gap-0">
                <span className="flex h-full items-center text-bold text-lg">#</span> 
                <input
                  type="number"
                  title = "Number of fake data needed"
                  min = "1"
                  value = {recordCount}
                  onChange = {(e) => setRecordCount(Number(e.target.value))}
                  className = "w-[8ch] py-2 bg-green-500 opacity-80 rounded-md text-center font-mono font-bold text-white focus:ring-2 focus:ring-green-800 outline-none"
                />
                </div>
              </div>

              {fields.length > 0 && (<button
                onClick = {resetForm}
                className="bg-red-500 hover:bg-red-700 text-white py-2 px-2 cursor-pointer rounded-lg transition-all flex justify-center items-center shadow-lg"
                >
                  <RotateCcw size={18}/>
                  <span className="px-2">Reset</span>
              </button>)}
          </div>
        </div>
      </div>


        {/*Right Column*/}
      <div className={`transition-all duration-700 rounded ease-in-out flex flex-col ${showResults ? 'w-1/2 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-20 overflow-hidden'}`}>
            
            <div className="sticky top-12 h-[calc(100vh-4rem)] flex flex-col relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-[#0d1117]">
              
              {/*Nav bar */}
              
              <div className="sticky flex top-0 left-0 right-0 h-14 bg-gray-800/50 backdrop-blur-md border-b border-white/5 justify-between items-center px-4 z-20 shrink-0">
                <div className="flex gap-4 items-center">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex text-white items-center p-4 text-md font-medium">Generated Data</div>
                </div>
                  <div className="flex items-center gap-4">
                  {generatedData && (
                      <button
                        onClick={handleCopy}
                        title = "Copy to clipboard"
                        className = {`group flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-md border text-xs font-medium transition-all duration-200
                            ${isCopied ? 'bg-green-500/20 border-green-500/50 text-green-400'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white active:scale-95'
                            }
                          `}>
                            <span>{isCopied ? 'Copied':'Copy'}</span>
                        {isCopied ? (<Check className='w-3.5 h-3.5'/>):(<Copy className='w-3.5 h-3.5'/>)}
                        
                        </button>
                    )}
                    <button
                      onClick={() => setGeneratedData(null)}
                      className = "p-1.5 text-gray-400 hover:bg-white/10 hover:text-red-400  cursor-pointer rounded-md transition-all active:scale-90"
                      title="Close Output"
                      >
                        <X className="w-4 h-4"/>
                    </button>
                    </div>
              </div>

                    <div className="bg-gray-800/50 border-b border-gray-700 p-2 flex gap-2 items-center backdrop-blur-sm z-20">
                    <div className="text-gray-500 text-xs font-mono font-bold">POST</div>
                      <input
                        type="text"
                        placeholder='target API endpoint URL'
                        value = {targetURL}
                        onChange={(e)=> setTargetURL(e.target.value)}
                        className="flex-grow bg-gray-900 border border-gray-700 rounded text-sm text-gray-300 px-3 py-1 focus:ring1 focus:ring-blue-500 outline-none font-mono placeholder:text-gray-600"
                      ></input>
                      <button
                        onClick = {handlePush}
                        disabled = {pushStatus === 'sending'}
                        className = {`
                          px-4 py-1.5 rounded text-xs font-bold text-white transition-all duration-500 flex items-center gap-2 cursor-pointer disabled-cursor-not-allowed
                          ${pushStatus === 'idle' ? 'bg-blue-600 hover:bg-blue-500':''}
                          ${pushStatus === 'sending' ? 'bg-blue-800 cursor-wait':''}
                          ${pushStatus === 'success' ? 'bg-green-600':''}
                          ${pushStatus ==='error' ? 'bg-red-600':''}
                          `}
                      >
                        {pushStatus === 'idle' && <> <Send size={18}/> Send</>}
                        {pushStatus === 'sending' && <><Loader2 size={14} className="animate-spin"/> Sending...</>}
                        {pushStatus === 'success' && <><Check size={14}/> Done</>}
                        {pushStatus === 'error' && <><span>⚠️</span> Failed</>}
                      </button>
                    </div>
               

                    {/*Generated content*/}
            <div className="flex-grow overflow-y-auto p-6 pt-8 custom-scrollbar">
              { isGenerating ? ( 
                        <div className="h-full flex flex-col items-center justify-center text-green-500/50 gap-4 space-y-4">
                          <div className="animate-spin text-4xl">⚙️</div>
                          <div className="animate-pulse">Generating fake data...</div>
                        </div>
                    ) : generatedData ? (
                        <pre className="font-mono text-pink-400 text-sm whitespace-pre-wrap leading-relaxed font-medium">
                            {JSON.stringify(generatedData, null, 2)}
                          </pre>
                        ): (
                            <div className="h-full flex flex-col text-gray-600 items-center italic-sm text-center justify-center mt-20">
                              Click "Generate" Button
                            </div>
                )}
              </div>
            </div>
      </div>
    </main>
    </div>
  );
}


