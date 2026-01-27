import TelegramBot from "node-telegram-bot-api";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_USERNAME = "@neyrolooms";
const FREE_TOOL_URL =
  "https://lmarena.ai/ru/c/019bee6b-3942-77d2-86fd-10c03d281086";

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

/* ================== WEB SERVER ================== */
const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ===== API: проверка подписки ===== */
app.post("/check-subscription", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ ok: false });
    }

    const member = await bot.getChatMember(CHANNEL_USERNAME, userId);

    const isSubscribed = ["member", "administrator", "creator"].includes(
      member.status
    );

    if (isSubscribed) {
      return res.json({
        ok: true,
        url: FREE_TOOL_URL,
      });
    } else {
      return res.json({ ok: false });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("🚀 Mini App server running on port", PORT)
);

/* ================== /start ================== */
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(
    chatId,
    `👋 *Creatify AI Studio*

Получи доступ к *бесплатному AI-инструменту*  
после подписки на наш Telegram-канал.

👇 Нажми кнопку ниже:`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Получить бесплатный AI-инструмент",
              web_app: {
                url: "https://creatify-ai-bot.onrender.com",
              },
            },
          ],
        ],
      },
    }
  );
});
/* ================== /post (публикация в канал) ================== */
bot.onText(/\/post/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await bot.sendMessage(
      CHANNEL_ID,
      `🎨 *Creatify AI Studio*

🎁 Бесплатный доступ к AI-генератору изображений  
🔒 Условие — подписка на канал

👇 Нажми кнопку ниже, чтобы получить доступ`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🚀 Получить AI-доступ",
                url: "https://t.me/" + (await bot.getMe()).username,
              },
            ],
          ],
        },
      }
    );

    await bot.sendMessage(chatId, "✅ Пост успешно опубликован в канале");
  } catch (err) {
    console.error(err);
    await bot.sendMessage(
      chatId,
      "❌ Ошибка. Проверь, что бот добавлен в канал администратором."
    );
  }
});
