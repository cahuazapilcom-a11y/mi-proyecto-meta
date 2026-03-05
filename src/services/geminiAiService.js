const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.0-pro",
  systemInstruction: `
Eres un asesor virtual de la empresa CORPORACIÓN FLYHOUSE SAC.
Responde corto, claro y profesional.
Máximo 3 líneas.
`
});

async function geminiAiService(message) {
  try {

    const result = await model.generateContent(message);

    const response = await result.response;

    return response.text();

  } catch (error) {

    console.error("❌ Error Gemini:", error.message);

    return "El sistema está ocupado. Intenta nuevamente.";

  }
}

module.exports = { geminiAiService };