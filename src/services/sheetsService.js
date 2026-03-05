const { google } = require("googleapis");

async function guardarCita(data) {

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({
    version: "v4",
    auth
  });

  await sheets.spreadsheets.values.append({

    spreadsheetId: process.env.SPREADSHEET_ID,

    range: "hoja1",

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

}

module.exports = { guardarCita };