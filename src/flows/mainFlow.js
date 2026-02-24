const metaService = require('../services/metaService');

const determinarFlujo = async (numero, mensajeRecibido) => {
    // 1. Limpiamos el texto para que no importen puntos, espacios o mayúsculas
    const texto = mensajeRecibido
        .toLowerCase()
        .trim()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    // 2. Definimos el mensaje de bienvenida largo
    const mensajeBienvenida = "¡Hola! Bienvenido a nuestro servicio Techo Propio 🏠. ¿En qué puedo ayudarte?\n\nCual es su consulta respecto al programa:\n1. Horarios\n2. Ubicación\n3. Hablar con un asesor";

    // 3. Lógica de respuesta fluida
    if (texto === "hola" || texto === "hi") {
        // Responde al saludo
        await metaService.enviarMensajeTexto(numero, mensajeBienvenida);
    } 
    else if (texto.includes("horario")) {
        // Responde si el mensaje contiene la palabra "horario"
        await metaService.enviarMensajeTexto(numero, "Estamos abiertos de Lunes a Viernes de 9:00 AM a 6:00 PM. 🕒");
    } 
    else if (texto.includes("ubicacion") || texto.includes("donde")) {
        // Responde a ubicación o preguntas de "¿dónde están?"
        await metaService.enviarMensajeTexto(numero, "Nos encontramos en la Av. Principal 123, Lima. 📍");
    } 
    else if (texto.includes("gracias")) {
        await metaService.enviarMensajeTexto(numero, "¡De nada! Es un placer ayudarte. 😊");
    } 
    else {
        // Respuesta por defecto si no entiende nada de lo anterior
        await metaService.enviarMensajeTexto(numero, "Lo siento, no entendí tu consulta. Escribe 'Hola' para ver mis opciones de Techo Propio.");
    }
};

module.exports = { determinarFlujo };
