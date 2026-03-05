const { google } = require("googleapis");

async function guardarCita(data) {
  try {

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Hoja1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          data.nombre,
          data.telefono,
          data.fecha,
          data.fechaRegistro
        ]]
      }
    });

    console.log("Cita guardada en Sheets");

  } catch (error) {
    console.error("Error guardando cita:", error);
    throw error;
  }
}

module.exports = { guardarCita };