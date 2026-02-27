const metaService = require("../services/metaService");

const determinarFlujo = async (numero, mensajeRecibido, name = "Cliente") => {
  try {

    const texto = mensajeRecibido
      ?.toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const urlRequisitos =
      "https://drive.google.com/uc?export=download&id=1HBRYma72_lk4iITQGsKrW17e_RxDmTeq";

    const mostrarMenu = async () => {
      await metaService.enviarBotones(
        numero,
        `Hola ${name} 👋 Bienvenido a COORPORACION FLYHOUSE SAC 🏡\n\nSelecciona una opción o escribe "requisitos"`
      );
    };

    // GRACIAS
    if (texto.includes("gracias")) {
      return await metaService.enviarMensajeTexto(
        numero,
        "De nada 😊 estoy aquí para ayudarte,GRACIAS POR CONFIAR EN FLYHOUSE ."
      );
    }

    // SALUDO
    if (texto === "hola" || texto === "menu" || texto === "inicio") {
      return await mostrarMenu();
    }

    // HORARIO
    if (texto === "HORARIO" || texto.includes("horario")) {
      return await metaService.enviarMensajeTexto(
        numero,
        "Horario:\nLunes a Viernes\n8am - 1pm\n3pm - 7pm"
      );
    }

    // UBICACION
    if (texto === "UBICACION" || texto.includes("ubicacion")) {
      return await metaService.enviarMensajeTexto(
        numero,
        "Estamos en Teniente Secada 400, Yurimaguas"
      );
    }

    // ASESOR
    if (texto === "ASESOR" || texto.includes("asesor")) {
      return await metaService.enviarMensajeTexto(
        numero,
        "Un asesor te contactará en breve."
      );
    }

    // REQUISITOS (detecta errores como requistos)
    if (texto.includes("requis")) {
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

    await mostrarMenu();

  } catch (error) {
    console.error("❌ Error en flujo:", error);
  }
};

module.exports = { determinarFlujo };
