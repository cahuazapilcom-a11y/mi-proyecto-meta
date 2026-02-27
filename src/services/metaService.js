const axios = require("axios");

const URL = `https://graph.facebook.com/${process.env.META_VERSION}/${process.env.META_PHONE_ID}/messages`;

const HEADERS = {
  Authorization: `Bearer ${process.env.META_TOKEN}`,
  "Content-Type": "application/json"
};

const enviarMensajeTexto = async (numero, texto) => {
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
};

const enviarMensajePDF = async (numero, urlPdf, nombreArchivo) => {
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
};

const enviarMensajeImagen = async (numero, imageUrl, caption = "") => {
  await axios.post(
    URL,
    {
      messaging_product: "whatsapp",
      to: numero,
      type: "image",
      image: {
        link: imageUrl,
        caption: caption
      }
    },
    { headers: HEADERS }
  );
};

const enviarBotones = async (numero, cuerpoTexto, botones) => {
  await axios.post(
    URL,
    {
      messaging_product: "whatsapp",
      to: numero,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: cuerpoTexto },
        action: {
          buttons: botones.map((btn) => ({
            type: "reply",
            reply: {
              id: btn.id,
              title: btn.title
            }
          }))
        }
      }
    },
    { headers: HEADERS }
  );
};

module.exports = {
  enviarMensajeTexto,
  enviarMensajePDF,
  enviarMensajeImagen,
  enviarBotones
};
