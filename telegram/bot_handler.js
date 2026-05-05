// ============================================================
// PUZZLE 9 — TELEGRAM BOT
// BOT HANDLER — proses incoming commands
// ============================================================

const { handleSaldo, handleStatus, handleKill } = require('./commands');
const config = require('./config');

async function processUpdate(update, sendMessage) {
  const message = update?.message;
  if (!message) return;

  // Only respond to private channel
  const chatId = message.chat.id.toString();
  if (chatId !== config.CHANNEL_ID.toString()) return;

  const text = message?.text?.trim();
  if (!text) return;

  let response = "";

  switch (text) {
    case config.COMMANDS.SALDO:
      response = handleSaldo();
      break;
    case config.COMMANDS.STATUS:
      response = handleStatus();
      break;
    case config.COMMANDS.KILL:
      response = handleKill();
      break;
    default:
      response = [
        "🤖 *SWARM-STRIKE BOT*",
        `━━━━━━━━━━━━━━━━━`,
        `Commands:`,
        `/saldo  → cek bankroll`,
        `/status → cek sistem`,
        `/kill   → stop trading`,
      ].join("\n");
  }

  await sendMessage(chatId, response);
}

module.exports = { processUpdate };
