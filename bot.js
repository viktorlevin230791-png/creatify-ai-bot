import TelegramBot from "node-telegram-bot-api";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

/* ================== BASE ================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================== CONFIG ================== */
const BOT_TOKEN = process.env.BOT_TOKEN;

// ID твоего Telegram-канала
const CHANNEL_ID = -1002822432167;

// Ссылка на Mini App
const MINI_APP_URL = "https://creatify-ai-bot.onrender.com";

// Ссылка на канал, которую видит пользователь
const CHANNEL_URL = "https://t.me/neyrolooms";

// Ссылка на инструмент
const FREE_TOOL_URL =
  "https://lmarena.ai/ru/c/019bee6b-3942-77d2-86fd-10c03d281086";

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN не найден в переменных окружения");
  process.exit(1);
}

/* ================== BOT ================== */
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.on("polling_error", (err) => {
  if (err?.message?.includes("409")) return;
  console.error("Polling error:", err.message);
});

/* ================== EXPRESS ================== */
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ===== ROOT ===== */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ===== PING ===== */
app.get("/ping", (req, res) => {
  res.status(200).send("ok");
});

/* ================== HELPERS ================== */
async function checkUserSubscription(userId) {
  if (!userId) return false;

  try {
    const member = await bot.getChatMember(CHANNEL_ID, userId);

    return ["member", "administrator", "creator"].includes(member.status);
  } catch (error) {
    console.error("CHECK SUB ERROR:", error.message);
    return false;
  }
}

/* ================== API: CHECK SUBSCRIPTION ================== */
app.post("/check-subscription", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.json({
      ok: false,
      message: "Не удалось получить Telegram ID пользователя",
    });
  }

  const isSubscribed = await checkUserSubscription(userId);

  if (!isSubscribed) {
    return res.json({
      ok: false,
      message: "Сначала подпишись на канал",
      channelUrl: CHANNEL_URL,
    });
  }

  return res.json({
    ok: true,
    message: "Подписка подтверждена",
    url: FREE_TOOL_URL,
  });
});

/* ================== START SERVER ================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});

/* ================== BOT /start ================== */
bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `👋 *Creatify AI Studio*

Получи доступ к *бесплатному AI-инструменту* после подписки на наш Telegram-канал 👇`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Получить AI-инструмент",
              web_app: { url: MINI_APP_URL },
            },
          ],
        ],
      },
    }
  );
});
