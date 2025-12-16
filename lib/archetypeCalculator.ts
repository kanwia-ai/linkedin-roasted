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
