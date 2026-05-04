const { logStrike, getHistory, resetHistory } = require('../src/ledger/index');

describe('PUZZLE 8 — STRIKE LEDGER', () => {

  beforeEach(() => {
    resetHistory();
  });

  const mockPayload = {
    session_id: 'session-123',
    signal: { direction: 'long' }
  };

  const mockSwarmResult = {
    strike_output: '🎯 STRIKE: UP',
    fc_adjusted: 0.85,
    platforms_eligible: ['polymarket']
  };

  test('should log a strike successfully', () => {
    const record = logStrike(mockSwarmResult, mockPayload);
    expect(record.session_id).toBe('session-123');
    expect(record.direction).toBe('long');
    expect(record.confidence).toBe(0.85);

    const history = getHistory();
    expect(history.length).toBe(1);
    expect(history[0].session_id).toBe('session-123');
  });

  test('should maintain multiple strikes in history', () => {
    logStrike(mockSwarmResult, mockPayload);
    logStrike(mockSwarmResult, { ...mockPayload, session_id: 'session-456' });

    const history = getHistory();
    expect(history.length).toBe(2);
    expect(history[1].session_id).toBe('session-456');
  });

  test('should reset history correctly', () => {
    logStrike(mockSwarmResult, mockPayload);
    resetHistory();
    expect(getHistory().length).toBe(0);
  });
});
