const metaService = require("../services/metaService");

const determinarFlujo = async (numero, mensajeRecibido, name = "Cliente") => {
  try {
    // 🔎 Limpiar texto (minúsculas, sin tildes ni símbolos raros)
    const texto = mensajeRecibido
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, "");

    // 🔗 Link PDF en descarga directa (IMPORTANTE)
    const urlRequisitos =
      "https://drive.google.com/uc?export=download&id=1HBRYma72_lk4iITQGsKrW17e_RxDmTeq";

    const mensajeBienvenida = `¡Hola ${name}! 👋  
Bienvenido a *FLYHOUSE* 🏡  

Te puedo ayudar con:

1️⃣ Horarios  
2️⃣ Ubicación  
3️⃣ Hablar con asesor  
4️⃣ Requisitos Techo Propio  

Escribe el número o la palabra.`;

    /* ==============================
       SALUDO
    ============================== */
    if (
      texto === "hola" ||
      texto === "hi" ||
      texto === "inicio" ||
      texto === "menu"
    ) {
      await metaService.enviarMensajeTexto(numero, mensajeBienvenida);
    }

    /* ==============================
       HORARIOS
    ============================== */
    else if (
      texto.includes("horario") ||
      texto.includes("hoario") ||
      texto === "1"
    ) {
      await metaService.enviarMensajeTexto(
        numero,
        "🕒 Nuestro horario de atención es:\n\nLunes a Viernes\n8:00 AM a 1:00 PM\n3:00 PM a 7:00 PM"
      );
    }

    /* ==============================
       UBICACIÓN
    ============================== */
    else if (texto.includes("ubicacion") || texto === "2") {
      await metaService.enviarMensajeTexto(
        numero,
        "📍 Nos encontramos en:\nTeniente Secada 400\nYurimaguas, Perú 🇵🇪"
      );
    }

    /* ==============================
       ASESOR
    ============================== */
    else if (texto.includes("asesor") || texto === "3") {
      await metaService.enviarMensajeTexto(
        numero,
        `✅ ${name}, he notificado a un asesor. Te contactará en breve.`
      );
    }

    /* ==============================
       REQUISITOS (PDF)
    ============================== */
    else if (texto.includes("requisito") || texto === "4") {
      await metaService.enviarMensajeTexto(
        numero,
        "📄 Te envío los requisitos en PDF. Un momento..."
      );

      await metaService.enviarMensajePDF(
        numero,
        urlRequisitos,
        "Requisitos_Techo_Propio.pdf"
      );
    }

    /* ==============================
       NO ENTENDIDO
    ============================== */
    else {
      await metaService.enviarMensajeTexto(
        numero,
        "🤔 No entendí tu mensaje.\n\nEscribe *Hola* para ver el menú principal."
      );
    }
  } catch (error) {
    console.error("❌ Error en determinarFlujo:", error);
  }
};

module.exports = { determinarFlujo };
