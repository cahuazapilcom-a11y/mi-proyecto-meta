const axios = require('axios');

const enviarMensajeTexto = async (numero, texto) => {
    try {
        const data = {
            messaging_product: "whatsapp",
            to: numero,
            type: "text",
            text: { body: texto }
        };

        await axios.post(
            `https://graph.facebook.com/${process.env.META_VERSION}/${process.env.META_PHONE_ID}/messages`,
            data,
            { headers: { Authorization: `Bearer ${process.env.META_TOKEN}` } }
        );
    } catch (error) {
        console.error("❌ Error enviando texto:", error.response?.data || error.message);
    }
};

// ESTA ES LA FUNCIÓN QUE TE FALTABA
const enviarMensajePDF = async (numero, urlPdf, nombreArchivo) => {
    try {
        const data = {
            messaging_product: "whatsapp",
            to: numero,
            type: "document",
            document: {
                link: urlPdf,
                filename: nombreArchivo
            }
        };

        await axios.post(
            `https://graph.facebook.com/${process.env.META_VERSION}/${process.env.META_PHONE_ID}/messages`,
            data,
            { headers: { Authorization: `Bearer ${process.env.META_TOKEN}` } }
        );
        console.log("📄 PDF enviado con éxito");
    } catch (error) {
        console.error("❌ Error enviando PDF:", error.response?.data || error.message);
    }
};

// IMPORTANTE: Exportar ambas funciones
module.exports = { enviarMensajeTexto, enviarMensajePDF,enviarMensajeImagen };
