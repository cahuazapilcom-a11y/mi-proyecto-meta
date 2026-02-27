const metaService = require("../services/metaService");

/* ==============================
   NORMALIZAR TEXTO
============================== */
const normalizarTexto = (texto = "") => {
  return texto
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

/* ==============================
   FLUJO PRINCIPAL
============================== */
const determinarFlujo = async (numero, mensaje, name = "Cliente") => {
  try {

    if (!numero) return;

    /* ==================================
       DETECTAR SI ES BOTÓN O TEXTO
    ================================== */
    let texto = "";

    if (mensaje?.text?.body) {
      texto = normalizarTexto(mensaje.text.body);
    }

    if (mensaje?.interactive?.button_reply?.id) {
      texto = normalizarTexto(mensaje.interactive.button_reply.id);
    }

    if (!texto) return;

    const urlRequisitos =
      "https://drive.google.com/uc?export=download&id=1HBRYma72_lk4iITQGsKrW17e_RxDmTeq";

    /* ==================================
       MENÚ
    ================================== */
    const mostrarMenu = async () => {
      return await metaService.enviarBotones(
        numero,
        `Hola ${name} 👋 Bienvenido a *COORPORACION FLYHOUSE SAC* 🏡\n\nSelecciona una opción:`
      );
    };

    /* ==================================
       RESPUESTAS
    ================================== */
    switch (true) {

      /* ===== GRACIAS ===== */
      case texto.includes("gracias"):
        return await metaService.enviarMensajeTexto(
          numero,
          "😊 De nada, estoy aquí para ayudarte.GRACIAS POR CONFIAR EN FLYHOUSE ."
        );

      /* ===== SALUDO ===== */
      case ["hola", "menu", "inicio"].includes(texto):
        return await mostrarMenu();

      /* ===== HORARIO ===== */
      case ["horario", "horarios", "1"].includes(texto):
        return await metaService.enviarMensajeTexto(
          numero,
          "🕒 Nuestro horario:\n\nLunes a Viernes\n8:00 AM - 1:00 PM\n3:00 PM - 7:00 PM"
        );

      /* ===== UBICACIÓN ===== */
      case ["ubicacion", "2"].includes(texto):
        return await metaService.enviarMensajeTexto(
          numero,
          "📍 Estamos en:\nTeniente Secada 400\nYurimaguas - Perú 🇵🇪"
        );

      /* ===== ASESOR ===== */
      case ["asesor", "3"].includes(texto):
        return await metaService.enviarMensajeTexto(
          numero,
          `✅ ${name}, un asesor te contactará en breve.`
        );

      /* ===== REQUISITOS ===== */
      case ["requisito", "requisitos", "4"].includes(texto):
        await metaService.enviarMensajeTexto(
          numero,
          "📄 Te envío los requisitos..."
        );

        return await metaService.enviarMensajePDF(
          numero,
          urlRequisitos,
          "Requisitos_Techo_Propio.pdf"
        );

      /* ===== DEFAULT ===== */
      default:
        return await mostrarMenu();
    }

  } catch (error) {
    console.error("❌ Error en flujo:", error);
  }
};

module.exports = { determinarFlujo };
