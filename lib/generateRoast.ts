// lib/generateRoast.ts
import type { RoastResult } from './types';
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
