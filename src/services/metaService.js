/* =========================
   ENVIAR BOTONES INTERACTIVOS
========================= */
const enviarBotones = async (numero, cuerpoTexto, botones) => {
  try {
    await axios.post(
      URL,
      {
        messaging_product: "whatsapp",
        to: numero,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: cuerpoTexto
          },
          action: {
            buttons: botones.map((btn) => ({
              type: "reply",
              reply: {
                id: btn.id,
                title: btn.title
              }
            }))
          }
        }
      },
      { headers: HEADERS }
    );

    console.log("✅ Botones enviados");
  } catch (error) {
    console.error("❌ Error enviando botones:", error.response?.data || error.message);
  }
};

module.exports = {
  enviarMensajeTexto,
  enviarMensajePDF,
  enviarMensajeImagen,
  enviarBotones
};


