const express = require('express');
const axios = require('axios');
// IMPORTANTE: Ruta relativa correcta para Render
const { determinarFlujo } = require('./flows/mainFlow'); 

const app = express();
app.use(express.json());

// Verificación del Webhook
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

// Procesamiento de mensajes
app.post('/webhook', async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const mensajeObj = value?.messages?.[0];

        if (mensajeObj) {
            const numeroUsuario = mensajeObj.from;
            const textoRecibido = mensajeObj.text?.body || "";

            // --- AQUÍ CORREGIMOS EL NOMBRE PARA QUE NO SALGA UNDEFINED ---
            const contact = value?.contacts?.[0];
            const name = contact?.profile?.name || "amigo(a)";

            console.log(`📩 [MENSAJE] De: ${name} (${numeroUsuario}) | Texto: "${textoRecibido}"`);

            // Enviamos los 3 datos al flujo principal
            await determinarFlujo(numeroUsuario, textoRecibido, name);
        }
        res.sendStatus(200);
    } catch (error) {
        console.error("❌ ERROR PROCESANDO:", error.message);
        res.sendStatus(200); 
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor FLYHOUSE activo en puerto ${PORT}`);
});
