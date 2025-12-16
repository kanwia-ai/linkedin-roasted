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
