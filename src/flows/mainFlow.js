const metaService = require('../services/metaService');

const determinarFlujo = async (numero, mensajeRecibido) => {
    const texto = mensajeRecibido.toLowerCase().trim();

    // Definimos los flujos como un objeto para evitar los IF/ELSE
    const respuestas = {
        "hola": "¡Hola! Bienvenido a nuestro servicio. ¿En qué puedo ayudarte?\n1. Horarios\n2. Ubicación\n3. Hablar con un asesor",
        "horarios": "Estamos abiertos de Lunes a Viernes de 9:00 AM a 6:00 PM. 🕒",
        "ubicacion": "Nos encontramos en la Av. Principal 123, Lima. 📍",
        "gracias": "¡De nada! Es un placer ayudarte. 😊"
    };

    // Buscamos si el mensaje coincide con alguna clave
    if (respuestas[texto]) {
        await metaService.enviarMensajeTexto(numero, respuestas[texto]);
    } else {
        // Respuesta por defecto si no entiende el mensaje
        await metaService.enviarMensajeTexto(numero, "Lo siento, no entendí eso. Intenta escribiendo 'Hola' para ver las opciones.");
    }
};

module.exports = { determinarFlujo };
