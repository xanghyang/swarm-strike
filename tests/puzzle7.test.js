const { processEdge } = require('../src/edge/index');
const { MIN_SCORE } = require('../src/edge/filter_engine');

describe('PUZZLE 7 — SMART EDGE IMPROVER', () => {

  const mockPayload = {
    state_vector: Array(15).fill('⊤'),
    signal: {
      final_confidence: 0.85,
      coherence_score: 1.0
    }
  };

  const mockSwarmResult = {
    swarm_overlay: {
      quant_eval: { count_top: 15 }
    },
    constraints: []
  };

  test('should pass a high-quality signal', () => {
    const report = processEdge(mockSwarmResult, mockPayload);
    expect(report.score).toBeGreaterThanOrEqual(MIN_SCORE);
    expect(report.passed_filters).toBe(true);
    expect(report.improvements.length).toBe(0);
  });

  test('should reject a low-score signal', () => {
    const lowPayload = {
      ...mockPayload,
      signal: {
        final_confidence: 0.30,
        coherence_score: 0.8
      }
    };
    const lowSwarm = {
      swarm_overlay: {
        quant_eval: { count_top: 2 }
      },
      constraints: []
    };

    const report = processEdge(lowSwarm, lowPayload);
    expect(report.score).toBeLessThan(MIN_SCORE);
    expect(report.passed_filters).toBe(false);
    expect(report.rejection_reason).toContain('SCORE_TOO_LOW');
  });

  test('should reject signal with critical constraint', () => {
    const swarmWithConstraint = {
      ...mockSwarmResult,
      constraints: [{ impact: 'high', reason: 'API_DOWN' }]
    };

    const report = processEdge(swarmWithConstraint, mockPayload);
    expect(report.passed_filters).toBe(false);
    expect(report.rejection_reason).toContain('CRITICAL_CONSTRAINT');
  });

  test('should suggest improvements for indeterminate slots', () => {
    const fuzzyPayload = {
      ...mockPayload,
      state_vector: ['⊥⊤', '⊥⊤', '⊥⊤', '⊥⊤', '⊥⊤', '⊤', '⊤', '⊤', '⊤', '⊤', '⊤', '⊤', '⊤', '⊤', '⊤']
    };
    const report = processEdge(mockSwarmResult, fuzzyPayload);
    expect(report.improvements.some(i => i.type === 'REDUCE_UNCERTAINTY')).toBe(true);
  });
});
