const { sendTextMessage, sendButtons } = require("../services/metaService");
const geminiAiService = require("../services/geminiAiService");
const { guardarCita } = require("../services/sheetsService");
const { getUserState, clearUserState } = require("../utils/userState");

async function handleIncomingMessage(message, contact) {

  const from = contact.wa_id;
  const name = contact.profile?.name || "cliente";

  const text = message?.text?.body?.toLowerCase();

  const state = getUserState(from);

/* =========================
BIENVENIDA
========================= */

if (text === "hola") {

await sendButtons(from,

`Hola ${name} 👋

Bienvenido a *FLYHOUSE SAC*

¿En qué podemos ayudarte?`,

[
{
type: "reply",
reply: { id: "info", title: "Información" }
},
{
type: "reply",
reply: { id: "cita", title: "Agendar cita" }
},
{
type: "reply",
reply: { id: "asesor", title: "Hablar asesor" }
}
]);

return;
}

/* =========================
AGENDAR CITA
========================= */

if (text === "agendar cita" || text === "cita") {

state.step = "nombre";

await sendTextMessage(from,"Por favor envíame tu nombre completo");

return;
}

if (state.step === "nombre") {

state.nombre = text;
state.step = "fecha";

await sendTextMessage(from,"¿Qué fecha deseas para tu cita?");

return;
}

if (state.step === "fecha") {

await guardarCita({

nombre: state.nombre,
telefono: from,
fecha: text,
fechaRegistro: new Date().toISOString()

});

clearUserState(from);

await sendTextMessage(from,"Tu cita fue agendada correctamente.");

return;
}

/* =========================
IA
========================= */

const aiResponse = await geminiAiService(text);

await sendTextMessage(from, aiResponse);

}

module.exports = { handleIncomingMessage };