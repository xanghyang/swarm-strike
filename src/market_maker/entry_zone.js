/**
 * ENTRY ZONE (5B)
 * Validates price entry and slippage.
 */

const MIN_ORDER = {
  polymarket: 0.02,
  limitless: 0.01
};

/**
 * Validates if the order can be placed based on price and platform rules.
 *
 * @param {string} platform - polymarket or limitless
 * @param {number} currentPrice - Current market price per share
 * @param {number} maxCeiling - Ceiling price allowed for this confidence
 * @param {number} size - Calculated size in USD
 * @returns {Object} Validation result
 */
function validateEntry(platform, currentPrice, maxCeiling, size) {
  const min = MIN_ORDER[platform] || 0.01;
  const slippageEstimate = 0.01; // Fixed 1% estimate for puzzle 5

  const priceValid = currentPrice <= maxCeiling;
  const sizeValid = size >= min;

  let status = "VALID";
  let reason = "ALL_CHECKS_PASSED";

  if (!priceValid) {
    status = "REJECTED";
    reason = `PRICE_EXCEEDS_CEILING: ${currentPrice} > ${maxCeiling}`;
  } else if (!sizeValid) {
    status = "REJECTED";
    reason = `SIZE_BELOW_MINIMUM: ${size} < ${min}`;
  }

  return {
    status,
    reason,
    effective_price: parseFloat((currentPrice * (1 + slippageEstimate)).toFixed(4)),
    slippage_estimate: slippageEstimate
  };
}

module.exports = {
  validateEntry
};
