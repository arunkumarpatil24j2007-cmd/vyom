# Vyom Google Sheets Error Reporting Integration Guide

This guide explains how your new global **Report Issue** button automatically synchronizes error reports directly into a Google Sheet.

---

## 1. How It Works
1. Any user on any page of Vyom can click the floating **Report Issue** button in the bottom corner.
2. A modal opens allowing the user to select an issue category, describe what happened, and optionally leave an email. The system automatically attaches the current page URL, screen resolution, browser user agent, and timestamp.
3. The report is:
   - **Immediately logged locally** to `data/error_reports.json` on the server so no report is ever lost.
   - **Instantly forwarded** to your connected Google Sheet via Google Apps Script Webhook.

---

## 2. 60-Second Setup to Connect Your Google Sheet

### Step 1: Open or Create a Google Sheet
Create a new blank sheet at [sheets.new](https://sheets.new) or open your existing Google Sheet. (Name it e.g. **Vyom — Issue & Error Reports**).

### Step 2: Open Apps Script
In the top menu bar of your Google Sheet, click:  
**Extensions** > **Apps Script**

### Step 3: Paste the Webhook Script
1. Delete any sample code inside the editor.
2. Open [`scripts/google_apps_script.js`](file:///Users/arunkumarpatil/vyom/scripts/google_apps_script.js) in your project, copy the entire code, and paste it into the Apps Script editor.
3. Click the disk icon (**Save project**).

### Step 4: Deploy as a Web App
1. In the top-right corner of the Apps Script window, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon (**Select type**) next to "Select type" and choose **Web app**.
3. Configure the deployment settings:
   - **Description:** `Vyom Error Reporter`
   - **Execute as:** `Me (your email)`
   - **Who has access:** `Anyone` *(Important: Must be set to 'Anyone' so the web application can send POST requests without individual Google logins)*.
4. Click **Deploy**.
5. When prompted, click **Authorize access**, select your Google account, click **Advanced** > **Go to Vyom Error Reporter (unsafe)** (standard Google Apps Script warning), and click **Allow**.

### Step 5: Add the Webhook URL to Vyom
Copy the generated **Web App URL** (starts with `https://script.google.com/macros/s/.../exec`).

Add it to your `.env` file in the root of `/Users/arunkumarpatil/vyom`:
```env
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

---

## 3. That's It!
Every time someone clicks the **Report Issue** button and submits:
- A new row will automatically appear in your Google Sheet with:
  - **Report ID**
  - **Timestamp (UTC)**
  - **Category**
  - **Error Description**
  - **Reporter Email**
  - **Page URL**
  - **Screen Resolution**
  - **User Agent / Browser**
- You can also view all historical reports anytime in [`data/error_reports.json`](file:///Users/arunkumarpatil/vyom/data/error_reports.json).
