/**
 
 * SMART EDGE IMPROVER ORCHESTRATOR (7D)
 * Coordinates scoring, filtering, and edge improvement.
 */

const { scoreSignal } = require('./signal_scorer');
const { applyFilters } = require('./filter_engine');
const { suggestImprovements } = require('./edge_improver');

/**

 * Processes a swarm result to evaluate and improve its edge.
 *
 * @param {Object} swarmResult - Output from runSwarm()
 * @param {Object} payload - Original payload
 * @returns {Object} Edge analysis report
 */
function processEdge(swarmResult, payload) {
  const { swarm_overlay, constraints } = swarmResult;

  // 1. Scoring
  const score = scoreSignal(payload, swarm_overlay);

  // 2. Filtering
  const filterResult = applyFilters(score, constraints);

  // 3. Suggestions
  const improvements = suggestImprovements(payload, swarm_overlay);

  return {
    score,
    passed_filters: filterResult.pass,
    rejection_reason: filterResult.reason,
    improvements,
    timestamp_utc: new Date().toISOString()
  };
}

module.exports = {
  processEdge
};
