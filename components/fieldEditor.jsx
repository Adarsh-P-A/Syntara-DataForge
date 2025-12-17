"use client";


import {useState, useEffect} from 'react';

export default function FieldEditor({onAddField, initialData=null, onCancel=null}) {
    const [keyName, setKeyName] = useState('');
    const [type, setType] = useState('');
    const [subFields, setSubFields] = useState([]);
    const [editingSubFieldIndex, setEditingSubFieldIndex] = useState(null);
    const [constraints, setConstraints] = useState({min:'', max:'', choices:''});
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
                    <div className="flex flex-grow items-center gap-4 min-w-0">
                        
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
                            {type && type !== 'object' && type !== 'array' && (
                                <button
                                    onClick = {() => setShowRules(!showRules)}
                                    className = "px-2 rounded border h-10 transition-colors flex-none ${showRules ? 'bg-blue-100 border-blue-400' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}"
                                    title = "Add Constraints"
                                >
                                        {showRules ? 'ok' : 'set rules'}
                                </button>
                            )}
                            </div>
                        
                    </div>
                
                    {/*right side*/}
                    <div className="flex flex-none items-center gap-2">
                        <button
                            className={`${initialData ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-500 hover:bg-green-600'} 
                                        w-24 text-white px-4 py-2 rounded flex flex-none items-center justify-center transition`}
                            onClick = {handleSave}
                            >
                            {initialData ? 'Update' : 'Add'}
                        </button>

                        {/*Cancel button for edit mode*/}
                        {initialData && onCancel &&(
                            <button
                            onClick={onCancel}
                            className= "bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400"
                            >Cancel</button>
                        )}
                    </div>
                </div>
            {showRules && type !== 'object' && type !== 'array' && (
                            <div className="bg-gray-50 border rounded p-3 text-sm animate-in fade-in slide-in-from-top-1">
                                <div className="font-semibold text-gray-600 mb-2">Constraints for {type}</div>
                                    {(['integer', 'float', 'age', 'price'].includes(type)) && (<div className="flex gap-2 mb-2">
                                        <input
                                            placeholder = "Min Value"
                                            type = "number"
                                            className="border p-1 rounded w-1/2"
                                            value = {constraints.min}
                                            onChange = {e => setConstraints({...constraints, min: e.target.value})}
                                        />
                                        <input
                                            placeholder = "Max Value"
                                            type="number"
                                            className = "border p-1 rounded w-1/2"
                                            value = {constraints.max}
                                            onChange = {e => setConstraints({...constraints, max: e.target.value})}
                                        />
                                    </div>)}
                                        <input
                                            placeholder = "Choices (comma separated)"
                                            className = "border p-1 rounded w-full"
                                            value = {constraints.choices}
                                            onChange = {e => setConstraints({...constraints, choices: e.target.value})}
                                        />
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
                                        {f.constraints && <span className= "ml-2 text-xs text-orange-500">⚙️</span>} {/*an icon to indicate constraints*/}
                                    </div> 
                                    <div className="flex gap-4">

                                        <button 
                                            onClick = {()=>handleEditSubField(index)} 
                                            className= "flex gap-4 text-blue-500 hover:text-blue-700 font-mono"
                                        >Edit</button>

                                        <button 
                                            onClick={() => removeSubField(index)}
                                            className="flex gap-4 text-red-500 hover:underline hover:text-red-700 font-mono"
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