/* eslint-disable */
/**
 * TECHXAURA 2K26 - Payment Screenshot Uploader (FIXED VERSION)
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Save this script (Ctrl+S)
 * 2. Click Deploy → New Deployment
 * 3. Type: Web app
 * 4. Execute as: Me
 * 5. Who has access: Anyone
 * 6. Click Deploy
 * 7. Copy the Web App URL to your .env file
 */

// Test endpoint - visit your URL in browser to verify deployment
function doGet(e) {
    return ContentService.createTextOutput(JSON.stringify({
        "status": "ok",
        "message": "TECHXAURA Upload Script is working!",
        "timestamp": new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
}

// Main upload endpoint
function doPost(e) {
    try {
        // REPLACE with your Google Drive Folder ID
        const FOLDER_ID = "1HvKjHiP1lRAamsnC07ld0Hab5zZQ3Z-V";

        // Debug: Log what we received
        Logger.log("Received POST request");
        Logger.log("postData: " + JSON.stringify(e.postData));

        // Check if postData exists
        if (!e || !e.postData || !e.postData.contents) {
            Logger.log("ERROR: No postData received");
            return ContentService.createTextOutput(JSON.stringify({
                "status": "error",
                "error": "No data received. Check that you're sending a POST body.",
                "received": e ? JSON.stringify(e) : "null"
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // Parse the JSON data
        let data;
        try {
            data = JSON.parse(e.postData.contents);
            Logger.log("Parsed data keys: " + Object.keys(data).join(", "));
        } catch (parseError) {
            Logger.log("JSON Parse Error: " + parseError.toString());
            return ContentService.createTextOutput(JSON.stringify({
                "status": "error",
                "error": "Invalid JSON: " + parseError.toString(),
                "rawData": e.postData.contents.substring(0, 100)
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // Validate required fields
        if (!data.base64) {
            return ContentService.createTextOutput(JSON.stringify({
                "status": "error",
                "error": "Missing 'base64' field in request",
                "receivedFields": Object.keys(data).join(", ")
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // Get the folder
        let folder;
        try {
            folder = DriveApp.getFolderById(FOLDER_ID);
        } catch (folderError) {
            Logger.log("Folder Error: " + folderError.toString());
            return ContentService.createTextOutput(JSON.stringify({
                "status": "error",
                "error": "Could not access folder. Check FOLDER_ID.",
                "folderId": FOLDER_ID
            })).setMimeType(ContentService.MimeType.JSON);
        }

        // Create filename
        const timestamp = new Date().getTime();
        const userName = data.userName || "User";
        const safeUserName = userName.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = safeUserName + "_" + timestamp + ".jpg";

        // Decode and create file
        const blob = Utilities.newBlob(
            Utilities.base64Decode(data.base64),
            data.type || "image/jpeg",
            fileName
        );
        const file = folder.createFile(blob);

        // Set permissions
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        // Generate direct link
        const directLink = "https://drive.google.com/uc?export=view&id=" + file.getId();

        Logger.log("SUCCESS: Created file " + fileName);

        return ContentService.createTextOutput(JSON.stringify({
            "status": "success",
            "driveUrl": file.getUrl(),
            "directLink": directLink,
            "fileName": fileName,
            "fileId": file.getId()
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        Logger.log("FATAL ERROR: " + err.toString());
        return ContentService.createTextOutput(JSON.stringify({
            "status": "error",
            "error": err.toString(),
            "stack": err.stack || "No stack trace"
        })).setMimeType(ContentService.MimeType.JSON);
    }
}
