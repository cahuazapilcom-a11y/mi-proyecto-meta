import whatsappService from "./whatsappService.js";
import appendToSheet from "./googleSheetsService.js";
import openAiService from "./openAiService.js";

class MessageHandler {
  constructor() {
    this.appointmentState = {};
    this.assistantState = {};
  }

  async handleIncomingMessage(message, senderInfo) {
    const from = message.from;
    const messageId = message.id;

    if (message?.type === "text") {
      const incomingMessage = message.text.body.toLowerCase().trim();

      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(from, senderInfo);

      } 
      else if (this.isAdvisorRequest(incomingMessage)) {
        await this.sendAdvisorContacts(from);
      } 
      else if (this.appointmentState[from]) {
        await this.handleAppointmentFlow(from, incomingMessage);
      } 
      else if (this.assistantState[from]) {
        await this.handleAssistantFlow(from, incomingMessage);
      } 
      else {
        await this.handleMenuOption(from, incomingMessage);
      }
    }

    if (message?.type === "interactive") {
      const option =
        message?.interactive?.button_reply?.title.toLowerCase().trim();

      await this.handleMenuOption(from, option);
    }

    await whatsappService.markAsRead(messageId);
  }

  isGreeting(message) {
    const greetings = ["hola", "hello", "hi", "buenas"];
    return greetings.some((g) => message.includes(g));
  }

  // NUEVO: detectar cuando piden asesor
  isAdvisorRequest(message) {
    const advisorWords = [
      "asesor",
      "quiero hablar con un asesor",
      "quiero comunicarme con un asesor",
      "hablar con asesor",
      "asesor humano",
      "asesor real"
    ];

    return advisorWords.some((word) => message.includes(word));
  }

  // NUEVO: enviar números
  async sendAdvisorContacts(to) {
    const text = `📞 Para comunicarte con un asesor de *CORPORACION FLYHOUSE SAC* puedes llamar o escribir a:

📱 +51 918 156 548
📱 +51 977 745 422

Un asesor te atenderá personalmente.`;

    await whatsappService.sendMessage(to, text);
  }

  async sendWelcomeMessage(to, senderInfo) {
    const name = senderInfo?.profile?.name || "Cliente";

    const text = `Hola ${name} 👋

Bienvenido a *CORPORACION FLYHOUSE SAC Tu Asesor Virtual*

¿En qué puedo ayudarte hoy?`;

    const buttons = [
      { type: "reply", reply: { id: "req", title: "RequisitosTP" } },
      { type: "reply", reply: { id: "cita", title: "Agendar cita" } },
      { type: "reply", reply: { id: "ubi", title: "Ubicación" } },
    ];

    await whatsappService.sendInteractiveButtons(to, text, buttons);
  }

  async handleMenuOption(to, option) {
    switch (option) {

      case "requisitosTP":
        await whatsappService.sendMessage(
          to,
          "Te envío los requisitos del programa."
        );
        break;

      case "agendar cita":
      case "cita":
        this.appointmentState[to] = { step: "name" };

        await whatsappService.sendMessage(
          to,
          "Perfecto, escribe tu nombre completo por favor para registrar tu cita."
        );

        break;

      case "ubicación":
      case "ubicacion":

        await whatsappService.sendMessage(
          to,
          "📍 Nuestra ubicación:\nhttps://maps.app.goo.gl/D1o8jzQHbe3JPr2KA"
        );

        break;

      case "asesor":

        await this.sendAdvisorContacts(to);

        break;

      default:

        const aiResponse = await openAiService(option);

        await whatsappService.sendMessage(to, aiResponse);
    }
  }

  async handleAppointmentFlow(to, message) {
    const state = this.appointmentState[to];

    if (state.step === "name") {

      state.name = message;
      state.step = "date";

      await whatsappService.sendMessage(
        to,
        "¿Qué fecha deseas para tu cita?"
      );

      return;
    }

    if (state.step === "date") {

      state.date = message;

      await appendToSheet([
        new Date().toLocaleString(),
        to,
        state.name,
        state.date,
        "Cita agendada",
      ]);

      await whatsappService.sendMessage(
        to,
        "✅ Tu cita fue registrada correctamente, gracias por confiar en nosotros."
      );

      delete this.appointmentState[to];
    }
  }

  async handleAssistantFlow(to, message) {

    const response = await openAiService(message);

    await whatsappService.sendMessage(to, response);

    delete this.assistantState[to];
  }
}

export default new MessageHandler();