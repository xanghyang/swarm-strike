/**
 * SIGNAL SCORER (7A)
 * Evaluates the quality of a signal based on its components.
 */

/**
 * Scores a signal from 0.0 to 1.0.
 *
 * @param {Object} payload - Signal payload
 * @param {Object} swarmOverlay - Swarm overlay from core
 * @returns {number} Score
 */
function scoreSignal(payload, swarmOverlay) {
  const { final_confidence, coherence_score } = payload.signal;
  const { count_top } = swarmOverlay.quant_eval;

  // Weights
  const wConfidence = 0.4;
  const wCoherence = 0.3;
  const wTopCount = 0.3;

  const topScore = count_top / 15;

  const finalScore = (final_confidence * wConfidence) +
                     (coherence_score * wCoherence) +
                     (topScore * wTopCount);

  return parseFloat(finalScore.toFixed(4));
}

module.exports = {
  scoreSignal
};
