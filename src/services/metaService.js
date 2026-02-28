const axios = require("axios");

/* =========================
   VALIDACIÓN DE ENTORNO
========================= */
const {
  META_VERSION,
  META_PHONE_ID,
  META_TOKEN
} = process.env;

if (!META_VERSION || !META_PHONE_ID || !META_TOKEN) {
  throw new Error("❌ Faltan variables de entorno META_VERSION, META_PHONE_ID o META_TOKEN");
}

const URL = `https://graph.facebook.com/${META_VERSION}/${META_PHONE_ID}/messages`;

const axiosInstance = axios.create({
  baseURL: URL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${META_TOKEN}`,
    "Content-Type": "application/json"
  }
});

/* =========================
   FUNCIÓN BASE
========================= */
const enviarPeticion = async (payload) => {
  try {
    const response = await axiosInstance.post("", payload);
    return response.data;
  } catch (error) {
    const errorData = error.response?.data || error.message;
    console.error("❌ Error WhatsApp API:", JSON.stringify(errorData, null, 2));
    throw errorData;
  }
};

/* =========================
   TEXTO
========================= */
const enviarMensajeTexto = async (numero, texto) => {
  if (!numero || !texto) return;

  return await enviarPeticion({
    messaging_product: "whatsapp",
    to: numero,
    type: "text",
    text: { body: texto }
  });
};

/* =========================
   PDF
========================= */
const enviarMensajePDF = async (numero, urlPdf, nombreArchivo = "documento.pdf") => {
  if (!numero || !urlPdf) return;

  return await enviarPeticion({
    messaging_product: "whatsapp",
    to: numero,
    type: "document",
    document: {
      link: urlPdf,
      filename: nombreArchivo
    }
  });
};

/* =========================
   BOTONES (ACTUALIZADO)
========================= */
const enviarBotones = async (numero, cuerpoTexto) => {
  if (!numero || !cuerpoTexto) return;

  return await enviarPeticion({
    messaging_product: "whatsapp",
    to: numero,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: cuerpoTexto
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: { id: "HORARIO", title: "Horarios" }
          },
          {
            type: "reply",
            reply: { id: "UBICACION", title: "Ubicación" }
          },
          {
            type: "reply",
            reply: { id: "ASESOR", title: "Asesor" }
          },
          {
            type: "reply",
            reply: { id: "CITA", title: "Agendar Cita" }
          }
        ]
      }
    }
  });
};

/* =========================
   EXPORTAR
========================= */
module.exports = {
  enviarMensajeTexto,
  enviarMensajePDF,
  enviarBotones
};