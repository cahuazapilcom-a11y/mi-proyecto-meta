import path from 'path';
import { google } from 'googleapis';

const sheets = google.sheets('v4');

const appendToSheet = async (values) => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: path.join(process.cwd(), 'src/credentials', 'credentials.json'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const authClient = await auth.getClient();
        const spreadsheetId = '153jUI87fT7z2ThWuw-E6NSa0aPGD6KvYxPDKPUXR6H8';

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Hoja1', // Asegúrate que la hoja se llame 'reservas'
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: { values: [values] },  
            auth: authClient,
        });
        
        return true;
    } catch (error) {
        console.error("Error en Google Sheets:", error);
        return false;
    }
}

export default appendToSheet;