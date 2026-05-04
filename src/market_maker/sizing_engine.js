/**
 * SIZING ENGINE (5A)
 * Implements Quarter-Kelly sizing and platform caps.
 */

const CAPS = {
  polymarket: 50.00,
  limitless: 30.00
};

/**
 * Calculates max ceiling price based on confidence.
 * @param {number} fc - Adjusted final confidence
 * @returns {number} Max price in USD
 */
function getCeilingPrice(fc) {
  if (fc >= 0.85) return 0.80;
  if (fc >= 0.75) return 0.65;
  if (fc >= 0.65) return 0.50;
  return 0.00;
}

/**
 * Calculates order size using Quarter-Kelly.
 * Kelly formula: f* = (p*b - q) / b
 * where b = odds - 1.
 * Using share price (sp), odds = 1/sp.
 * b = (1/sp) - 1.
 *
 * @param {number} p - Probability (final_confidence)
 * @param {number} sp - Current share price (e.g. 0.50)
 * @param {number} bankroll - Available bankroll for this platform
 * @returns {number} Size in USD
 */
function calculateQuarterKelly(p, sp, bankroll) {
  if (sp <= 0 || sp >= 1) return 0;

  const b = (1 / sp) - 1;
  const q = 1 - p;
  const kelly = (p * b - q) / b;

  // Quarter-Kelly
  const size = bankroll * (kelly / 4);
  return Math.max(0, parseFloat(size.toFixed(2)));
}

/**
 * Executes sizing logic for a given platform.
 * @param {string} platform - polymarket or limitless
 * @param {number} fc - Adjusted final confidence
 * @param {number} currentSharePrice - Current market price
 * @param {number} bankroll - Current bankroll for platform
 * @returns {Object} Sizing result
 */
function getSizing(platform, fc, currentSharePrice, bankroll) {
  const cap = CAPS[platform] || 0;
  const ceiling = getCeilingPrice(fc);

  const rawSize = calculateQuarterKelly(fc, currentSharePrice, bankroll);
  const finalSize = Math.min(rawSize, cap);

  return {
    size: finalSize,
    ceiling,
    cap_applied: rawSize > cap
  };
}

module.exports = {
  getSizing,
  getCeilingPrice,
  calculateQuarterKelly
};
