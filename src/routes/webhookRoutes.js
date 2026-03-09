import express from "express";
import messageHandler from "../services/messageHandler.js";
import config from "../config/env.js";

const router = express.Router();

/* 🔹 VERIFICACIÓN DEL WEBHOOK (Meta) */
router.get("/", (req, res) => {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === config.WEBHOOK_VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});


/* 🔹 RECEPCIÓN DE MENSAJES */
router.post("/", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    const message = value?.messages?.[0];
    const contact = value?.contacts?.[0];

    if (message) {
      await messageHandler.handleIncomingMessage(message, contact);
    }

    res.sendStatus(200);

  } catch (error) {
    console.error("Error webhook:", error);
    res.sendStatus(500);
  }
});

export default router;