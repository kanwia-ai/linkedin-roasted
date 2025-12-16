// lib/analyzer.ts
import type { LinkedInData, DetectedPatterns, ConnectionRow, MessageRow, ReactionRow, ShareRow } from './types';
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

function detectNameCollection(connections: ConnectionRow[]): DetectedPatterns['nameCollection'] {
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

function detectNightOwl(messages: MessageRow[]): DetectedPatterns['nightOwl'] {
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

function detectCoffeeLiar(messages: MessageRow[]): DetectedPatterns['coffeeLiar'] {
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

function detectCongratsBot(reactions: ReactionRow[]): DetectedPatterns['congratsBot'] {
  const celebrateCount = reactions.filter(r =>
    r['Type']?.toLowerCase() === 'celebrate'
  ).length;

  if (celebrateCount >= 30) {
    return { count: celebrateCount };
  }
  return null;
}

function detectCompanyStalker(connections: ConnectionRow[]): DetectedPatterns['companyStalker'] {
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

function detectPanicNetworker(connections: ConnectionRow[]): DetectedPatterns['panicNetworker'] {
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

function detectGhosts(messages: MessageRow[], userName: string): DetectedPatterns['ghost'] {
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

function detectThoughtLeader(shares: ShareRow[]): DetectedPatterns['thoughtLeader'] {
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
