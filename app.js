// === 1. CONFIGURACIÓN INICIAL ===
require('dotenv').config();
const express = require('express');
const app = express();
const { determinarFlujo } = require('./src/flows/mainFlow');

app.use(express.json());

const PORT = process.env.PORT || 3000;

// === 2. VERIFICACIÓN DEL WEBHOOK (GET) ===
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        console.log("✅ Webhook verificado correctamente");
        res.status(200).send(challenge);
    } else {
        console.error("❌ Fallo en la verificación del token");
        res.sendStatus(403);
    }
});

// === 3. RECEPCIÓN DE MENSAJES (POST) ===
app.post('/webhook', async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const mensajeObj = value?.messages?.[0];

        if (mensajeObj) {
            const numeroUsuario = mensajeObj.from;
            const textoRecibido = mensajeObj.text?.body || "";

            // Log informativo para saber qué está llegando
            console.log(`📩 [NUEVO MENSAJE] De: ${numeroUsuario} | Texto: "${textoRecibido}"`);

            // Enviamos al flujo de conversación
            await determinarFlujo(numeroUsuario, textoRecibido);
        }

        // Siempre responder 200 a Meta para evitar bloqueos
        res.sendStatus(200);

    } catch (error) {
        console.error("❌ ERROR PROCESANDO MENSAJE:", error.message);
        // Respondemos 200 de todas formas para que Meta no reintente el envío fallido infinitamente
        res.sendStatus(200);
    }
});

// === 4. INICIO DEL SERVIDOR ===
app.listen(PORT, () => {
    console.log(`🚀 Servidor activo y escuchando en puerto ${PORT}`);
});
