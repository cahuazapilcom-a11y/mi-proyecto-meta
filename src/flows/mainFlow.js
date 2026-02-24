const metaService = require('../services/metaService');

const determinarFlujo = async (numero, mensajeRecibido) => {
    // 1. Limpiamos el texto: minúsculas, sin espacios y QUITAMOS PUNTUACIÓN
    const texto = mensajeRecibido
        .toLowerCase()
        .trim()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""); // Esto quita puntos, comas, etc.

    const respuestas = {
        "hola": "¡Hola! Bienvenido a nuestro servicio. ¿En qué puedo ayudarte?\n1. Horarios\n2. Ubicación\n3. Hablar con un asesor",
        "horarios": "Estamos abiertos de Lunes a Viernes de 9:00 AM a 6:00 PM. 🕒",
        "ubicacion": "Nos encontramos en la Av. Principal 123, Lima. 📍",
        "gracias": "¡De nada! Es un placer ayudarte. 😊"
    };

    // 2. Buscamos coincidencia exacta después de limpiar
    if (respuestas[texto]) {
        await metaService.enviarMensajeTexto(numero, respuestas[texto]);
    } else {
        // 3. Opcional: Buscar si el mensaje CONTIENE la palabra clave
        if (texto.includes("hola")) {
             await metaService.enviarMensajeTexto(numero, respuestas["hola"]);
        } else {
             await metaService.enviarMensajeTexto(numero, "Lo siento, no entendí eso. Intenta escribiendo 'Hola' para ver las opciones.");
        }
    }
};

module.exports = { determinarFlujo };
