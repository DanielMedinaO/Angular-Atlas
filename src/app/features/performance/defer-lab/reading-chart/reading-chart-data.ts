type ReadingCategory = 'angular' | 'typescript' | 'accessibility';

interface ReadingSeries {
  readonly key: ReadingCategory;
  readonly label: string;
  readonly values: readonly number[];
}

export const totalDays = 365;

export const dates: readonly Date[] = Array.from(
  { length: totalDays },
  (_, day) => new Date(Date.UTC(2025, 0, day + 1)),
);

const categories = [
  { key: 'angular', label: 'Angular', baseline: 180, growth: 45, seed: 36, peakDay: 143 },
  { key: 'typescript', label: 'TypeScript', baseline: 140, growth: 24, seed: 67, peakDay: 259 },
  {
    key: 'accessibility',
    label: 'Accesibilidad',
    baseline: 95,
    growth: 38,
    seed: 82,
    peakDay: 197,
  },
] as const;

// Synthetic weekday/weekend traffic, gradual growth and a short peak per category.
export const readingSeries: readonly ReadingSeries[] = categories.map((category) => {
  let randomState: number = category.seed;
  const values = dates.map((date, day) => {
    randomState = (Math.imul(randomState, 1_664_525) + 1_013_904_223) >>> 0;
    const jitter = (randomState / 2 ** 32 - 0.5) * 36;
    const weekday = date.getUTCDay();
    const weeklyFactor = weekday === 0 || weekday === 6 ? 0.72 : 1;
    const trend = category.growth * (day / (totalDays - 1));
    const seasonality = 12 * Math.sin((2 * Math.PI * day) / 91);
    const peak = 50 * Math.max(0, 1 - Math.abs(day - category.peakDay) / 9);

    return Math.round((category.baseline + trend + seasonality + peak) * weeklyFactor + jitter);
  });

  return { key: category.key, label: category.label, values };
});
