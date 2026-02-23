const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;
const accessToken = process.env.WHATSAPP_TOKEN;
const phoneId = process.env.PHONE_ID;

// Verificación del Webhook (GET)
app.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === verifyToken) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Recepción y respuesta de mensajes (POST)
app.post('/', async (req, res) => {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
        if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
            
            const message = body.entry[0].changes[0].value.messages[0];
            const from = message.from; 
            const text = message.text.body;

            console.log(`Mensaje recibido de ${from}: ${text}`);

            // ENVIAR RESPUESTA AUTOMÁTICA
            try {
                await axios({
                    method: "POST",
                    url: `https://graph.facebook.com/v18.0/${phoneId}/messages`,
                    data: {
                        messaging_product: "whatsapp",
                        to: from,
                        type: "text",
                        text: { body: "Hola, recibí tu mensaje: " + text }
                    },
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
            } catch (error) {
                console.error("Error al enviar:", error.response ? error.response.data : error.message);
            }
        }
        // IMPORTANTE: Responder siempre con 200 a Meta
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
}); // <--- Verifica que esta llave y paréntesis existan

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
        
