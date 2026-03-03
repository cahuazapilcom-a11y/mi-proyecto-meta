// metaService.js

const axios = require("axios");
const { google } = require("googleapis");

// ============================
// CONFIG META
// ============================

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// ============================
// ENVIAR MENSAJE
// ============================

async function sendTextMessage(to, message) {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error enviando mensaje:", error.response?.data || error);
  }
}

// ============================
// GOOGLE SHEETS
// ============================

async function saveAppointment(data) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Citas!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            data.nombre,
            data.telefono,
            data.fecha,
            data.fechaRegistro,
          ],
        ],
      },
    });

    console.log("Cita guardada en Google Sheets");
  } catch (error) {
    console.error("Error guardando en Sheets:", error);
  }
}

module.exports = { sendTextMessage, saveAppointment };