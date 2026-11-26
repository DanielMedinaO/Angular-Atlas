import {
  ASSERTION_CASES,
  AssertionCase,
  assertionCode,
  describeExpectation,
  evaluateAssertion,
  evaluateAssertions,
} from './assertions';

function assertionCase(overrides: Partial<AssertionCase> = {}): AssertionCase {
  return { id: 'case', matcher: 'toBe', expected: 3, negated: false, ...overrides };
}

describe('evaluateAssertion', () => {
  it.each([
    { matcher: 'toBe', received: 3, expected: 3, passed: true },
    { matcher: 'toBe', received: 4, expected: 3, passed: false },
    { matcher: 'toBeGreaterThan', received: 4, expected: 3, passed: true },
    { matcher: 'toBeGreaterThan', received: 3, expected: 3, passed: false },
    { matcher: 'toBeGreaterThanOrEqual', received: 3, expected: 3, passed: true },
    { matcher: 'toBeGreaterThanOrEqual', received: 2, expected: 3, passed: false },
    { matcher: 'toBeLessThan', received: 2, expected: 3, passed: true },
    { matcher: 'toBeLessThan', received: 3, expected: 3, passed: false },
    { matcher: 'toBeLessThanOrEqual', received: 3, expected: 3, passed: true },
    { matcher: 'toBeLessThanOrEqual', received: 4, expected: 3, passed: false },
  ] as const)(
    '$matcher passes=$passed when received is $received and expected is $expected',
    ({ matcher, received, expected, passed }) => {
      const result = evaluateAssertion(received, assertionCase({ matcher, expected }));

      expect(result.passed).toBe(passed);
    },
  );

  it('inverts the outcome when the assertion is negated', () => {
    expect(evaluateAssertion(0, assertionCase({ expected: 0, negated: true })).passed).toBe(false);
    expect(evaluateAssertion(1, assertionCase({ expected: 0, negated: true })).passed).toBe(true);
  });

  it('reports the expectation and the received value as readable text', () => {
    const result = evaluateAssertion(7, assertionCase({ matcher: 'toBeLessThan', expected: 5 }));

    expect(result).toEqual({
      id: 'case',
      code: 'expect(counter).toBeLessThan(5)',
      passed: false,
      expected: '< 5',
      received: '7',
    });
  });

  it('distinguishes 0 from -0 like toBe, which uses Object.is', () => {
    expect(evaluateAssertion(-0, assertionCase({ expected: 0 })).passed).toBe(false);
  });
});

describe('assertion descriptions', () => {
  it('builds the code of a negated assertion with .not', () => {
    expect(assertionCode(assertionCase({ negated: true, expected: 0 }))).toBe(
      'expect(counter).not.toBe(0)',
    );
  });

  it('prefixes negated expectations', () => {
    expect(describeExpectation(assertionCase({ negated: true, expected: 0 }))).toBe('no = 0');
    expect(describeExpectation(assertionCase({ matcher: 'toBeGreaterThanOrEqual' }))).toBe('≥ 3');
  });
});

describe('evaluateAssertions', () => {
  it('evaluates every predefined case in order against the same counter value', () => {
    const results = evaluateAssertions(5);

    expect(results.map((result) => result.id)).toEqual(ASSERTION_CASES.map((item) => item.id));
    expect(results.map((result) => result.passed)).toEqual([false, true, true, true, true, false]);
    expect(new Set(results.map((result) => result.received))).toEqual(new Set(['5']));
  });

  it('returns an empty list when there is nothing to verify', () => {
    expect(evaluateAssertions(1, [])).toEqual([]);
  });
});
