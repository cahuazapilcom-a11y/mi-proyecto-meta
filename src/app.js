const express = require("express");
const { determinarFlujo } = require("./flows/mainFlow");

const app = express();
app.use(express.json());

/* =========================================
   CONTROL DE MENSAJES PROCESADOS (ANTI DUPLICADO)
========================================= */
const mensajesProcesados = new Set();

/* =========================================
   VERIFICACIÓN WEBHOOK (GET)
========================================= */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

/* =========================================
   RECEPCIÓN DE MENSAJES (POST)
========================================= */
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    // ⚠️ Responder inmediatamente a Meta (evita reintentos)
    res.status(200).send("EVENT_RECEIVED");

    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    // 🔴 Ignorar si no es evento de mensaje
    if (!value?.messages) return;

    const mensajeObj = value.messages[0];

    // 🔴 Evitar procesar el mismo mensaje 2 veces
    if (mensajesProcesados.has(mensajeObj.id)) {
      console.log("⚠️ Mensaje duplicado ignorado:", mensajeObj.id);
      return;
    }

    mensajesProcesados.add(mensajeObj.id);

    const numeroUsuario = mensajeObj.from;
    const contact = value?.contacts?.[0];
    const name = contact?.profile?.name || "amigo(a)";

    console.log(`📩 Mensaje de ${name}`);

    // 🔥 Ahora enviamos el OBJETO COMPLETO al flujo (no solo texto)
    await determinarFlujo(numeroUsuario, mensajeObj, name);

  } catch (error) {
    console.error("❌ Error en webhook:", error);
  }
});

/* =========================================
   INICIAR SERVIDOR
========================================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
