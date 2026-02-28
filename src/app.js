const express = require("express");
const { determinarFlujo } = require("./flows/mainFlow");

const app = express();
app.use(express.json());

/* =========================================
   CONTROL DE MENSAJES PROCESADOS (ANTI DUPLICADO)
========================================= */
const mensajesProcesados = new Set();

/* Limpieza automática cada 5 minutos
   (evita que el Set crezca infinito) */
setInterval(() => {
  mensajesProcesados.clear();
  console.log("🧹 Limpieza de mensajes procesados");
}, 5 * 60 * 1000);

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

    // ⚡ RESPONDER INMEDIATAMENTE A META
    res.status(200).send("EVENT_RECEIVED");

    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    if (!value?.messages) return;

    const mensajeObj = value.messages[0];

    // 🔴 Evitar duplicados
    if (mensajesProcesados.has(mensajeObj.id)) {
      console.log("⚠️ Mensaje duplicado ignorado:", mensajeObj.id);
      return;
    }

    mensajesProcesados.add(mensajeObj.id);

    const numeroUsuario = mensajeObj.from;
    const contact = value?.contacts?.[0];
    const name = contact?.profile?.name || "Cliente";

    console.log(`📩 Mensaje recibido de ${name} (${numeroUsuario})`);

    // 🔥 Aquí se ejecuta tu flujo (incluye agendado + Google Sheets)
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
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});