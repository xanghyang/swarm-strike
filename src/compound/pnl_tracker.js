/**
 * PnL TRACKER (6B)
 * Tracks profit and loss per order.
 */

/**
 * Calculates PnL for a settled order.
 *
 * @param {Object} order - Executed order object
 * @param {boolean} isWin - Whether the prediction was correct
 * @param {number} settlementPrice - Actual share price at settlement (usually 1.0 or 0.0)
 * @returns {Object} PnL report
 */
function calculatePnL(order, isWin, settlementPrice) {
  const { amount_usd, limit_price } = order;

  // shares = amount / price_per_share
  const shares = amount_usd / limit_price;
  const grossProceeds = shares * settlementPrice;
  const netPnL = grossProceeds - amount_usd;

  return {
    order_id: order.session_id,
    platform: order.platform,
    is_win: isWin,
    net_pnl: parseFloat(netPnL.toFixed(2)),
    roi: parseFloat((netPnL / amount_usd).toFixed(4))
  };
}

module.exports = {
  calculatePnL
};
