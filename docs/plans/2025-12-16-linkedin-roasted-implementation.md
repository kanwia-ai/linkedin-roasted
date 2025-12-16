# LinkedIn Roasted Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a client-side web app that parses LinkedIn data exports and generates personalized, funny roast slides about user's 2025 LinkedIn behavior.

**Architecture:** Next.js 14 App Router with all processing client-side. ZIP files are parsed in-browser using JSZip + PapaParse. Slides are data-driven (patterns select which roasts appear) with randomized humor flavors. Two shareable outputs: 2x2 matrix and fake headline.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, JSZip, PapaParse, html-to-image

---

## Task 1: Project Setup

**Files:**
- Create: `linkedin-roasted/package.json`
- Create: `linkedin-roasted/tsconfig.json`
- Create: `linkedin-roasted/tailwind.config.ts`
- Create: `linkedin-roasted/app/layout.tsx`
- Create: `linkedin-roasted/app/page.tsx`

**Step 1: Initialize Next.js project**

Run from `/Users/kyraatekwana`:
```bash
cd linkedin-roasted && npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

When prompted, accept defaults.

**Step 2: Install dependencies**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm install jszip papaparse framer-motion html-to-image && npm install -D @types/papaparse
```

**Step 3: Verify setup**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm run dev
```

Expected: Dev server starts at localhost:3000

**Step 4: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git init && git add . && git commit -m "chore: initial Next.js setup with dependencies"
```

---

## Task 2: Type Definitions

**Files:**
- Create: `lib/types.ts`

**Step 1: Create core type definitions**

```typescript
// lib/types.ts

// LinkedIn CSV row types
export interface ConnectionRow {
  'First Name': string;
  'Last Name': string;
  'Email Address': string;
  'Company': string;
  'Position': string;
  'Connected On': string;
}

export interface MessageRow {
  'CONVERSATION ID': string;
  'CONVERSATION TITLE': string;
  'FROM': string;
  'TO': string;
  'DATE': string;
  'SUBJECT': string;
  'CONTENT': string;
}

export interface ReactionRow {
  'Date': string;
  'Type': string;
  'Link': string;
}

export interface ShareRow {
  'Date': string;
  'ShareLink': string;
  'ShareCommentary': string;
  'SharedUrl': string;
  'MediaUrl': string;
  'Visibility': string;
}

export interface InvitationRow {
  'From': string;
  'To': string;
  'Sent At': string;
  'Message': string;
  'Direction': 'INCOMING' | 'OUTGOING';
}

// Parsed data structure
export interface LinkedInData {
  connections: ConnectionRow[];
  messages: MessageRow[];
  reactions: ReactionRow[];
  shares: ShareRow[];
  invitations: InvitationRow[];
  userName: string;
}

// Pattern detection results
export interface DetectedPatterns {
  nameCollection: { name: string; count: number } | null;
  nightOwl: { percentage: number; lateMessages: number } | null;
  coffeeLiar: { mentions: number; followUps: number } | null;
  congratsBot: { count: number } | null;
  companyStalker: { company: string; count: number } | null;
  panicNetworker: { month: string; count: number; average: number; ratio: number } | null;
  ghost: { name: string; lastContact: Date; messageCount: number }[] | null;
  replyGuy: { comments: number; posts: number } | null;
  thoughtLeader: { buzzwordCount: number; topBuzzword: string } | null;
  totalConnections2025: number;
  totalMessages2025: number;
  totalReactions2025: number;
  totalPosts2025: number;
}

// Humor flavors
export type HumorFlavor = 'absurdist' | 'meta' | 'deadpan' | 'universal';

// Slide types
export type SlideType =
  | 'opening'
  | 'nameCollection'
  | 'nightOwl'
  | 'coffeeLiar'
  | 'congratsBot'
  | 'companyStalker'
  | 'panicNetworker'
  | 'ghost'
  | 'replyGuy'
  | 'thoughtLeader';

export interface SlideData {
  type: SlideType;
  flavor: HumorFlavor;
  data: Record<string, unknown>;
}

// Archetype for 2x2 matrix
export type ArchetypeName = 'THE OPERATOR' | 'THE BROADCASTER' | 'THE WHISPERER' | 'THE LURKER';

export interface Archetype {
  name: ArchetypeName;
  quadrant: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  tagline: string;
  roast: string;
}

// Percentile stats
export interface PercentileStats {
  posting: number;
  engagement: number;
  coffeeLies: number;
  ghostFactor: number;
  isLoud: boolean;
  isActive: boolean;
}

// Final roast result
export interface RoastResult {
  slides: SlideData[];
  archetype: Archetype;
  percentiles: PercentileStats;
  headline: string;
  userName: string;
  patterns: DetectedPatterns;
}
```

**Step 2: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add lib/types.ts && git commit -m "feat: add TypeScript type definitions"
```

---

## Task 3: Date Parsing Utility

**Files:**
- Create: `lib/dateUtils.ts`
- Create: `lib/__tests__/dateUtils.test.ts`

**Step 1: Create test file**

```typescript
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
```

**Step 2: Run test to verify it fails**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm test -- lib/__tests__/dateUtils.test.ts
```

Expected: FAIL (module not found)

**Step 3: Install Jest**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm install -D jest @types/jest ts-jest && npx ts-jest config:init
```

**Step 4: Add test script to package.json**

Add to scripts section: `"test": "jest"`

**Step 5: Create implementation**

```typescript
// lib/dateUtils.ts

const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

export function parseDate(dateString: string | undefined | null): Date | null {
  if (!dateString || typeof dateString !== 'string') return null;

  const trimmed = dateString.trim();
  if (!trimmed) return null;

  // Try ISO format: 2025-03-15
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // Try US format: MM/DD/YYYY or M/D/YYYY
  const usMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (usMatch) {
    const [, month, day, year] = usMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // Try written format: Mar 15, 2025 or March 15, 2025
  const writtenMatch = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (writtenMatch) {
    const [, monthStr, day, year] = writtenMatch;
    const month = MONTH_MAP[monthStr.toLowerCase()];
    if (month !== undefined) {
      return new Date(parseInt(year), month, parseInt(day));
    }
  }

  // Try native Date parsing as fallback
  const native = new Date(trimmed);
  if (!isNaN(native.getTime())) {
    return native;
  }

  return null;
}

export function isIn2025(date: Date | null): boolean {
  if (!date) return false;
  return date.getFullYear() === 2025;
}

export function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}
```

**Step 6: Run tests**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm test -- lib/__tests__/dateUtils.test.ts
```

Expected: PASS

**Step 7: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add lib/dateUtils.ts lib/__tests__/dateUtils.test.ts jest.config.js && git commit -m "feat: add date parsing utilities with tests"
```

---

## Task 4: ZIP + CSV Parser

**Files:**
- Create: `lib/parser.ts`
- Create: `lib/__tests__/parser.test.ts`

**Step 1: Create test file**

```typescript
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
```

**Step 2: Run test to verify it fails**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm test -- lib/__tests__/parser.test.ts
```

Expected: FAIL

**Step 3: Create implementation**

```typescript
// lib/parser.ts
import JSZip from 'jszip';
import Papa from 'papaparse';
import type {
  ConnectionRow,
  MessageRow,
  ReactionRow,
  ShareRow,
  InvitationRow,
  LinkedInData
} from './types';

export function normalizeCompanyName(name: string | null | undefined): string | null {
  if (!name) return null;

  return name
    .toLowerCase()
    .replace(/,?\s*(inc\.?|llc|ltd|corp\.?|corporation|company)$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || null;
}

export async function parseCSVContent<T>(content: string): Promise<T[]> {
  return new Promise((resolve) => {
    // LinkedIn CSVs sometimes have preamble text - find the header row
    const lines = content.split('\n');
    let headerIndex = 0;

    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i].trim();
      // Header row has commas and doesn't start with common preamble patterns
      if (line.includes(',') &&
          !line.toLowerCase().startsWith('note') &&
          !line.toLowerCase().startsWith('some')) {
        headerIndex = i;
        break;
      }
    }

    const cleanedContent = lines.slice(headerIndex).join('\n');

    Papa.parse<T>(cleanedContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data)
    });
  });
}

export async function parseLinkedInExport(file: File): Promise<LinkedInData> {
  const zip = await JSZip.loadAsync(file);

  const fileNames = {
    connections: 'Connections.csv',
    messages: 'Messages.csv',
    reactions: 'Reactions.csv',
    shares: 'Shares.csv',
    invitations: 'Invitations.csv'
  };

  const data: LinkedInData = {
    connections: [],
    messages: [],
    reactions: [],
    shares: [],
    invitations: [],
    userName: ''
  };

  // Try to find files (they might be in subdirectories)
  for (const [key, fileName] of Object.entries(fileNames)) {
    let fileContent: string | null = null;

    // Try direct path first
    const directFile = zip.file(fileName);
    if (directFile) {
      fileContent = await directFile.async('string');
    } else {
      // Search in subdirectories
      const files = zip.file(new RegExp(fileName + '$', 'i'));
      if (files.length > 0) {
        fileContent = await files[0].async('string');
      }
    }

    if (fileContent) {
      switch (key) {
        case 'connections':
          data.connections = await parseCSVContent<ConnectionRow>(fileContent);
          break;
        case 'messages':
          data.messages = await parseCSVContent<MessageRow>(fileContent);
          break;
        case 'reactions':
          data.reactions = await parseCSVContent<ReactionRow>(fileContent);
          break;
        case 'shares':
          data.shares = await parseCSVContent<ShareRow>(fileContent);
          break;
        case 'invitations':
          data.invitations = await parseCSVContent<InvitationRow>(fileContent);
          break;
      }
    }
  }

  // Detect user name from messages (most frequent sender)
  data.userName = detectUserName(data.messages);

  return data;
}

function detectUserName(messages: MessageRow[]): string {
  const senderCounts: Record<string, number> = {};

  messages.forEach(m => {
    const from = m['FROM'];
    if (from) {
      senderCounts[from] = (senderCounts[from] || 0) + 1;
    }
  });

  const sorted = Object.entries(senderCounts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || 'User';
}
```

**Step 4: Run tests**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm test -- lib/__tests__/parser.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add lib/parser.ts lib/__tests__/parser.test.ts && git commit -m "feat: add ZIP and CSV parsing for LinkedIn exports"
```

---

## Task 5: Pattern Analyzer

**Files:**
- Create: `lib/analyzer.ts`
- Create: `lib/__tests__/analyzer.test.ts`

**Step 1: Create test file**

```typescript
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
```

**Step 2: Run test to verify it fails**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm test -- lib/__tests__/analyzer.test.ts
```

Expected: FAIL

**Step 3: Create implementation**

```typescript
// lib/analyzer.ts
import type { LinkedInData, DetectedPatterns } from './types';
import { parseDate, isIn2025 } from './dateUtils';

export function analyzePatterns(data: LinkedInData): DetectedPatterns {
  const { connections, messages, reactions, shares, userName } = data;

  // Filter to 2025 only
  const connections2025 = connections.filter(c => {
    const date = parseDate(c['Connected On']);
    return isIn2025(date);
  });

  const messages2025 = messages.filter(m => {
    const date = parseDate(m['DATE']);
    return isIn2025(date);
  });

  const reactions2025 = reactions.filter(r => {
    const date = parseDate(r['Date']);
    return isIn2025(date);
  });

  const shares2025 = shares.filter(s => {
    const date = parseDate(s['Date']);
    return isIn2025(date);
  });

  const userMessages2025 = messages2025.filter(m => m['FROM'] === userName);

  return {
    nameCollection: detectNameCollection(connections2025),
    nightOwl: detectNightOwl(userMessages2025),
    coffeeLiar: detectCoffeeLiar(userMessages2025),
    congratsBot: detectCongratsBot(reactions2025),
    companyStalker: detectCompanyStalker(connections2025),
    panicNetworker: detectPanicNetworker(connections2025),
    ghost: detectGhosts(messages2025, userName),
    replyGuy: null, // Would need comments data
    thoughtLeader: detectThoughtLeader(shares2025),
    totalConnections2025: connections2025.length,
    totalMessages2025: userMessages2025.length,
    totalReactions2025: reactions2025.length,
    totalPosts2025: shares2025.length,
  };
}

function detectNameCollection(connections: typeof connections2025): DetectedPatterns['nameCollection'] {
  const nameCounts: Record<string, number> = {};

  connections.forEach(c => {
    const name = c['First Name']?.trim();
    if (name) {
      nameCounts[name] = (nameCounts[name] || 0) + 1;
    }
  });

  const sorted = Object.entries(nameCounts).sort((a, b) => b[1] - a[1]);
  const top = sorted[0];

  if (top && top[1] >= 5) {
    return { name: top[0], count: top[1] };
  }
  return null;
}

function detectNightOwl(messages: typeof messages2025): DetectedPatterns['nightOwl'] {
  if (messages.length === 0) return null;

  let lateCount = 0;

  messages.forEach(m => {
    const date = parseDate(m['DATE']);
    if (date) {
      const hour = date.getHours();
      if (hour >= 22 || hour < 5) {
        lateCount++;
      }
    }
  });

  const percentage = (lateCount / messages.length) * 100;

  if (percentage >= 20) {
    return { percentage: Math.round(percentage), lateMessages: lateCount };
  }
  return null;
}

function detectCoffeeLiar(messages: typeof messages2025): DetectedPatterns['coffeeLiar'] {
  const coffeePhrases = [
    'grab coffee', 'get coffee', 'coffee sometime',
    'grab lunch', 'get lunch', 'lunch sometime',
    'catch up', 'meet up', 'get together',
    'pick your brain', 'chat sometime'
  ];

  const schedulingPhrases = [
    'calendar', 'schedule', 'available', 'free on',
    'how about', 'this week', 'next week',
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday'
  ];

  let mentions = 0;
  let followUps = 0;
  const coffeeRecipients = new Set<string>();

  messages.forEach(m => {
    const content = m['CONTENT']?.toLowerCase() || '';
    if (coffeePhrases.some(phrase => content.includes(phrase))) {
      mentions++;
      coffeeRecipients.add(m['TO']);
    }
  });

  // Check for follow-ups (simplified: any scheduling language to same person)
  coffeeRecipients.forEach(recipient => {
    const recipientMessages = messages.filter(m => m['TO'] === recipient);
    if (recipientMessages.some(m =>
      schedulingPhrases.some(phrase => m['CONTENT']?.toLowerCase().includes(phrase))
    )) {
      followUps++;
    }
  });

  if (mentions >= 3) {
    return { mentions, followUps };
  }
  return null;
}

function detectCongratsBot(reactions: typeof reactions2025): DetectedPatterns['congratsBot'] {
  const celebrateCount = reactions.filter(r =>
    r['Type']?.toLowerCase() === 'celebrate'
  ).length;

  if (celebrateCount >= 30) {
    return { count: celebrateCount };
  }
  return null;
}

function detectCompanyStalker(connections: typeof connections2025): DetectedPatterns['companyStalker'] {
  const companyCounts: Record<string, number> = {};

  connections.forEach(c => {
    const company = c['Company']?.trim();
    if (company) {
      const normalized = company.toLowerCase()
        .replace(/,?\s*(inc\.?|llc|ltd|corp\.?)$/i, '')
        .trim();
      companyCounts[normalized] = (companyCounts[normalized] || 0) + 1;
    }
  });

  const sorted = Object.entries(companyCounts).sort((a, b) => b[1] - a[1]);
  const top = sorted[0];

  if (top && top[1] >= 15) {
    // Capitalize properly
    const displayName = top[0].split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return { company: displayName, count: top[1] };
  }
  return null;
}

function detectPanicNetworker(connections: typeof connections2025): DetectedPatterns['panicNetworker'] {
  const monthCounts: Record<string, number> = {};

  connections.forEach(c => {
    const date = parseDate(c['Connected On']);
    if (date) {
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts[key] = (monthCounts[key] || 0) + 1;
    }
  });

  const counts = Object.values(monthCounts);
  if (counts.length === 0) return null;

  const average = counts.reduce((a, b) => a + b, 0) / counts.length;
  const sorted = Object.entries(monthCounts).sort((a, b) => b[1] - a[1]);
  const peak = sorted[0];

  if (peak && peak[1] / average >= 3) {
    const [year, month] = peak[0].split('-');
    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'long' });
    return {
      month: `${monthName} ${year}`,
      count: peak[1],
      average: Math.round(average),
      ratio: Math.round(peak[1] / average * 10) / 10
    };
  }
  return null;
}

function detectGhosts(messages: typeof messages2025, userName: string): DetectedPatterns['ghost'] {
  const relationships: Record<string, { lastContact: Date; count: number }> = {};

  messages.forEach(m => {
    const other = m['FROM'] === userName ? m['TO'] : m['FROM'];
    const date = parseDate(m['DATE']);

    if (other && date) {
      if (!relationships[other]) {
        relationships[other] = { lastContact: date, count: 0 };
      }
      relationships[other].count++;
      if (date > relationships[other].lastContact) {
        relationships[other].lastContact = date;
      }
    }
  });

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const ghosts = Object.entries(relationships)
    .filter(([, data]) => data.count >= 5 && data.lastContact < sixMonthsAgo)
    .map(([name, data]) => ({ name, lastContact: data.lastContact, messageCount: data.count }))
    .sort((a, b) => b.messageCount - a.messageCount)
    .slice(0, 3);

  return ghosts.length > 0 ? ghosts : null;
}

function detectThoughtLeader(shares: typeof shares2025): DetectedPatterns['thoughtLeader'] {
  const buzzwords = ['learnings', 'insights', 'journey', 'excited', 'grateful', 'humbled', 'thrilled'];
  const counts: Record<string, number> = {};

  shares.forEach(s => {
    const content = s['ShareCommentary']?.toLowerCase() || '';
    buzzwords.forEach(word => {
      if (content.includes(word)) {
        counts[word] = (counts[word] || 0) + 1;
      }
    });
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  if (total >= 10 && sorted[0]) {
    return { buzzwordCount: total, topBuzzword: sorted[0][0] };
  }
  return null;
}

// Type helper for the filter functions
type connections2025 = typeof LinkedInData.prototype.connections;
type messages2025 = typeof LinkedInData.prototype.messages;
type reactions2025 = typeof LinkedInData.prototype.reactions;
type shares2025 = typeof LinkedInData.prototype.shares;
```

**Step 4: Run tests**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm test -- lib/__tests__/analyzer.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add lib/analyzer.ts lib/__tests__/analyzer.test.ts && git commit -m "feat: add pattern detection analyzer for LinkedIn data"
```

---

## Task 6: Roast Templates

**Files:**
- Create: `data/roastTemplates.ts`

**Step 1: Create roast templates with all 4 flavors per slide type**

```typescript
// data/roastTemplates.ts
import type { SlideType, HumorFlavor } from '@/lib/types';

type TemplateFunction = (data: Record<string, unknown>) => string;

type RoastTemplates = {
  [key in SlideType]: {
    [flavor in HumorFlavor]: TemplateFunction;
  };
};

export const roastTemplates: RoastTemplates = {
  opening: {
    absurdist: (data) => `${data.totalConnections} connections in 2025.

If they all showed up to your apartment right now, you'd have to explain who they are to your roommate.

You couldn't.

You'd just gesture vaguely and say "networking."`,

    meta: (data) => `${data.totalConnections} new connections in 2025.

LinkedIn counted them. LinkedIn always counts.

LinkedIn is watching you build relationships you'll never use.

LinkedIn is fine with this. This is the product working as intended.`,

    deadpan: (data) => `${data.totalConnections} connections this year.

That's ${data.totalConnections} people who have seen your headshot.

Most of them scrolled past.

This is your network.`,

    universal: (data) => `${data.totalConnections} connections in 2025.

You clicked "Connect." They clicked "Accept."

That was the whole relationship.

You both know this. Everyone knows this. We keep doing it anyway.`
  },

  nameCollection: {
    absurdist: (data) => `You connected with ${data.count} people named ${data.name} this year.

That's not a network. That's a ${data.name} collection.

What are you doing with all these ${data.name}s?

Are you building something? A ${data.name} army?

The ${data.name}s don't know about each other. Probably.`,

    meta: (data) => `${data.count} ${data.name}s in your network.

LinkedIn's algorithm noticed. We noticed.

The ${data.name}s have not noticed each other yet.

When they do, they'll have questions. You won't have answers.`,

    deadpan: (data) => `You know ${data.count} people named ${data.name}.

That's a lot of ${data.name}s for one year.

This is statistically unusual.

We're noting it. Moving on.`,

    universal: (data) => `${data.count} ${data.name}s. In one year.

At some point you connected with a ${data.name} and thought "another one."

And then you did it again. And again.

We've all been there. Except we haven't. This is just you.`
  },

  nightOwl: {
    absurdist: (data) => `${data.percentage}% of your LinkedIn messages were sent after 10pm.

That's ${data.lateMessages} messages.

In the dark. Alone. To colleagues.

LinkedIn is not a bar. It's not a crisis hotline.

But you treated it like both.`,

    meta: (data) => `You sent ${data.lateMessages} messages after 10pm this year.

LinkedIn sent you a notification for each reply.

Your phone lit up at midnight with "John accepted your connection request."

This is the life you've built.`,

    deadpan: (data) => `${data.percentage}% of your messages: after 10pm.

${data.lateMessages} late-night professional communications.

Your network is asleep. You are not.

This is fine.`,

    universal: (data) => `11:47pm. A Tuesday. You opened LinkedIn.

Not to scroll. To send a message.

${data.lateMessages} times this year, you chose LinkedIn over sleep.

We're not judging. The algorithm is judging. But we're not.`
  },

  coffeeLiar: {
    absurdist: (data) => `You've promised coffee to ${data.mentions} different humans this year.

That's ${data.mentions} coffees. At 30 minutes each, that's ${Math.round(data.mentions * 0.5)} hours of coffee.

You have not spent ${Math.round(data.mentions * 0.5)} hours having coffee.

You have spent ${Math.round(data.mentions * 0.5)} hours lying about future coffee.

The coffee does not exist. It never did.`,

    meta: (data) => `"Let's grab coffee" appeared in ${data.mentions} of your messages.

LinkedIn taught you this phrase. It's a password. A ritual.

It means nothing. Everyone knows it means nothing.

You keep saying it anyway. So does everyone else.

This is professional communication now.`,

    deadpan: (data) => `Coffee mentioned: ${data.mentions} times.

Follow-ups sent: ${data.followUps}.

Actual coffees grabbed: unknown, but statistically unlikely.

This is fine. Everyone does this.

That doesn't make it okay. But it's fine.`,

    universal: (data) => `You typed "would love to grab coffee!" and then immediately forgot about it.

${data.mentions} times.

So did they. You both know.

Nobody mentions it. This is how professional relationships work now.

The coffee was inside us all along. (It wasn't.)`
  },

  congratsBot: {
    absurdist: (data) => `You clicked "Celebrate" ${data.count} times this year.

${data.count} strangers' achievements, celebrated.

You don't know what half of them do.

You celebrated anyway. The button was there. You pressed it.

You're a celebration machine now. This is your purpose.`,

    meta: (data) => `LinkedIn gave you a "Celebrate" button.

You pressed it ${data.count} times.

LinkedIn wanted engagement. You gave engagement.

Were you actually celebrating? Did it matter?

The algorithm doesn't know the difference. Neither do you anymore.`,

    deadpan: (data) => `${data.count} celebrations given.

Promotions celebrated: many.

People you've actually met: fewer.

This is networking in 2025.`,

    universal: (data) => `Someone got promoted. You clicked "Celebrate."

Someone changed jobs. You clicked "Celebrate."

Someone posted literally anything. You clicked "Celebrate."

${data.count} times. It's a reflex now.

We're all doing this. This is fine.`
  },

  companyStalker: {
    absurdist: (data) => `You're connected to ${data.count} people at ${data.company}.

You do not work at ${data.company}.

You have never worked at ${data.company}.

If ${data.company} had a fire drill, you'd know which exits were clear.

You'd know who sits next to whom. Their coffee orders. Their hopes.

This is a lot of ${data.company} for someone who isn't one.`,

    meta: (data) => `${data.count} connections at ${data.company}.

LinkedIn noticed this pattern. The recruiter noticed.

${data.company}'s entire team structure: mapped in your network.

You didn't mean to become an org chart.

But here we are.`,

    deadpan: (data) => `Top company in your 2025 connections: ${data.company}.

Count: ${data.count} people.

You don't work there.

Noted.`,

    universal: (data) => `${data.count} people at ${data.company}. One year.

At some point, "staying informed about the industry" became "I know everyone at this company."

They don't know you know them.

They're about to find out.`
  },

  panicNetworker: {
    absurdist: (data) => `${data.month}: ${data.count} new connections.

Your monthly average: ${data.average}.

That's a ${data.ratio}x spike.

Your connection history looks like a heart monitor.

Something happened in ${data.month}. We won't ask.

But the connections remember. They always remember.`,

    meta: (data) => `${data.month}. ${data.count} connections. ${data.ratio}x your average.

LinkedIn saw the spike. The algorithm adjusted.

"This user is networking aggressively," it noted.

"Something happened," it concluded.

It was right.`,

    deadpan: (data) => `${data.month}: ${data.count} connections.

Average month: ${data.average} connections.

Spike ratio: ${data.ratio}x.

We're not going to speculate about what happened.`,

    universal: (data) => `${data.month}. You connected with ${data.count} people.

That's ${data.ratio}x your normal rate.

We've all had months like this. The "I should really network more" months.

The "something is happening at work" months.

The month passed. The connections remain.`
  },

  ghost: {
    absurdist: (data) => `You and ${data.ghosts[0].name} exchanged ${data.ghosts[0].messageCount} messages.

Then nothing. Radio silence.

${data.ghosts[0].name} is out there somewhere. Living their life.

Probably thinking about you never.

You were their most active LinkedIn relationship for a while there.

Now you're a memory. A notification they don't get anymore.`,

    meta: (data) => `${data.ghosts[0].name}: ${data.ghosts[0].messageCount} messages exchanged.

Last contact: ${data.ghosts[0].lastContactFormatted}.

LinkedIn still suggests you reconnect.

You ignore the suggestion. So do they.

This is how professional relationships decay.

The algorithm watches. The algorithm remembers.`,

    deadpan: (data) => `Active relationships gone quiet:

${data.ghosts[0].name} — last message: ${data.ghosts[0].lastContactFormatted}

${data.ghosts.length > 1 ? `${data.ghosts[1].name} — last message: ${data.ghosts[1].lastContactFormatted}` : ''}

They're fine. Probably.`,

    universal: (data) => `You and ${data.ghosts[0].name} used to talk.

${data.ghosts[0].messageCount} messages over time. Ideas exchanged. Plans made maybe.

Then one day, you just... stopped.

No fight. No falling out. Just silence.

This is fine. This is how it works. Everyone has a ${data.ghosts[0].name}.`
  },

  replyGuy: {
    absurdist: (data) => `You've commented ${data.comments} times this year.

You've posted ${data.posts} times.

You prefer the cheap seats. The peanut gallery.

The stage is right there. You could take it.

But no. You're in the comments. Where it's safe.

Where the pressure is low. Where the takes are hot.`,

    meta: (data) => `${data.comments} comments. ${data.posts} posts.

LinkedIn rewards posts. You know this.

You comment anyway.

This is either self-aware rebellion or chronic stage fright.

The algorithm doesn't care which. It just notices.`,

    deadpan: (data) => `Comments: ${data.comments}.

Posts: ${data.posts}.

Ratio: ${Math.round(data.comments / Math.max(data.posts, 1))}:1.

You're an audience member.

A vocal one.`,

    universal: (data) => `You've got opinions. ${data.comments} of them, left in comments.

Creating a post? ${data.posts} times. That's the hard part.

We get it. Posting is scary. Comments are easy.

You can just... agree. Add a "Great point!"

We've all done it. You've done it ${data.comments} times.`
  },

  thoughtLeader: {
    absurdist: (data) => `You've used the word "${data.topBuzzword}" ${data.buzzwordCount} times in your posts.

"${data.topBuzzword}" is not a real thing.

It's a thing LinkedIn made up and you absorbed through osmosis.

You are now a distribution channel for LinkedIn vocabulary.

Congratulations. Or should we say: you should be ${data.topBuzzword}.`,

    meta: (data) => `${data.buzzwordCount} uses of LinkedIn buzzwords this year.

Top word: "${data.topBuzzword}."

LinkedIn invented a dialect. You learned it.

Now you speak it fluently.

Somewhere, a 2019 version of you is confused.`,

    deadpan: (data) => `Buzzword usage: ${data.buzzwordCount} instances.

Most frequent: "${data.topBuzzword}."

This is LinkedIn brain.

There's no cure. Only awareness.`,

    universal: (data) => `You said "${data.topBuzzword}" ${data.buzzwordCount} times this year.

At some point, it started feeling natural.

"I'm ${data.topBuzzword} to announce..."

We've all been there. The platform changes you.

You used to have other words. You'll find them again. Maybe.`
  }
};

export function getRandomFlavor(): HumorFlavor {
  const flavors: HumorFlavor[] = ['absurdist', 'meta', 'deadpan', 'universal'];
  return flavors[Math.floor(Math.random() * flavors.length)];
}

export function getRoast(slideType: SlideType, flavor: HumorFlavor, data: Record<string, unknown>): string {
  return roastTemplates[slideType][flavor](data);
}
```

**Step 2: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add data/roastTemplates.ts && git commit -m "feat: add roast templates with 4 humor flavors per slide type"
```

---

## Task 7: Headline Templates

**Files:**
- Create: `data/headlineTemplates.ts`

**Step 1: Create headline templates**

```typescript
// data/headlineTemplates.ts
import type { ArchetypeName } from '@/lib/types';

interface HeadlineTemplate {
  archetype: string;
  modifier: string;
}

type ModifierKey = 'nightOwl' | 'coffeeLiar' | 'congratsBot' | 'companyStalker' | 'nameCollection' | 'default';

const archetypeHeadlines: Record<ArchetypeName, string[]> = {
  'THE LURKER': [
    'Professionally Invisible',
    'Watching Your Career From a Safe Distance',
    'Silent Observer of Success',
    'Present But Not Posting',
    'Engagement: Minimal | Judgment: Maximum',
  ],
  'THE BROADCASTER': [
    'Speaking Into the Void',
    'Thought Leader (Self-Assessed)',
    'Content Creator (Limited Audience)',
    'Posting Daily | Engagement Pending',
    'Will Share This Too',
  ],
  'THE WHISPERER': [
    'Never Posts, Always DMs',
    'Operating in the Background',
    'Inbox Regular, Feed Ghost',
    'Networking in the Shadows',
    'Professionally Mysterious',
  ],
  'THE OPERATOR': [
    'Optimized LinkedIn Like a Video Game',
    'Everywhere at Once',
    'Maximum Efficiency, Minimum Chill',
    'Posting AND Engaging | Exhausting',
    'The Algorithm Fears This One',
  ],
};

const modifierHeadlines: Record<ModifierKey, string[]> = {
  nightOwl: [
    'Online at 11pm for Professional Reasons',
    'Sends Connection Requests After Midnight',
    'LinkedIn Hours: 10pm - 2am',
    'Networking When Normal People Sleep',
  ],
  coffeeLiar: [
    'Open to Coffee (Lying)',
    'Would Love to Catch Up (Won\'t)',
    'Let\'s Grab Coffee Sometime (Never)',
    'Calendar Availability: Theoretical',
  ],
  congratsBot: [
    'Has Celebrated 47 Strangers',
    'Professional Congratulator',
    'Will Celebrate Your Thing Too',
    'Clicks Celebrate Reflexively',
  ],
  companyStalker: [
    'Knows Your Org Chart',
    'Connected to Everyone at [Company]',
    'Industry Researcher (Obsessive)',
    'Following Your Company\'s Every Move',
  ],
  nameCollection: [
    'Collecting [Names] for Unknown Reasons',
    'Knows Too Many [Names]',
    'Building a [Name] Portfolio',
  ],
  default: [
    'Professional Professional',
    'Doing LinkedIn Professionally',
    'Networked and Networking',
    'Connections: Many | Friends: Fewer',
  ],
};

export function generateHeadline(
  userName: string,
  archetype: ArchetypeName,
  patterns: {
    nightOwl?: boolean;
    coffeeLiar?: boolean;
    congratsBot?: boolean;
    companyStalker?: { company: string };
    nameCollection?: { name: string };
  }
): string {
  // Pick random archetype headline
  const archetypeOptions = archetypeHeadlines[archetype];
  const archetypePart = archetypeOptions[Math.floor(Math.random() * archetypeOptions.length)];

  // Pick modifier based on detected patterns
  let modifierKey: ModifierKey = 'default';
  if (patterns.nightOwl) modifierKey = 'nightOwl';
  else if (patterns.coffeeLiar) modifierKey = 'coffeeLiar';
  else if (patterns.congratsBot) modifierKey = 'congratsBot';
  else if (patterns.companyStalker) modifierKey = 'companyStalker';
  else if (patterns.nameCollection) modifierKey = 'nameCollection';

  let modifierOptions = modifierHeadlines[modifierKey];
  let modifierPart = modifierOptions[Math.floor(Math.random() * modifierOptions.length)];

  // Replace placeholders
  if (patterns.companyStalker) {
    modifierPart = modifierPart.replace('[Company]', patterns.companyStalker.company);
  }
  if (patterns.nameCollection) {
    modifierPart = modifierPart.replace('[Name]', patterns.nameCollection.name);
    modifierPart = modifierPart.replace('[Names]', patterns.nameCollection.name + 's');
  }

  return `${userName} | ${archetypePart} | ${modifierPart}`;
}
```

**Step 2: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add data/headlineTemplates.ts && git commit -m "feat: add headline generator templates"
```

---

## Task 8: Archetype Calculator

**Files:**
- Create: `lib/archetypeCalculator.ts`
- Create: `lib/__tests__/archetypeCalculator.test.ts`

**Step 1: Create test file**

```typescript
// lib/__tests__/archetypeCalculator.test.ts
import { calculateArchetype, calculatePercentiles } from '../archetypeCalculator';
import type { DetectedPatterns } from '../types';

const basePatterns: DetectedPatterns = {
  nameCollection: null,
  nightOwl: null,
  coffeeLiar: null,
  congratsBot: null,
  companyStalker: null,
  panicNetworker: null,
  ghost: null,
  replyGuy: null,
  thoughtLeader: null,
  totalConnections2025: 50,
  totalMessages2025: 100,
  totalReactions2025: 200,
  totalPosts2025: 10,
};

describe('calculateArchetype', () => {
  it('returns THE OPERATOR for high posts and high engagement', () => {
    const result = calculateArchetype({
      ...basePatterns,
      totalPosts2025: 100,
      totalMessages2025: 500,
      totalReactions2025: 1000,
    });
    expect(result.name).toBe('THE OPERATOR');
  });

  it('returns THE LURKER for low posts and low engagement', () => {
    const result = calculateArchetype({
      ...basePatterns,
      totalPosts2025: 2,
      totalMessages2025: 10,
      totalReactions2025: 20,
    });
    expect(result.name).toBe('THE LURKER');
  });
});

describe('calculatePercentiles', () => {
  it('calculates posting percentile', () => {
    const result = calculatePercentiles({
      ...basePatterns,
      totalPosts2025: 50,
    });
    expect(result.posting).toBeGreaterThan(50);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm test -- lib/__tests__/archetypeCalculator.test.ts
```

Expected: FAIL

**Step 3: Create implementation**

```typescript
// lib/archetypeCalculator.ts
import type { DetectedPatterns, Archetype, ArchetypeName, PercentileStats } from './types';

const ARCHETYPES: Record<ArchetypeName, Omit<Archetype, 'name'>> = {
  'THE OPERATOR': {
    quadrant: 'top-right',
    tagline: 'Posts AND engages. Everywhere at once. Exhausting but effective.',
    roast: "You're in everyone's feed and everyone's DMs. You've optimized LinkedIn like it's a video game. It's working. It's also a lot. People see your name and feel tired. But also slightly impressed. Mostly tired.",
  },
  'THE BROADCASTER': {
    quadrant: 'top-left',
    tagline: 'Posts constantly. Engagement from others: optional.',
    roast: "You think LinkedIn is your stage. Your audience is mostly bots and former coworkers. You've never met a thought you didn't want to share with 2,000 strangers. They're listening. Some of them. Maybe.",
  },
  'THE WHISPERER': {
    quadrant: 'bottom-right',
    tagline: 'Never posts. But always in the DMs. Lowkey powerful.',
    roast: "You never post but you're in everyone's inbox. Mysterious. Possibly powerful. Definitely plotting something. Your network has no idea what you look like but they've all gotten a 'quick question' from you.",
  },
  'THE LURKER': {
    quadrant: 'bottom-left',
    tagline: 'Watches everything. Says nothing. Professionally invisible.',
    roast: "You see everything, say nothing, and have opinions about everyone else's content. You'll screenshot this and send it to a coworker instead of posting it publicly. We know you. We are you.",
  },
};

// Thresholds for percentile calculation
const POSTING_THRESHOLDS = [
  { max: 0, percentile: 0 },
  { max: 4, percentile: 10 },
  { max: 12, percentile: 25 },
  { max: 30, percentile: 50 },
  { max: 75, percentile: 75 },
  { max: 150, percentile: 90 },
  { max: 300, percentile: 97 },
  { max: Infinity, percentile: 99 },
];

const ENGAGEMENT_THRESHOLDS = [
  { max: 25, percentile: 5 },
  { max: 75, percentile: 15 },
  { max: 200, percentile: 30 },
  { max: 500, percentile: 50 },
  { max: 1000, percentile: 70 },
  { max: 2000, percentile: 85 },
  { max: 4000, percentile: 95 },
  { max: Infinity, percentile: 99 },
];

const COFFEE_LIES_THRESHOLDS = [
  { max: 0, percentile: 0 },
  { max: 3, percentile: 30 },
  { max: 10, percentile: 55 },
  { max: 20, percentile: 75 },
  { max: 40, percentile: 90 },
  { max: Infinity, percentile: 99 },
];

const GHOST_THRESHOLDS = [
  { max: 0, percentile: 10 },
  { max: 1, percentile: 30 },
  { max: 3, percentile: 50 },
  { max: 5, percentile: 70 },
  { max: 10, percentile: 85 },
  { max: Infinity, percentile: 99 },
];

function getPercentile(value: number, thresholds: { max: number; percentile: number }[]): number {
  for (const threshold of thresholds) {
    if (value <= threshold.max) return threshold.percentile;
  }
  return 99;
}

export function calculatePercentiles(patterns: DetectedPatterns): PercentileStats {
  const postingPercentile = getPercentile(patterns.totalPosts2025, POSTING_THRESHOLDS);

  const engagementTotal = patterns.totalMessages2025 + patterns.totalReactions2025;
  const engagementPercentile = getPercentile(engagementTotal, ENGAGEMENT_THRESHOLDS);

  const coffeeLiesCount = patterns.coffeeLiar?.mentions || 0;
  const coffeeLiesPercentile = getPercentile(coffeeLiesCount, COFFEE_LIES_THRESHOLDS);

  const ghostCount = patterns.ghost?.length || 0;
  const ghostPercentile = getPercentile(ghostCount, GHOST_THRESHOLDS);

  return {
    posting: postingPercentile,
    engagement: engagementPercentile,
    coffeeLies: coffeeLiesPercentile,
    ghostFactor: ghostPercentile,
    isLoud: postingPercentile >= 50,
    isActive: engagementPercentile >= 50,
  };
}

export function calculateArchetype(patterns: DetectedPatterns): Archetype {
  const percentiles = calculatePercentiles(patterns);
  const { isLoud, isActive } = percentiles;

  let name: ArchetypeName;

  if (isLoud && isActive) {
    name = 'THE OPERATOR';
  } else if (isLoud && !isActive) {
    name = 'THE BROADCASTER';
  } else if (!isLoud && isActive) {
    name = 'THE WHISPERER';
  } else {
    name = 'THE LURKER';
  }

  return {
    name,
    ...ARCHETYPES[name],
  };
}
```

**Step 4: Run tests**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm test -- lib/__tests__/archetypeCalculator.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add lib/archetypeCalculator.ts lib/__tests__/archetypeCalculator.test.ts && git commit -m "feat: add archetype calculator with percentile stats"
```

---

## Task 9: Slide Selector

**Files:**
- Create: `lib/slideSelector.ts`

**Step 1: Create slide selector**

```typescript
// lib/slideSelector.ts
import type { DetectedPatterns, SlideData, SlideType, HumorFlavor } from './types';
import { getRandomFlavor } from '@/data/roastTemplates';

const SLIDE_ORDER: SlideType[] = [
  'opening',
  'companyStalker',
  'panicNetworker',
  'nameCollection',
  'nightOwl',
  'coffeeLiar',
  'congratsBot',
  'ghost',
  'thoughtLeader',
  'replyGuy',
];

export function selectSlides(patterns: DetectedPatterns): SlideData[] {
  const slides: SlideData[] = [];

  // Opening slide always included
  slides.push({
    type: 'opening',
    flavor: getRandomFlavor(),
    data: {
      totalConnections: patterns.totalConnections2025,
      totalMessages: patterns.totalMessages2025,
      totalReactions: patterns.totalReactions2025,
      totalPosts: patterns.totalPosts2025,
    },
  });

  // Add slides based on detected patterns
  if (patterns.companyStalker) {
    slides.push({
      type: 'companyStalker',
      flavor: getRandomFlavor(),
      data: patterns.companyStalker,
    });
  }

  if (patterns.panicNetworker) {
    slides.push({
      type: 'panicNetworker',
      flavor: getRandomFlavor(),
      data: patterns.panicNetworker,
    });
  }

  if (patterns.nameCollection) {
    slides.push({
      type: 'nameCollection',
      flavor: getRandomFlavor(),
      data: patterns.nameCollection,
    });
  }

  if (patterns.nightOwl) {
    slides.push({
      type: 'nightOwl',
      flavor: getRandomFlavor(),
      data: patterns.nightOwl,
    });
  }

  if (patterns.coffeeLiar) {
    slides.push({
      type: 'coffeeLiar',
      flavor: getRandomFlavor(),
      data: patterns.coffeeLiar,
    });
  }

  if (patterns.congratsBot) {
    slides.push({
      type: 'congratsBot',
      flavor: getRandomFlavor(),
      data: patterns.congratsBot,
    });
  }

  if (patterns.ghost && patterns.ghost.length > 0) {
    slides.push({
      type: 'ghost',
      flavor: getRandomFlavor(),
      data: {
        ghosts: patterns.ghost.map(g => ({
          ...g,
          lastContactFormatted: g.lastContact.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          }),
        })),
      },
    });
  }

  if (patterns.thoughtLeader) {
    slides.push({
      type: 'thoughtLeader',
      flavor: getRandomFlavor(),
      data: patterns.thoughtLeader,
    });
  }

  if (patterns.replyGuy) {
    slides.push({
      type: 'replyGuy',
      flavor: getRandomFlavor(),
      data: patterns.replyGuy,
    });
  }

  // Ensure minimum 4 slides, maximum 8
  // If too few patterns detected, we'll handle with fallback content
  return slides.slice(0, 8);
}
```

**Step 2: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add lib/slideSelector.ts && git commit -m "feat: add slide selector based on detected patterns"
```

---

## Task 10: Main Orchestrator

**Files:**
- Create: `lib/generateRoast.ts`

**Step 1: Create main orchestrator**

```typescript
// lib/generateRoast.ts
import type { RoastResult, LinkedInData } from './types';
import { parseLinkedInExport } from './parser';
import { analyzePatterns } from './analyzer';
import { selectSlides } from './slideSelector';
import { calculateArchetype, calculatePercentiles } from './archetypeCalculator';
import { generateHeadline } from '@/data/headlineTemplates';

export async function generateRoast(file: File): Promise<RoastResult> {
  // Step 1: Parse the LinkedIn export
  const data = await parseLinkedInExport(file);

  // Step 2: Analyze patterns (2025 only)
  const patterns = analyzePatterns(data);

  // Step 3: Select slides based on patterns
  const slides = selectSlides(patterns);

  // Step 4: Calculate archetype and percentiles
  const archetype = calculateArchetype(patterns);
  const percentiles = calculatePercentiles(patterns);

  // Step 5: Generate headline
  const headline = generateHeadline(data.userName, archetype.name, {
    nightOwl: !!patterns.nightOwl,
    coffeeLiar: !!patterns.coffeeLiar,
    congratsBot: !!patterns.congratsBot,
    companyStalker: patterns.companyStalker ? { company: patterns.companyStalker.company } : undefined,
    nameCollection: patterns.nameCollection ? { name: patterns.nameCollection.name } : undefined,
  });

  return {
    slides,
    archetype,
    percentiles,
    headline,
    userName: data.userName,
    patterns,
  };
}
```

**Step 2: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add lib/generateRoast.ts && git commit -m "feat: add main roast generation orchestrator"
```

---

## Task 11: Landing Page

**Files:**
- Modify: `app/page.tsx`
- Create: `app/globals.css` (update)

**Step 1: Update globals.css for dark theme**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0A0A0A;
  --foreground: #FFFFFF;
  --accent: #0A66C2;
  --highlight: #8B5CF6;
  --muted: #6B7280;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

**Step 2: Create landing page**

```tsx
// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          LinkedIn<br />
          <span className="text-[#8B5CF6]">Roasted</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400">
          LinkedIn Wrapped, but it&apos;s mean.
          <br />
          <span className="text-gray-500">(Affectionately.)</span>
        </p>

        <div className="pt-4">
          <Link
            href="/upload"
            className="inline-block bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            Get Roasted
          </Link>
        </div>

        <div className="pt-8 text-sm text-gray-500 space-y-2">
          <p>Your data never leaves your browser.</p>
          <p>We don&apos;t store anything. We just judge you.</p>
        </div>
      </div>
    </main>
  );
}
```

**Step 3: Test locally**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm run dev
```

Expected: Landing page visible at localhost:3000

**Step 4: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add app/page.tsx app/globals.css && git commit -m "feat: add landing page with dark theme"
```

---

## Task 12: File Upload Component

**Files:**
- Create: `components/FileUpload.tsx`

**Step 1: Create file upload component**

```tsx
// components/FileUpload.tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function FileUpload({ onFileSelect, isProcessing }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);

    if (acceptedFiles.length === 0) {
      setError('Please upload a ZIP file');
      return;
    }

    const file = acceptedFiles[0];

    if (!file.name.endsWith('.zip')) {
      setError('Please upload a ZIP file from LinkedIn');
      return;
    }

    onFileSelect(file);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  return (
    <div className="w-full max-w-xl">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-[#8B5CF6] bg-[#8B5CF6]/10' : 'border-gray-700 hover:border-gray-500'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        {isProcessing ? (
          <p className="text-gray-400">Processing your data...</p>
        ) : isDragActive ? (
          <p className="text-[#8B5CF6]">Drop your LinkedIn export here...</p>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl">📦</div>
            <p className="text-gray-300">
              Drag & drop your LinkedIn ZIP file here
            </p>
            <p className="text-gray-500 text-sm">
              or click to browse
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
```

**Step 2: Install react-dropzone**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm install react-dropzone
```

**Step 3: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add components/FileUpload.tsx && git commit -m "feat: add drag-and-drop file upload component"
```

---

## Task 13: Processing Animation

**Files:**
- Create: `components/ProcessingAnimation.tsx`

**Step 1: Create processing animation**

```tsx
// components/ProcessingAnimation.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_MESSAGES = [
  "Reading your connection requests...",
  "Counting your coffee lies...",
  "Measuring your ghost energy...",
  "Calculating your cringe index...",
  "Analyzing your late-night activity...",
  "Detecting congratulations patterns...",
  "Finding the Gregs...",
  "This is worse than we expected...",
  "Actually, it's fine. Mostly.",
  "Preparing your roast...",
];

export function ProcessingAnimation() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8">
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 border-4 border-[#8B5CF6] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ borderTopColor: 'transparent' }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-gray-400 text-lg text-center"
        >
          {LOADING_MESSAGES[messageIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
```

**Step 2: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add components/ProcessingAnimation.tsx && git commit -m "feat: add funny processing animation with rotating messages"
```

---

## Task 14: Upload Page

**Files:**
- Create: `app/upload/page.tsx`

**Step 1: Create upload page**

```tsx
// app/upload/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';
import { ProcessingAnimation } from '@/components/ProcessingAnimation';
import { generateRoast } from '@/lib/generateRoast';
import type { RoastResult } from '@/lib/types';

export default function UploadPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await generateRoast(file);

      // Store result in sessionStorage for the roast page
      sessionStorage.setItem('roastResult', JSON.stringify(result));

      // Navigate to roast page
      router.push('/roast');
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Something went wrong processing your file. Make sure it\'s a valid LinkedIn export.');
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {isProcessing ? (
        <ProcessingAnimation />
      ) : (
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Upload Your LinkedIn Export</h1>
            <p className="text-gray-400">
              Your data stays in your browser. We don&apos;t see it. We just judge it.
            </p>
          </div>

          <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />

          {error && (
            <p className="text-red-400 text-center">{error}</p>
          )}

          <div className="bg-gray-900 rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">How to get your LinkedIn export:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-400">
              <li>Go to LinkedIn → Settings → Data Privacy</li>
              <li>Click &quot;Get a copy of your data&quot;</li>
              <li>Select &quot;Download larger data archive&quot;</li>
              <li>Wait for the email (usually 24-72 hours)</li>
              <li>Download the ZIP and upload it here</li>
            </ol>
            <p className="text-sm text-gray-500">
              We only look at 2025 data. Your ancient history is safe.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
```

**Step 2: Test locally**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm run dev
```

Navigate to localhost:3000/upload

**Step 3: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add app/upload/page.tsx && git commit -m "feat: add upload page with instructions"
```

---

## Task 15: Slide Renderer Component

**Files:**
- Create: `components/SlideRenderer.tsx`
- Create: `components/Slide.tsx`

**Step 1: Create individual slide component**

```tsx
// components/Slide.tsx
'use client';

import { motion } from 'framer-motion';
import type { SlideData } from '@/lib/types';
import { getRoast } from '@/data/roastTemplates';

interface SlideProps {
  slide: SlideData;
  isActive: boolean;
}

export function Slide({ slide, isActive }: SlideProps) {
  const content = getRoast(slide.type, slide.flavor, slide.data);
  const lines = content.split('\n').filter(line => line.trim());

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 50 }}
      exit={{ opacity: 0, x: -50 }}
      className="absolute inset-0 flex items-center justify-center p-8"
    >
      <div className="max-w-lg text-center space-y-6">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`
              ${i === 0 ? 'text-2xl md:text-3xl font-bold' : 'text-lg md:text-xl text-gray-300'}
              ${i === lines.length - 1 ? 'text-[#8B5CF6]' : ''}
            `}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}
```

**Step 2: Create slide renderer**

```tsx
// components/SlideRenderer.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SlideData } from '@/lib/types';
import { Slide } from './Slide';

interface SlideRendererProps {
  slides: SlideData[];
  onComplete: () => void;
}

export function SlideRenderer({ slides, onComplete }: SlideRendererProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < rect.width / 3) {
      goPrev();
    } else {
      goNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      goNext();
    } else if (e.key === 'ArrowLeft') {
      goPrev();
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-[#0A0A0A] cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <AnimatePresence mode="wait">
        <Slide
          key={currentIndex}
          slide={slides[currentIndex]}
          isActive={true}
        />
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIndex ? 'bg-[#8B5CF6]' : 'bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Navigation hint */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-gray-600 text-sm">
        Tap to continue
      </div>
    </div>
  );
}
```

**Step 3: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add components/Slide.tsx components/SlideRenderer.tsx && git commit -m "feat: add tap-through slide renderer with animations"
```

---

## Task 16: Matrix Result Component

**Files:**
- Create: `components/MatrixResult.tsx`

**Step 1: Create matrix result with fake population**

```tsx
// components/MatrixResult.tsx
'use client';

import { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Archetype, PercentileStats } from '@/lib/types';

interface MatrixResultProps {
  archetype: Archetype;
  percentiles: PercentileStats;
  userName: string;
}

// Generate fake dots for each quadrant
function generateFakeDots(count: number, quadrant: string): { x: number; y: number }[] {
  const dots: { x: number; y: number }[] = [];

  const ranges = {
    'top-left': { xMin: 5, xMax: 45, yMin: 5, yMax: 45 },
    'top-right': { xMin: 55, xMax: 95, yMin: 5, yMax: 45 },
    'bottom-left': { xMin: 5, xMax: 45, yMin: 55, yMax: 95 },
    'bottom-right': { xMin: 55, xMax: 95, yMin: 55, yMax: 95 },
  };

  const range = ranges[quadrant as keyof typeof ranges];

  for (let i = 0; i < count; i++) {
    dots.push({
      x: range.xMin + Math.random() * (range.xMax - range.xMin),
      y: range.yMin + Math.random() * (range.yMax - range.yMin),
    });
  }

  return dots;
}

export function MatrixResult({ archetype, percentiles, userName }: MatrixResultProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate fake population dots (memoized to prevent regeneration)
  const fakeDots = useMemo(() => ({
    'top-left': generateFakeDots(18, 'top-left'),
    'top-right': generateFakeDots(22, 'top-right'),
    'bottom-left': generateFakeDots(25, 'bottom-left'),
    'bottom-right': generateFakeDots(20, 'bottom-right'),
  }), []);

  // User's position based on percentiles
  const userPosition = useMemo(() => {
    const x = percentiles.isActive ? 55 + (percentiles.engagement / 100) * 40 : 5 + (percentiles.engagement / 100) * 40;
    const y = percentiles.isLoud ? 5 + (100 - percentiles.posting) / 100 * 40 : 55 + (100 - percentiles.posting) / 100 * 40;
    return { x, y };
  }, [percentiles]);

  const allDots = [
    ...fakeDots['top-left'],
    ...fakeDots['top-right'],
    ...fakeDots['bottom-left'],
    ...fakeDots['bottom-right'],
  ];

  return (
    <div ref={containerRef} className="w-full max-w-lg mx-auto p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">Your LinkedIn Personality</h2>

      {/* Matrix */}
      <div className="relative aspect-square bg-gray-900 rounded-xl p-4">
        {/* Axis labels */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-gray-500">LOUD</div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500">QUIET</div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 -rotate-90">PASSIVE</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 rotate-90">ACTIVE</div>

        {/* Quadrant lines */}
        <div className="absolute top-1/2 left-4 right-4 h-px bg-gray-700" />
        <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gray-700" />

        {/* Quadrant labels */}
        <div className="absolute top-6 left-6 text-xs text-gray-600">BROADCASTER</div>
        <div className="absolute top-6 right-6 text-xs text-gray-600">OPERATOR</div>
        <div className="absolute bottom-6 left-6 text-xs text-gray-600">LURKER</div>
        <div className="absolute bottom-6 right-6 text-xs text-gray-600">WHISPERER</div>

        {/* Fake population dots */}
        {allDots.map((dot, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            className="absolute w-1.5 h-1.5 bg-gray-500 rounded-full"
            style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
          />
        ))}

        {/* User's dot */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
          className="absolute w-4 h-4 bg-[#8B5CF6] rounded-full border-2 border-white"
          style={{
            left: `${userPosition.x}%`,
            top: `${userPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>

      {/* Archetype */}
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-[#8B5CF6]">{archetype.name}</h3>
        <p className="text-gray-400 italic">&quot;{archetype.tagline}&quot;</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-500">POSTING</div>
          <div className="text-lg font-bold">{percentiles.posting}th percentile</div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-500">ENGAGEMENT</div>
          <div className="text-lg font-bold">{percentiles.engagement}th percentile</div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-500">COFFEE LIES</div>
          <div className="text-lg font-bold">{percentiles.coffeeLies}th percentile</div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-gray-500">GHOST FACTOR</div>
          <div className="text-lg font-bold">{percentiles.ghostFactor}th percentile</div>
        </div>
      </div>

      {/* Roast paragraph */}
      <p className="text-gray-300 text-center leading-relaxed">
        {archetype.roast}
      </p>

      {/* Disclaimer */}
      <p className="text-xs text-gray-600 text-center">
        Are these percentiles made up? Yes.<br />
        Are they directionally correct? Also yes.<br />
        #LinkedInRoasted
      </p>
    </div>
  );
}
```

**Step 2: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add components/MatrixResult.tsx && git commit -m "feat: add 2x2 matrix result with fake population dots"
```

---

## Task 17: Headline Result Component

**Files:**
- Create: `components/HeadlineResult.tsx`

**Step 1: Create headline result**

```tsx
// components/HeadlineResult.tsx
'use client';

import { motion } from 'framer-motion';

interface HeadlineResultProps {
  headline: string;
  userName: string;
}

export function HeadlineResult({ headline, userName }: HeadlineResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto p-8"
    >
      <div className="bg-white rounded-xl p-6 text-black">
        {/* Fake LinkedIn header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{userName}</h3>
            <p className="text-gray-600 text-sm leading-tight mt-1">
              {headline.split(' | ').slice(1).join(' | ')}
            </p>
          </div>
        </div>

        {/* Fake LinkedIn stats */}
        <div className="flex gap-4 text-xs text-gray-500 border-t pt-4">
          <span>500+ connections</span>
          <span>•</span>
          <span>Roasted by LinkedIn Roasted</span>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm mt-4">
        Your new LinkedIn headline (please don&apos;t actually use this)
      </p>
    </motion.div>
  );
}
```

**Step 2: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add components/HeadlineResult.tsx && git commit -m "feat: add fake LinkedIn headline result component"
```

---

## Task 18: Share Button Component

**Files:**
- Create: `components/ShareButton.tsx`

**Step 1: Create share button with image generation**

```tsx
// components/ShareButton.tsx
'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';

interface ShareButtonProps {
  targetRef: React.RefObject<HTMLDivElement>;
  filename?: string;
}

export function ShareButton({ targetRef, filename = 'linkedin-roasted' }: ShareButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!targetRef.current) return;

    setIsGenerating(true);

    try {
      const dataUrl = await toPng(targetRef.current, {
        backgroundColor: '#0A0A0A',
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!targetRef.current) return;

    setIsGenerating(true);

    try {
      const dataUrl = await toPng(targetRef.current, {
        backgroundColor: '#0A0A0A',
        pixelRatio: 2,
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);

      alert('Image copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      // Fallback to download
      handleDownload();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        {isGenerating ? 'Generating...' : 'Download Image'}
      </button>

      <button
        onClick={handleCopyToClipboard}
        disabled={isGenerating}
        className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Copy to Clipboard
      </button>
    </div>
  );
}
```

**Step 2: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add components/ShareButton.tsx && git commit -m "feat: add share button with image download and clipboard copy"
```

---

## Task 19: Roast Page

**Files:**
- Create: `app/roast/page.tsx`

**Step 1: Create roast page**

```tsx
// app/roast/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SlideRenderer } from '@/components/SlideRenderer';
import { MatrixResult } from '@/components/MatrixResult';
import { HeadlineResult } from '@/components/HeadlineResult';
import { ShareButton } from '@/components/ShareButton';
import type { RoastResult } from '@/lib/types';

type ViewState = 'slides' | 'matrix' | 'headline';

export default function RoastPage() {
  const router = useRouter();
  const [result, setResult] = useState<RoastResult | null>(null);
  const [viewState, setViewState] = useState<ViewState>('slides');
  const matrixRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('roastResult');
    if (!stored) {
      router.push('/upload');
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      // Reconstruct dates from JSON
      if (parsed.patterns?.ghost) {
        parsed.patterns.ghost = parsed.patterns.ghost.map((g: { lastContact: string }) => ({
          ...g,
          lastContact: new Date(g.lastContact),
        }));
      }
      setResult(parsed);
    } catch {
      router.push('/upload');
    }
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const handleSlidesComplete = () => {
    setViewState('matrix');
  };

  return (
    <main className="min-h-screen">
      {viewState === 'slides' && (
        <SlideRenderer slides={result.slides} onComplete={handleSlidesComplete} />
      )}

      {viewState === 'matrix' && (
        <div className="min-h-screen flex flex-col items-center justify-center py-12">
          <div ref={matrixRef}>
            <MatrixResult
              archetype={result.archetype}
              percentiles={result.percentiles}
              userName={result.userName}
            />
          </div>

          <div className="mt-8 space-y-4">
            <ShareButton targetRef={matrixRef} filename="linkedin-roasted-matrix" />

            <button
              onClick={() => setViewState('headline')}
              className="block w-full text-center text-gray-400 hover:text-white transition-colors"
            >
              See your roasted headline →
            </button>
          </div>
        </div>
      )}

      {viewState === 'headline' && (
        <div className="min-h-screen flex flex-col items-center justify-center py-12">
          <div ref={headlineRef}>
            <HeadlineResult headline={result.headline} userName={result.userName} />
          </div>

          <div className="mt-8 space-y-4">
            <ShareButton targetRef={headlineRef} filename="linkedin-roasted-headline" />

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setViewState('matrix')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to matrix
              </button>

              <button
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
```

**Step 2: Test full flow locally**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm run dev
```

Test with a sample ZIP file if available

**Step 3: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add app/roast/page.tsx && git commit -m "feat: add roast page with slides, matrix, and headline views"
```

---

## Task 20: Layout and Metadata

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Update layout with metadata**

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LinkedIn Roasted | Your 2025 LinkedIn Year in Review (But Mean)',
  description: 'LinkedIn Wrapped, but it\'s mean. (Affectionately.) Get your personalized roast based on your LinkedIn data.',
  openGraph: {
    title: 'LinkedIn Roasted',
    description: 'LinkedIn Wrapped, but it\'s mean. (Affectionately.)',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn Roasted',
    description: 'LinkedIn Wrapped, but it\'s mean. (Affectionately.)',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**Step 2: Commit**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add app/layout.tsx && git commit -m "feat: add metadata and OpenGraph tags for sharing"
```

---

## Task 21: Build and Fix Issues

**Step 1: Run build to find issues**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm run build
```

**Step 2: Fix any TypeScript/ESLint errors**

Address each error as they appear. Common fixes:
- Add 'use client' directives
- Fix import paths with @/ alias
- Add proper type annotations

**Step 3: Run build again to verify**

```bash
cd /Users/kyraatekwana/linkedin-roasted && npm run build
```

Expected: Build succeeds

**Step 4: Commit fixes**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add . && git commit -m "fix: resolve build errors"
```

---

## Task 22: Deploy to Vercel

**Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

**Step 2: Login to Vercel**

```bash
vercel login
```

**Step 3: Deploy**

```bash
cd /Users/kyraatekwana/linkedin-roasted && vercel
```

Follow prompts to set up project

**Step 4: Deploy to production**

```bash
vercel --prod
```

**Step 5: Commit Vercel config**

```bash
cd /Users/kyraatekwana/linkedin-roasted && git add . && git commit -m "chore: add Vercel configuration"
```

---

## Summary

This plan creates LinkedIn Roasted with:

1. **Core Infrastructure** (Tasks 1-4): Project setup, types, date parsing, CSV/ZIP parsing
2. **Analysis Engine** (Tasks 5-10): Pattern detection, roast templates, headlines, archetype calculator, slide selector, main orchestrator
3. **UI Components** (Tasks 11-18): Landing page, file upload, processing animation, slides, matrix, headline, share button
4. **Integration** (Tasks 19-22): Roast page, layout, build fixes, deployment

Each task is atomic (2-5 minutes), follows TDD where applicable, and includes a commit checkpoint.
