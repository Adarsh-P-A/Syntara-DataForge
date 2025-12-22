import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const {targetURL, data, method='POST', headers = {}} = await request.json();

        if (!targetURL || !data) {
            return NextResponse.json({error:"Missing URL or Data"}, {status: 400});
        }

        console.log(`Seeding data to: ${targetURL}`);

        const response = await fetch (targetURL, {
            method: method,
            headers: {
                'Content-Type':'application/JSON',
                ...headers
            },
            body: JSON.stringify(data)
        });
        
        const responseText = await response.text();
        let responseJSON;
        try{
            responseJSON = JSON.parse(responseText);
        } catch {
            responseJSON = { message: responseText};
        }

        if(!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    status: response.status,
                    error: responseJSON
                }, {status: response.status}
            );
        }

        return NextResponse.json({
            success: true,
            status: response.status,
            response: responseJSON
        });
    } catch(error: any) {
        console.error("🔥 PROXY ERROR:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, {status:500});
    }
}