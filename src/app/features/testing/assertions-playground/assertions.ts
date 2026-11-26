export type NumericMatcher =
  'toBe' | 'toBeGreaterThan' | 'toBeGreaterThanOrEqual' | 'toBeLessThan' | 'toBeLessThanOrEqual';

export interface AssertionCase {
  readonly id: string;
  readonly matcher: NumericMatcher;
  readonly expected: number;
  readonly negated: boolean;
}

export interface AssertionResult {
  readonly id: string;
  readonly code: string;
  readonly passed: boolean;
  readonly expected: string;
  readonly received: string;
}

const MATCHER_SYMBOLS: Readonly<Record<NumericMatcher, string>> = {
  toBe: '=',
  toBeGreaterThan: '>',
  toBeGreaterThanOrEqual: '≥',
  toBeLessThan: '<',
  toBeLessThanOrEqual: '≤',
};

const MATCHER_PREDICATES: Readonly<Record<NumericMatcher, (a: number, b: number) => boolean>> = {
  toBe: (received, expected) => Object.is(received, expected),
  toBeGreaterThan: (received, expected) => received > expected,
  toBeGreaterThanOrEqual: (received, expected) => received >= expected,
  toBeLessThan: (received, expected) => received < expected,
  toBeLessThanOrEqual: (received, expected) => received <= expected,
};

export const ASSERTION_CASES: readonly AssertionCase[] = [
  { id: 'is-zero', matcher: 'toBe', expected: 0, negated: false },
  { id: 'not-zero', matcher: 'toBe', expected: 0, negated: true },
  { id: 'greater-than-two', matcher: 'toBeGreaterThan', expected: 2, negated: false },
  { id: 'at-least-five', matcher: 'toBeGreaterThanOrEqual', expected: 5, negated: false },
  { id: 'less-than-ten', matcher: 'toBeLessThan', expected: 10, negated: false },
  { id: 'at-most-three', matcher: 'toBeLessThanOrEqual', expected: 3, negated: false },
];

export function assertionCode(assertion: AssertionCase): string {
  const chain = assertion.negated ? '.not' : '';
  return `expect(counter)${chain}.${assertion.matcher}(${assertion.expected})`;
}

export function describeExpectation(assertion: AssertionCase): string {
  const prefix = assertion.negated ? 'no ' : '';
  return `${prefix}${MATCHER_SYMBOLS[assertion.matcher]} ${assertion.expected}`;
}

export function evaluateAssertion(received: number, assertion: AssertionCase): AssertionResult {
  const matches = MATCHER_PREDICATES[assertion.matcher](received, assertion.expected);

  return {
    id: assertion.id,
    code: assertionCode(assertion),
    passed: assertion.negated ? !matches : matches,
    expected: describeExpectation(assertion),
    received: String(received),
  };
}

export function evaluateAssertions(
  received: number,
  assertions: readonly AssertionCase[] = ASSERTION_CASES,
): readonly AssertionResult[] {
  return assertions.map((assertion) => evaluateAssertion(received, assertion));
}
