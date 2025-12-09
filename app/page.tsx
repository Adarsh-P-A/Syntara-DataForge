"use client";
import {useState} from 'react';
import FieldEditor from '../components/fieldEditor';

interface SchemaField {
  keyName: string;
  type: string;
}

export default function Home() {
  const [fields, setFields] = useState<SchemaField[]>([]); // State to hold the list of schema fields

  const handleNewField = (newField: SchemaField) => {
    setFields((prev) => [...prev, newField]);
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const schemaObject = fields.reduce((acc, field) => {
    acc[field.keyName] = field.type;
    return acc;
  }, {} as Record<string, string>);

  return (
    <main className="p-8 max-w-4xl mx-auto space-y-6 animate-fade-in duration-500">

      <h1 className="text-2xl font-bold mb-6">JSON Schema Builder</h1>
      
      {/*input session*/}
      <div className="bg-white p-6 rounded shadow-md border mb-8">
        <h2 className="text-lg font-semibold mb-4">Add new Field</h2>
        <FieldEditor onAddField={handleNewField}/>
      </div>
      {/*display session*/}
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
                <span className="text-green-600 badge bg-gray-100 px-2 py-1 rounded text-sm">{field.type}</span>
              </div>
              <button 
                onClick={() => removeField(index)}
                className="text-red-500 hover:underline hover:text-red-700 text-sm"
              >
                Remove
              </button>
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
      </div>
    </main>
  );
}
