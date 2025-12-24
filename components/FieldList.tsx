import {Edit2, Trash2, ArrowUp, ArrowDown} from 'lucide-react';
import { SchemaField } from '@/app/utils/schemaUtils';

interface FieldListProps { // index is not required here because it is a property of fields
    fields: SchemaField[];
    onEdit: (index: number) => void;
    onRemove: (index: number) => void;
    setFields: (field: SchemaField[]) => void;
}


export default function FieldList({fields, onEdit, onRemove, setFields}: FieldListProps) {

    const moveField = (index: number, direction:'up' | 'down') => {
        if(direction === 'up' && index===0) return;
        if(direction ==='down' && index === fields.length - 1) return;

        const newFields = [...fields];
        const targetIndex = direction ==='up' ? index - 1: index + 1;

        [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
        setFields(newFields);
    }

    if(fields.length === 0) {
        return <p className="text-gray-500 italic">No fields added yet</p>
    }

    return (
    <div className="space-y-2 ">
              {fields.map((field, index) =>(
                <div key={index} className="flex justify-between items-center bg-white dark:bg-neutral-900 p-3 border dark:border-2 dark:border-neutral-700 rounded hover:shadow-md"> 
                  <div> 
                    <span className="font-mono font-bold text-sm lg:text-base text-blue-600 dark:text-blue-400">{field.keyName}</span>
                    <span className= "mx-2 text-gray-400">:</span>
                    <span className="text-green-600 dark:text-green-300 badge bg-gray-100 dark:bg-black/30 px-2 py-1 rounded lg:text-sm text-xs">
                      {field.type}{(field.type === 'object' || field.type === 'array') && `(${field.subFields?.length || 0} items)`}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex justify-center items-center px-3">
                        <button
                            onClick={()=>moveField(index,'up')}
                            disabled = {index === 0}
                            className = "p-0.5 text-gray-400 hover:text-blue-600 disabled:hover:text-gray-400 dark:hover:text-blue-400 "
                            title= "Move Up"
                        >
                            <ArrowUp size={20}/>
                        </button>
                        <button
                            onClick={()=>moveField(index,'down')}
                            disabled = {index === fields.length - 1}
                            className = "p-0.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 dark:hover:text-blue-400"
                            title= "Move down"
                        >
                            <ArrowDown size={20}/>
                        </button>
                    </div>
                    <button 
                      onClick={() => onEdit(index)}
                      className ="text-gray-400 p-1 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all active:scale-90 cursor-pointer"
                      title = "Edit Field"
                      >
                      <Edit2 className="w-4 h-4"/>
                      </button>
                    <button 
                        onClick={() => onRemove(index)}
                        className="text-gray-500 hover:text-red-700 dark:hover:text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all active-scale-90 cursor-pointer"
                        title="Remove Field">
                      <Trash2 className="w-4 h-4"/>
                      </button>
                  </div>
                </div>
              ))}
            </div>
    );
}