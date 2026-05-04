/**
 * EDGE IMPROVER (7C)
 * Suggests adjustments to improve the edge of a signal.
 */

/**
 * Suggests improvements for a signal.
 *
 * @param {Object} payload - Signal payload
 * @param {Object} swarmOverlay - Swarm overlay
 * @returns {Array} List of improvement suggestions
 */
function suggestImprovements(payload, swarmOverlay) {
  const { state_vector } = payload;
  const suggestions = [];

  // Rule 1: Check indeterminate slots
  const indetSlots = state_vector.map((val, idx) => val === '⊥⊤' ? idx : null).filter(val => val !== null);
  if (indetSlots.length > 3) {
    suggestions.push({
      type: "REDUCE_UNCERTAINTY",
      slots: indetSlots,
      advice: "Too many indeterminate slots. Increase data resolution or add secondary sources."
    });
  }

  // Rule 2: Low confidence booster
  if (payload.signal.final_confidence < 0.65) {
    suggestions.push({
      type: "BOOST_CONFIDENCE",
      advice: "Confidence below optimal threshold for high-stakes routing. Consider cross-verifying with Macro specialist."
    });
  }

  return suggestions;
}

module.exports = {
  suggestImprovements
};
