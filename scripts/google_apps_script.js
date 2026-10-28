/**
 * =========================================================================
 * VYOM ISSUE & ERROR REPORTING — GOOGLE APPS SCRIPT WEBHOOK
 * =========================================================================
 *
 * Follow these 3 simple steps to connect your Google Sheet:
 *
 * 1. Open your Google Sheet (or create a new one at https://sheets.new).
 * 2. In the top menu, click: Extensions > Apps Script.
 * 3. Delete any code in the editor, paste this ENTIRE file, and click 'Save'.
 * 4. In the top right, click 'Deploy' > 'New deployment'.
 *    - Select type: 'Web app' (click the gear icon > Web app).
 *    - Description: 'Vyom Error Reporter'
 *    - Execute as: 'Me' (your Google account)
 *    - Who has access: 'Anyone' (IMPORTANT: Must be 'Anyone' so the website can post errors)
 *    - Click 'Deploy' and authorize access.
 * 5. Copy the generated Web App URL (starts with https://script.google.com/macros/s/...)
 * 6. Add this URL to your .env file in vyom:
 *    GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 *
 * That's it! Every reported error will instantly append as a row in your sheet.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // Automatically set up the header row if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Report ID",
        "Timestamp (UTC)",
        "Category",
        "Error Description",
        "Reporter Email",
        "Page URL",
        "Screen Resolution",
        "User Agent / Browser"
      ]);

      // Style header row with Vyom Midnight Navy & White text
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#09132E");
      headerRange.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = { description: e.postData.contents };
      }
    }

    // Append the error report row
    sheet.appendRow([
      payload.id || ("ERR-" + new Date().getTime()),
      payload.timestamp || new Date().toISOString(),
      payload.category || "General Error",
      payload.description || "",
      payload.email || "Anonymous",
      payload.pageUrl || "",
      payload.screenResolution || "",
      payload.userAgent || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", id: payload.id }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("Vyom Error Reporting Webhook is active and healthy.")
    .setMimeType(ContentService.MimeType.TEXT);
}
