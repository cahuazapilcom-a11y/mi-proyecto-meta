import express from 'express';
import config from './config/env.js';
import webhookRoutes from './routes/webhookRoutes.js';

const app = express();
app.use(express.json());

app.use('/webhook', webhookRoutes);

app.get('/', (req, res) => {
    res.send('Corporación Flyhouse Bot - Activo');
});

app.listen(config.PORT, () => {
    console.log(`🚀 Servidor escuchando en puerto: ${config.PORT}`);
});