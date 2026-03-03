const metaService = require("../services/metaService");
const { guardarCita } = require("../services/sheetsService");

const sesiones = {};

const determinarFlujo = async (numero, mensaje) => {
  const texto = mensaje?.toLowerCase();

  if (!sesiones[numero]) {
    sesiones[numero] = { paso: "inicio" };
  }

  const sesion = sesiones[numero];

  /* =========================
     MENÚ PRINCIPAL
  ========================== */
  if (
    texto === "hola" ||
    texto === "menu" ||
    texto === "inicio"
  ) {
    sesion.paso = "menu";

    return await metaService.enviarMensaje(
      numero,
      `👋 Bienvenido a *FLYHOUSE*\n\n` +
      `1️⃣ Ubicación\n` +
      `2️⃣ Agendar cita\n` +
      `3️⃣ Asesor`
    );
  }

  /* =========================
     UBICACIÓN
  ========================== */
  if (texto === "1" || texto === "ubicacion") {
    return await metaService.enviarMensaje(
      numero,
      "📍 Nos encontramos en: [TU DIRECCIÓN AQUÍ]\n" +
      "Google Maps: https://maps.app.goo.gl/D1o8jzQHbe3JPr2KA"
    );
  }

  /* =========================
     ASESOR
  ========================== */
  if (texto === "3" || texto === "asesor") {
    return await metaService.enviarMensaje(
      numero,
      "👨‍💼 Un asesor se pondrá en contacto contigo."
    );
  }

  /* =========================
     AGENDAR CITA
  ========================== */
  if (texto === "2" || texto === "agendar cita") {
    sesion.paso = "fecha";

    return await metaService.enviarMensaje(
      numero,
      "📅 ¿Para qué fecha deseas agendar la visita?"
    );
  }

  if (sesion.paso === "fecha") {
    await guardarCita({
      fecha: mensaje,
      telefono: numero,
      nombre: numero,
      mensaje: "Interesado en visita inmobiliaria",
    });

    sesion.paso = "inicio";

    return await metaService.enviarMensaje(
      numero,
      `✅ Tu cita ha sido registrada para el ${mensaje}.`
    );
  }
};

module.exports = { determinarFlujo };