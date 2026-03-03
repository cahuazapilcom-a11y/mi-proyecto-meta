// mainFlow.js

const { sendTextMessage } = require("../services/metaService");
const { saveAppointment } = require("../services/sheetsService");

// Estado en memoria (para producción real usar DB o Redis)
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

    // =============================
    // BIENVENIDA
    // =============================
    if (
      ["hi", "hello", "hola", "hola!", "buenas", "buenos dias", "buenas tardes"].includes(text)
    ) {
      userStates[from] = { step: null };

      const welcomeMessage = `👋 Hola *${userName}*, bienvenido a *CORPORACIÓN FLYHOUSE SAC* ✈️

Estoy aquí para ayudarte 😊  
¿En qué puedo asistirte hoy?

1️⃣ Requisitos TP  
2️⃣ Agendar cita  
3️⃣ Asesor en línea`;

      await sendTextMessage(from, welcomeMessage);
      return;
    }

    // =============================
    // REQUISITOS
    // =============================
    if (text.includes("requisito") || text === "1") {
      await sendTextMessage(
        from,
        `📄 Te envío los requisitos y catálogo:

📍 Ubicación:
https://maps.app.goo.gl/D1o8jzQHbe3JPr2KA

📎 Documento:
https://tudominio.com/catalogo.pdf

¿Te puedo ayudar en algo más? 😊`
      );
      return;
    }

    // =============================
    // AGENDAR CITA - PASO 1
    // =============================
    if (text.includes("cita") || text === "2") {
      userStates[from] = { step: "waiting_name" };

      await sendTextMessage(
        from,
        `Perfecto *${userName}* 😊  
Por favor escríbeme tu *nombre completo* para agendar tu cita:`
      );
      return;
    }

    // =============================
    // GUARDAR NOMBRE
    // =============================
    if (userStates[from]?.step === "waiting_name") {
      userStates[from].name = text;
      userStates[from].step = "waiting_date";

      await sendTextMessage(
        from,
        `Gracias 🙌  
Ahora indícame la *fecha* que deseas para tu cita (ejemplo: 20/02/2026)`
      );
      return;
    }

    // =============================
    // GUARDAR FECHA Y ENVIAR A GOOGLE SHEETS
    // =============================
    if (userStates[from]?.step === "waiting_date") {
      const appointmentDate = text;

      const data = {
        nombre: userStates[from].name,
        telefono: from,
        fecha: appointmentDate,
        fechaRegistro: new Date().toISOString(),
      };

      await saveAppointment(data);

      await sendTextMessage(
        from,
        `✅ Tu cita fue agendada correctamente.

Muchas gracias por confiar en *FLYHOUSE* ✈️  
Nos comunicaremos contigo pronto.

¿Te puedo ayudar en algo más?`
      );

      userStates[from] = { step: null };
      return;
    }

    // =============================
    // ASESOR
    // =============================
    if (
      text.includes("asesor") ||
      text.includes("promotor") ||
      text === "3"
    ) {
      await sendTextMessage(
        from,
        `👨‍💼 Un asesor se pondrá en contacto contigo en breve.

También puedes escribir *"asesor en línea"* si deseas atención inmediata.`
      );
      return;
    }

    // =============================
    // UBICACIÓN
    // =============================
    if (text.includes("ubicacion") || text.includes("direccion")) {
      await sendTextMessage(
        from,
        `📍 Nos encontramos en:

[TU DIRECCIÓN AQUÍ]

Google Maps:
https://maps.app.goo.gl/D1o8jzQHbe3JPr2KA`
      );
      return;
    }

    // =============================
    // HORARIO
    // =============================
    if (text.includes("horario") || text.includes("hora")) {
      await sendTextMessage(
        from,
        `🕒 Nuestro horario de atención:

Lunes a Viernes  
⏰ 8:00 AM - 1:00 PM  
⏰ 3:00 PM - 7:00 PM`
      );
      return;
    }

    // =============================
    // GRACIAS
    // =============================
    if (text.includes("gracias")) {
      await sendTextMessage(
        from,
        `😊 De nada *${userName}*, estoy para ayudarte.

Gracias por confiar en FLYHOUSE ✈️`
      );
      return;
    }
  } catch (error) {
    console.error("Error en mainFlow:", error);
  }
}

module.exports = { handleIncomingMessage };