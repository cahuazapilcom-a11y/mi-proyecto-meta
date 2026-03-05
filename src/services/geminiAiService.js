const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function geminiAiService(message) {

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
Eres un asesor inmobiliario de la empresa FLYHOUSE SAC.

Responde:
amable
corto
profesional
como chat de WhatsApp.

Pregunta cliente:
${message}
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    return response.text();

  } catch (error) {

    console.error("Error Gemini:", error);

    return "Lo siento, en este momento no puedo responder.";
  }
}

module.exports = geminiAiService;