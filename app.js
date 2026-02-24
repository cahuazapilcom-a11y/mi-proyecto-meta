// Cambia la línea 2 (si decides importar el servicio aquí luego) y la 5
require('dotenv').config();
const express = require('express');
const app = express();

// CORRECCIÓN AQUÍ: Agregamos "src/" a la ruta
const { determinarFlujo } = require('./src/flows/mainFlow'); 

app.use(express.json());

const PORT = process.env.PORT || 3000;

// === 2. VERIFICACIÓN DEL WEBHOOK (GET) ===
// Esto es solo para que Facebook confirme que tu servidor existe
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

// === 3. RECEPCIÓN DE MENSAJES (POST) ===
app.post('/webhook', async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const mensajeObj = value?.messages?.[0];

        if (mensajeObj) {
            const numeroUsuario = mensajeObj.from;
            const textoRecibido = mensajeObj.text?.body;

            console.log(`📩 Mensaje de ${numeroUsuario}: ${textoRecibido}`);

            // Delegamos TODA la respuesta a nuestro archivo de flujos
            await determinarFlujo(numeroUsuario, textoRecibido);
        }

        // Importante: Siempre responder 200 a Meta inmediatamente
        res.sendStatus(200);

    } catch (error) {
        console.error("❌ Error en Webhook:", error);
        res.sendStatus(500);
    }
});

// === 4. INICIO DEL SERVIDOR ===
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en puerto ${PORT}`);
});
