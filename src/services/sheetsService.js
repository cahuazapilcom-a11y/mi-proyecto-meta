const { google } = require('googleapis');
const path = require('path');

// Esta ruta busca el archivo físico que ya tienes en el proyecto
const KEYFILEPATH = path.join(process.cwd(), 'src', 'credentials', 'credentials.json');

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function guardarCita({ fecha, telefono, nombre, mensaje }) {
    const sheets = google.sheets({ version: 'v4', auth });
    
    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Hoja1!A1', // Verifica que tu hoja se llame Hoja1
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [[fecha, telefono, nombre, mensaje]]
        },
    });
}

module.exports = { guardarCita };