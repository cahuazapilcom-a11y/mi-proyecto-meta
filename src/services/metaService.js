const enviarBotones = async (numero, cuerpoTexto) => {
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
            buttons: [
              {
                type: "reply",
                reply: { id: "HORARIO", title: "Horarios" }
              },
              {
                type: "reply",
                reply: { id: "UBICACION", title: "Ubicacion" }
              },
              {
                type: "reply",
                reply: { id: "ASESOR", title: "Asesor" }
              }
            ]
          }
        }
      },
      { headers: HEADERS }
    );

    console.log("✅ Botones enviados correctamente");
  } catch (error) {
    console.error("❌ Error botones:", error.response?.data || error.message);
  }
};
module.exports = {
  enviarMensajeTexto,
  enviarMensajePDF,
  enviarBotones
};
