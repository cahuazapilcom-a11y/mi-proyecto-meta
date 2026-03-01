const metaService = require("../services/metaService");
const { google } = require("googleapis");

const sesiones = {};

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const sheets = google.sheets({ version: "v4", auth });

const guardarEnSheets = async (datos) => {
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Hoja1!A:D",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        new Date().toLocaleString(),
        datos.nombre,
        datos.fecha,
        datos.telefono
      ]]
    }
  });
};

const determinarFlujo = async (numero, mensaje) => {
  const texto = mensaje.toLowerCase().trim();

  if (!sesiones[numero]) {
    sesiones[numero] = { paso: null };
  }

  const sesion = sesiones[numero];

  // BOTONES
  if (mensaje === "UBICACION") {
    return metaService.enviarMensajeTexto(
      numero,
      "📍 Estamos ubicados en Tarapoto.\nhttps://maps.google.com"
    );
  }

  if (mensaje === "ASESOR") {
    return metaService.enviarMensajeTexto(
      numero,
      "👨‍💼 Un asesor se comunicará contigo pronto."
    );
  }

  if (mensaje === "AGENDAR") {
    sesion.paso = "nombre";
    return metaService.enviarMensajeTexto(
      numero,
      "Perfecto 👍\nPor favor escribe tu nombre completo:"
    );
  }

  // FLUJO AGENDAR
  if (sesion.paso === "nombre") {
    sesion.nombre = mensaje;
    sesion.paso = "fecha";
    return metaService.enviarMensajeTexto(
      numero,
      "📅 ¿Qué fecha deseas para tu cita?"
    );
  }

  if (sesion.paso === "fecha") {
    sesion.fecha = mensaje;
    sesion.telefono = numero;

    await guardarEnSheets(sesion);

    delete sesiones[numero];

    return metaService.enviarMensajeTexto(
      numero,
      "✅ Tu cita fue agendada correctamente.\nNos comunicaremos contigo pronto."
    );
  }

  // MENÚ PRINCIPAL
  return metaService.enviarBotones(
    numero,
    "Bienvenido a Monarka Group 🏡\nSelecciona una opción:"
  );
};

module.exports = { determinarFlujo };