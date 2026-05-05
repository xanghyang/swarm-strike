// ============================================================
// PUZZLE 9 — TELEGRAM BOT
// CONFIG — Token + Channel ID
// ============================================================

const config = {
  BOT_TOKEN  : process.env.TELEGRAM_BOT_TOKEN || "YOUR_BOT_TOKEN",
  CHANNEL_ID : process.env.TELEGRAM_CHANNEL_ID || "YOUR_CHANNEL_ID",
  COMMANDS   : {
    SALDO  : "/saldo",
    STATUS : "/status",
    KILL   : "/kill",
  }
};

module.exports = config;
