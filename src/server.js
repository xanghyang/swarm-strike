// ============================================================
// PUZZLE 9 — ENTRY POINT
// SERVER — jalankan bot + expose health check
// ============================================================

const { startPolling } = require('./telegram/index');
const { isKilled }     = require('./telegram/commands');

// Health check endpoint (untuk Railway/VPS monitoring)
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status : isKilled() ? "KILLED" : "RUNNING",
      uptime : process.uptime(),
    }));
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log("✅ Health check running on port 3000");
});

// Start Telegram Bot
startPolling();
