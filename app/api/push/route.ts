import { NextResponse } from "next/server";

function isUnsafe(url: string) {
    try {
        const parsed = new URL(url);
        const hostname = parsed.hostname;

        // block localhost
        if(hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') return true;

        const privateIpRegex = /(^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.)/;
        if(privateIpRegex.test(hostname)) return true; // private IP ranges

        if(parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return true; //http or https

        return false;
    } catch (e) {
        return true;
    }
}

export async function POST(request: Request) {
    try {
        const {targetURL, data, method='POST', headers = {}} = await request.json();

        if (!targetURL || !data) {
            return NextResponse.json({error:"Missing URL or Data"}, {status: 400});
        }
        if(isUnsafe(targetURL)) {
            return NextResponse.json({success: false, error:{message:"Invalid or Restricted Target URL"}}, {status: 400});
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