const { google } = require("googleapis");

// 1. Limpiamos la llave directamente desde la variable de entorno
const privateKey = process.env.GOOGLE_PRIVATE_KEY 
    ? process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n') 
    : null;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: privateKey,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

async function agregarFila(datos = []) {
  try {
    // Asegúrate de que el SPREADSHEET_ID sea el correcto
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Hoja1", // <--- IMPORTANTE: Verifica el nombre de la pestaña
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [datos],
      },
    });
    console.log("✅ Guardado en Sheets");
  } catch (error) {
    // Esto te dará más detalles si vuelve a fallar
    console.error("❌ Error Sheets:", error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { agregarFila };
