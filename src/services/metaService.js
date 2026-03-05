const axios = require("axios");

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

const URL = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;

/* =========================
MENSAJE TEXTO
========================= */

async function sendTextMessage(to, message) {

  await axios.post(
    URL,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message }
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

/* =========================
BOTONES
========================= */

async function sendButtons(to, body, buttons) {

  await axios.post(
    URL,
    {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: body },
        action: {
          buttons
        }
      }
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

module.exports = {
  sendTextMessage,
  sendButtons
};