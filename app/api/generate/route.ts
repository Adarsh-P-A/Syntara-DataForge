
import crypto from 'crypto';
import {faker} from '@faker-js/faker';
import { NextResponse } from 'next/server';

// Always remember Internal represention is not same as JSON preview
// Here I send clean JSON to backend and internal representation is only for UI


// app/api/generate/route.ts

const gen_map: Record<string, (options?: any) => any> = {
    // --- Primitives ---
    string: () => faker.string.alphanumeric(10),
    integer: (opts) => faker.number.int({ min: opts?.min || 0, max: opts?.max || 1000 }),
    float: (opts) => faker.number.float({ min: opts?.min || 0, max: opts?.max || 1000, fractionDigits: 2 }),
    boolean: () => faker.datatype.boolean(),
    null: () => null,

    // --- Identity ---
    uuid: () => faker.string.uuid(),
    name: () => faker.person.fullName(),
    first_name: () => faker.person.firstName(),
    last_name: () => faker.person.lastName(),
    gender: () => faker.person.sex(),
    age: (opts) => faker.number.int({ min: opts?.min || 18, max: opts?.max || 90 }),
    email: () => faker.internet.email(),
    phone: () => faker.phone.number(),
    job_title: () => faker.person.jobTitle(),

    // --- Location ---
    address: () => faker.location.streetAddress(),
    city: () => faker.location.city(),
    country: () => faker.location.country(),
    country_code: () => faker.location.countryCode(),
    zip_code: () => faker.location.zipCode(),
    state: () => faker.location.state(),
    latitude: () => faker.location.latitude(),
    longitude: () => faker.location.longitude(),
    time_zone: () => faker.location.timeZone(),

    // --- Commerce ---
    price: (opts) => faker.commerce.price({ min: opts?.min || 10, max: opts?.max || 1000 }),
    currency: () => faker.finance.currencyName(),
    currency_code: () => faker.finance.currencyCode(),
    currency_symbol: () => faker.finance.currencySymbol(),
    credit_card: () => faker.finance.creditCardNumber(),
    iban: () => faker.finance.iban(),
    bitcoin_address: () => faker.finance.bitcoinAddress(),
    product_name: () => faker.commerce.productName(),
    department: () => faker.commerce.department(),
    material: () => faker.commerce.productMaterial(),

    // --- Internet ---
    url: () => faker.internet.url(),
    domain: () => faker.internet.domainName(),
    ip_address: () => faker.internet.ip(),
    ipv6: () => faker.internet.ipv6(),
    user_agent: () => faker.internet.userAgent(),
    mac_address: () => faker.internet.mac(),
    file_extension: () => faker.system.fileExt(),
    mime_type: () => faker.system.mimeType(),

    // --- Content ---
    word: () => faker.lorem.word(),
    sentence: () => faker.lorem.sentence(),
    paragraph: () => faker.lorem.paragraph(),
    slug: () => faker.lorem.slug(),
    
    // --- Date ---
    date: () => faker.date.anytime().toISOString(),
    future_date: () => faker.date.future().toISOString(),
    past_date: () => faker.date.past().toISOString(),
    recent_date: () => faker.date.recent().toISOString(),
    
    // --- Company ---
    company_name: () => faker.company.name(),
    catch_phrase: () => faker.company.catchPhrase(),

    // --- Media ---
    image_url: () => faker.image.url(),
    avatar: () => faker.image.avatar(),
    emoji: () => faker.internet.emoji(),
};

function generate_object(schema: any): any
{
    let output:any = {};
    const properties = schema.properties || schema; 
    
    for(const key in properties) {
        const fieldDefinition = properties[key];

        if (typeof fieldDefinition === 'string') { // type is given directly
            const generator = gen_map[fieldDefinition];
            output[key] = generator ? generator ({}) : null;
        }
        else if(typeof fieldDefinition ==='object' && fieldDefinition !== null) {

            if(fieldDefinition.type === 'array') {
                const min = fieldDefinition.min || fieldDefinition.minItems|| 1;
                const max = fieldDefinition.max || fieldDefinition.minItems || 5;
                const count = faker.number.int({ min, max});

                output[key] = [];

                for(let i=0; i<count; i++) {
                    if(typeof fieldDefinition.items === 'string') {
                        const generator = gen_map[fieldDefinition.items];
                        output[key].push(generator ? generator({}) : null)  
                    }
                    else if(typeof fieldDefinition.items === 'object' ) { // object inside array
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
                if(fieldDefinition.regex) {
                    try {
                        output[key] = faker.helpers.fromRegExp(fieldDefinition.regex);
                    } catch(e) {
                        output[key] = "Error: Invalid Regex";
                    }
                }
                else if(fieldDefinition.choices && Array.isArray(fieldDefinition.choices) && fieldDefinition.choices.length > 0) {
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
        const body = await request.json();
        const schema = body.schema || body;
        const count = (typeof body.count === 'number') ?body.count : 1;
        if(count===1) {
            const result = generate_object(schema);
            return NextResponse.json(result);
        }
        const results = [];
        for(let i=0; i<count; i++) {
            results.push(generate_object(schema));
        }
        return NextResponse.json(results);
    } catch (error) {
        console.error("Generator Error:", error);
        return NextResponse.json({error: "Failed to generate data"}, {status : 500});
    }
}

