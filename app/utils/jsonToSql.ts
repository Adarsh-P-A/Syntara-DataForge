function inferSqlType(value: any): string {
    if(typeof value === "number") {
        return Number.isInteger(value) ? "INTEGER" : "DECIMAL";
    }
    if(typeof value === "boolean") return "BOOLEAN";
    if(typeof value === "object") return "TEXT";
    if(typeof value === "string" && !isNaN(Date.parse(value)) && value.length > 0) {
        return "TIMESTAMP";
    }
    return "TEXT"; //by default
}

function smartFlatten(val: any): any {
    if(Array.isArray(val) && val.length > 0) {
        const firstItem = val[0];

        if(typeof firstItem === 'object' && firstItem !== null && !Array.isArray(firstItem)) {
            const keys = Object.keys(firstItem);
            if(keys.length === 1) {
                const singleKey = keys[0];
                return val.map((item: any) => item[singleKey])
            }
        }
    }
    return val;
}

export function jsonToSql(inputData: any[], tableName: string = "users") {
    if(!inputData) return "";

    const data = Array.isArray(inputData) ? inputData : [inputData]; // single data is not array so make it array
    if (data.length === 0) return "";

    const keys = Object.keys(data[0]);// recheck before continuing

    let createTableSql = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
    createTableSql += ` _auto_id SERIAL PRIMARY KEY, \n`;
    
    const columnDefs = keys.map (key => {

        const sampleValue = data[0][key];
        const type = inferSqlType(sampleValue);
        return ` ${key} ${type}`;
    });

    createTableSql += columnDefs.join(",\n");
    createTableSql += "\n);\n\n";

    const columns = keys.join(", ");
    let insertSql = `INSERT INTO ${tableName} (${columns}) VALUES\n`;

    const values = data.map((row) => {
            const rowValues = keys.map((key) => {
                let val = row[key];
                
                if(val === null || val === undefined) return "NULL";
                val = smartFlatten(val);
                if(typeof val === "number") return val;
                if(typeof val === "boolean") return val ? "TRUE" : "FALSE";
                if(typeof val === "object") {
                    const jsonString = JSON.stringify(val).replace(/'/g,"''");
                    return `'${jsonString}'`;
                }
                const safeString = String(val).replace(/'/g, "''");
                return `'${safeString}'`;
            });

            return `(${rowValues.join(", ")})`;
    });

    insertSql += values.join(",\n") + ";";
    return createTableSql + insertSql;
}