/* Level 0 — The Wake-Up Call */
(function () {
  'use strict';
  var PU = window.PU;

  PU.levels[0] = {
    id: 'L0',
    num: 0,
    color: 'var(--sw-0)',
    title: 'The ==wake-up== call',
    short: 'The wake-up call',
    tagline: 'Most people use Claude at 20% of its potential.',
    deliverable: 'A new way of seeing Claude',
    learn: ['Why two people get wildly different results from the same Claude'],
    steps: [
      {
        type: 'hero',
        hideBar: true,
        xp: 10,
        eyebrow: (PU.brand && PU.brand.name ? PU.brand.name : 'Claude Power-Up') + ' · Internal training',
        title: 'Most people are using Claude at ==20%== of its potential.',
        lede: 'Stop using Claude like Google. Learn to brief it, feed it and put it to work like the sharpest person on your team.',
        meta: [
          ['grid', '11 short levels'],
          ['trophy', 'XP, ranks and a certificate'],
          ['target', 'Ends with a challenge on your real work']
        ]
      },

      {
        type: 'poll',
        xp: 10,
        eyebrow: 'Warm-up',
        title: 'Be honest. How do you use Claude today?',
        lede: 'No wrong answers. This just tells us where you’re starting.',
        options: [
          {
            label: 'Like Google: quick question, quick answer.',
            reply: 'Most people start here. Search engines reward short questions. Claude rewards full briefs. Level 1 fixes this.'
          },
          {
            label: 'Captions, emails and quick copy.',
            reply: 'Good instinct, small ambition. Level 4 gives you 50 ready-made jobs Claude can do for your role.'
          },
          {
            label: 'I paste something in and say “make it better”.',
            reply: 'You’re one step away. Level 2 shows you what to say instead of “better”.'
          },
          {
            label: 'I barely use it.',
            reply: 'Perfect. No bad habits to unlearn. Let’s build good ones.'
          },
          {
            label: 'A lot, but the results are hit or miss.',
            reply: 'Hit-or-miss usually means the brief changes every time. Levels 1 and 6 make your results consistent.'
          }
        ]
      },

      {
        type: 'showdown',
        xp: 10,
        eyebrow: 'The showdown',
        title: 'Same Claude. Same task. ==Two employees.==',
        lede: 'Both were asked to post about the ghee roast dosa at Dakshin Table, a premium South Indian restaurant in Bandra. Press run and compare.',
        runHint: 'Watch both answers arrive.',
        a: {
          name: 'Employee A',
          initial: 'A',
          role: 'Uses Claude like Google',
          color: '#8c92b5',
          good: false,
          prompt: 'Write a caption for this restaurant.',
          output:
            '🍽️✨ Craving something delicious? Come and experience the amazing flavours at our restaurant! Perfect for family, friends and foodies. Visit us today! 😋\n\n#food #foodie #restaurant #yummy #instafood #foodlover #delicious',
          verdict: ['Generic', '7 hashtags', 'Could be any restaurant']
        },
        b: {
          name: 'Employee B',
          initial: 'B',
          role: 'Briefs Claude like a strategist',
          color: '#2e3bff',
          good: true,
          prompt:
            'You’re the social media strategist for Dakshin Table, a premium South Indian restaurant in Bandra, Mumbai. Audience: 25–40 year-old professionals who grew up on home-style South Indian food and want it done beautifully. Voice: warm, confident, a little witty. No foodie clichés.\n\nWrite 3 Instagram captions for our ghee roast dosa (the batter ferments for 36 hours). Under 40 words each, one sensory detail, a soft call to book weekend brunch, max 2 hashtags.',
          output:
            '**1.** 36 hours of fermenting. 4 seconds of crunch. Our ghee roast dosa is made the slow way, the way your ammamma insisted on. Weekend brunch tables go fast: book via the link in bio. #DakshinTable #BandraBrunch\n\n**2.** Some things shouldn’t be rushed. Our batter rests for a day and a half so your Sunday doesn’t have to. Ghee roast, gunpowder, filter coffee. Brunch is served. #DakshinTable\n\n**3.** You’ll hear it before you taste it. Crisp, golden, glistening with ghee. The dosa people cross the city for is on the weekend brunch menu. Reserve via the link in bio. #DakshinTable #MumbaiEats',
          verdict: ['Specific', 'On-brand', 'Ready for client review']
        }
      },

      {
        type: 'quiz',
        xp: 20,
        eyebrow: 'Quick question',
        title: 'What made the difference?',
        options: [
          { label: 'Employee B has a paid Claude plan.', why: 'Same Claude, same plan. Nothing technical changed.' },
          { label: 'Employee B is a better writer.', why: 'Claude did the writing both times. Employee B just described what good looks like.' },
          {
            label: 'Employee B gave Claude the information a real strategist would need.',
            correct: true,
            why: 'Brand, audience, voice, product detail, format and rules. That’s a brief.'
          },
          { label: 'Employee B got lucky. AI is random.', why: 'Run Employee A’s prompt ten times and you’ll get ten versions of the same generic caption.' }
        ],
        reveal: {
          eyebrow: 'Remember this',
          big: 'The difference wasn’t intelligence. It was ==instruction==.',
          text: 'Claude can’t see your client’s brand book, last week’s meeting or what the client hated last time. It only knows what you tell it.'
        }
      },

      {
        type: 'write',
        xp: 60,
        eyebrow: 'Your turn',
        title: 'Rescue this prompt',
        lede: 'Rewrite Employee A’s prompt so Claude can’t get it wrong. Use the facts below. Messy is fine.',
        bad: 'Write a caption for this restaurant.',
        facts: {
          title: 'The facts you have',
          tag: 'Dakshin Table',
          rows: [
            ['Client', 'Dakshin Table, a premium South Indian restaurant in Bandra, Mumbai'],
            ['The post', 'A new dessert: filter coffee tiramisu'],
            ['Audience', '25–40 year-old urban professionals'],
            ['Goal', 'More weekend brunch bookings'],
            ['Voice', 'Warm, confident, a little witty. No clichés.']
          ]
        },
        label: 'Your rescued prompt',
        placeholder: 'Start with who Claude should be, then add the facts that matter…',
        chips: [
          { label: 'Role', insert: 'You’re the social media strategist for ' },
          { label: 'Audience', insert: 'Audience: ' },
          { label: 'Goal', insert: 'Goal: ' },
          { label: 'Tone', insert: 'Tone: ' },
          { label: 'Avoid', insert: 'Avoid: ' },
          { label: 'Format', insert: 'Give me 3 options, each under 40 words.' }
        ],
        checks: [
          'role',
          {
            id: 'brand',
            label: 'The brand',
            what: 'Says who the client is',
            tip: 'Name the client and what it is: “Dakshin Table, a premium South Indian restaurant in Bandra.”',
            test: function (t) {
              return /dakshin|south indian|restaurant/i.test(t) && PU.RX.descriptor.test(t);
            }
          },
          {
            id: 'product',
            label: 'The product',
            what: 'Says what the post is about',
            tip: 'Mention the dessert: the new filter coffee tiramisu.',
            test: function (t) {
              return /tiramisu|dessert/i.test(t);
            }
          },
          { id: 'audience', tip: 'Add the audience: “25–40 year-old urban professionals.”' },
          { id: 'goal', tip: 'Add the goal: “more weekend brunch bookings.”' },
          { id: 'constraints', label: 'Tone and rules', tip: 'Add the voice and rules: “Warm, confident, a little witty. No clichés.”' },
          { id: 'format', tip: 'Say what you want back: “3 captions, each under 40 words, with a call to book brunch.”' }
        ],
        expert:
          'You’re the social media lead for Dakshin Table, a premium South Indian restaurant in Bandra, Mumbai. Write 3 Instagram captions for our new filter coffee tiramisu.\n\nAudience: 25–40 year-old urban professionals. Goal: more weekend brunch bookings.\nVoice: warm, confident, a little witty. No clichés like “indulge” or “foodie heaven”.\n\nEach caption under 35 words, with one sensory detail and a soft call to book brunch. Max 2 hashtags.',
        expertNote: 'Notice it isn’t long. Every sentence just carries a fact Claude needs.',
        task: 'Rewrite “Write a caption for this restaurant.” so Claude writes great Instagram captions for Dakshin Table (a premium South Indian restaurant in Bandra) promoting a new filter coffee tiramisu to 25–40 year-old professionals, to drive weekend brunch bookings.',
        saveAs: 'rescue',
        saveTitle: 'Rescued caption prompt'
      },

      {
        type: 'summary',
        takeaway: 'Claude’s output is only as good as ==your brief==.',
        points: ['Short, vague prompts get short, generic answers.', 'Claude only knows what you tell it.', 'Next: a simple formula for briefing it properly.']
      }
    ]
  };
})();
