const axios = require('axios');

/**
 * Servicio para interactuar con la API de WhatsApp Business (Meta)
 */
const enviarMensajeTexto = async (numeroDestino, cuerpoTexto) => {
    try {
        const url = `https://graph.facebook.com/${process.env.META_VERSION}/${process.env.META_PHONE_ID}/messages`;
        
        const data = {
            messaging_product: "whatsapp",
            to: numeroDestino,
            type: "text",
            text: { body: cuerpoTexto }
        };

        const config = {
            headers: {
                'Authorization': `Bearer ${process.env.META_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.post(url, data, config);
        return response.data;
        
    } catch (error) {
        console.error("❌ Error enviando mensaje a Meta:", error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = {
    enviarMensajeTexto
};
