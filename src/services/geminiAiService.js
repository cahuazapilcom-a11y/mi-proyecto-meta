const { GoogleGenerativeAI } = require("@google/generative-ai");

// validar API KEY
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY no está configurada en las variables de entorno");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function geminiAiService(message) {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });

    const prompt = `
Eres un asesor inmobiliario de la empresa FLYHOUSE SAC.

Reglas de respuesta:
- amable
- corto
- profesional
- estilo chat de WhatsApp
- máximo 3 líneas

Pregunta del cliente:
${message}
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return response;

  } catch (error) {

    console.error("Error Gemini:", error?.message || error);

    return "Lo siento, en este momento no puedo responder. Un asesor te contactará pronto.";
  }
}

module.exports = geminiAiService;