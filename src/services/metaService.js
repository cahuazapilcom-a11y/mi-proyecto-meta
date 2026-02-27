const axios = require("axios");

const URL = `https://graph.facebook.com/${process.env.META_VERSION}/${process.env.META_PHONE_ID}/messages`;

const HEADERS = {
  Authorization: `Bearer ${process.env.META_TOKEN}`,
  "Content-Type": "application/json"
};

const enviarMensajeTexto = async (numero, texto) => {
  try {
    await axios.post(
      URL,
      {
        messaging_product: "whatsapp",
        to: numero,
        type: "text",
        text: { body: texto }
      },
      { headers: HEADERS }
    );
  } catch (error) {
    console.error("❌ Error texto:", error.response?.data || error.message);
  }
};

const enviarMensajePDF = async (numero, urlPdf, nombreArchivo) => {
  try {
    await axios.post(
      URL,
      {
        messaging_product: "whatsapp",
        to: numero,
        type: "document",
        document: {
          link: urlPdf,
          filename: nombreArchivo
        }
      },
      { headers: HEADERS }
    );
  } catch (error) {
    console.error("❌ Error PDF:", error.response?.data || error.message);
  }
};

const enviarBotones = async (numero, cuerpoTexto) => {
  try {
    await axios.post(
      URL,
      {
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
                reply: { id: "UBICACION", title: "Ubicacion" }
              },
              {
                type: "reply",
                reply: { id: "ASESOR", title: "Asesor" }
              }
            ]
          }
        }
      },
      { headers: HEADERS }
    );
  } catch (error) {
    console.error("❌ Error botones:", error.response?.data || error.message);
  }
};

module.exports = {
  enviarMensajeTexto,
  enviarMensajePDF,
  enviarBotones
};
