const tg = window.Telegram.WebApp;
tg.expand();

const userId = tg.initDataUnsafe?.user?.id;
const CHANNEL_LINK = 'https://t.me/neyrolooms';

document.getElementById('subBtn').href = CHANNEL_LINK;

document.getElementById('checkBtn').onclick = async () => {
  const result = document.getElementById('result');

  if (!userId) {
    result.innerHTML = '❌ Не удалось определить пользователя Telegram';
    return;
  }

  const res = await fetch(`/check-subscription?userId=${userId}`);
  const data = await res.json();

  if (data.subscribed) {
    result.innerHTML = `
      🎉 <b>Подписка подтверждена!</b><br><br>
      🔓 Доступ к бесплатному AI-инструменту открыт
      <br><br>
      <button class="btn primary">
        🎨 Запустить генератор изображений
      </button>
    `;
  } else {
    result.innerHTML = `
      ❌ <b>Подписка не найдена</b><br>
      Подпишись на канал и нажми «Проверить подписку»
    `;
  }
};
