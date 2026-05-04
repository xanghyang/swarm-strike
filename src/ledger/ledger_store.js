/**
 * LEDGER STORE (8A)
 * In-memory storage for STRIKE signal history.
 */

let strikes = [];

/**
 * Adds a strike to the ledger.
 * @param {Object} strike - Strike record
 */
function addStrike(strike) {
  strikes.push({
    ...strike,
    ledger_timestamp: new Date().toISOString()
  });
}

/**
 * Retrieves all strikes from the ledger.
 * @returns {Array} List of strikes
 */
function getStrikes() {
  return [...strikes];
}

/**
 * Clears the ledger.
 */
function clearLedger() {
  strikes = [];
}

module.exports = {
  addStrike,
  getStrikes,
  clearLedger
};
