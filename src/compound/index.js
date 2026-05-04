settlementPrice }
 * @returns {Object} { updatedBankroll, pnlReport, reinvestDecision }
 */
function settleAndCompound(currentBankroll, settlementResult) {
  const { order, isWin, settlementPrice } = settlementResult;

  // 1. Track PnL
  const pnlReport = calculatePnL(order, isWin, settlementPrice);

  // 2. Determine Reinvestment
  const reinvestAmount = getReinvestAmount(pnlReport);

  // 3. Update Bankroll
  // reinvestAmount is negative for losses, correctly reducing the bankroll
  const updatedBankroll = updateBankroll(currentBankroll, order.platform, reinvestAmount);

  return {
    updatedBankroll,
    pnlReport,
    reinvest_decision: {
      platform: order.platform,
      amount: reinvestAmount,
      strategy: reinvestAmount > 0 ? "PARTIAL_REINVEST" : "DRAWDOWN_LOGGED"
    }
  };
}

module.exports = {
  settleAndCompound
};
