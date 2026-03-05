const { sendTextMessage } = require("../services/metaService");
const { guardarCita } = require("../services/sheetsService");
const { geminiAiService } = require("../services/geminiAiService");

const userStates = {};

function getUserName(profile, senderInfo) {
  return profile?.name || senderInfo?.wa_id;
}

async function handleIncomingMessage(message, profile, senderInfo) {

  try {

    const from = senderInfo.wa_id;
    const userName = getUserName(profile, senderInfo);

    const text = message?.text?.body?.toLowerCase().trim();

    if (!text) return;

    // ======================
    // BIENVENIDA
    // ======================

    if (["hola","hi","hello","buenas","menu"].includes(text)) {

      userStates[from] = { step: null };

      const msg = `👋 Hola *${userName}*

Bienvenido a *CORPORACIÓN FLYHOUSE SAC*

¿Cómo puedo ayudarte?

1️⃣ Requisitos TP
2️⃣ Agendar cita
3️⃣ Asesor en línea`;

      await sendTextMessage(from, msg);
      return;
    }

    // ======================
    // REQUISITOS
    // ======================

    if (text === "1" || text.includes("requisito")) {

      await sendTextMessage(from,

`📄 Información y requisitos:

Documento
https://www.facebook.com/share/1arsQ2uQkG/

📎 Archivo
https://drive.google.com/file/d/1HBRYma72_lk4iITQGsKrW17e_RxDmTeq/view

¿Necesitas algo más?`);

      return;
    }

    // ======================
    // AGENDAR CITA
    // ======================

    if (text === "2" || text.includes("cita")) {

      userStates[from] = { step: "waiting_name" };

      await sendTextMessage(from,
`Perfecto ${userName}

Escríbeme tu *nombre completo* para agendar la cita`);

      return;
    }

    // GUARDAR NOMBRE

    if (userStates[from]?.step === "waiting_name") {

      userStates[from].name = text;
      userStates[from].step = "waiting_date";

      await sendTextMessage(from,
`Gracias.

Ahora envíame la *fecha* para tu cita`);

      return;
    }

    // GUARDAR FECHA

    if (userStates[from]?.step === "waiting_date") {

      const data = {
        nombre: userStates[from].name,
        telefono: from,
        fecha: text,
        fechaRegistro: new Date().toISOString()
      };

      await guardarCita(data);

      await sendTextMessage(from,

`✅ Cita registrada correctamente.

Gracias por confiar en FLYHOUSE SAC`);

      userStates[from] = { step: null };

      return;
    }

    // ======================
    // ASESOR
    // ======================

    if (text === "3" || text.includes("asesor")) {

      await sendTextMessage(from,

`👨‍💼 Un asesor te contactará pronto.

Si deseas atención inmediata escribe:
"asesor urgente"`);

      return;
    }

    // ======================
    // UBICACIÓN
    // ======================

    if (text.includes("ubicacion")) {

      await sendTextMessage(from,

`📍 Nuestra ubicación:

https://maps.app.goo.gl/hLhhaGatonhgt8Jv8`);

      return;
    }

    // ======================
    // FALLBACK IA
    // ======================

    const aiResponse = await geminiAiService(text);

    await sendTextMessage(from, aiResponse);

  } catch (error) {

    console.error("Error en mainFlow:", error);

  }

}

module.exports = { handleIncomingMessage };