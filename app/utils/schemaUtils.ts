export interface SchemaField {
    keyName : string;
    type : string;
    subFields?:SchemaField[];
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
            schema[field.keyName] = field.type;
        }
    });    
    return schema;
};
