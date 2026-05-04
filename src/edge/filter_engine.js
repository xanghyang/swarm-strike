/**
 * FILTER ENGINE (7B)
 * Filters signals based on score thresholds and constraints.
 */

const MIN_SCORE = 0.55;

/**
 * Validates if a signal passes the edge filters.
 *
 * @param {number} score - Calculated signal score
 * @param {Array} constraints - List of signal constraints
 * @returns {Object} { pass: boolean, reason: string }
 */
function applyFilters(score, constraints) {
  if (score < MIN_SCORE) {
    return { pass: false, reason: `SCORE_TOO_LOW: ${score} < ${MIN_SCORE}` };
  }

  const highImpactConstraint = constraints.find(c => c.impact === 'high');
  if (highImpactConstraint) {
    return { pass: false, reason: `CRITICAL_CONSTRAINT: ${highImpactConstraint.reason}` };
  }

  return { pass: true, reason: "FILTERS_PASSED" };
}

module.exports = {
  applyFilters,
  MIN_SCORE
};
