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
} from '@/lib/types';

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
