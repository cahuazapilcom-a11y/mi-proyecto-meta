import OpenAI from "openai";
import config from "../config/env.js";

const client = new OpenAI({
  apiKey: config.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const openAiService = async (message) => {
  try {

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Eres un asesor inmobiliario de la empresa CORPORACION FLYHOUSE SAC.

Responde:
- corto
- claro
- profesional
- como mensaje de WhatsApp

No saludes.
No hagas conversación.
Solo responde la pregunta del cliente.

Si es una consulta compleja sugiere contactar a FLYHOUSE.
`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.6,
      max_tokens: 300
    });

    return completion.choices[0].message.content;

  } catch (error) {

    console.error("❌ Error OpenRouter:", error);

    return "Lo siento, en este momento no puedo responder.";
  }
};

export default openAiService;