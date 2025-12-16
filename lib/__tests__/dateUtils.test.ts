// lib/__tests__/dateUtils.test.ts
import { parseDate, isIn2025 } from '../dateUtils';

describe('parseDate', () => {
  it('parses ISO format', () => {
    const result = parseDate('2025-03-15');
    expect(result?.getFullYear()).toBe(2025);
    expect(result?.getMonth()).toBe(2); // March = 2
    expect(result?.getDate()).toBe(15);
  });

  it('parses US format MM/DD/YYYY', () => {
    const result = parseDate('03/15/2025');
    expect(result?.getFullYear()).toBe(2025);
    expect(result?.getMonth()).toBe(2);
    expect(result?.getDate()).toBe(15);
  });

  it('parses written format "Mar 15, 2025"', () => {
    const result = parseDate('Mar 15, 2025');
    expect(result?.getFullYear()).toBe(2025);
    expect(result?.getMonth()).toBe(2);
  });

  it('returns null for invalid input', () => {
    expect(parseDate('')).toBeNull();
    expect(parseDate('not a date')).toBeNull();
  });
});

describe('isIn2025', () => {
  it('returns true for 2025 dates', () => {
    expect(isIn2025(new Date('2025-06-15'))).toBe(true);
  });

  it('returns false for non-2025 dates', () => {
    expect(isIn2025(new Date('2024-12-31'))).toBe(false);
    expect(isIn2025(new Date('2026-01-01'))).toBe(false);
  });
});
