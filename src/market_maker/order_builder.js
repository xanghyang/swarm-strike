/**
 * ORDER BUILDER (5C)
 * Constructs order parameters for the compound manager.
 */

/**
 * Builds the final order object.
 *
 * @param {Object} params - Order parameters
 * @returns {Object} Order structure
 */
function buildOrder(params) {
  const {
    platform,
    direction,
    size,
    price,
    session_id,
    slippage
  } = params;

  return {
    platform,
    direction: direction.toUpperCase(),
    amount_usd: size,
    limit_price: price,
    slippage_tolerance: slippage,
    session_id,
    timestamp_utc: new Date().toISOString(),
    ttl_candles: 1,
    route_to: "PUZZLE_6_COMPOUND_MANAGER",
    status: "PENDING_EXECUTION"
  };
}

module.exports = {
  buildOrder
};
