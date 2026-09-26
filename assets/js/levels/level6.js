/* Level 6 — Projects, memory & reusable context */
(function () {
  'use strict';
  var PU = window.PU;
  var h = PU.h;

  var REPEATED =
    'Luma Skin is a D2C skincare brand for sensitive skin. Audience: 22–35, metro India. Voice: clear, science-backed, warm. Never make medical claims. Avoid “flawless” and “glass skin”. Here are the brand guidelines again…';

  PU.levels[6] = {
    id: 'L6',
    num: 6,
    color: 'var(--sw-6)',
    title: 'Projects, memory & ==reusable context==',
    short: 'Projects & memory',
    tagline: 'Brief once. Reuse forever.',
    deliverable: 'Never explain the client twice',
    minutes: 5,
    learn: ['How Projects give every chat a built-in brief', 'What memory does, and where it lives', 'What to do when a long chat starts forgetting things'],
    steps: [
      { type: 'intro' },

      {
        type: 'concept',
        eyebrow: 'The problem',
        title: 'You’ve explained Luma Skin to Claude ==47 times== this month.',
        lede: 'Every new chat starts from zero. So you paste the same brand info, audience and rules again. Or you skip it and get generic work.',
        visual: function () {
          var stack = h('div', { style: 'display:grid;padding:0 22px 22px 0' });
          [0, 1, 2].forEach(function (i) {
            var el = PU.promptBlock(REPEATED, { label: 'Pasted again · chat #' + (45 + i) });
            el.style.gridArea = '1 / 1';
            el.style.transform = 'translate(' + i * 11 + 'px,' + i * 11 + 'px) rotate(' + [-1.6, 0.9, 0][i] + 'deg)';
            el.style.boxShadow = 'var(--shadow-2)';
            el.style.background = 'var(--surface)';
            if (i < 2) el.setAttribute('aria-hidden', 'true');
            stack.appendChild(el);
          });
          return stack;
        },
        callout: {
          eyebrow: 'The fix',
          title: 'A ==Project== is a workspace for one client or campaign.',
          text: 'Add instructions and files once. Every chat inside it starts already briefed. You’ll find Projects in the Claude sidebar.'
        }
      },

      {
        type: 'project',
        xp: 40,
        eyebrow: 'Build it',
        title: 'Set up a Project for ==Luma Skin==',
        lede: 'Pick the instructions and files a strategist would want. Then start a chat and see the difference.',
        defaultName: 'Luma Skin · Social',
        instructions: [
          { text: 'You’re the senior strategist on the Luma Skin account.', good: true },
          { text: 'Voice: clear, science-backed, warm. Never preachy.', good: true },
          { text: 'Audience: 22–35, metro India, sensitive skin.', good: true },
          { text: 'Never make medical claims or promise results. Avoid “flawless” and “glass skin”.', good: true },
          { text: 'Be creative and amazing.', good: false, warn: 'Adds nothing. Claude already tries.' },
          { text: 'Give options with a one-line reason for each. Ask questions if a brief is unclear.', good: true }
        ],
        files: [
          { text: 'brand-guidelines.pdf', type: 'pdf', good: true },
          { text: 'tone-of-voice-examples.docx', type: 'docx', good: true },
          { text: 'office-party-photos.zip', type: 'zip', good: false, warn: 'Irrelevant files add noise.' },
          { text: 'audience-personas.pdf', type: 'pdf', good: true },
          { text: 'q3-performance-report.xlsx', type: 'xlsx', good: true },
          { text: 'salary-slips-2026.pdf', type: 'pdf', good: false, warn: 'Never upload confidential personal data.' },
          { text: 'product-catalogue-2026.pdf', type: 'pdf', good: true }
        ],
        chatPrompt: '3 captions for the new SPF 50 gel sunscreen launch.',
        answer:
          'Here are 3 options in Luma’s voice, written for our 22–35 sensitive-skin audience:\n\n1. **SPF 50 that feels like nothing.** Our new gel sunscreen sinks in fast, leaves no white cast, and was tested on sensitive skin. Your daily step, simplified.\n_Why: leads with the number one complaint about sunscreen, the texture._\n\n2. **Sensitive skin deserves sun protection that doesn’t sting.** Meet our SPF 50 gel: fragrance-free, lightweight, made for every day.\n_Why: speaks straight to the audience’s biggest worry._\n\n3. **Sunscreen you’ll actually wear.** The best SPF is the one you use every day. New SPF 50 gel, out now.\n_Why: honest and habit-focused, with no exaggerated claims._\n\nWant me to adapt these for Reels or stories?'
      },

      {
        type: 'sort',
        xp: 30,
        eyebrow: 'What goes where?',
        title: 'Instructions, files, or ==just the chat==?',
        buckets: [
          { key: 'ins', label: 'Instructions' },
          { key: 'files', label: 'Project files' },
          { key: 'chat', label: 'Chat message' }
        ],
        items: [
          { text: 'Brand voice rules', answer: 'ins', why: 'How Claude should always behave goes in the instructions.' },
          { text: 'Brand guidelines PDF', answer: 'files', why: 'Reference documents go in the project files.' },
          { text: 'Today’s task: 5 Diwali captions', answer: 'chat', why: 'One-off tasks go in the chat.' },
          { text: 'Never use the word “flawless”', answer: 'ins', why: 'A standing rule belongs in the instructions.' },
          { text: 'Last quarter’s performance report', answer: 'files', why: 'Background data goes in the project files.' },
          { text: '“Make option 2 shorter”', answer: 'chat', why: 'Feedback on this draft goes in the chat.' },
          { text: 'Always ask questions if a brief is unclear', answer: 'ins', why: 'A standing behaviour belongs in the instructions.' },
          { text: 'Customer personas', answer: 'files', why: 'Reference material goes in the project files.' }
        ],
        success: 'Perfect. Rules go in instructions, reference material in files, today’s task in the chat.'
      },

      {
        type: 'cards',
        xp: 10,
        eyebrow: 'Memory',
        title: 'What Claude remembers, and ==where==',
        lede: 'Memory and Projects work together. Open each card.',
        wide: true,
        cards: [
          {
            icon: 'users',
            title: 'Memory',
            q: 'Claude remembers you',
            color: '#7a4dff',
            body: 'Claude can remember details from past chats: your role, how you like things written, what you’re working on. You can view and edit what it remembers in Settings, or just say “Remember that I…”.'
          },
          {
            icon: 'folder',
            title: 'Each Project has its own memory',
            q: 'What happens in a project stays there',
            color: '#2e3bff',
            body: 'Every Project keeps its own files, instructions and memory. Client A’s details won’t leak into Client B’s project.'
          },
          {
            icon: 'eye',
            title: 'Incognito chats',
            q: 'When you don’t want it remembered',
            color: '#00a676',
            body: 'Start an incognito chat for anything you don’t want saved to your memory or chat history.'
          },
          {
            icon: 'target',
            title: 'Rule of thumb',
            q: 'Where should client facts live?',
            color: '#e89a00',
            body: 'Put client facts in the **Project**, where the whole team can rely on them. Let memory handle **you**: your role, your style, your preferences.'
          }
        ]
      },

      {
        type: 'quiz',
        xp: 20,
        eyebrow: 'Long chats',
        title: 'Your chat is 80 messages long and Claude keeps forgetting decisions from the start. Best move?',
        options: [
          { label: 'Keep going and repeat yourself louder.', why: 'The chat just gets longer and messier.' },
          {
            label: 'Ask Claude to summarise everything decided so far, then start a fresh chat with that summary.',
            correct: true,
            why: 'A clean summary in a new chat makes Claude sharp again.'
          },
          { label: 'Delete everything and start from zero.', why: 'You’d lose the good work. Summarise it first.' },
          { label: 'Switch to a different AI.', why: 'Every AI has this limit. The fix is the same.' }
        ],
        explain: 'Very long chats get cluttered, and Claude can lose track of early details. Start fresh with a handover summary. Inside a Project, the brief carries over automatically.',
        after: function () {
          return PU.promptBlock(
            'Summarise this chat as a handover brief: the goal, what we decided, what we rejected and why, and what’s next. I’ll paste it into a new chat.',
            { label: 'The handover prompt', kind: 'good', copy: true }
          );
        }
      },

      {
        type: 'quiz',
        xp: 20,
        eyebrow: 'Team setup',
        title: 'Your team handles 6 clients. What’s the best setup?',
        options: [
          { label: 'One giant chat for all six clients', why: 'Clients’ details bleed into each other, and it gets slow and confused.' },
          { label: 'A new blank chat every time', why: 'You’d re-explain every client forever.' },
          {
            label: 'One Project per client, with brand files and instructions, shared with the team',
            correct: true,
            why: 'Everyone starts briefed, and the brief stays consistent.'
          },
          { label: 'Everyone keeps it in their heads', why: 'That’s how briefs get lost when someone’s on leave.' }
        ],
        explain: 'Sharing Projects with colleagues is available on Team and Enterprise plans. Ask your admin how your workspace is set up.'
      },

      {
        type: 'summary',
        takeaway: 'Brief once. ==Reuse forever.==',
        points: [
          'One Project per client: instructions for behaviour, files for knowledge.',
          'Memory handles you. Projects handle the client.',
          'Long chat going off track? Summarise, then start fresh.'
        ]
      }
    ]
  };
})();
