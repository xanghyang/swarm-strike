/**
 * BANKROLL MANAGER (6A)
 * Tracks and updates platform-specific bankrolls.
 */

const initialBankroll = {
  polymarket: 1000.00,
  limitless: 1000.00
};

/**
 * Updates bankroll after an order is executed or settled.
 *
 * @param {Object} currentBankroll - { polymarket, limitless }
 * @param {string} platform - polymarket or limitless
 * @param {number} amount - Amount to add/subtract
 * @returns {Object} Updated bankroll
 */
function updateBankroll(currentBankroll, platform, amount) {
  const updated = { ...currentBankroll };
  if (updated[platform] !== undefined) {
    updated[platform] = parseFloat((updated[platform] + amount).toFixed(2));
  }
  return updated;
}

module.exports = {
  initialBankroll,
  updateBankroll
};
