import dotenv from 'dotenv';

// Carga las variables de entorno del archivo .env
dotenv.config();

const config = {
  // Puerto donde corre tu servidor (por defecto 3000)
  PORT: process.env.PORT || 3000,

  // Configuración de WhatsApp Cloud API
  API_TOKEN: process.env.API_TOKEN,
  BUSINESS_PHONE: process.env.BUSINESS_PHONE,
  API_VERSION: process.env.API_VERSION || 'v21.0',

  // Verificación del Webhook (debe coincidir con lo que pongas en la consola de Meta)
  WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN,

  // Credenciales de Inteligencia Artificial
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  // Google Sheets ID (Sacado de la URL de tu hoja de cálculo)
  SPREADSHEET_ID: process.env.SPREADSHEET_ID || '1qt4Adt_muJZf1LXlXjqRUcs5hDf6Zac1wzGiwHeH_Ns'
};

// Validación rápida para que no olvides ninguna variable crítica en producción
const requiredKeys = ['API_TOKEN', 'BUSINESS_PHONE', 'WEBHOOK_VERIFY_TOKEN', 'OPENAI_API_KEY'];
requiredKeys.forEach(key => {
  if (!config[key]) {
    console.warn(`⚠️ ALERTA: La variable de entorno ${key} no está configurada.`);
  }
});

export default config;