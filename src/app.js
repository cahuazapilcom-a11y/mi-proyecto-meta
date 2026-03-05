require("dotenv").config();
const express = require("express");
const { handleIncomingMessage } = require("./flows/mainFlow");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

/* =========================
VERIFICAR WEBHOOK META
========================= */

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook verificado");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

/* =========================
RECIBIR MENSAJES
========================= */

app.post("/webhook", async (req, res) => {
  try {

    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    const message = value?.messages?.[0];
    const contact = value?.contacts?.[0];

    if (message) {
      await handleIncomingMessage(message, contact);
    }

    res.sendStatus(200);

  } catch (error) {

    console.error("Error webhook:", error);
    res.sendStatus(500);

  }
});

/* =========================
SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});