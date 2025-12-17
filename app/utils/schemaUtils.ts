export interface SchemaField {
    keyName : string;
    type : string;
    subFields?:SchemaField[];
    constraints?: {
        min?: number;
        max?: number;
        choices?: string[];
    };
}

// Raw JSON -> SchemaField[]
export const JSONtoSchemaFields = (jsonObj: any): SchemaField[] => {
    return Object.keys(jsonObj).map((key) => {
        const value = jsonObj[key];

        if(Array.isArray(value)) {
            const firstItem = value.length > 0 ? value[0] : {};
            return {
                keyName: key,
                type: 'array',
                subFields: JSONtoSchemaFields(firstItem)
            };
        }
        else if(typeof value === 'object' && value !== null) {
            if(value.type &&(value.min !== undefined || value.max !== undefined || value.choices !== undefined)) {
                return {
                    keyName: key,
                    type : value.type,
                    constraints : {
                        min: value.min,
                        max: value.max,
                        choices: value.choices
                    }
                };
            }
                return {
                    keyName: key,
                    type: 'object',
                    subFields: JSONtoSchemaFields(value)
                };
        }
        else {
            return {
                keyName: key,
                type: typeof value === 'number' ? (Number.isInteger(value) ? 'integer' : 'float') : typeof value
            };
        }
    });
};

export const generateSchema = (fieldList: SchemaField[]): any =>{
    const schema: any = {};
    fieldList.forEach((field) => {
        if(field.type === 'object' && field.subFields){
            schema[field.keyName] = generateSchema(field.subFields);
        }
        else if(field.type === 'array' && field.subFields) {
            schema[field.keyName] = [generateSchema(field.subFields)];
        }
        else {
            if(field.constraints && (field.constraints.min !== undefined || field.constraints.max !== undefined || field.constraints.choices !== undefined)) {
                schema[field.keyName] = {
                    type: field.type,
                    ...field.constraints // Spread constraints if they exist
                }
            }
            else {
                schema[field.keyName] = field.type;
            }
        }
    });    
    return schema;
};
