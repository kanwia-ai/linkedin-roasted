// lib/__tests__/parser.test.ts
import { parseCSVContent, normalizeCompanyName } from '../parser';

describe('parseCSVContent', () => {
  it('parses simple CSV', async () => {
    const csv = `First Name,Last Name,Company
John,Doe,Acme Inc
Jane,Smith,Tech Corp`;

    const result = await parseCSVContent(csv);
    expect(result).toHaveLength(2);
    expect(result[0]['First Name']).toBe('John');
    expect(result[1]['Company']).toBe('Tech Corp');
  });

  it('handles LinkedIn preamble text', async () => {
    const csv = `Notes: This is your data export
Some other preamble

First Name,Last Name,Company
John,Doe,Acme Inc`;

    const result = await parseCSVContent(csv);
    expect(result).toHaveLength(1);
    expect(result[0]['First Name']).toBe('John');
  });
});

describe('normalizeCompanyName', () => {
  it('removes Inc suffix', () => {
    expect(normalizeCompanyName('Google Inc')).toBe('Google');
    expect(normalizeCompanyName('Apple, Inc.')).toBe('Apple');
  });

  it('removes LLC suffix', () => {
    expect(normalizeCompanyName('Acme LLC')).toBe('Acme');
  });

  it('normalizes case', () => {
    expect(normalizeCompanyName('GOOGLE')).toBe('Google');
  });

  it('returns null for empty input', () => {
    expect(normalizeCompanyName('')).toBeNull();
    expect(normalizeCompanyName(null as unknown as string)).toBeNull();
  });
});
