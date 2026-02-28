const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function guardarCita({ fecha, telefono, nombre, mensaje }) {
  const client = await auth.getClient();

  const sheets = google.sheets({ version: "v4", auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Hoja1!A:D",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[fecha, telefono, nombre, mensaje]],
    },
  });
}

module.exports = { guardarCita };