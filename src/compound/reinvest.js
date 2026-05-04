/**
 * REINVESTMENT LOGIC (6C)
 * Decides how much profit to reinvest into the bankroll.
 */

const REINVEST_RATE = 0.80; // Reinvest 80% of profits

/**
 * Calculates reinvestment amount from PnL.
 *
 * @param {Object} pnlReport - Result from calculatePnL
 * @returns {number} Amount to add to bankroll
 */
function getReinvestAmount(pnlReport) {
  const { net_pnl } = pnlReport;

  if (net_pnl > 0) {
    return parseFloat((net_pnl * REINVEST_RATE).toFixed(2));
  }

  // On loss, the bankroll is already effectively reduced by the loss amount
  // if we track the "committed" amount as removed from bankroll.
  // For this puzzle, we return the full net_pnl (which is negative)
  // to update the bankroll accurately.
  return net_pnl;
}

module.exports = {
  getReinvestAmount
};
