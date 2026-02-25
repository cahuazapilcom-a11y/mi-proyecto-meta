const metaService = require('../services/metaService');

const determinarFlujo = async (numero, mensajeRecibido, name) => {
    // 1. Limpieza de texto
    const texto = mensajeRecibido
        .toLowerCase()
        .trim()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    // 2. Tu enlace directo de PDF
    const urlRequisitos = "https://drive.google.com/uc?export=download&id=1HBRYma72_lk4iITQGsKrW17e_RxDmTeq";

    // 3. Mensaje de bienvenida personalizado con el nombre
    const mensajeBienvenida = `¡Hola ${name}! Bienvenido a *FLYHOUSE*, Tu consulta en línea. 🏠\n\n¿En qué puedo ayudarte?\n\n1. Horarios\n2. Ubicación\n3. Hablar con un asesor\n4. Requisitos (Recibir PDF) 📄`;

    // 4. Lógica de respuestas
    if (texto === "hola" || texto === "hi" || texto === "inicio") {
        await metaService.enviarMensajeTexto(numero, mensajeBienvenida);
    } 
    else if (texto.includes("horario") || texto === "1") {
        await metaService.enviarMensajeTexto(numero, "Estamos abiertos de Lunes a Viernes de 8:00 AM a 1:00 PM y de 3:00 PM a 6:00 PM. 🕒");
    } 
    else if (texto.includes("ubicacion") || texto === "2") {
        await metaService.enviarMensajeTexto(numero, "Nos encontramos en Teniente Secada 400. 📍");
    } 
    else if (texto.includes("asesor") || texto === "3") {
        // Confirmación al cliente
        await metaService.enviarMensajeTexto(numero, `Entendido ${name}, he notificado a un asesor. Se pondrán en contacto contigo pronto. 😊`);

        // Alerta a tu celular personal
        const miNumero = process.env.MI_NUMERO_PERSONAL;
        if (miNumero) {
            const alerta = `🚨 *ALERTA ASESOR*\nEl cliente *${name}* (${numero}) solicita ayuda humana ahora mismo.`;
            await metaService.enviarMensajeTexto(miNumero, alerta);
        }
    } 
    else if (texto.includes("requisitos") || texto === "4") {
        await metaService.enviarMensajeTexto(numero, "Excelente. Te estoy enviando el PDF con los requisitos para el programa Techo Propio. Espere un momento... ⏳");
        // Asegúrate de que metaService.js tenga la función enviarMensajePDF
        await metaService.enviarMensajePDF(numero, urlRequisitos, "Requisitos_Techo_Propio.pdf");
    }
    else if (texto.includes("gracias")) {
        await metaService.enviarMensajeTexto(numero, `¡De nada ${name}! Es un placer ayudarte. 😊`);
    } 
    else {
        await metaService.enviarMensajeTexto(numero, "Lo siento, no entendí tu consulta. Escribe 'Hola' para ver las opciones disponibles.");
    }
};

module.exports = { determinarFlujo };
