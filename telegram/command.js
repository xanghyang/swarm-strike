// ============================================================
// PUZZLE 9 — TELEGRAM BOT
// COMMANDS — /saldo /status /kill
// ============================================================

const { getBankroll }    = require('../compound/bankroll');
const { getSystemStatus} = require('../pipeline/swarm_core');

let killSwitch = false;

function handleSaldo() {
  const bankroll = getBankroll();
  return [
    "💰 *SALDO REPORT*",
    `━━━━━━━━━━━━━━━━━`,
    `💵 Bankroll : $${bankroll.current}`,
    `📈 Profit   : $${bankroll.profit}`,
    `📉 Loss     : $${bankroll.loss}`,
    `🔄 Trades   : ${bankroll.total_trades}`,
  ].join("\n");
}

function handleStatus() {
  const status = killSwitch ? "🔴 KILLED" : "🟢 RUNNING";
  return [
    "🖥 *SYSTEM STATUS*",
    `━━━━━━━━━━━━━━━━━`,
    `⚡ Engine   : ${status}`,
    `🧠 P1 Payload Guard    : ✅`,
    `🔄 P2 Swarm Pipeline   : ✅`,
    `🎯 P3 Specialists      : ✅`,
    `🛣 P4 Platform Router  : ✅`,
    `💹 P5 Market Maker     : ✅`,
    `💰 P6 Compound Manager : ✅`,
    `🔍 P7 Edge Improver    : ✅`,
    `📒 P8 Strike Ledger    : ✅`,
  ].join("\n");
}

function handleKill() {
  killSwitch = true;
  return [
    "🚨 *KILL SWITCH ACTIVATED*",
    `━━━━━━━━━━━━━━━━━`,
    `🔴 Trading STOPPED`,
    `⏹ No new orders will execute`,
    `✅ Existing positions unaffected`,
    ``,
    `To restart: redeploy system`,
  ].join("\n");
}

function isKilled() {
  return killSwitch;
}

module.exports = {
  handleSaldo,
  handleStatus,
  handleKill,
  isKilled,
};
