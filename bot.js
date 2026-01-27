// ====== ИМПОРТЫ ======
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

// ====== ПЕРЕМЕННЫЕ ======
const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
  console.error("❌ BOT_TOKEN не задан");
  process.exit(1);
}

// ====== TELEGRAM BOT ======
const bot = new TelegramBot(TOKEN, {
  polling: true,
});

console.log("🤖 Telegram bot started");

// ====== ОБРАБОТЧИКИ ======
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    "👋 Привет!\n\nЭто Creatify AI Studio.\nБот успешно запущен 🚀"
  );
});

bot.on("message", (msg) => {
  if (msg.text && msg.text !== "/start") {
    bot.sendMessage(msg.chat.id, "Я получил сообщение 👍");
  }
});

// ====== EXPRESS (ДЛЯ RENDER) ======
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ Bot is running");
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});
