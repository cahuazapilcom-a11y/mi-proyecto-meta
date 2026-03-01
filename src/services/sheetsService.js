const { google } = require("googleapis");

if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
  throw new Error("❌ GOOGLE_SERVICE_ACCOUNT no está definida en Render");
}

if (!process.env.SPREADSHEET_ID) {
  throw new Error("❌ SPREADSHEET_ID no está definido");
}

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

const auth = new google.auth.GoogleAuth({
  credentials: {
    ...serviceAccount,
    private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

async function agregarFila(datos = []) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Hoja1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [datos],
      },
    });

    console.log("✅ Guardado en Sheets");
  } catch (error) {
    console.error("❌ Error Sheets:", error.message);
    throw error;
  }
}

module.exports = { agregarFila };
