const metaService = require('../services/metaService');

const determinarFlujo = async (numero, mensajeRecibido) => {
    // 1. Normalización del texto (minúsculas, sin espacios, sin signos)
    const texto = mensajeRecibido
        .toLowerCase()
        .trim()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    // 2. Tu enlace de Google Drive convertido a DIRECTO
    const urlRequisitos = "https://drive.google.com/uc?export=download&id=1HBRYma72_lk4iITQGsKrW17e_RxDmTeq";

    // 3. Definición del mensaje de bienvenida
    const mensajeBienvenida = "¡Hola! Bienvenido a nuestro servicio de asesoría para Techo Propio 🏠.\n\n¿En qué puedo ayudarte?\n\nCual es su consulta respecto al programa:\n1. Horarios\n2. Ubicación\n3. Hablar con un asesor\n4. Requisitos (Recibir PDF) 📄";

    // 4. Lógica de decisiones
    if (texto === "hola" || texto === "hi" || texto === "inicio") {
        await metaService.enviarMensajeTexto(numero, mensajeBienvenida);
    } 
    else if (texto.includes("horario")) {
        await metaService.enviarMensajeTexto(numero, "Estamos abiertos de Lunes a Viernes de 9:00 AM a 6:00 PM. 🕒");
    } 
    else if (texto.includes("ubicacion") || texto.includes("ubicacion")) {
        await metaService.enviarMensajeTexto(numero, "Nos encontramos en teniente secada 400. 📍");
    } 
        // ... dentro de determinarFlujo ...

    else if (texto.includes("asesor") || texto === "3") {
        // 1. Notificación al cliente
        await metaService.enviarMensajeTexto(numero, "He notificado a un asesor. Se pondrán en contacto contigo a la brevedad posible. 😊");

        // 2. Alerta automática a TU número personal
        const miNumero = process.env.MI_NUMERO_PERSONAL;
        const alertaAsesor = `🚨 *ALERTA ASESOR* 🚨\nEl usuario @${numero} ha solicitado ayuda humana ahora mismo.`;
        
        await metaService.enviarMensajeTexto(miNumero, alertaAsesor);
        
        console.log(`⚠️ Alerta enviada al asesor (${miNumero}) por el usuario ${numero}`);
    }
       
    else if (texto.includes("requisitos") || texto === "4") {
        // Primero confirmamos al usuario
        await metaService.enviarMensajeTexto(numero, "Excelente. Te estoy enviando el PDF con los requisitos para el programa Techo Propio. Espere un momento... ⏳");
        
        // Enviamos el archivo PDF
        await metaService.enviarMensajePDF(numero, urlRequisitos, "Requisitos_Techo_Propio.pdf");
    }
    else if (texto.includes("gracias")) {
        await metaService.enviarMensajeTexto(numero, "¡De nada! Es un placer ayudarte. 😊");
    } 
    else {
        // Si el bot no entiende, ofrece el menú de nuevo
        await metaService.enviarMensajeTexto(numero, "Lo siento, no entendí tu consulta. Escribe 'Hola' para ver las opciones disponibles.");
    }
};

module.exports = { determinarFlujo };
