import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const CHANNEL_USERNAME = "@neyrolooms";
const FREE_TOOL_URL = "https://lmarena.ai/ru/c/019bee6b-3942-77d2-86fd-10c03d281086";

// /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(
    chatId,
    `👋 Привет!

Ты получаешь доступ к *бесплатному AI-инструменту* для генерации и экспериментов.

📌 Условие одно — подписка на наш Telegram-канал.`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Попробовать AI бесплатно",
              web_app: {
                url: "https://creatify-ai-bot.onrender.com", // твой Mini App
              },
            },
          ],
        ],
      },
    }
  );
});

// Проверка подписки (Mini App дергает этот callback)
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;

  if (query.data !== "check_sub") return;

  try {
    const member = await bot.getChatMember(CHANNEL_USERNAME, userId);

    const isSubscribed =
      member.status === "member" ||
      member.status === "administrator" ||
      member.status === "creator";

    if (isSubscribed) {
      await bot.sendMessage(
        chatId,
        "✅ Подписка подтверждена!\n\nДоступ к бесплатному AI-инструменту открыт:",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🚀 Открыть AI-инструмент",
                  url: FREE_TOOL_URL,
                },
              ],
            ],
          },
        }
      );
    } else {
      await bot.sendMessage(
        chatId,
        "❌ Подписка не найдена.\n\nПодпишись на канал и попробуй снова 👇",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🔔 Подписаться на канал",
                  url: "https://t.me/neyrolooms",
                },
              ],
              [
                {
                  text: "✅ Проверить подписку",
                  callback_data: "check_sub",
                },
              ],
            ],
          },
        }
      );
    }
  } catch (err) {
    console.error(err);
    await bot.sendMessage(chatId, "⚠️ Ошибка сервера. Попробуй позже.");
  }
});
