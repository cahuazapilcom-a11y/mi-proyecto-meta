const { addKeyword } = require('@bot-whatsapp/bot');
const { guardarCita } = require('../services/sheetsService');

/* ==============================
   FLUJO PRINCIPAL
============================== */

const mainFlow = addKeyword(['hola', 'buenas', 'info', 'inicio', 'menu'])
  .addAnswer(
    null,
    null,
    async (ctx, { flowDynamic }) => {

      const name =
        ctx.pushName ||
        ctx.message?.profile?.name ||
        ctx.from;

      await flowDynamic(
        `Hola ${name} 👋 bienvenido a *FLYHOUSE*, tu consulta en línea.\n\n` +
        `Selecciona una opción:\n\n` +
        `1️⃣ Ubicación\n` +
        `2️⃣ Agendar cita\n` +
        `3️⃣ Asesor`
      );
    }
  )

  /* ==============================
     UBICACIÓN
  ============================== */
  .addAnswer(
    ['1', 'ubicacion', 'Ubicación'],
    null,
    async (ctx, { flowDynamic }) => {
      await flowDynamic("📍 Nos encontramos en: [TU DIRECCIÓN AQUÍ]");
      await flowDynamic("Aquí tienes nuestra ubicación en Google Maps: https://maps.app.goo.gl/D1o8jzQHbe3JPr2KA");
    }
  )

  /* ==============================
     ASESOR
  ============================== */
  .addAnswer(
    ['3', 'asesor', 'Asesor'],
    null,
    async (ctx, { flowDynamic }) => {
      await flowDynamic("👨‍💼 En un momento un asesor de *FLYHOUSE* se pondrá en contacto contigo.");
    }
  )

  /* ==============================
     AGENDAR CITA - PASO 1
  ============================== */
  .addAnswer(
    ['2', 'agendar cita', 'Agendar cita'],
    { capture: true },
    async (ctx, { flowDynamic, state }) => {

      const name =
        ctx.pushName ||
        ctx.message?.profile?.name ||
        ctx.from;

      await state.update({ nombre: name });

      await flowDynamic("Perfecto 👍 ¿Para qué fecha deseas agendar la visita?");
    }
  )

  /* ==============================
     AGENDAR CITA - PASO 2
  ============================== */
  .addAnswer(
    "Por favor, indícanos la fecha (Ejemplo: Lunes 15 de Marzo a las 4pm)",
    { capture: true },
    async (ctx, { state, flowDynamic }) => {

      const nombreUsuario = state.get('nombre');
      const fechaCita = ctx.body;

      // Guardar en Google Sheets
      await guardarCita({
        fecha: fechaCita,
        telefono: ctx.from,
        nombre: nombreUsuario,
        mensaje: "Interesado en visita inmobiliaria"
      });

      await flowDynamic(
        `✅ ¡Excelente, ${nombreUsuario}! Tu cita ha sido registrada para el ${fechaCita}.`
      );

      await flowDynamic(
        "🏡 Te enviamos nuestro catálogo de propiedades: https://tu-link-de-catalogo.com"
      );
    }
  );

module.exports = mainFlow;