# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Form submissions to Google Sheets (Option A)

This project now uses:

- Frontend form -> `POST /api/submit`
- Local dev (`npm run dev`) -> Vite proxy sends `/api/submit` directly to your Google Apps Script URL from `.env`
- Production -> `api/submit.js` forwards requests server-side using `APPS_SCRIPT_URL`

### 1) Google Apps Script (linked to your sheet)

Use this script in the spreadsheet that has the tab named `Applications`:

```javascript
const SHEET_NAME = 'Applications';

const HEADERS = [
  'submittedAt',
  'firstName',
  'lastName',
  'fullName',
  'age',
  'gender',
  'state',
  'email',
  'whatsapp',
  'linkedin',
  'track',
  'jobOrBusiness',
  'industry',
  'years',
  'currentWork',
  'satisfactionScore',
  'satisfactionWhy',
  'gap',
  'burningQuestion',
  'vision',
  'ordinaryWhen',
  'videoFileName',
  'videoLink',
  'canAttendLaunch',
  'commitmentScore',
  'commitmentWhy',
  'hearAbout',
  'referrer',
  'hearOtherSpecify',
  'declarationAgreed',
  'signFullName',
  'signDate',
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  } else {
    const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    const mismatch = HEADERS.some((h, i) => String(firstRow[i] || '').trim() !== h);
    if (mismatch) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    }
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const sheet = getSheet_();
    const row = HEADERS.map((field) => {
      if (field === 'submittedAt') return new Date().toISOString();
      const value = data[field];
      return value === undefined || value === null ? '' : value;
    });
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

Deploy as Web App:

- Execute as: `Me`
- Who has access: `Anyone`
- Copy the `/exec` URL

### 2) Local `.env`

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/your-script-id/exec
```

Restart dev server after editing `.env`.

### 3) Production environment variables

Set these on your host (e.g. Vercel):

- `APPS_SCRIPT_URL` = your Apps Script `/exec` URL

