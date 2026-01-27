const TelegramBot = require('node-telegram-bot-api');

// Берём токен из Environment Variables (Render)
const TOKEN = process.env.BOT_TOKEN;

if (!TOKEN) {
  console.error('❌ BOT_TOKEN не найден');
  process.exit(1);
}

// Запуск бота
const bot = new TelegramBot(TOKEN, { polling: true });

console.log('🤖 Creatify AI Bot запущен');

// ===== /start =====
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  const welcomeText = `👋 *Добро пожаловать в Creatify AI Studio*

Мы создаём *премиальные AI-инструменты* для:
• контента  
• брендов  
• бизнеса  
• экспертов  

🎁 *Бесплатно ты можешь:*
— протестировать AI-инструменты  
— получить идеи и контент  
— увидеть, как AI решает твои задачи  

Выбери действие ниже 👇`;

  await bot.sendMessage(chatId, welcomeText, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🚀 Попробовать AI (бесплатно)', callback_data: 'try_ai' }
        ],
        [
          { text: '🧠 Что умеет Creatify AI', callback_data: 'about_ai' }
        ],
        [
          { text: '💎 Для бизнеса / брендов', callback_data: 'business' }
        ]
      ]
    }
  });
});

// ===== КНОПКИ =====
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  // Убираем "часики" у кнопок
  await bot.answerCallbackQuery(query.id);

  if (data === 'try_ai') {
    await bot.sendMessage(
      chatId,
      `🚀 *Бесплатный AI-инструмент*

Скоро здесь появится первый инструмент:
— генерация идей  
— контент под соцсети  
— быстрые AI-решения  

⚡ Мы запускаемся поэтапно. Ты уже внутри.`,
      { parse_mode: 'Markdown' }
    );
  }

  if (data === 'about_ai') {
    await bot.sendMessage(
      chatId,
      `🧠 *Creatify AI Studio*

Это AI-платформа нового поколения:
— минимализм  
— скорость  
— практическая польза  

Без воды. Без лишних слов. Только результат.`,
      { parse_mode: 'Markdown' }
    );
  }

  if (data === 'business') {
    await bot.sendMessage(
      chatId,
      `💎 *Для бизнеса и брендов*

Мы разрабатываем:
— кастомные AI-инструменты  
— AI для контента и маркетинга  
— автоматизацию процессов  

📩 Свяжемся — когда ты будешь готов.`,
      { parse_mode: 'Markdown' }
    );
  }
});

// ===== FALLBACK (на любые сообщения) =====
bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    bot.sendMessage(
      msg.chat.id,
      'ℹ️ Используй кнопки ниже или команду /start'
    );
  }
});
