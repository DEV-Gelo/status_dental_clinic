const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

export async function sendTelegramMessage(text) {
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!chatId || !process.env.TELEGRAM_BOT_TOKEN) {
    console.error("Telegram credentials are missing");
    return;
  }

  try {
    const res = await fetch(TELEGRAM_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error("Telegram error:", data);
    }
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
  }
}
