import OpenAI from "openai";
import config from "../config/env.js";

const client = new OpenAI({
    apiKey: config.OPENAI_API_KEY,
});

const openAiService = async (message) => {
    try {
        const response = await client.chat.completions.create({
            messages: [
                { 
                    role: 'system', 
                    content: 'Eres un gestor inmobiliario experto de CORPORACION FLYHOUSE SAC. Responde de forma clara, profesional y concisa sobre el programa Techo Propio. No saludes, no generes charla innecesaria, solo responde directamente a la pregunta. Si el usuario necesita atención urgente, indícale que debe llamarnos.' 
                }, 
                { role: 'user', content: message }
            ],
            model: 'gpt-4o'
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error en OpenAI Service:", error);
        return "Lo siento, tuve un problema al procesar tu consulta. Inténtalo de nuevo más tarde.";
    }
}

export default openAiService;