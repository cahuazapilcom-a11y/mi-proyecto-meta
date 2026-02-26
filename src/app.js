const express = require('express');
const { determinarFlujo } = require('./flows/mainFlow'); 

const app = express();
app.use(express.json());

app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else { res.sendStatus(403); }
});

app.post('/webhook', async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const mensajeObj = value?.messages?.[0];

        if (mensajeObj) {
            const numeroUsuario = mensajeObj.from;
            const textoRecibido = mensajeObj.text?.body || "";

            // EXTRAER NOMBRE CORRECTAMENTE
            const contact = value?.contacts?.[0];
            const name = contact?.profile?.name || "cliente"; 

            console.log(`📩 Mensaje de ${name}: ${textoRecibido}`);
            await determinarFlujo(numeroUsuario, textoRecibido, name);
        }
        res.sendStatus(200);
    } catch (error) {
        console.error("❌ Error:", error.message);
        res.sendStatus(200);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
