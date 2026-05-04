/**
 * MARKET MAKER ORCHESTRATOR (5D)
 * Coordinates sizing → entry → order building.
 */

const { getSizing } = require('./sizing_engine');
const { validateEntry } = require('./entry_zone');
const { buildOrder } = require('./order_builder');

/**
 * Orchestrates the market making process for a swarm result.
 *
 * @param {Object} swarmResult - Output from runSwarm()
 * @param {Object} marketData - Current market prices { polymarket: 0.50, limitless: 0.52 }
 * @param {Object} bankrolls - Current bankrolls { polymarket: 1000, limitless: 1000 }
 * @param {string} session_id - Unique session ID
 * @returns {Array} List of built orders
 */
function orchestrateMarketMaking(swarmResult, marketData, bankrolls, session_id) {
  const { platforms_eligible, fc_adjusted, strike_output } = swarmResult;

  // Neutral direction = skip
  if (strike_output.includes("WAIT NEXT CANDLE") || strike_output.includes("INVALID")) {
    return [];
  }

  // Extract direction from strike_output or swarmResult if available
  // Agent 3 uses 'UP'/'DOWN' or 'BUY'/'SELL'
  let direction = "neutral";
  if (strike_output.includes("ACTION     : UP") || strike_output.includes("ACTION     : BUY") || strike_output.includes("ACTION     : LONG")) {
    direction = "long";
  } else if (strike_output.includes("ACTION     : DOWN") || strike_output.includes("ACTION     : SELL") || strike_output.includes("ACTION     : SHORT")) {
    direction = "short";
  }

  if (direction === "neutral") return [];

  const orders = [];

  // Filter for supported platforms
  const supported = ['polymarket', 'limitless', 'lighter']; // 'lighter' maps to limitless for routing
  const activePlatforms = platforms_eligible.filter(p => supported.includes(p));

  for (const p of activePlatforms) {
    const platformKey = p === 'lighter' ? 'limitless' : p;
    const currentPrice = marketData[platformKey];
    const bankroll = bankrolls[platformKey] || 0;

    if (!currentPrice) continue;

    // 1. Sizing
    const sizing = getSizing(platformKey, fc_adjusted, currentPrice, bankroll);

    // 2. Entry Validation
    const validation = validateEntry(platformKey, currentPrice, sizing.ceiling, sizing.size);

    if (validation.status === "VALID") {
      // 3. Order Building
      const order = buildOrder({
        platform: platformKey,
        direction,
        size: sizing.size,
        price: currentPrice,
        session_id,
        slippage: validation.slippage_estimate
      });
      orders.push(order);
    }
  }

  return orders;
}

module.exports = {
  orchestrateMarketMaking
};
