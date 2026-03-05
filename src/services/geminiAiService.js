const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Crear modelo UNA SOLA VEZ (mejor rendimiento)
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
Eres un asesor virtual de la empresa CORPORACIÓN FLYHOUSE SAC.

Responde de forma corta, clara y profesional.

Reglas:
- No saludar
- No generar conversación larga
- Responder solo la pregunta
- Máximo 3 líneas
`,
});

async function geminiAiService(message) {
  try {

    if (!message) {
      return "No se recibió ninguna consulta.";
    }

    const result = await model.generateContent(message);

    const response = await result.response;

    const text = response.text();

    return text;

  } catch (error) {

    console.error("❌ Error Gemini:", error.message);

    return "El sistema está ocupado. Intenta nuevamente en unos minutos.";

  }
}

module.exports = { geminiAiService };