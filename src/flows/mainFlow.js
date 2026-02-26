const metaService = require('../services/metaService');

const determinarFlujo = async (numero, mensajeRecibido, name) => {
    // Limpieza de texto para evitar errores de tildes o mayúsculas
    const texto = mensajeRecibido
        .toLowerCase()
        .trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    const urlRequisitos = "https://drive.google.com/uc?export=download&id=1HBRYma72_lk4iITQGsKrW17e_RxDmTeq";

    // El saludo ahora usa la variable 'name' que viene de app.js
    const mensajeBienvenida = `¡Hola ${name}! Bienvenido a *FLYHOUSE*, Tu consulta en línea. 🏠\n\n¿En qué puedo ayudarte?\n\n1. Horarios\n2. Ubicación\n3. Hablar con un asesor\n4. Requisitos (Recibir PDF) 📄`;

    if (texto === "hola" || texto === "hi" || texto === "inicio") {
        await metaService.enviarMensajeTexto(numero, mensajeBienvenida);
    } 
    // Reconoce "horarios", "horario" o incluso "hoarios"
    else if (texto.includes("horario") || texto.includes("hoario") || texto === "1") {
        await metaService.enviarMensajeTexto(numero, "Estamos abiertos de Lunes a Viernes de 8:00 AM a 1:00 PM y de 3:00 PM a 6:00 PM. 🕒");
    } 
    else if (texto.includes("ubicacion") || texto === "2") {
        await metaService.enviarMensajeTexto(numero, "Nos encontramos en Teniente Secada 400. 📍");
    } 
    else if (texto.includes("asesor") || texto === "3") {
        await metaService.enviarMensajeTexto(numero, `He notificado a un asesor, ${name}. Se pondrán en contacto contigo pronto. 😊`);
        // Aquí puedes agregar tu alerta al número personal
    } 
    else if (texto.includes("requisito") || texto === "4") {
        await metaService.enviarMensajeTexto(numero, "Te envío los requisitos en PDF. Espere un momento... ⏳");
        await metaService.enviarMensajePDF(numero, urlRequisitos, "Requisitos_Techo_Propio.pdf");
    }
    else {
        await metaService.enviarMensajeTexto(numero, "Lo siento, no entendí tu consulta. Escribe 'Hola' para ver las opciones.");
    }
};

module.exports = { determinarFlujo };
