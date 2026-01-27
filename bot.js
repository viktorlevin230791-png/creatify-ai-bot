import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🚀 Добро пожаловать в Creatify AI\n\nНажми кнопку ниже 👇",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🎁 Получить AI-инструмент",
              web_app: {
                url: "https://creatify-ai-rust.vercel.app"
              }
            }
          ]
        ]
      }
    }
  );
});

console.log("BOT STARTED");
