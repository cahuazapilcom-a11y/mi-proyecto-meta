const metaService = require("../services/metaService");
const { guardarCita } = require("../services/sheetsService");

const sesiones = {}; // memoria temporal simple

const normalizarTexto = (texto = "") => {
  return texto
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const determinarFlujo = async (numero, mensaje, name = "Cliente") => {
  try {
    if (!numero) return;

    let texto = "";

    if (mensaje?.text?.body) {
      texto = normalizarTexto(mensaje.text.body);
    }

    if (mensaje?.interactive?.button_reply?.id) {
      texto = normalizarTexto(mensaje.interactive.button_reply.id);
    }

    if (!texto) return;

    const mostrarMenu = async () => {
      return await metaService.enviarBotones(
        numero,
        `Hola ${name} 👋 Bienvenido a *COORPORACION FLYHOUSE SAC.* 🏡\n\nSelecciona una opción:\n\n1️⃣ Horario\n2️⃣ Ubicación\n3️⃣ Asesor\n4️⃣ Requisitos\n5️⃣ Agendar Cita`
      );
    };

    /* ============================
       SI ESTÁ EN PROCESO DE CITA
    ============================ */

    if (sesiones[numero]?.estado === "esperando_datos") {

      const fecha = new Date().toLocaleString("es-PE");

      await guardarCita({
        fecha,
        telefono: numero,
        nombre: name,
        mensaje: mensaje.text?.body || "Sin mensaje"
      });

      delete sesiones[numero];

      return await metaService.enviarMensajeTexto(
        numero,
        "✅ Tu cita fue agendada correctamente. Un asesor te contactará pronto."
      );
    }

    switch (true) {

      case texto.includes("gracias"):
        return await metaService.enviarMensajeTexto(
          numero,
          "😊 De nada, gracias por confiar en FLYHOUSE."
        );

      case ["hola", "menu", "inicio"].includes(texto):
        return await mostrarMenu();

      case ["horario", "1"].includes(texto):
        return await metaService.enviarMensajeTexto(
          numero,
          "🕒 Lunes a Viernes\n8:00 AM - 1:00 PM\n3:00 PM - 7:00 PM"
        );

      case ["ubicacion", "2"].includes(texto):
        return await metaService.enviarMensajeTexto(
          numero,
          "📍 Teniente Secada 400\nYurimaguas - Perú 🇵🇪"
        );

      case ["asesor", "3"].includes(texto):
        return await metaService.enviarMensajeTexto(
          numero,
          `✅ ${name}, un asesor te contactará en breve.`
        );

      case ["requisitos", "4"].includes(texto):
        return await metaService.enviarMensajeTexto(
          numero,
          "📄 Te envío los requisitos..."
        );

      /* ===== AGENDAR CITA ===== */
      case ["5", "cita", "agendar"].includes(texto):

        sesiones[numero] = { estado: "esperando_datos" };

        return await metaService.enviarMensajeTexto(
          numero,
          "📝 Por favor escribe el motivo de tu cita o información adicional."
        );

      default:
        return await mostrarMenu();
    }

  } catch (error) {
    console.error("❌ Error en flujo:", error);
  }
};

module.exports = { determinarFlujo };