// ============================================================
// PUZZLE 9 — TELEGRAM BOT
// INDEX — orchestrator + polling
// ============================================================

const https          = require('https');
const config         = require('./config');
const { processUpdate } = require('./bot_handler');

const BASE_URL = `https://api.telegram.org/bot${config.BOT_TOKEN}`;

// ── SEND MESSAGE ─────────────────────────────────────────
async function sendMessage(chatId, text) {
  const body = JSON.stringify({
    chat_id    : chatId,
    text       : text,
    parse_mode : "Markdown",
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      `${BASE_URL}/sendMessage`,
      {
        method  : "POST",
        headers : {
          "Content-Type"  : "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => resolve(JSON.parse(data)));
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── POLLING ──────────────────────────────────────────────
let offset = 0;

async function getUpdates() {
  return new Promise((resolve, reject) => {
    https.get(
      `${BASE_URL}/getUpdates?offset=${offset}&timeout=30`,
      (res) => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => resolve(JSON.parse(data)));
      }
    ).on("error", reject);
  });
}

async function startPolling() {
  console.log("🤖 SWARM-STRIKE Bot started...");
  while (true) {
    try {
      const result = await getUpdates();
      if (result.ok && result.result.length > 0) {
        for (const update of result.result) {
          await processUpdate(update, sendMessage);
          offset = update.update_id + 1;
        }
      }
    } catch (err) {
      console.error("Polling error:", err.message);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

module.exports = { startPolling, sendMessage };
