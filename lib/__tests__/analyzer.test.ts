// lib/__tests__/analyzer.test.ts
import { analyzePatterns } from '../analyzer';
import type { LinkedInData, ConnectionRow, MessageRow } from '../types';

const createMockData = (overrides: Partial<LinkedInData> = {}): LinkedInData => ({
  connections: [],
  messages: [],
  reactions: [],
  shares: [],
  invitations: [],
  userName: 'Test User',
  ...overrides
});

describe('analyzePatterns', () => {
  describe('nameCollection', () => {
    it('detects when one first name appears 5+ times', () => {
      const connections: ConnectionRow[] = [
        { 'First Name': 'Greg', 'Last Name': 'A', 'Email Address': '', 'Company': '', 'Position': '', 'Connected On': '01/15/2025' },
        { 'First Name': 'Greg', 'Last Name': 'B', 'Email Address': '', 'Company': '', 'Position': '', 'Connected On': '02/15/2025' },
        { 'First Name': 'Greg', 'Last Name': 'C', 'Email Address': '', 'Company': '', 'Position': '', 'Connected On': '03/15/2025' },
        { 'First Name': 'Greg', 'Last Name': 'D', 'Email Address': '', 'Company': '', 'Position': '', 'Connected On': '04/15/2025' },
        { 'First Name': 'Greg', 'Last Name': 'E', 'Email Address': '', 'Company': '', 'Position': '', 'Connected On': '05/15/2025' },
        { 'First Name': 'John', 'Last Name': 'X', 'Email Address': '', 'Company': '', 'Position': '', 'Connected On': '06/15/2025' },
      ];

      const result = analyzePatterns(createMockData({ connections }));
      expect(result.nameCollection).toEqual({ name: 'Greg', count: 5 });
    });

    it('returns null when no name appears 5+ times', () => {
      const connections: ConnectionRow[] = [
        { 'First Name': 'Greg', 'Last Name': 'A', 'Email Address': '', 'Company': '', 'Position': '', 'Connected On': '01/15/2025' },
        { 'First Name': 'John', 'Last Name': 'B', 'Email Address': '', 'Company': '', 'Position': '', 'Connected On': '02/15/2025' },
      ];

      const result = analyzePatterns(createMockData({ connections }));
      expect(result.nameCollection).toBeNull();
    });
  });

  describe('nightOwl', () => {
    it('detects when 20%+ messages sent after 10pm', () => {
      const messages: MessageRow[] = [
        { 'CONVERSATION ID': '1', 'CONVERSATION TITLE': '', 'FROM': 'Test User', 'TO': 'Someone', 'DATE': '2025-03-15 23:30:00', 'SUBJECT': '', 'CONTENT': 'Late night msg' },
        { 'CONVERSATION ID': '2', 'CONVERSATION TITLE': '', 'FROM': 'Test User', 'TO': 'Someone', 'DATE': '2025-03-15 22:00:00', 'SUBJECT': '', 'CONTENT': 'Another late msg' },
        { 'CONVERSATION ID': '3', 'CONVERSATION TITLE': '', 'FROM': 'Test User', 'TO': 'Someone', 'DATE': '2025-03-15 10:00:00', 'SUBJECT': '', 'CONTENT': 'Morning msg' },
      ];

      const result = analyzePatterns(createMockData({ messages, userName: 'Test User' }));
      expect(result.nightOwl).not.toBeNull();
      expect(result.nightOwl!.percentage).toBeGreaterThanOrEqual(20);
    });
  });
});
