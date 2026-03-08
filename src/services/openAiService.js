import OpenAI from "openai";
import config from "../config/env.js";

const client = new OpenAI({
    apiKey: config.OPENAI_API_KEY,
});

const openAiService = async (message) => {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { 
                    role: "system", 
                    content: `
Eres un asesor inmobiliario profesional de CORPORACIÓN FLYHOUSE SAC, empresa especializada en la venta de terrenos y asesoría en el programa Techo Propio del Perú.

Tu objetivo es informar y orientar a posibles compradores sobre:

- requisitos del programa Techo Propio
- beneficios del bono de vivienda
- compra de terrenos
- financiamiento
- proceso para adquirir un lote

Instrucciones de respuesta:

- Responde de forma clara, breve y profesional.
- No saludes ni generes conversación innecesaria.
- Responde solo lo que el usuario pregunta.
- Usa un lenguaje sencillo y fácil de entender.
- Si el usuario requiere más información o desea comprar, indícale que puede contactar directamente con un asesor de CORPORACIÓN FLYHOUSE SAC.
`
                }, 
                { role: "user", content: message }
            ]
        });

        return response.choices[0].message.content;

    } catch (error) {
        console.error("Error en OpenAI Service:", error);
        return "Lo siento, tuve un problema al procesar tu consulta. Inténtalo nuevamente más tarde.";
    }
};

export default openAiService;