// Netlify Function: приймає текст заявки з форми й пересилає його в Telegram.
// Токен і chat_id беруться зі змінних середовища Netlify, тому не потрапляють у браузер.

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return json(500, { error: "Server is not configured" });
  }

  let text;
  try {
    ({ text } = JSON.parse(event.body || "{}"));
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  if (typeof text !== "string" || !text.trim() || text.length > 2000) {
    return json(400, { error: "Invalid message" });
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      return json(502, { error: data.description || "Telegram API error" });
    }
    return json(200, { ok: true });
  } catch (err) {
    return json(502, { error: "Failed to reach Telegram" });
  }
};
