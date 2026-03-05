const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const prompt = `
Eres un asesor virtual de la empresa CORPORACIÓN FLYHOUSE SAC.

Responde de forma corta, clara y profesional.

Reglas:
- No saludar
- No generar conversación larga
- Responder solo la pregunta
- Máximo 3 líneas
`;

async function geminiAiService(message) {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: prompt
    });

    const result = await model.generateContent(message);

    const response = await result.response;

    return response.text();

  } catch (error) {
    console.error("Error Gemini:", error);
    return "Lo siento, en este momento no puedo responder. Intenta nuevamente.";
  }
}

module.exports = { geminiAiService };