/* Level 7 — Claude Cowork */
(function () {
  'use strict';
  var PU = window.PU;
  var h = PU.h;

  function deliverables() {
    function slide(title, bars) {
      return h(
        'div.slide',
        h('div.sl-bar'),
        h('div', title),
        h(
          'div.sl-foot',
          bars.map(function (v) {
            return h('i', { style: 'height:' + v + '%' });
          })
        )
      );
    }
    return h(
      'div.stack',
      h(
        'div.slides',
        slide('November: purchases up 18%', [40, 55, 48, 70, 92]),
        slide('What worked: new ads + retargeting', [30, 62, 58, 80, 74]),
        slide('December plan: 3 changes', [50, 50, 64, 64, 86])
      ),
      h('p.small.muted', 'november-report.pptx · 9 slides in October’s layout'),
      h(
        'div.prompt',
        h('div.prompt-label', h('span', 'client-email.docx')),
        h('div.md', {
          html: PU.md(
            '**Subject:** November results: purchases up 18%\n\nHi Ananya,\n\nNovember bounced back: purchases rose 18% on October, and cost per purchase fell 9%.\n\n- The 6 new ads lifted click-through from 0.9% to 1.7%.\n- Retargeting returned ₹4.30 for every ₹1.\n- Reels brought 58% of our reach.\n\nThe full deck is attached. Can we lock December’s plan on Thursday’s call?\n\nBest,\nRohan'
          )
        })
      )
    );
  }

  PU.levels[7] = {
    id: 'L7',
    num: 7,
    color: 'var(--sw-7)',
    title: 'Claude ==Cowork==',
    short: 'Claude Cowork',
    tagline: 'Chat gives you answers. Cowork gives you finished work.',
    deliverable: 'Finished files, not just answers',
    learn: [
      'What Cowork is, and when to use it instead of chat',
      'How to delegate a task and stay in control',
      'How to set up Cowork on your computer, step by step',
      'The ground rules for letting Claude work on your files'
    ],
    steps: [
      { type: 'intro' },

      {
        type: 'concept',
        eyebrow: 'What is Cowork?',
        title: 'Chat gives you answers. Cowork gives you ==finished work==.',
        lede: 'In Cowork, you describe the result you want. Claude makes a plan, works through it on its own, and hands you finished files.',
        visual: function () {
          return h(
            'div.flow',
            { style: 'grid-template-columns:repeat(3,minmax(0,1fr))' },
            [
              ['You', 'Describe the finished result'],
              ['Claude', 'Plans, works, checks'],
              ['You', 'Review and send']
            ].map(function (x, i) {
              return h('div.fnode', { style: 'cursor:default' }, h('span.fn-num', '0' + (i + 1)), h('span.fn-title', x[0]), h('span.fn-short', x[1]));
            })
          );
        },
        body:
          '- **Works with your files.** In the Claude desktop app, connect a folder and Claude can read, organise and create files in it.\n- **Makes real documents.** Spreadsheets with formulas, presentations, reports.\n- **Keeps going without you.** Tasks can run in the background, and recurring jobs can run on a schedule.\n- **You stay in charge.** You choose how often it asks before it acts.',
        note: 'Cowork is in the Claude app on paid plans. You’ll set it up, step by step, later in this level.'
      },

      {
        type: 'compare',
        eyebrow: 'Same task, two ways',
        title: '40 feedback screenshots → ==one organised tracker==',
        cols: [
          {
            tag: 'In chat',
            kind: 'bad',
            steps: [
              'Upload screenshots in batches',
              'Ask Claude to read each batch',
              'Copy the answers',
              'Paste them into Excel',
              'Fix the formatting',
              'Repeat four times',
              'Build the summary tab yourself'
            ],
            stat: ['7', 'steps for you']
          },
          {
            tag: 'In Cowork',
            kind: 'good',
            steps: [
              '“Read every screenshot in the Luma feedback folder. Group the feedback by theme and urgency. Create feedback-tracker.xlsx with a summary tab.”',
              'Review the finished file'
            ],
            stat: ['2', 'steps for you']
          }
        ]
      },

      {
        type: 'cowork',
        xp: 40,
        eyebrow: 'Watch it work',
        title: 'Delegate the ==monthly report==',
        lede: 'A job every account team knows. Start the task and watch Cowork plan, work and deliver.',
        folder: 'Luma Skin / November report',
        files: [
          { name: 'meta-ads-export.csv', type: 'csv' },
          { name: 'google-analytics.pdf', type: 'pdf' },
          { name: 'instagram-insights.png', type: 'png' },
          { name: 'october-report.pptx', type: 'pptx' },
          { name: 'final-final-v2.pptx', type: 'pptx', junk: true },
          { name: 'final-final-v3.pptx', type: 'pptx', junk: true },
          { name: 'final-USE-THIS.pptx', type: 'pptx', junk: true }
        ],
        task: 'Create Luma Skin’s November performance report from the data files in this folder. Follow the layout of october-report.pptx and save it as november-report.pptx. Then write a short summary email for the client.',
        plan: [
          { t: 'Read the 3 data files', log: 'Reading meta-ads-export.csv, google-analytics.pdf, instagram-insights.png…' },
          { t: 'Calculate month-on-month changes', log: 'Purchases +18% · reach +21% · cost per purchase −9%' },
          { t: 'Find the 3 biggest insights', log: 'Click-through back to 1.7% · retargeting return 4.3x · Reels 58% of reach' },
          { t: 'Build the deck in October’s layout', log: 'Creating november-report.pptx (9 slides)…', ms: 1500 },
          { t: 'Write the client email', log: 'Drafting client-email.docx…' },
          { t: 'Check every number against the source files', log: '24 numbers checked · 0 mismatches' }
        ],
        approval: {
          after: 3,
          title: 'Claude wants to delete 3 old files',
          text: 'While building the deck, Claude found final-final-v2.pptx, final-final-v3.pptx and final-USE-THIS.pptx, and suggests deleting them to tidy the folder.',
          allowNote: 'Done, they’re gone. It turned out fine this time, but deleting wasn’t part of your task. When Claude asks for something you didn’t request, it’s fine to say no.',
          denyNote: 'Good call. Deleting wasn’t part of the task, so Claude carries on with just the report.'
        },
        outputs: [
          { name: 'november-report.pptx', type: 'pptx' },
          { name: 'client-email.docx', type: 'docx' }
        ],
        preview: deliverables,
        doneCallout: {
          eyebrow: 'Your job now',
          title: 'Review it like a manager, ==then== send it.',
          text: 'Check the numbers, the story and the tone. Cowork did the legwork. You own the result.'
        }
      },

      {
        type: 'sort',
        xp: 25,
        eyebrow: 'Chat or Cowork?',
        title: 'Which is the ==better fit==?',
        buckets: [
          { key: 'chat', label: 'Chat' },
          { key: 'cowork', label: 'Cowork' }
        ],
        items: [
          { text: 'Brainstorm 5 taglines', answer: 'chat', why: 'Quick thinking work suits chat.' },
          { text: 'Rename and sort 300 product photos into folders by category', answer: 'cowork', why: 'Lots of files and lots of steps: Cowork.' },
          { text: 'Turn 8 clients’ spreadsheets into one summary deck', answer: 'cowork', why: 'Several files in, a finished file out: Cowork.' },
          { text: 'Get a second opinion on a subject line', answer: 'chat', why: 'A quick question suits chat.' },
          { text: 'Every Monday, compile last week’s numbers into a report', answer: 'cowork', why: 'Recurring work can run on a schedule in Cowork.' },
          { text: 'Rewrite one paragraph in a friendlier tone', answer: 'chat', why: 'A small, one-off edit suits chat.' },
          { text: 'Read 25 interview transcripts and write a findings doc', answer: 'cowork', why: 'Long, file-heavy work: Cowork.' }
        ],
        success: 'All correct. Chat for thinking and quick edits. Cowork for multi-step work that ends in a file.'
      },

      {
        type: 'guide',
        xp: 20,
        eyebrow: 'Set it up',
        title: 'Get Cowork running ==on your computer==',
        lede: 'Do this once. Tick each step as you go. Not at your computer right now? Continue, and come back to this list later.',
        items: [
          {
            title: 'Install the Claude desktop app',
            body: 'Download it from [claude.com/download](https://claude.com/download). It works on Mac and Windows.'
          },
          {
            title: 'Sign in with your work account',
            body: 'Cowork needs a paid plan: Pro, Max, Team or Enterprise. On a Team plan it’s switched on by default. Can’t see it? Ask your admin to check **Organization settings → Cowork**.'
          },
          {
            title: 'Switch to Cowork',
            body: 'In the message box, choose **Cowork**. No Chat/Cowork switch? Then your app already handles Cowork tasks in any conversation.'
          },
          {
            title: 'Pick one folder',
            body: 'Click **Work in a project or folder** and choose one project folder, like _Luma Skin / November report_. Claude can only see the folders you pick. Never pick your whole computer.'
          },
          {
            title: 'Add folder instructions',
            body: 'Tell Claude how the folder works: what’s inside, how files are named, and what it must never touch. It reads them every time it works there, and can update them for you.'
          },
          {
            title: 'Choose how much Claude asks',
            body: 'Pick a mode in the message box.\n- **Manual:** Claude asks before it acts. Start here.\n- **Auto:** it keeps going without asking at every step.\n- **Skip:** no pauses, and nothing checks its actions. Avoid it for client work.'
          },
          {
            title: 'Run a small, safe first task',
            body: 'Try: “List every file in this folder with a one-line summary of each. Don’t move or delete anything.” Check the result, then hand it something bigger.'
          }
        ],
        extras: [
          {
            icon: 'layers',
            title: 'Connect your tools',
            text: 'Google Drive, Gmail, Slack and more. Add them from the + menu in the message box.',
            color: 'var(--sw-5)'
          },
          {
            icon: 'clock',
            title: 'Put repeat jobs on a schedule',
            text: 'Type /schedule in a task, or click Scheduled in the left sidebar. Scheduled tasks run in the cloud, even when your computer is off.',
            color: 'var(--sw-2)'
          },
          {
            icon: 'send',
            title: 'Start tasks from your phone',
            text: 'Cowork is also in the Claude phone app and on claude.ai. Files on your computer are only reachable while the desktop app is open.',
            color: 'var(--sw-6)'
          }
        ],
        footer: 'Menus and names change often. If something looks different, look for the same three things: pick a folder, choose how much Claude asks, then describe the finished result.',
        callout: { title: 'You’re set up. Start small, ==then delegate bigger==.' }
      },

      {
        type: 'cards',
        xp: 15,
        eyebrow: 'Ground rules',
        title: 'Six rules for letting Claude ==work on your files==',
        lede: 'Open each card.',
        cards: [
          { icon: 'folder', title: 'Give it one folder', color: '#ff7a00', body: 'Connect a specific project folder, not your whole computer.' },
          { icon: 'target', title: 'Describe “done”', color: '#2e3bff', body: 'Say what the finished file looks like, what it’s called and where it goes.' },
          { icon: 'eye', title: 'Check the plan first', color: '#00a676', body: 'Claude shows its plan before it starts. Fix the plan, not the output.' },
          {
            icon: 'alert',
            title: 'Stay in charge',
            color: '#e0418b',
            body: 'Choose how often Claude asks before acting. For anything important, keep approvals on, and say no to anything you didn’t ask for.'
          },
          { icon: 'check', title: 'Review before it’s real', color: '#7a4dff', body: 'Claude can make mistakes. Check numbers and facts before anything reaches a client.' },
          { icon: 'refresh', title: 'Back up, then automate', color: '#00a3e0', body: 'Work on copies of important files at first. Once a task works well, put it on a schedule.' }
        ]
      },

      {
        type: 'summary',
        takeaway: 'Delegate outcomes, not keystrokes. Then ==review like a manager==.',
        points: [
          'Describe the finished result, approve the plan, review the files.',
          'Chat for thinking. Cowork for multi-step work that ends in a file.',
          'Set up once: desktop app, one folder, Manual mode to start.',
          'Say no to anything you didn’t ask for.'
        ]
      }
    ]
  };
})();
