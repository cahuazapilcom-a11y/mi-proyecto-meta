import express from 'express';
import config from './config/env.js';
import webhookRoutes from './routes/webhookRoutes.js';

const app = express();
app.use(express.json());

app.use('/webhook', webhookRoutes);

app.get('/', (req, res) => {
    res.send('Corporación Flyhouse Bot - Activo');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor escuchando en puerto: ${PORT}`);
});