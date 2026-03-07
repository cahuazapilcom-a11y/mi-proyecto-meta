import whatsappService from './whatsappService.js';
import appendToSheet from './googleSheetsService.js';
import openAiService from './openAiService.js';

class MessageHandler {
  constructor() {
    this.appointmentState = {};
    this.assistantState = {};
  }

  async handleIncomingMessage(message, senderInfo) {
    const from = message.from;
    const messageId = message.id;

    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim();

      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(from, senderInfo);
      } else if (this.appointmentState[from]) {
        await this.handleAppointmentFlow(from, incomingMessage);
      } else if (this.assistantState[from]) {
        await this.handleAssistantFlow(from, incomingMessage);
      } else {
        await this.handleMenuOption(from, incomingMessage);
      }
    } else if (message?.type === 'interactive') {
      const option = message?.interactive?.button_reply?.title.toLowerCase().trim();
      await this.handleMenuOption(from, option);
    }
    
    await whatsappService.markAsRead(messageId);
  }

  isGreeting(message) {
    const greetings = ["hola", "hello", "hi", "que tal", "buenas"];
    return greetings.some(g => message.includes(g));
  }

  async sendWelcomeMessage(to, senderInfo) {
    const name = senderInfo?.profile?.name || "Cliente";
    const welcomeText = `Hola ${name}, bienvenido a CORPORACION FLYHOUSE SAC. Tu consulta en línea. ¿En qué puedo ayudarte?\n\n1. Requisitos TP\n2. Agendar cita\n3. Asesor`;
    
    const buttons = [
      { type: 'reply', reply: { id: 'btn_req', title: 'Requisitos' } },
      { type: 'reply', reply: { id: 'btn_cita', title: 'Agendar Cita' } },
      { type: 'reply', reply: { id: 'btn_ubica', title: 'Ubicación' } }
    ];

    await whatsappService.sendInteractiveButtons(to, welcomeText, buttons);
  }

  async handleMenuOption(to, option) {
    switch (option) {
      case 'requisitos':
      case 'requisitos tp':
        await whatsappService.sendMessage(to, "Te envío los requisitos y catálogo: https://maps.app.goo.gl/D1o8jzQHbe3JPr2KA");
        await whatsappService.sendMediaMessage(to, 'document', 'https://tuservidor.com/techo_propio.pdf', 'Catálogo Techo Propio');
        break;

      case 'agendar cita':
      case 'agendar':
        this.appointmentState[to] = { step: 'name' };
        await whatsappService.sendMessage(to, "Perfecto. Por favor escribe tu nombre completo:");
        break;

      case 'ubicación':
      case 'ubicacion':
        await whatsappService.sendMessage(to, "📍 Nos encontramos en: [TU DIRECCIÓN AQUÍ]\nGoogle Maps: https://maps.app.goo.gl/D1o8jzQHbe3JPr2KA");
        break;

      case 'asesor':
      case 'consultar':
        this.assistantState[to] = { step: 'question' };
        await whatsappService.sendMessage(to, "Realiza tu consulta y un asesor virtual te responderá:");
        break;

      case 'horario':
      case 'hora':
        await whatsappService.sendMessage(to, "🕒 Atención de Lunes a Viernes:\n8:00 AM - 1:00 PM\n3:00 PM - 7:00 PM");
        break;

      default:
        // Si no es ninguna opción fija, pasarlo a la IA por si acaso
        const aiResponse = await openAiService(option);
        await whatsappService.sendMessage(to, aiResponse);
    }
  }

  async handleAppointmentFlow(to, message) {
    const state = this.appointmentState[to];

    switch (state.step) {
      case 'name':
        state.name = message;
        state.step = 'date';
        await whatsappService.sendMessage(to, `Gracias ${state.name}, ¿Qué fecha deseas para tu cita? (Ej: 20/02/2026)`);
        break;
      case 'date':
        state.date = message;
        // Guardar en Google Sheets
        await appendToSheet([new Date().toLocaleString(), to, state.name, state.date, "Cita Agendada"]);
        await whatsappService.sendMessage(to, "✅ Tu cita fue agendada correctamente, muchas gracias por confiar en FLYHOUSE. Nos comunicaremos contigo pronto.");
        delete this.appointmentState[to];
        break;
    }
  }

  async handleAssistantFlow(to, message) {
    const response = await openAiService(message);
    await whatsappService.sendMessage(to, response);
    
    const buttons = [
      { type: 'reply', reply: { id: 'ask_ok', title: 'Gracias' } },
      { type: 'reply', reply: { id: 'ask_more', title: 'Hacer otra pregunta' } }
    ];
    await whatsappService.sendInteractiveButtons(to, "¿La respuesta fue de tu ayuda?", buttons);
    delete this.assistantState[to];
  }
}

export default new MessageHandler();