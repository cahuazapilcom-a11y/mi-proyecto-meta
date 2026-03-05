const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY no configurada");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 150
  }
});

async function geminiAiService(message) {

  try {

    const prompt = `
Eres un asesor inmobiliario de FLYHOUSE SAC.

Reglas:
- responde corto
- tono profesional
- estilo WhatsApp
- máximo 3 líneas

Cliente dice:
${message}
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return response || "Un asesor te responderá en breve.";

  } catch (error) {

    console.error("Error Gemini:", error.message);

    return "En este momento no puedo responder. Un asesor te contactará pronto.";
  }
}

module.exports = geminiAiService;