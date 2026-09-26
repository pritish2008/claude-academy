/* Final — The real work challenge */
(function () {
  'use strict';
  var PU = window.PU;

  PU.levels[10] = {
    id: 'LF',
    num: 10,
    color: 'var(--sw-10)',
    title: 'The ==real work== challenge',
    short: 'The real work challenge',
    tagline: 'Use everything on a task from your actual to-do list.',
    deliverable: 'Real work, done better, today',
    minutes: 5,
    learn: ['Brief Claude on a real task using the full formula', 'Spend 30 focused minutes doing the work in Claude', 'Leave with your certificate and a personal cheat sheet'],
    steps: [
      { type: 'intro' },

      {
        type: 'mission',
        xp: 170,
        minutes: 30,
        eyebrow: 'Final mission',
        title: 'Do ==real work==, better, right now',
        lede: 'Pick a task you actually need to do today. Brief it here, then spend 30 minutes getting it done in Claude.',
        nextLabel: 'See your certificate',
        examples: [
          'Plan next week’s posts for a client',
          'Draft a proposal from call notes',
          'Write ad copy variations',
          'Prep for a client meeting',
          'Summarise a report for a client',
          'Reply to tricky client feedback'
        ],
        fields: [
          { key: 'role', label: 'Role: who should Claude be?', ph: 'e.g. a senior social media strategist for skincare brands', w: 10 },
          { key: 'context', label: 'Context: brand, audience, situation', ph: 'e.g. Luma Skin, a D2C brand for sensitive skin. Audience 22–35 in metro India…', w: 20, long: true, min: 6 },
          { key: 'goal', label: 'Goal: what does success look like?', ph: 'e.g. 5,000 units sold in the first month', w: 15 },
          { key: 'input', label: 'Input: what will you attach or paste?', ph: 'e.g. brand guidelines, last month’s top posts, the launch brief', w: 15 },
          { key: 'constraints', label: 'Constraints: rules, tone, no-gos', ph: 'e.g. no medical claims, warm but expert, under 40 words each', w: 15, long: true },
          { key: 'output', label: 'Output: what should Claude hand back?', ph: 'e.g. a table of 5 posts with hook, caption and call to action', w: 15 }
        ],
        toggles: [
          { key: 'ask', label: 'Ask me questions first', line: 'Before you start, ask me any questions you need answered to do this brilliantly.', w: 4 },
          {
            key: 'steps',
            label: 'Work step by step',
            line: 'Work step by step: analyse what I’ve given you, find the key insight, create, then critique your own work and improve it before showing me the final version.',
            w: 3
          },
          { key: 'options', label: 'Give me options', line: 'Give me 3 options with a one-line reason for each.', w: 3 }
        ],
        moves: [
          ['I gave Claude real material', 'Files, screenshots, examples or data.'],
          ['I asked for options, not one answer', 'And picked the best one myself.'],
          ['I gave specific feedback at least twice', 'Keep this, change that, give me X.'],
          ['I asked Claude to critique its own work', 'Before accepting a draft.'],
          ['I checked facts and numbers', 'Before using anything with a client.'],
          ['I saved something reusable', 'A Project, a prompt or a workflow.']
        ]
      },

      {
        type: 'certificate',
        hideNext: true,
        nextSteps:
          '**What next?** Keep your cheat sheet handy, set up one Project for your main client this week, and share your best prompt with your team. The fastest way to get better is to use Claude on real work every day.'
      }
    ]
  };
})();
