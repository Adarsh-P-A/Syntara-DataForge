"use client";


import {useState, useEffect} from 'react';
import { Settings2 } from 'lucide-react';
export default function FieldEditor({onAddField, initialData=null, onCancel=null}) {
    const [keyName, setKeyName] = useState('');
    const [type, setType] = useState('');
    const [subFields, setSubFields] = useState([]);
    const [editingSubFieldIndex, setEditingSubFieldIndex] = useState(null);
    const [constraints, setConstraints] = useState({min:'', max:'', choices:'', regex:''});
    const [showRules, setShowRules] = useState(false);

    const basicTypes = ['string', 'integer', 'float', 'boolean',
                        'name', 'email', 'phone', 'date', 
                        'image_url', 'file_url',
                        'uuid',
                        'age', 'address', 'city', 'country', 'zip_code', 'price', 'currency_code',
                        'paragraph', 'sentence',
                        'product_name', 'color',
                        'url', 'ip_address', 'user_name',
                        'word', 'future_date'];
        {/*Editing mode*/}
        useEffect(()=>{
            if(initialData) {
                setKeyName(initialData.keyName || '');
                setType(initialData.type || '');
                setSubFields(initialData.subFields || []);
                setConstraints(initialData.constraints || {min:'', max:'', choices:''})
            } 
            else {
                resetForm();
            }

        },[initialData]); //dependency on initialData changes

        const resetForm = () => {
            setKeyName('');
            setType('');
            setSubFields([]);
            setEditingSubFieldIndex(null);
            setConstraints({min:'', max:'', choices:''});
            setShowRules(false);
        }
    
        const handleSave = () => {
                if(keyName && type) {
                
                    const finalConstraints = {};
                    if(constraints.min) finalConstraints.min = Number(constraints.min);
                    if(constraints.max) finalConstraints.max = Number(constraints.max);
                    if(constraints.choices) finalConstraints.choices = constraints.choices
                                                                        .split(',')
                                                                        .map(s => s.trim())
                                                                        .filter(s => s);
                    if(constraints.regex) finalConstraints.regex = constraints.regex.trim();
                    const hasConstraints = Object.keys(finalConstraints).length > 0; // we check if there are any constraints to add
                    onAddField({
                        keyName, 
                        type, 
                        subFields,
                        constraints: hasConstraints ? finalConstraints : undefined
                    });
                    if(!initialData)
                    resetForm();
                }
        };
        
        const handleSubFieldSave = (newSubField) => {
            if(editingSubFieldIndex !== null) {
                setSubFields (prev => {
                    const updated = [...prev];
                    updated[editingSubFieldIndex] = newSubField;
                    return updated;
                });
                setEditingSubFieldIndex(null);
            }
            else {
                setSubFields( prev => [...prev, newSubField] );
            }
        };

        const handleEditSubField = (index) => {
            setEditingSubFieldIndex(index);
        }

        const removeSubField = (index) => {
            setSubFields((prev) => prev.filter((_, i) => i !== index));
            if(editingSubFieldIndex === index) {
                setEditingSubFieldIndex(null);
            }
        };
     
    return (
        
        <div className="flex flex-col items-center gap-4 my-2 w-full transisiton-all">
                {/*Main inputs*/}
                <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center w-full">
                    {/*left side*/}
                    <div className="flex flex-grow items-center justify-between gap-4 min-w-0">
                        
                            <div className="flex items-center gap-4 min-w-0">
                            <input
                                className = "border p-2 rounded w-full h-10"
                                placeholder = "Key Name"
                                value = {keyName}
                                onChange = {e => setKeyName(e.target.value)}
                            />
                            </div>

                            <div className="w-32 flex-grow">
                            <input 
                            list= "typeOptions" 
                            className= "border p-2 rounded w-full h-10"
                            placeholder= "Select Type..." 
                            value={type}
                            onChange={e => setType(e.target.value)}
                        />
                        {/* The Built-in List Definition */}
                        <datalist id="typeOptions">
                            <option value="object" />
                            <option value="array" />
                            {basicTypes.map(t => <option key={t} value={t} />)}
                        </datalist>
                            </div>

                            {/*Constraints*/}
                            <div className="flex-none">
                            {type && type !== 'object' && (
                                <button
                                    onClick = {() => setShowRules(!showRules)}
                                    className = "px-2 rounded border h-10 transition-colors flex-none cursor-pointer ${showRules ? 'bg-blue-100 border-blue-400' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}"
                                    title = "Add Constraints"
                                >
                                        {showRules ? '✔️' : <Settings2 className={`w-5 h-5 transition-transform duration-300 ${showRules ? 'rotate-180' : ''}`} />}
                                </button>
                            )}
                            </div>
                            <div className="flex"></div>
                        
                    </div>
                
                    {/*right side*/}
                    <div className="flex flex-none items-center gap-2">
                        <button
                            className={`${initialData ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-500 hover:bg-green-600'} 
                                        w-24 text-white px-4 py-2 rounded flex flex-none items-center justify-center transition cursor-pointer
                                        `}
                            onClick = {handleSave}
                            >
                            {initialData ? 'Update' : 'Add'}
                        </button>
                        {(keyName || type)&& !initialData &&(
                            <button
                                onClick = {resetForm}
                                className="bg-red-500 hover-red-700 w-24 text-white px-2 py-2 rounded transition cursor-pointer"
                                >Cancel</button>
                        )}
                        {/*Cancel button for edit mode*/}
                        {initialData && onCancel &&(
                            <button
                            onClick={onCancel}
                            className= "bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400 cursor-pointer"
                            >Cancel</button>
                        )}
                    </div>
                </div>

                {/*constraints*/}
            {showRules && type !== 'object' && (
                            <div className="bg-gray-50 border w-3/4 rounded p-3 text-sm animate-in fade-in slide-in-from-top-1">
                                <div className="font-semibold text-gray-600 mb-2">Constraints for {type}</div>
                                    {(['integer', 'float', 'age', 'price', 'array'].includes(type)) && (<div className="flex gap-2 mb-2">
                                        <input
                                            placeholder = {type==='array' ? 'Min Items' : 'Min Value'}
                                            type = "number"
                                            min = "1"
                                            className="border p-1 rounded w-1/2"
                                            value = {constraints.min}
                                            onChange = {e => setConstraints({...constraints, min: e.target.value})}
                                        />
                                        <input
                                            placeholder = {type==='array' ? 'Max Items' : 'Max Value'}
                                            type="number"
                                            min={constraints.min}
                                            className = "border p-1 rounded w-1/2"
                                            value = {constraints.max}
                                            onChange = {e => setConstraints({...constraints, max: e.target.value})}
                                        />
                                    </div>)}
                                        {(!['array','object'].includes(type)) &&(<div className="flex flex-col flex-grow gap-2 ">
                                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${!constraints.regex ? 'max-h-20 opacity-100 scale-100':'max-h-0 opacity-100 scale-80'}`}>
                                            <input
                                            placeholder = "Choices (comma seperated)"
                                            className = "border p-1 rounded w-full"
                                            value = {constraints.choices ?? ''}
                                            onChange = {e => setConstraints({...constraints, choices: e.target.value})}
                                        />
                                            </div>
                                            <div className = {`transition-all duration-300 ease-in-out overflow-hidden ${!constraints.choices ? 'max-h-20 opacity-100 scale-100':'max-h-0 opacity-100 scale-80'}`}>
                                            <input
                                                placeholder = "Regex pattern"
                                                className= "border p-1 rounded w-full"
                                                value = {constraints.regex ?? ''}
                                                onChange = {e => setConstraints({...constraints, regex: e.target.value})}
                                            
                                        />
                                            </div>
                                        </div>)}
                                </div>
                        )}
            {/*When array or object is selected, sub-input should appear*/}
            {(type === 'object' || type === 'array') && (
                <div className="ml-8 mt-2 border-l-4 border-blue-200 pl-4 py-2 bg-gray-50 rounded"> 
                    <p className="text-sm font-bold text-blue-600 mb-2">
                        {type === 'array' ? 'Define Array Items:' : 'Define Object Properties:'}
                    </p>
                    {/*sub Fields*/}
                    {subFields.length > 0 && (
                        <div className="mb-4 space-y-2">
                            {subFields.map((f, index) => ( 
                                <div key={index} className={`flex justify-between items-center bg-white p-2 border rounded shadow-sm ${editingSubFieldIndex === index ? 'ring-2 ring-blue-400' : ''}`}>
                                    <div>
                                        <span className="font-mono font-bold">{f.keyName}</span>
                                        <span className="mx-2 text-gray-400">:</span>
                                        <span className="text-xs text-gray-400">{f.type}</span>
                                        
                                    </div> 
                                    <div className="flex gap-4">

                                        <button 
                                            onClick = {()=>handleEditSubField(index)} 
                                            className= "flex gap-4 text-blue-500 hover:text-blue-700 font-mono cursor-pointer"
                                        >Edit</button>

                                        <button 
                                            onClick={() => removeSubField(index)}
                                            className="flex gap-4 text-red-500 hover:underline hover:text-red-700 font-mono cursor-pointer"
                                        >Remove</button>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <FieldEditor 
                        onAddField={handleSubFieldSave} 
                        initialData = {editingSubFieldIndex !== null ? subFields[editingSubFieldIndex] : null}
                        onCancel = {() => setEditingSubFieldIndex(null)}
                        />
                </div>
            )}
        </div>
    );

}