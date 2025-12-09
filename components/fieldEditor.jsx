"use client";

import {useState} from 'react';

export default function FieldEditor({onAddField}) {
    const [keyName, setKeyName] = useState('');
    const [type, setType] = useState('');
    const [subFields, setSubFields] = useState([]);

    const basicTypes = ['string', 'integer', 'float', 'boolean',
                        'name', 'email', 'phone', 'date', 
                        'image_url', 'file_url',
                        'uuid',
                        'age', 'address', 'city', 'country', 'zip_code', 'price', 'currency_code',
                        'paragraph', 'sentence',
                        'product_name', 'color',
                        'url', 'ip_address', 'user_name',
                        'word', 'future_date'];

            const handleAddField = () => {
                if(keyName && type) {
                    onAddField({keyName, type, subFields});

                    //clear inputs after adding
                    setKeyName('');
                    setType('');
                    setSubFields([]);
                }
            };
        
        const handleSubFieldAdd = (newSubField) => {
            setSubFields( prev => [...prev, newSubField] );
        };
                
    return (
        <div className="flex gap-4 my-2 w-full">
            {/*Main inputs*/}
            <div className="flex gap-4">
            <input
                className = "border p-2 rounded w-1/3"
                placeholder = "Key Name"
                value = {keyName}
                onChange = {e => setKeyName(e.target.value)}
            />
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
        <button
            className = "bg-green-500 text-white px-4 py-2 rounded w-1/6"
            onClick = {handleAddField}
            >
            Add Field
        </button>
        </div>
        {/*When array or object is selected, sub-input should appear*/}
        {(type === 'object' || type === 'array') && (
            <div className="ml-8 mt-2 border-l-4 border-blue-200 pl-4 py-2 bg-gray-50 rounded"> 
            <p className="text-sm font-bold text-blue-600 mb-2">
                {type === 'array' ? 'Define Array Items:' : 'Define Object Properties:'}
            </p>
                {/*sub Fields*/}
                {subFields.length > 0 && (
                    <ul className="mb-4 text-sm space-y-1">
                    {subFields.map((f, index) => ( 
                        <li key={index} className="flex items-center gap-2 text-gray-700 bg-white p-2 border rounded">
                            <span className="font-mono font-bold">{f.keyname}</span>
                            <span className="text-xs text-gray-400">{f.type}</span>
                        </li>
                    ))}
                    </ul>
                )}
                <FieldEditor onAddField={handleSubFieldAdd} />
            </div>
        )
            }
        </div>
    );

}



{/* 
    to-do list
    Add subfield 
    */}