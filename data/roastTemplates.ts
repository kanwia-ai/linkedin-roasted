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

That's ${data.mentions} coffees. At 30 minutes each, that's ${Math.round(Number(data.mentions) * 0.5)} hours of coffee.

You have not spent ${Math.round(Number(data.mentions) * 0.5)} hours having coffee.

You have spent ${Math.round(Number(data.mentions) * 0.5)} hours lying about future coffee.

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
    absurdist: (data) => {
      const ghosts = data.ghosts as Array<{ name: string; messageCount: number; lastContactFormatted: string }>;
      return `You and ${ghosts[0].name} exchanged ${ghosts[0].messageCount} messages.

Then nothing. Radio silence.

${ghosts[0].name} is out there somewhere. Living their life.

Probably thinking about you never.

You were their most active LinkedIn relationship for a while there.

Now you're a memory. A notification they don't get anymore.`;
    },

    meta: (data) => {
      const ghosts = data.ghosts as Array<{ name: string; messageCount: number; lastContactFormatted: string }>;
      return `${ghosts[0].name}: ${ghosts[0].messageCount} messages exchanged.

Last contact: ${ghosts[0].lastContactFormatted}.

LinkedIn still suggests you reconnect.

You ignore the suggestion. So do they.

This is how professional relationships decay.

The algorithm watches. The algorithm remembers.`;
    },

    deadpan: (data) => {
      const ghosts = data.ghosts as Array<{ name: string; messageCount: number; lastContactFormatted: string }>;
      return `Active relationships gone quiet:

${ghosts[0].name} — last message: ${ghosts[0].lastContactFormatted}

${ghosts.length > 1 ? `${ghosts[1].name} — last message: ${ghosts[1].lastContactFormatted}` : ''}

They're fine. Probably.`;
    },

    universal: (data) => {
      const ghosts = data.ghosts as Array<{ name: string; messageCount: number; lastContactFormatted: string }>;
      return `You and ${ghosts[0].name} used to talk.

${ghosts[0].messageCount} messages over time. Ideas exchanged. Plans made maybe.

Then one day, you just... stopped.

No fight. No falling out. Just silence.

This is fine. This is how it works. Everyone has a ${ghosts[0].name}.`;
    }
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

Ratio: ${Math.round(Number(data.comments) / Math.max(Number(data.posts), 1))}:1.

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
