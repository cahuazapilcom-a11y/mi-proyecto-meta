import express from 'express';
import webhookController from '../controllers/webhookController.js';

const router = express.Router();

/**
 * RUTA: GET /webhook
 * Propósito: Verificación del Webhook por parte de Meta (Facebook/WhatsApp).
 * Meta envía un reto (challenge) que debemos devolver si el token coincide.
 */
router.get('/', webhookController.verifyWebhook);

/**
 * RUTA: POST /webhook
 * Propósito: Recibir todas las notificaciones de mensajes entrantes, 
 * cambios de estado y respuestas interactivas de los clientes.
 */
router.post('/', webhookController.handleIncoming);

export default router;