const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  credentials: {
    ...JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    private_key: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT).private_key.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function agregarFila(datos = []) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Hoja1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [datos],
      },
    });

    console.log("✅ Datos guardados en Google Sheets");
  } catch (error) {
    console.error("❌ Error Sheets:", error.message);
  }
}

module.exports = { agregarFila };
