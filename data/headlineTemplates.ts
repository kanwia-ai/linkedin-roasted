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
