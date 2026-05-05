/**
 * STRIKE LOGGER (8B)
 * Formats and validates strike records for the ledger.
 */

/**
 * Creates a formatted strike record.
 *
 * @param {Object} swarmResult - Full runSwarm() output
 * @param {Object} payload - Original payload
 * @returns {Object} Formatted strike record
 */
function createStrikeRecord(swarmResult, payload) {
  const { session_id, signal } = payload;
  const { strike_output, fc_adjusted, platforms_eligible } = swarmResult;

  return {
    session_id,
    direction: signal.direction,
    confidence: fc_adjusted,
    platforms: platforms_eligible,
    strike_output_preview: strike_output.substring(0, 100) + "...",
    created_at: new Date().toISOString(),
    status: "RECORDED"
  };
}

module.exports = {
  createStrikeRecord
};
