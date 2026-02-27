const metaService = require("../services/metaService");

const determinarFlujo = async (numero, mensajeRecibido, name = "Cliente") => {
  try {

    // 🔎 Normalizar texto (minúsculas y sin tildes)
    const texto = mensajeRecibido
      ?.toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const urlRequisitos =
      "https://drive.google.com/uc?export=download&id=1HBRYma72_lk4iITQGsKrW17e_RxDmTeq";

    /* ==============================
       MENÚ CON BOTONES
    ============================== */
    const mostrarMenu = async () => {
      await metaService.enviarBotones(
        numero,
        `Hola ${name} 👋 Bienvenido a *FLYHOUSE* 🏡\n\nSelecciona una opción:`,
        [
          { id: "HORARIO", title: "🕒 Horarios" },
          { id: "UBICACION", title: "📍 Ubicación" },
          { id: "ASESOR", title: "👨‍💼 Asesor" },
          { id: "REQUISITOS", title: "📄 Requisitos" }
        ]
      );
    };

    /* ==============================
       RESPUESTA A GRACIAS
    ============================== */
    if (texto.includes("gracias")) {
      return await metaService.enviarMensajeTexto(
        numero,
        "😊 De nada, estoy aquí para ayudarte."
      );
    }

    /* ==============================
       SALUDO
    ============================== */
    if (texto === "hola" || texto === "menu" || texto === "inicio") {
      return await mostrarMenu();
    }

    /* ==============================
       HORARIO
    ============================== */
    if (
      texto === "horario" ||
      texto === "horarios" ||
      texto === "1" ||
      texto === "HORARIO"
    ) {
      return await metaService.enviarMensajeTexto(
        numero,
        "🕒 Nuestro horario:\n\nLunes a Viernes\n8:00 AM - 1:00 PM\n3:00 PM - 7:00 PM"
      );
    }

    /* ==============================
       UBICACIÓN
    ============================== */
    if (
      texto === "ubicacion" ||
      texto === "2" ||
      texto === "UBICACION"
    ) {
      return await metaService.enviarMensajeTexto(
        numero,
        "📍 Estamos en:\nTeniente Secada 400\nYurimaguas - Perú 🇵🇪"
      );
    }

    /* ==============================
       ASESOR
    ============================== */
    if (
      texto === "asesor" ||
      texto === "3" ||
      texto === "ASESOR"
    ) {
      return await metaService.enviarMensajeTexto(
        numero,
        `✅ ${name}, un asesor te contactará en breve.`
      );
    }

    /* ==============================
       REQUISITOS (detecta errores)
    ============================== */
    if (
      texto.includes("requisito") ||
      texto.includes("requisto") ||
      texto.includes("requistos") ||
      texto.includes("reqisito") ||
      texto.includes("reqisitos") ||
      texto === "4" ||
      texto === "REQUISITOS"
    ) {
      await metaService.enviarMensajeTexto(
        numero,
        "📄 Te envío los requisitos en PDF. Un momento..."
      );

      return await metaService.enviarMensajePDF(
        numero,
        urlRequisitos,
        "Requisitos_Techo_Propio.pdf"
      );
    }

    /* ==============================
       SI NO ENTIENDE
    ============================== */
    await mostrarMenu();

  } catch (error) {
    console.error("❌ Error en flujo:", error);
  }
};

module.exports = { determinarFlujo };
