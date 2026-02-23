const express = require('express');
const axios = require('axios'); // Nueva dependencia para enviar mensajes
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;
const accessToken = process.env.WHATSAPP_TOKEN; // Tu Token de Meta
const phoneId = process.env.PHONE_ID; // Tu ID de número

// Verificación del Webhook (GET) - Ya lo tienes y funciona
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
            const from = message.from; // Número del usuario
            const text = message.text.body; // Texto que te enviaron

            console.log(Mensaje recibido de ${from}: ${text});

            // ENVIAR RESPUESTA AUTOMÁTICA
            try {
                await axios({
                    method: "POST",
                    url: https://graph.facebook.com/v18.0/${phoneId}/messages,
                    data: {
                        messaging_product: "whatsapp",
                        to: from,
                        text: { body: "¡Hola! Soy tu bot. Recibí tu mensaje: " + text },
                    },
                    headers: { "Authorization": Bearer ${accessToken} },
                });
            } catch (error) {
                console.error("Error al enviar mensaje:", error.response ? error.response.data : error.message);
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

app.listen(port, () => {
    console.log(Mensaje recibido de ${from}: ${text});
});
