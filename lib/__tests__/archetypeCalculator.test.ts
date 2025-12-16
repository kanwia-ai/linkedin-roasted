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
