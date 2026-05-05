/**
 * LEDGER ORCHESTRATOR (8C)
 * Coordinates logging and retrieval of strikes.
 */

const { addStrike, getStrikes, clearLedger } = require('./ledger_store');
const { createStrikeRecord } = require('./strike_logger');

/**
 * Logs a new strike to the ledger.
 *
 * @param {Object} swarmResult - Full runSwarm() output
 * @param {Object} payload - Original payload
 * @returns {Object} The recorded strike
 */
function logStrike(swarmResult, payload) {
  const record = createStrikeRecord(swarmResult, payload);
  addStrike(record);
  return record;
}

/**
 * Retrieves the full ledger history.
 * @returns {Array} History
 */
function getHistory() {
  return getStrikes();
}

/**
 * Resets the ledger history.
 */
function resetHistory() {
  clearLedger();
}

module.exports = {
  logStrike,
  getHistory,
  resetHistory
};
