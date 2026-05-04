const { updateBankroll } = require('../src/compound/bankroll');
const { calculatePnL } = require('../src/compound/pnl_tracker');
const { getReinvestAmount } = require('../src/compound/reinvest');
const { settleAndCompound } = require('../src/compound/index');

describe('PUZZLE 6 — COMPOUND MANAGER', () => {

  const mockOrder = {
    platform: 'polymarket',
    amount_usd: 10.00,
    limit_price: 0.50,
    session_id: 'session-123'
  };

  describe('Bankroll Management', () => {
    test('should update bankroll correctly', () => {
      const bankroll = { polymarket: 1000, limitless: 1000 };
      const updated = updateBankroll(bankroll, 'polymarket', 50);
      expect(updated.polymarket).toBe(1050);
      expect(updated.limitless).toBe(1000);
    });
  });

  describe('PnL Tracking', () => {
    test('should calculate win PnL correctly', () => {
      // 10 / 0.5 = 20 shares. 20 * 1.0 = 20. 20 - 10 = 10 profit.
      const pnl = calculatePnL(mockOrder, true, 1.0);
      expect(pnl.net_pnl).toBe(10.00);
      expect(pnl.roi).toBe(1.0);
    });

    test('should calculate loss PnL correctly', () => {
      const pnl = calculatePnL(mockOrder, false, 0.0);
      expect(pnl.net_pnl).toBe(-10.00);
      expect(pnl.roi).toBe(-1.0);
    });
  });

  describe('Reinvestment Logic', () => {
    test('should apply reinvest rate on profit', () => {
      const pnl = { net_pnl: 10.00 };
      const amount = getReinvestAmount(pnl);
      expect(amount).toBe(8.00); // 80% of 10
    });

    test('should pass through loss', () => {
      const pnl = { net_pnl: -10.00 };
      const amount = getReinvestAmount(pnl);
      expect(amount).toBe(-10.00);
    });
  });

  describe('Compound Manager Orchestrator', () => {
    test('should orchestrate full settlement flow', () => {
      const bankroll = { polymarket: 1000, limitless: 1000 };
      const settlement = {
        order: mockOrder,
        isWin: true,
        settlementPrice: 1.0
      };

      const result = settleAndCompound(bankroll, settlement);
      expect(result.updatedBankroll.polymarket).toBe(1008);
      expect(result.pnlReport.net_pnl).toBe(10.00);
      expect(result.reinvest_decision.amount).toBe(8.00);
    });
  });
});
