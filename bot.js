const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const token = process.env.BOT_TOKEN;
const CHANNEL = process.env.CHANNEL_USERNAME || '@neyrolooms';

if (!token) {
  console.error('EFATAL: Telegram Bot Token not provided!');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Web server running on port', PORT);
});

// ===== /start =====
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(
    chatId,
    `👋 *Добро пожаловать в Creatify AI Studio*

🎁 Ты получаешь *бесплатный доступ к AI-инструментам*:
— генерация изображений  
— визуалы под бизнес и рекламу  

👉 Условие простое: подписка на наш канал.

Нажми кнопку ниже и запусти мини-приложение 👇`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🚀 Открыть AI-инструменты',
              web_app: {
                url: 'https://creatify-ai-bot.onrender.com'
              }
            }
          ]
        ]
      }
    }
  );
});

// ===== Проверка подписки =====
app.get('/check-subscription', async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.json({ subscribed: false });
  }

  try {
    const member = await bot.getChatMember(CHANNEL, userId);

    const ok =
      member.status === 'member' ||
      member.status === 'administrator' ||
      member.status === 'creator';

    res.json({ subscribed: ok });
  } catch (err) {
    res.json({ subscribed: false });
  }
});
