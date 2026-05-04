const { getSizing, calculateQuarterKelly } = require('../src/market_maker/sizing_engine');
const { validateEntry } = require('../src/market_maker/entry_zone');
const { orchestrateMarketMaking } = require('../src/market_maker/index');

describe('PUZZLE 5 — MARKET MAKER ENGINE', () => {

  describe('Sizing Engine', () => {
    test('should calculate correct Quarter-Kelly size', () => {
      const p = 0.70;
      const sp = 0.50;
      const bankroll = 1000;

      // b = (1/0.5) - 1 = 1
      // q = 1 - 0.7 = 0.3
      // kelly = (0.7*1 - 0.3) / 1 = 0.4
      // 1/4 kelly = 0.1
      // size = 1000 * 0.1 = 100
      const size = calculateQuarterKelly(p, sp, bankroll);
      expect(size).toBe(100);
    });

    test('should apply platform caps', () => {
      const fc = 0.80;
      const sp = 0.50;
      const bankroll = 5000;

      const polySizing = getSizing('polymarket', fc, sp, bankroll);
      expect(polySizing.size).toBe(50); // Cap is 50

      const limitlessSizing = getSizing('limitless', fc, sp, bankroll);
      expect(limitlessSizing.size).toBe(30); // Cap is 30
    });

    test('should return correct ceiling prices', () => {
      const { getCeilingPrice } = require('../src/market_maker/sizing_engine');
      expect(getCeilingPrice(0.90)).toBe(0.80);
      expect(getCeilingPrice(0.80)).toBe(0.65);
      expect(getCeilingPrice(0.70)).toBe(0.50);
      expect(getCeilingPrice(0.60)).toBe(0.00);
    });
  });

  describe('Entry Zone', () => {
    test('should reject price above ceiling', () => {
      const validation = validateEntry('polymarket', 0.55, 0.50, 10);
      expect(validation.status).toBe('REJECTED');
      expect(validation.reason).toContain('PRICE_EXCEEDS_CEILING');
    });

    test('should reject size below minimum', () => {
      const validation = validateEntry('polymarket', 0.45, 0.50, 0.01);
      expect(validation.status).toBe('REJECTED');
      expect(validation.reason).toContain('SIZE_BELOW_MINIMUM');
    });

    test('should accept valid entry', () => {
      const validation = validateEntry('polymarket', 0.45, 0.50, 10);
      expect(validation.status).toBe('VALID');
    });
  });

  describe('Market Maker Orchestrator', () => {
    test('should build orders for valid swarm output', () => {
      const swarmResult = {
        platforms_eligible: ['polymarket', 'lighter'],
        fc_adjusted: 0.75,
        strike_output: '🔥 ACTION     : UP'
      };
      const marketData = { polymarket: 0.50, limitless: 0.50 };
      const bankrolls = { polymarket: 1000, limitless: 1000 };

      const orders = orchestrateMarketMaking(swarmResult, marketData, bankrolls, 'session-123');

      expect(orders.length).toBe(2);
      expect(orders[0].platform).toBe('polymarket');
      expect(orders[1].platform).toBe('limitless');
      expect(orders[0].amount_usd).toBeGreaterThan(0);
      expect(orders[0].route_to).toBe('PUZZLE_6_COMPOUND_MANAGER');
    });

    test('should skip for neutral direction', () => {
      const swarmResult = {
        platforms_eligible: ['polymarket'],
        fc_adjusted: 0.50,
        strike_output: '🚫 STATUS     : INVALID'
      };
      const orders = orchestrateMarketMaking(swarmResult, {}, {}, 'session-123');
      expect(orders.length).toBe(0);
    });
  });
});
