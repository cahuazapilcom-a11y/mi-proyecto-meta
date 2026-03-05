require("dotenv").config();

const express = require("express");
const { handleIncomingMessage } = require("./flows/mainFlow");

const app = express();

app.use(express.json());


// ========================
// VERIFICAR WEBHOOK
// ========================

app.get("/webhook", (req, res) => {

  const verifyToken = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }

});


// ========================
// RECIBIR MENSAJES
// ========================

app.post("/webhook", async (req, res) => {

  try {

    const body = req.body;

    if (body.object) {

      const message =
        body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      const profile =
        body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile;

      const senderInfo =
        body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];

      if (message) {
        await handleIncomingMessage(message, profile, senderInfo);
      }

      res.sendStatus(200);

    } else {

      res.sendStatus(404);

    }

  } catch (error) {

    console.error("Webhook error:", error);

    res.sendStatus(500);

  }

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});