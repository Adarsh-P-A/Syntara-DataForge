"use client";


import {useState, useEffect} from 'react';
import { Settings2 , Edit2, Trash2} from 'lucide-react';
export default function FieldEditor({onAddField, initialData=null, onCancel=null}) {
    const [keyName, setKeyName] = useState('');
    const [type, setType] = useState('');
    const [subFields, setSubFields] = useState([]);
    const [editingSubFieldIndex, setEditingSubFieldIndex] = useState(null);
    const [constraints, setConstraints] = useState({min:'', max:'', choices:'', regex:''});
    const [showRules, setShowRules] = useState(false);

    // utils/dataTypes.ts or inside your component

        const DATA_TYPES = {
            "Complex": ['object', 'array'],

            "Primitives": [
                'string', 'integer', 'float', 'boolean', 'null'
            ],
            "Identity & Personal": [
                'uuid', 'name', 'first_name', 'last_name', 
                'gender', 'age', 'email', 'phone', 'job_title', 'prefix', 'suffix'
            ],
            "Location & Address": [
                'address', 'city', 'country', 'country_code', 
                'zip_code', 'street_address', 'state', 'latitude', 'longitude', 'time_zone'
            ],
            "Commerce & Finance": [
                'price', 'currency', 'currency_code', 'currency_symbol',
                'credit_card', 'iban', 'bitcoin_address', 
                'product_name', 'product_description', 'department', 'material'
            ],
            "Internet & Tech": [
                'url', 'domain', 'ip_address', 'ipv6', 
                'user_agent', 'mac_address', 'file_extension', 'mime_type',
                'semver'
            ],
            "Content & Text": [
                'word', 'sentence', 'paragraph', 'slug', 'lorem_lines'
            ],
            "Date & Time": [
                'date', 'future_date', 'past_date', 'recent_date', 'weekday', 'month'
            ],
            "Company": [
                'company_name', 'catch_phrase', 'bs_buzz'
            ],
            "Media": [
                'image_url', 'avatar', 'emoji'
            ]
        };



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
                                className = "border p-2 rounded w-full h-10 dark:bg-neutral-900 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-200"
                                placeholder = "Key Name"
                                value = {keyName}
                                onChange = {e => setKeyName(e.target.value)}
                            />
                            </div>

                            <div className="w-32 flex-grow">
                            
                        {/* The Built-in List Definition */}
                        <select 
                            className="w-full border rounded p-2 dark:bg-neutral-900 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-200"
                            value={type} 
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="" disabled >Select Type...</option>
                            
                            {/* Map over the Categories */}
                            {Object.entries(DATA_TYPES).map(([category, types]) => (
                                <optgroup key={category} label={category}>
                                    {types.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                            </div>

                            {/*Constraints*/}
                            <div className="flex-none">
                            {type && type !== 'object' && (
                                <button
                                    onClick = {() => setShowRules(!showRules)}
                                    className = "px-2 rounded border h-10 transition-colors flex-none cursor-pointer hover:bg-blue-200 border-blue-400 "
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
                            className={`${initialData ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-800' : 'bg-green-500 hover:bg-green-600 dark:bg-emerald-600 dark:hover:bg-emerald-700'} 
                                        w-24 text-white px-4 py-2 rounded flex flex-none items-center justify-center transition cursor-pointer
                                         disabled:bg-gray-500 disabled:cursor-not-allowed`}
                            disabled = {!(keyName && type)}
                            onClick = {handleSave}
                            >
                            {initialData ? 'Update' : 'Add'}
                        </button>
                        {(keyName || type)&& !initialData &&(
                            <button
                                onClick = {resetForm}
                                className="bg-red-500 dark:bg-rose-700 hover-red-700 w-24 text-white px-2 py-2 rounded transition cursor-pointer"
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
                            <div className="bg-gray-50 dark:bg-neutral-700 border w-3/4 rounded p-3 text-sm animate-in fade-in slide-in-from-top-1">
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
                <div className="ml-8 mt-2 border-l-4 border-blue-200 dark:border-blue-900 pl-4 py-2 bg-gray-50 dark:bg-slate-800 rounded"> 
                    <p className="text-sm font-bold dark:text-blue-300 text-blue-600 mb-2">
                        {type === 'array' ? 'Define Array Items:' : 'Define Object Properties:'}
                    </p>
                    {subFields.length > 0 && (
                            <div className="space-y-2">
                                          {subFields.map((f, index) =>(
                                            <div key={index} className="flex justify-between items-center bg-white dark:bg-neutral-900 p-3 border border-2 dark:border-neutral-700 rounded hover:shadow-md"> 
                                              <div> 
                                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{f.keyName}</span>
                                                <span className= "mx-2 text-gray-400">:</span>
                                                <span className="text-green-600 dark:text-green-300 badge bg-gray-100 dark:bg-black/30 px-2 py-1 rounded text-sm">
                                                  {f.type}{(f.type === 'object' || f.type === 'array') && `(${f.subFields?.length || 0} items)`}
                                                </span>
                                              </div>
                                              <div className="flex gap-2">
                                                <button 
                                                  onClick={() => handleEditSubField(index)}
                                                  className ="text-gray-400 p-1 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all active:scale-90 cursor-pointer"
                                                  title = "Edit Field"
                                                  >
                                                  <Edit2 className="w-4 h-4"/>
                                                  </button>
                                                <button 
                                                    onClick={() => removeSubField(index)}
                                                    className="text-gray-500 hover:text-red-700 dark:hover:text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all active-scale-90 cursor-pointer"
                                                    title="Remove Field">
                                                  <Trash2 className="w-4 h-4"/>
                                                  </button>
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