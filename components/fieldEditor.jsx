"use client";


import {useState, useEffect} from 'react';

export default function FieldEditor({onAddField, initialData=null, onCancel=null}) {
    const [keyName, setKeyName] = useState('');
    const [type, setType] = useState('');
    const [subFields, setSubFields] = useState([]);
    const [editingSubFieldIndex, setEditingSubFieldIndex] = useState(null);

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
        }
    
        const handleSave = () => {
                if(keyName && type) {
                    onAddField({keyName, type, subFields});
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
    <div className="flex flex-col gap-4 my-2 w-full transisiton-all">
            {/*Main inputs*/}
            <div className="flex gap-4 items-end">
                <div className="w-1/3">
            <input
                className = "border p-2 rounded w-full"
                placeholder = "Key Name"
                value = {keyName}
                onChange = {e => setKeyName(e.target.value)}
            />
            </div>
            <div className="w-1/3">
            <select
                className = "border p-2 rounded w-1/3"
                value = {type}
                onChange = {e => setType(e.target.value)}
            >
                <option value = "">Select Type</option>
                {basicTypes.map(t => <option key = {t} value = {t}>{t}</option>)}
                <option value="object">object</option>
                <option value="array">array</option>
            </select>
            </div>
            <div className="flex gap-2 w-1/3">
        <button
            className={`${initialData ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded flex-grow transition`}
            onClick = {handleSave}
            >
            {initialData ? 'Update' : 'Add'}
        </button>
        {/*Cancel button fo edit mode*/}
        {initialData && onCancel &&(
            <button
            onClick={onCancel}
            className= "bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400"
            >Cancel</button>
        )}
        </div>
    </div>
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
                            className= "flex gap-4 text-blue-500 hover:text-blue-700 font-semibold"
                            >Edit</button>

                            <button 
                                onClick={() => removeSubField(index)}
                                className="flex gap-4 text-red-500 hover:underline hover:text-red-700 font-semibold"
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
        )
            }
        </div>
    );

}