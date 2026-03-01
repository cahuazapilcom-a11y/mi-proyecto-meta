require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { determinarFlujo } = require("./flows/mainFlow");

const app = express();
app.use(bodyParser.json());

app.get("/webhook", (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === verify_token) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const numero = message.from;
      const texto =
        message.type === "interactive"
          ? message.interactive.button_reply.id
          : message.text?.body;

      await determinarFlujo(numero, texto);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error webhook:", error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));