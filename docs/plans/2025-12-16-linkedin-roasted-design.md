# LinkedIn Roasted — Design Document

## Overview

**What:** A client-side web app that parses a user's LinkedIn data export and generates a personalized, tap-through roast of their 2025 LinkedIn behavior.

**Tagline:** "LinkedIn Wrapped, but it's mean. (Affectionately.)"

**Core principle:** Everything runs client-side. No data uploaded. Privacy-first.

**Tone:** Warm, absurdist, specific. They laugh because it's TRUE, not because it hurts. The goal is recognition, not attack.

---

## Key Decisions from Brainstorm

| Decision | Choice |
|----------|--------|
| Data scope | 2025 only |
| Core viral mechanic | Roast accuracy (scarily specific) |
| Data source | LinkedIn data export (ZIP upload) |
| Humor styles | Absurdist, Meta, Specific+Universal, Deadpan — mixed |
| Roast selection | Data-driven (patterns pick the roast) |
| Flavor selection | Randomized (style varies per slide) |
| Shareable endings | 2x2 matrix + Fake LinkedIn headline |
| 2x2 visual | Populated with ~50-100 fake dots, user highlighted |
| Headline format | Mad Libs templates selected by archetype + behavior |

---

## User Flow

```
Landing Page
    ↓
Export Instructions (how to get your LinkedIn data)
    ↓
ZIP Upload (drag & drop)
    ↓
Processing Animation (funny loading messages)
    ↓
Tap-Through Roast Slides (6-10 slides, 2025 data only)
    ↓
Finale: 2x2 Matrix + Fake Headline
    ↓
Share (download PNG / copy to clipboard)
```

---

## Slide System

### How It Works

1. **Parse LinkedIn export** → Extract 2025-only data
2. **Detect patterns** → Late-night messaging, coffee lies, Greg collections, etc.
3. **Select roasts** → Pick slides that match detected patterns
4. **Assign flavor** → Randomly assign tone (absurdist/meta/deadpan/universal) to each slide
5. **Render** → Tap-through experience with share button per slide

### Slide Types (Data-Driven)

Each slide type triggers when specific patterns are detected:

| Slide | Triggers When | Example Roast |
|-------|---------------|---------------|
| The Greg Collector | One first name appears 5+ times | "You know 6 Gregs. This isn't networking. This is a Greg collection." |
| The Night Owl | 20%+ messages sent after 10pm | "11:47pm. A Tuesday. You sent a connection request. LinkedIn is not a bar." |
| The Coffee Liar | 3+ "coffee" mentions, <30% follow-up | "You said 'let's grab coffee' 12 times. You grabbed coffee 0 times." |
| The Congratulations Bot | 30+ "Congratulations" reactions | "You celebrated 47 strangers' achievements. You don't know what they do." |
| The Company Stalker | 15+ connections at one company (not employer) | "You know 34 people at Stripe. You don't work at Stripe. Suspicious." |
| The Panic Networker | Any month 3x above average | "March 2025: 67 connections. Your average: 8. We won't ask about February." |
| The Ghost | 5+ active relationships gone dormant | "You and Jamie exchanged 40 messages. Then nothing. Jamie is fine. Probably." |
| The Draft Hoarder | Detected incomplete message threads | "You have drafts you never sent. They're still there. Judging you." |
| The Reply Guy | High comment count, low post count | "You've commented 89 times. Posted 3 times. You prefer the audience to the stage." |
| The Thought Leader | 10+ posts with "learnings"/"insights" | "You used 'learnings' 9 times. That's not a word. LinkedIn made it a word." |

### Flavor Variants

Each slide has 4 flavor variants. Example for "The Coffee Liar":

**Absurdist:**
> "You've promised coffee to 12 different humans. That's 12 coffees. At 20 minutes each, that's 4 hours of coffee. You have not spent 4 hours having coffee. You have spent 4 hours lying about future coffee."

**Meta:**
> "You typed 'let's grab coffee' because LinkedIn taught you this is what professionals say. It's a password. It means nothing. Everyone knows it means nothing. You keep saying it anyway."

**Deadpan:**
> "You suggested coffee 12 times. Follow-ups sent: 0. Coffees grabbed: 0. This is fine."

**Specific + Universal:**
> "You typed 'would love to grab coffee!' and then immediately forgot about it. So did they. You both know. Nobody mentions it. This is how professional relationships work now."

---

## Finale: Two Shareable Outputs

### 1. The 2x2 Matrix

```
                    LOUD
                     ↑
    ┌────────────────┼────────────────┐
    │  BROADCASTER   │   OPERATOR     │
    │    · ·  ·      │  ·  · ·  ·     │
    │  ·    ·   ·    │    ·  ★  ·     │  ← User's dot highlighted
    │     ·    ·     │  ·   ·    ·    │
PASSIVE ─────────────┼─────────────── ACTIVE
    │  ·   ·    ·    │    ·   ·  ·    │
    │    ·   ·       │  ·    ·   ·    │
    │  LURKER        │   WHISPERER    │
    └────────────────┼────────────────┘
                     ↓
                   QUIET
```

- 50-100 fake dots scattered realistically
- User's dot in distinct color (★) with label
- Archetype name + tagline below
- Stats card: Posting / Engagement / Coffee Lies / Ghost Factor percentiles

### 2. The Fake LinkedIn Headline

Mad Libs templates selected by archetype + behavioral modifiers:

**Template structure:**
```
[Name] | [Archetype Roast] | [Behavioral Modifier]
```

**Examples:**

THE LURKER + Late Night:
> "Kyra Atekwana | Professionally Invisible | Online at 11pm, reacting to nothing"

THE OPERATOR + Coffee Liar:
> "Kyra Atekwana | Optimized LinkedIn Like a Video Game | Open to Coffee (lying)"

THE BROADCASTER + Congratulations Bot:
> "Kyra Atekwana | Speaking Into the Void Since 2019 | Has celebrated 47 strangers"

---

## Humor Principles (Reference for All Copy)

1. **Warmth first** — They should feel seen, not attacked
2. **Include them in the joke** — "We all do this" energy
3. **Absurd escalation** — Start normal, go somewhere weird
4. **Specific numbers** — "47 messages" not "a lot of messages"
5. **End strong** — Last line is the screenshot-worthy moment
6. **Roast LinkedIn too** — The platform made them this way
7. **No cruelty** — Mock behavior, never worth

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                    (Next.js + React)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  ZIP Upload │  │  Parser     │  │  Slide Renderer     │ │
│  │  (JSZip)    │  │  (PapaParse)│  │  (Framer Motion)    │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                     │            │
│         ▼                ▼                     ▼            │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                 ANALYSIS ENGINE                         ││
│  │  - Filter to 2025 data                                  ││
│  │  - Detect patterns (night owl, coffee liar, etc.)       ││
│  │  - Calculate percentiles                                ││
│  │  - Assign archetype                                     ││
│  │  - Select slides + randomize flavors                    ││
│  └─────────────────────────────────────────────────────────┘│
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                  SHARE IMAGE GENERATOR                  ││
│  │              (html-to-image / dom-to-image)             ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘

All client-side. No backend required for MVP.
```

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14 (App Router) | Fast, deployable to Vercel |
| Styling | Tailwind CSS | Rapid iteration |
| Animations | Framer Motion | Smooth tap-through slides |
| ZIP parsing | JSZip | Client-side extraction |
| CSV parsing | PapaParse | Handles LinkedIn's quirky CSVs |
| Image generation | html-to-image | Better than html2canvas for this |
| Deployment | Vercel | Free tier, instant deploys |
| Analytics | Vercel Analytics or Plausible | Privacy-friendly |

---

## File Structure

```
linkedin-roasted/
├── app/
│   ├── page.tsx              # Landing page
│   ├── upload/
│   │   └── page.tsx          # Upload + instructions
│   ├── roast/
│   │   └── page.tsx          # Slide experience
│   └── layout.tsx
├── components/
│   ├── FileUpload.tsx        # Drag & drop ZIP
│   ├── ProcessingAnimation.tsx
│   ├── SlideRenderer.tsx     # Tap-through container
│   ├── slides/               # Individual slide components
│   │   ├── OpeningSlide.tsx
│   │   ├── CoffeeLiarSlide.tsx
│   │   ├── NightOwlSlide.tsx
│   │   └── ...
│   ├── MatrixResult.tsx      # 2x2 finale
│   ├── HeadlineResult.tsx    # Fake headline finale
│   └── ShareButton.tsx
├── lib/
│   ├── parser.ts             # ZIP + CSV parsing
│   ├── analyzer.ts           # Pattern detection
│   ├── slideSelector.ts      # Pick slides based on patterns
│   ├── flavorRandomizer.ts   # Assign tones
│   ├── archetypeCalculator.ts
│   └── headlineGenerator.ts  # Mad Libs templates
├── data/
│   ├── roastTemplates.ts     # All roast copy by slide + flavor
│   └── headlineTemplates.ts  # All headline templates
├── public/
│   └── ...
└── docs/
    └── plans/
        └── 2025-12-16-linkedin-roasted-design.md
```

---

## MVP Scope

**In:**
- Landing page
- Export instructions
- ZIP upload + parsing
- 6-8 data-driven slides with flavor variants
- 2x2 matrix finale (with fake population)
- Fake headline finale
- Download PNG share
- Mobile-responsive tap-through

**Out (V2):**
- Part 1 / Part 2 split (quick export vs full)
- LLM-generated dynamic copy
- "Roast a colleague" flow
- Real anonymized benchmarks
- Email capture
- Calendar reminder for export wait

---

## Next Step

Create detailed implementation plan with bite-sized tasks.
