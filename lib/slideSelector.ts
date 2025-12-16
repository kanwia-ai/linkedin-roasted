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
