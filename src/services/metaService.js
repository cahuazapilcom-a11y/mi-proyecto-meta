const axios = require("axios");

const {
  META_VERSION,
  META_PHONE_ID,
  META_TOKEN
} = process.env;

if (!META_VERSION || !META_PHONE_ID || !META_TOKEN) {
  throw new Error("Faltan variables de entorno META_VERSION, META_PHONE_ID o META_TOKEN");
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

const enviarPeticion = async (payload) => {
  try {
    const response = await axiosInstance.post("", payload);
    return response.data;
  } catch (error) {
    console.error("Error WhatsApp API:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

const enviarMensajeTexto = async (numero, texto) => {
  return enviarPeticion({
    messaging_product: "whatsapp",
    to: numero,
    type: "text",
    text: { body: texto }
  });
};

const enviarBotones = async (numero, cuerpoTexto) => {
  return enviarPeticion({
    messaging_product: "whatsapp",
    to: numero,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: cuerpoTexto },
      action: {
        buttons: [
          {
            type: "reply",
            reply: { id: "UBICACION", title: "Ubicación" }
          },
          {
            type: "reply",
            reply: { id: "AGENDAR", title: "Agendar cita" }
          },
          {
            type: "reply",
            reply: { id: "ASESOR", title: "Asesor" }
          }
        ]
      }
    }
  });
};

module.exports = {
  enviarMensajeTexto,
  enviarBotones
};