const metaService = require('../services/metaService');

const determinarFlujo = async (numero, mensajeRecibido, name) => {
    // 1. Limpieza total de texto (quita espacios, tildes y signos)
    const texto = mensajeRecibido
        .toLowerCase()
        .trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    const urlRequisitos = "https://drive.google.com/uc?export=download&id=1HBRYma72_lk4iITQGsKrW17e_RxDmTeq";

    const mensajeBienvenida = `¡Hola ${name}! Bienvenido a *FLYHOUSE*, Tu consulta en línea. 🏠\n\n¿En qué puedo ayudarte?\n\n1. Horarios\n2. Ubicación\n3. Hablar con un asesor\n4. Requisitos (Recibir PDF) 📄`;

    // 2. Lógica de respuestas (usamos .includes para que si escribes "hoarios" o "horario" funcione)
    if (texto === "hola" || texto === "hi" || texto === "inicio") {
        await metaService.enviarMensajeTexto(numero, mensajeBienvenida);
    } 
    else if (texto.includes("horario") || texto.includes("hoario") || texto === "1") {
        await metaService.enviarMensajeTexto(numero, "Estamos abiertos de Lunes a Viernes de 8:00 AM a 1:00 PM y de 3:00 PM a 6:00 PM. 🕒");
    } 
    else if (texto.includes("ubicacion") || texto === "2") {
        await metaService.enviarMensajeTexto(numero, "Nos encontramos en Teniente Secada 400. 📍");
    } 
    else if (texto.includes("asesor") || texto === "3") {
        await metaService.enviarMensajeTexto(numero, `Entendido ${name}, he notificado a un asesor. Se pondrán en contacto pronto. 😊`);
        const miNumero = process.env.MI_NUMERO_PERSONAL;
        if (miNumero) {
            await metaService.enviarMensajeTexto(miNumero, `🚨 *ALERTA ASESOR*\nEl cliente *${name}* (${numero}) solicita ayuda.`);
        }
    } 
    else if (texto.includes("requisito") || texto === "4") {
        await metaService.enviarMensajeTexto(numero, "Perfecto. Te estoy enviando el PDF con los requisitos. Espere un momento... ⏳");
        await metaService.enviarMensajePDF(numero, urlRequisitos, "Requisitos_Techo_Propio.pdf");
    }
    else {
        await metaService.enviarMensajeTexto(numero, "Lo siento, no entendí tu consulta. Escribe *Hola* para ver las opciones disponibles.");
    }
};

module.exports = { determinarFlujo };
