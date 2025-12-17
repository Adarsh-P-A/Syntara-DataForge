
import crypto from 'crypto';
import {faker} from '@faker-js/faker';
import { NextResponse } from 'next/server';

// Always remember Internal represention is not same as JSON preview
// Here I send clean JSON to backend and internal representation is only for UI


const gen_map: any = {
    string: () => faker.lorem.words(3),
    boolean: () => faker.datatype.boolean(),
    name: () => faker.person.fullName(),
    email: () => faker.internet.email(),
    phone: () => faker.phone.number(),
    date: () => faker.date.past().toISOString(),
    image_url: () => faker.image.avatar(),
    file_url: () => faker.internet.url(),
    uuid: () => crypto.randomUUID(),
    address: () => faker.location.streetAddress(),
    city: () => faker.location.city(),
    country: () => faker.location.country(),
    zip_code: () => faker.location.zipCode(),
    currency_code: () => faker.finance.currencyCode(),
    paragraph: () => faker.lorem.paragraphs(2),
    sentence: () => faker.lorem.sentence(),
    product_name: () => faker.commerce.productName(),
    color: () => faker.color.human(),
    url: () => faker.internet.url(),
    ip_address: () => faker.internet.ip(),
    user_name: () => faker.internet.username(),
    word: () => faker.lorem.word(),
    future_date: () => faker.date.future().toISOString(),

    // constrained
     integer: (options: any) => faker.number.int({ 
        min: options?.min ?? 0 ,
        max: options?.max ?? 1000
     }),
     float: (options: any) => faker.number.float({
        min: options?.min ?? 0,
        max: options?.max ?? 1000
    }),
    age: (options: any) => faker.number.int({ 
        min: options?.min ?? 0, 
        max: options?.max ?? 100
    }),
    price: (options: any) => faker.commerce.price({ 
        min: options?.min ?? 1, 
        max: options?.max ?? 1000, 
        dec: 2 
    }),

};

function generate_object(schema: any): any
{
    let output:any = {};
    const properties = schema.properties || schema; // doubt
    
    for(const key in properties) {
        const fieldDefinition = properties[key];

        if (typeof fieldDefinition === 'string') {
            const generator = gen_map[fieldDefinition];
            output[key] = generator ? generator ({}) : null;
        }
        else if(typeof fieldDefinition ==='object' && fieldDefinition !== null) {

            if(fieldDefinition.type === 'array') {
                const min = fieldDefinition.minItems || 1;
                const max = fieldDefinition.maxItems || 5;
                const count = faker.number.int({ min, max});

                output[key] = [];

                for(let i=0; i<count; i++) {
                    if(typeof fieldDefinition.items === 'string') {
                        const generator = gen_map[fieldDefinition.items];
                        output[key].push = (generator)
                    }
                    else if(typeof fieldDefinition === 'object' ) { // object inside array
                        output[key].push(generate_object(fieldDefinition.items))
                    }
                }
            }
            else if( fieldDefinition.type === 'object' ||(!fieldDefinition.type && !fieldDefinition.choices && !fieldDefinition.min)) { // just an object
                const childSchema = fieldDefinition.properties || fieldDefinition ; // in a standard JSON elements of the object might be inside properties

                if(Object.keys(childSchema).length > 1 || !fieldDefinition.type) {
                    output[key] = generate_object(childSchema)
                } else {
                    output[key] = {};
                }
            }
            else { // primitives but when constraints are given looks like object
                if(fieldDefinition.choices && Array.isArray(fieldDefinition.choices) && fieldDefinition.choices.length > 0) {
                    output[key] = faker.helpers.arrayElement(fieldDefinition.choices);
                }
                else if(gen_map[fieldDefinition.type]) {
                    const generator = gen_map[fieldDefinition.type];
                    output[key] = generator ({
                        min: fieldDefinition.min,
                        max: fieldDefinition.max
                    });
                } else {
                    output[key] = null;
                }
            }
        }
    }
    return output;   
}

export async function POST(request: Request) {
    try {
        const schema = await request.json();
        const result = generate_object(schema);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Generator Error:", error);
        return NextResponse.json({error: "Failed to generate data"}, {status : 500});
    }
}

