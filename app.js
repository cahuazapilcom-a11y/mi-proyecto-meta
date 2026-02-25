const express = require('express');
const axios = require('axios');
const { determinarFlujo } = require('./flows/mainFlow');

const app = express();
app.use(express.json());

// Verificación del Webhook para Meta
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Recepción de mensajes
app.post('/webhook', async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const mensajeObj = value?.messages?.[0];

        if (mensajeObj) {
            const numeroUsuario = mensajeObj.from;
            const textoRecibido = mensajeObj.text?.body || "";

            // Extraemos el nombre del contacto de WhatsApp
            const contact = value?.contacts?.[0];
            const name = contact?.profile?.name || "amigo(a)";

            console.log(`📩 [NUEVO MENSAJE] De: ${name} (${numeroUsuario}) | Texto: "${textoRecibido}"`);

            // Enviamos 3 datos: número, texto y NOMBRE
            await determinarFlujo(numeroUsuario, textoRecibido, name);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("❌ ERROR PROCESANDO MENSAJE:", error.message);
        res.sendStatus(200); // Siempre respondemos 200 a Meta para evitar bloqueos
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor activo y escuchando en puerto ${PORT}`);
});
