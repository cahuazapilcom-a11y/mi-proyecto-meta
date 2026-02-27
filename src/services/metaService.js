const axios = require("axios");

const URL = `https://graph.facebook.com/${process.env.META_VERSION}/${process.env.META_PHONE_ID}/messages`;

const HEADERS = {
  Authorization: `Bearer ${process.env.META_TOKEN}`,
  "Content-Type": "application/json"
};

/* =========================
   ENVIAR MENSAJE DE TEXTO
========================= */
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

    console.log("✅ Texto enviado");
  } catch (error) {
    console.error("❌ Error enviando texto:", error.response?.data || error.message);
  }
};


/* =========================
   ENVIAR PDF (DOCUMENTO)
========================= */
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

    console.log("✅ PDF enviado correctamente");
  } catch (error) {
    console.error("❌ Error enviando PDF:", error.response?.data || error.message);
  }
};


/* =========================
   ENVIAR IMAGEN
========================= */
const enviarMensajeImagen = async (numero, imageUrl, caption = "") => {
  try {
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

    console.log("✅ Imagen enviada correctamente");
  } catch (error) {
    console.error("❌ Error enviando imagen:", error.response?.data || error.message);
  }
};


module.exports = {
  enviarMensajeTexto,
  enviarMensajePDF,
  enviarMensajeImagen
};
