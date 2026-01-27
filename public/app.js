const tg = window.Telegram.WebApp;
tg.expand();

const checkBtn = document.getElementById("checkBtn");
const result = document.getElementById("result");

checkBtn.onclick = async () => {
  result.innerText = "⏳ Проверяем подписку...";

  try {
    const res = await fetch("/check-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: tg.initDataUnsafe.user.id,
      }),
    });

    const data = await res.json();

    if (data.subscribed) {
      result.innerHTML = "🎉 Подписка подтверждена!<br>🔓 Доступ открыт";
    } else {
      result.innerHTML =
        "❌ Подписка не найдена<br>Подпишись и нажми «Проверить»";
    }
  } catch (e) {
    result.innerText = "⚠️ Ошибка сервера";
  }
};
