import TelegramBot from "node-telegram-bot-api";
import express from "express";
import fetch from "node-fetch";

const token = process.env.BOT_TOKEN;
const CHANNEL = "@neyrolooms";

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(express.static("public"));

/* ---------- START ---------- */
bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `✨ *Creatify AI Studio*

Получите доступ к *бесплатному AI-инструменту*  
для идей, контента и нейросервисов.

👇 Нажмите кнопку ниже, чтобы начать`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Получить бесплатный AI",
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

/* ---------- CHECK SUB ---------- */
app.post("/check-subscription", async (req, res) => {
  const { userId } = req.body;

  try {
    const member = await bot.getChatMember(CHANNEL, userId);

    if (["member", "administrator", "creator"].includes(member.status)) {
      return res.json({ subscribed: true });
    }

    return res.json({ subscribed: false });
  } catch (err) {
    console.error("SUB CHECK ERROR:", err.message);
    return res.status(500).json({ error: "subscription_check_failed" });
  }
});

app.listen(3000, () => {
  console.log("Server started");
});
