const https = require('https');

// Read URL from args or .env (but .env parsing might be needed)
// For simplicity, we'll ask user to provide it or hardcode for the test if we knew it.
// Since we can't easily access .env in a standalone script without dotenv, we'll verify if the user has it.
// Actually, we can try to read .env file manually.

const fs = require('fs');
const path = require('path');

function getEnvVar(key) {
    try {
        const envPath = path.join(__dirname, '..', '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
        return match ? match[1].trim() : null;
    } catch (e) {
        return null;
    }
}

const SCRIPT_URL = getEnvVar('NEXT_PUBLIC_GOOGLE_SCRIPT_URL');

if (!SCRIPT_URL) {
    console.error('Error: NEXT_PUBLIC_GOOGLE_SCRIPT_URL not found in .env');
    process.exit(1);
}

console.log('Testing Upload to:', SCRIPT_URL);

// Tiny 1x1 white pixel JPEG base64
const DUMMY_BASE64 = "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RCYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwH3+iiigD//2Q==";

const payload = JSON.stringify({
    base64: DUMMY_BASE64,
    type: "image/jpeg",
    name: "test_upload_script.jpg"
});

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain', // Google Apps Script often needs text/plain to avoid preflight issues or correct body parsing
    },
};

// Node.js doesn't have fetch built-in in older versions, so we use https module for compatibility,
// or check if global fetch exists (Node 18+).
if (typeof fetch !== 'undefined') {
    runFetch();
} else {
    runHttps();
}

async function runFetch() {
    try {
        console.log('Sending request via fetch...');
        const res = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: payload,
            // mode: 'no-cors' // We want to read response, so DO NOT use no-cors
        });

        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Response Body:', text);

        try {
            const json = JSON.parse(text);
            if (json.status === 'success') {
                console.log('✅ Upload Test PASSED');
            } else {
                console.log('❌ Upload Test FAILED: Status not success');
            }
        } catch (e) {
            console.log('❌ Response is not JSON');
        }

    } catch (e) {
        console.error('❌ Request Failed:', e);
    }
}

function runHttps() {
    // Basic https implementation if fetch missing
    console.log('Fetch not found, skipping https fallback for brevity. Please use Node 18+');
}
