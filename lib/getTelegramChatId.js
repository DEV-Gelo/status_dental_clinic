import TelegramBot from "node-telegram-bot-api";

// ⚠️ Встав сюди свій токен ТИМЧАСОВО
const bot = new TelegramBot(`7768974114:AAHff5la6hSda_oOiQTlKLrdVelmWVyTDZc`, {
  polling: true,
});

bot.on("message", (msg) => {
  console.log("🟢 CHAT ID:", msg.chat.id);
  console.log("📋 Chat Info:", msg.chat);
});
