import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fileType, type, ...data } = body;

        let scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

        if (fileType === 'abstract') {
            scriptUrl = process.env.NEXT_PUBLIC_ABSTRACT_GOOGLE_SCRIPT_URL;
        }

        if (!scriptUrl) {
            return NextResponse.json(
                { success: false, error: 'Server configuration error: Missing Script URL' },
                { status: 500 }
            );
        }

        const payload = {
            base64: data.base64,
            type: type, // Pass the actual MIME type (e.g., application/pdf)
            name: data.name,
            filename: data.name,
        };

        console.log(`Proxying ${fileType} upload to: ${scriptUrl}`);

        // THE KEY: Send as text/plain to bypass CORS preflight on GAS
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            redirect: 'follow',
            body: JSON.stringify(payload),
        });

        const responseText = await response.text();

        // Check if GAS returned HTML (broken deployment / page not found)
        if (responseText.trimStart().startsWith('<!DOCTYPE') || responseText.trimStart().startsWith('<html')) {
            console.error(`GAS returned HTML for ${type} upload. Deployment may be broken.`);
            return NextResponse.json(
                { success: false, error: 'The upload service is currently unavailable. The Google Apps Script deployment may need to be redeployed.' },
                { status: 502 }
            );
        }

        if (!response.ok) {
            console.error(`GAS Error (${response.status}):`, responseText);
            return NextResponse.json(
                { success: false, error: `Upload service error: ${responseText.substring(0, 200)}` },
                { status: response.status }
            );
        }

        // Parse JSON safely
        try {
            const gasResponse = JSON.parse(responseText);
            return NextResponse.json(gasResponse);
        } catch {
            console.error('GAS returned non-JSON:', responseText.substring(0, 500));
            return NextResponse.json(
                { success: false, error: 'Upload service returned an invalid response.' },
                { status: 502 }
            );
        }

    } catch (error) {
        console.error('Upload API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
