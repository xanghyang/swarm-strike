/**
 * PLATFORM ROUTER (Puzzle 4)
 * Handles routing of STRIKE signals to Polymarket and Limitless platforms.
 */

/**
 * Routes the signal based on platform eligibility.
 *
 * @param {Object} ternaryResult - Output from Agent 3 (Ternary)
 * @returns {Object} Routing report
 */
async function routeSignal(ternaryResult) {
  const { platforms_eligible, strike_output } = ternaryResult;
  const routing_report = {
    routed_at: new Date().toISOString(),
    polymarket: { status: "SKIPPED", action: null },
    limitless: { status: "SKIPPED", action: null },
    total_routed: 0
  };

  try {
    if (!platforms_eligible || platforms_eligible.length === 0) {
      return routing_report;
    }

    // 1. Polymarket Routing (Priority 1)
    if (platforms_eligible.includes('polymarket')) {
      routing_report.polymarket = {
        status: "ROUTED",
        action: "READY_FOR_EXECUTION",
        payload_preview: strike_output.split('\n\n')[0] // First block usually Polymarket
      };
      routing_report.total_routed++;
    }

    // 2. Limitless Routing (Priority 2)
    // In this puzzle, we assume 'lighter' or a dedicated 'limitless' tag triggers this.
    // Ternary Agent 3 used 'lighter', user mentioned 'Limitless' for Puzzle 4.
    // We will support both 'limitless' and 'lighter' (as Lighter is the DEX for Limitless)
    if (platforms_eligible.includes('limitless') || platforms_eligible.includes('lighter')) {
      routing_report.limitless = {
        status: "ROUTED",
        action: "READY_FOR_EXECUTION",
        payload_preview: strike_output.includes('LIGHTER') || strike_output.includes('LIMITLESS')
          ? strike_output
          : "Limitless specific output not found"
      };
      routing_report.total_routed++;
    }

    return routing_report;

  } catch (error) {
    return {
      ...routing_report,
      error: error.message,
      status: "ROUTING_FAILED"
    };
  }
}

module.exports = {
  routeSignal
};
