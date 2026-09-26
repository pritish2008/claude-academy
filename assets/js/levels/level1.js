/* Level 1 — Stop writing terrible prompts */
(function () {
  'use strict';
  var PU = window.PU;

  var C = { r: '#ff5a36', c: '#2e3bff', g: '#00a676', i: '#e0418b', k: '#e89a00', o: '#7a4dff' };

  PU.levels[1] = {
    id: 'L1',
    num: 1,
    color: 'var(--sw-1)',
    title: 'Stop writing ==terrible== prompts',
    short: 'Stop writing terrible prompts',
    tagline: 'A prompt is a brief. Here’s how to write a great one in 60 seconds.',
    deliverable: 'A prompt formula you’ll use every day',
    learn: ['The 6 parts of a great brief', 'Why better information beats longer prompts', 'How to check your own prompt before you send it'],
    steps: [
      { type: 'intro' },

      {
        type: 'cards',
        xp: 30,
        xpLabel: 'Formula unlocked',
        eyebrow: 'The formula',
        title: 'A prompt is a brief. Great briefs have ==6 parts==.',
        lede: 'You already write briefs for designers and freelancers. Same rules. Open each card.',
        mnemonic: [
          { word: 'Real', color: C.r },
          { word: 'Creatives', color: C.c },
          { word: 'Give', color: C.g },
          { word: 'Insanely', color: C.i },
          { word: 'Clear', color: C.k },
          { word: 'Orders', color: C.o }
        ],
        cards: [
          {
            letter: 'R',
            title: 'Role',
            q: 'Who should Claude be?',
            color: C.r,
            body: 'Sets the expertise and the point of view.',
            example: 'You’re a senior social media strategist who has launched 20+ café brands in India.',
            why: 'A “marketing expert” writes like a textbook. A café specialist writes like a café specialist.'
          },
          {
            letter: 'C',
            title: 'Context',
            q: 'What’s the situation?',
            color: C.c,
            body: 'The brand, the audience, what’s happening right now.',
            example: 'Kora Coffee is a premium specialty café in Bandra. Audience: 18–30, students and young professionals who care about design and quality.',
            why: 'Without it, Claude writes for a generic brand and a generic audience.'
          },
          {
            letter: 'G',
            title: 'Goal',
            q: 'What does success look like?',
            color: C.g,
            body: 'The business result, not just the deliverable.',
            example: 'Launch our cold brew range and get people to try it in-store within 30 days.',
            why: '“Make posts” and “drive trials” lead to very different ideas.'
          },
          {
            letter: 'I',
            title: 'Input',
            q: 'What should Claude work from?',
            color: C.i,
            body: 'Real material: briefs, menus, past posts, data.',
            example: 'Attached: the campaign brief, the cold brew menu and our 5 best-performing posts.',
            why: 'Real material beats descriptions. Claude reads files, screenshots and spreadsheets.'
          },
          {
            letter: 'C',
            title: 'Constraints',
            q: 'What are the rules?',
            color: C.k,
            body: 'Tone, length, must-haves and no-gos.',
            example: 'No cringe marketing language. No generic AI words like “elevate” or “indulge”. Keep the voice sophisticated.',
            why: 'Rules remove the stuff you’d delete anyway.'
          },
          {
            letter: 'O',
            title: 'Output',
            q: 'What should it hand back?',
            color: C.o,
            body: 'The exact format, length and number of options.',
            example: '10 concepts in a table: concept name, hook, format, visual idea, why it works.',
            why: 'You get something you can paste into a deck, not an essay.'
          }
        ]
      },

      {
        type: 'builder',
        xp: 40,
        eyebrow: 'Prompt builder',
        title: 'Build a prompt. Pick ==one piece per row==.',
        lede: 'Choose what you think is the strongest option in each row and watch the prompt strength change. Then run it.',
        task: '**The job:** an Instagram campaign for Kora Coffee’s new cold brew range.',
        slots: [
          {
            key: 'ROLE',
            color: C.r,
            q: 'Who should Claude be?',
            options: [
              { text: 'You’re a marketing expert.', q: 1 },
              { text: 'You’re a senior social media strategist who has launched 20+ café brands in India.', q: 2 },
              { text: '', label: 'Skip it', q: 0 }
            ]
          },
          {
            key: 'CONTEXT',
            color: C.c,
            q: 'What’s the situation?',
            options: [
              {
                text: 'Kora Coffee is a premium specialty café in Bandra, Mumbai. Our audience is 18–30: students and young professionals who care about design and quality.',
                q: 2
              },
              { text: 'It’s a café in Mumbai.', q: 1 },
              { text: '', label: 'Skip it', q: 0 }
            ]
          },
          {
            key: 'GOAL',
            color: C.g,
            q: 'What does success look like?',
            options: [
              { text: 'Make some posts.', q: 0 },
              { text: 'Create an Instagram campaign.', q: 1 },
              { text: 'Plan an Instagram campaign for our new cold brew range. Goal: get people to try it in-store within 30 days.', q: 2 }
            ]
          },
          {
            key: 'INPUT',
            color: C.i,
            q: 'What should it work from?',
            options: [
              { text: 'Here’s some info about the brand.', q: 1 },
              { text: '', label: 'Skip it', q: 0 },
              { text: 'Attached: the campaign brief, the cold brew menu and our 5 best-performing posts.', q: 2 }
            ]
          },
          {
            key: 'CONSTRAINTS',
            color: C.k,
            q: 'What are the rules?',
            options: [
              { text: 'No cringe marketing language. No generic AI words like “elevate” or “indulge”. Keep the voice sophisticated.', q: 2 },
              { text: 'Keep it professional.', q: 1 },
              { text: '', label: 'Skip it', q: 0 }
            ]
          },
          {
            key: 'OUTPUT',
            color: C.o,
            q: 'What should it hand back?',
            options: [
              { text: 'Give me a list of ideas.', q: 1 },
              { text: 'Give me 10 concepts in a table: concept name, hook, format, visual idea, why it works.', q: 2 },
              { text: '', label: 'Skip it', q: 0 }
            ]
          }
        ],
        outputs: {
          weak: {
            verdict: 'Could be any café, anywhere, any year',
            text:
              'Here are some Instagram ideas for your café! ☕\n\n1. Post a photo of your coffee with a catchy caption\n2. Share behind-the-scenes content of your baristas\n3. Run a giveaway to boost engagement\n4. Use trending audio for Reels\n5. Repost photos from happy customers\n\nConsistency is key! Post regularly and engage with your followers. 🚀'
          },
          ok: {
            verdict: 'Better. Still not something you’d show a client',
            text:
              'Here are 10 Instagram ideas for your café in Mumbai:\n\n1. **Cold Brew Mondays**: a weekly feature on your cold brew\n2. **Meet the barista**: short Reels introducing your team\n3. **Latte art time-lapse**\n4. **Customer of the week**\n5. **Monsoon specials** carousel\n6. **Behind the bar**: how cold brew is made\n7. **Poll**: hot or iced?\n8. **Coffee and work**: laptop-friendly café shots\n9. **Seasonal menu launch**\n10. **Giveaway**: tag a friend to win\n\nLet me know if you’d like captions for any of these!'
          },
          strong: {
            verdict: 'Specific, on-brand, measurable. A first draft you could present',
            text:
              'Here are 10 concepts for the Kora cold brew launch. Each is built to get people into the café to try it within 30 days.\n\n| Concept | Hook | Format | Visual idea | Why it works |\n|---|---|---|---|---|\n| The 18-Hour Wait | “We started making this yesterday.” | Reel | Time-lapse of the overnight steep, ending on the first pour | Turns slow brewing into a quality story |\n| Tasting Flight | “Three cold brews. One right answer: yours.” | Carousel | Three glasses on marble, tasting notes in clean type | Gives people a reason to visit and compare |\n| Desk to Kora | “Your 4 pm slump has a new address.” | Reel | POV walk from a Bandra co-working desk to the Kora counter | Speaks to the young professionals nearby |\n| Bean Passport | “Coorg, Chikmagalur, Araku. Pick your origin.” | Carousel | Map illustration, one origin per slide | Rewards the quality-curious audience |\n| First Sip Friday | “Say ‘cold brew’ at the counter. First one’s on us.” | Story + post | Bold type on brand colour, poll sticker | A trial driver you can measure |\n\n_Plus 5 more: barista picks, a pairing guide, cold brew tonic, a 30-day challenge and a regulars’ wall._\n\nWant me to turn the top 3 into full scripts?'
          }
        }
      },

      {
        type: 'tiers',
        xp: 10,
        eyebrow: 'Bad vs better vs expert',
        title: 'Longer isn’t better. ==Denser== is better.',
        lede: 'Same task, four prompts. Tap through all four.',
        tabs: [
          {
            label: 'Bad',
            kind: 'bad',
            prompt: 'Give me Instagram ideas for a café.',
            notes: ['- No brand, no audience, no goal', '- No format, so you get a random list'],
            result: 'A generic list: “Post latte art! Run a giveaway! Use trending audio!”'
          },
          {
            label: 'Better',
            kind: 'mid',
            prompt: 'Give me 10 Instagram post ideas for a premium café in Mumbai targeting young professionals. Make them trendy.',
            notes: ['+ Has an audience and a number', '- “Trendy” is vague', '- No goal, no brand voice, no format'],
            result: '10 decent ideas. Nothing you couldn’t have thought of in 5 minutes.'
          },
          {
            label: 'Expert',
            kind: 'good',
            prompt:
              'You’re a senior social strategist for Kora Coffee, a premium café in Bandra (audience: 18–30, design-conscious). We’re launching a cold brew range; the goal is in-store trials within 30 days. Using the attached brief and our top 5 posts, give me 10 concepts in a table: name, hook, format, visual, why it works. No clichés like “elevate” or “indulge”.',
            notes: ['+ Every sentence carries information', '+ Role, context, goal, input, rules and format', '+ About 70 words, no fluff'],
            result: 'Ten specific, on-brand concepts in a table you can paste into a deck.'
          },
          {
            label: 'Long but useless',
            kind: 'bad',
            prompt:
              'Hi Claude! I hope you’re doing well. I would really, really appreciate it if you could please help me come up with some absolutely amazing, creative, unique, viral, engaging, out-of-the-box Instagram ideas for a café that will make people love it. Please make them super creative and very engaging and amazing. Thank you so much!!',
            notes: ['- Longer than the Better prompt', '- Less information than the Bad one', '- Adjectives are not instructions'],
            result: 'The same generic list as the Bad prompt, with extra enthusiasm.'
          }
        ],
        callout: {
          eyebrow: 'The big idea',
          title: 'You don’t need longer prompts. You need ==better information==.',
          text: 'Every sentence should tell Claude something it couldn’t guess.'
        }
      },

      {
        type: 'multi',
        xp: 15,
        eyebrow: 'Spot the gaps · 1 of 2',
        title: 'What’s this prompt missing?',
        lede: 'Tap every part of the formula that’s missing, then press Check.',
        context: { prompt: 'Write 5 subject lines for our Diwali sale email. Keep them under 50 characters.', label: 'The prompt' },
        columns: '250px',
        options: [
          { label: '**Role**: who Claude should be', status: 'correct', why: 'No role, so you get a generic copywriter voice.' },
          { label: '**Context**: brand, product, audience', status: 'correct', why: 'Which brand? What’s on sale? Who’s reading?' },
          { label: '**Goal**: what success looks like', status: 'correct', why: 'Opens? Clicks? Sales? Each needs different lines.' },
          { label: '**Input**: material to work from', status: 'neutral', why: 'Optional here. Pasting last year’s best subject lines would help.' },
          { label: '**Constraints**: rules and limits', status: 'wrong', why: 'It has one: under 50 characters.' },
          { label: '**Output**: format and quantity', status: 'wrong', why: 'It has one: 5 subject lines.' }
        ],
        perfect: 'Spot on. It has a format and a limit, but Claude still has to guess the brand, the audience and the point.'
      },

      {
        type: 'multi',
        xp: 15,
        eyebrow: 'Spot the gaps · 2 of 2',
        title: 'And this one?',
        lede: 'Tap every part of the formula that’s missing.',
        context: {
          prompt: 'You’re a senior copywriter. Our client Luma Skin is launching a vitamin C serum for sensitive skin, aimed at 22–35 year-olds. Write the product page copy.',
          label: 'The prompt'
        },
        columns: '250px',
        options: [
          { label: '**Role**: who Claude should be', status: 'wrong', why: 'It has one: senior copywriter.' },
          { label: '**Context**: brand, product, audience', status: 'wrong', why: 'It has one: Luma Skin, the serum, the audience.' },
          { label: '**Goal**: what success looks like', status: 'correct', why: 'Convert first-time buyers? Build trust? Explain the science?' },
          { label: '**Input**: material to work from', status: 'neutral', why: 'Helpful: the ingredient list and product sheet.' },
          { label: '**Constraints**: rules and limits', status: 'correct', why: 'Skincare needs rules: no medical claims, tone, length.' },
          { label: '**Output**: format and quantity', status: 'correct', why: 'Which sections? How long? How many headline options?' }
        ],
        perfect: 'Nailed it. Great role and context, but no goal, no rules and no format. In skincare, missing rules can mean claims legal won’t approve.'
      },

      {
        type: 'write',
        xp: 80,
        eyebrow: 'Mini challenge',
        title: 'Write a prompt for ==5 Reel concepts==',
        lede: 'Ask Claude for 5 Instagram Reel concepts for a restaurant. Use a real client or make one up.',
        label: 'Your prompt',
        placeholder: 'e.g. You’re a short-form video strategist for restaurants…',
        chips: [
          { label: 'Role', insert: 'You’re a short-form video strategist for restaurants.' },
          { label: 'Context', insert: 'The restaurant: ' },
          { label: 'Audience', insert: 'Audience: ' },
          { label: 'Goal', insert: 'Goal: ' },
          { label: 'Rules', insert: 'Rules: under 30 seconds each, shootable on a phone, no clichés.' },
          { label: 'Format', insert: 'For each concept, give me a title, a 3-second hook, a shot-by-shot outline and on-screen text.' }
        ],
        checks: [
          {
            id: 'objective',
            label: 'Clear objective',
            what: 'Asks for 5 Reel concepts',
            tip: 'Say exactly what you want: “5 Instagram Reel concepts”.',
            test: function (t) {
              return /\breels?\b/i.test(t) && /\b(5|five)\b/i.test(t);
            }
          },
          { id: 'context', tip: 'Describe the restaurant: cuisine, location, what makes it special.' },
          { id: 'audience', tip: 'Say who the Reels are for, e.g. “25–40 year-old professionals in Mumbai”.' },
          { id: 'constraints', tip: 'Add rules: length, tone, what to avoid. e.g. “Under 30 seconds, shootable on a phone, no clichés.”' },
          { id: 'format', tip: 'Say what each concept should include: title, hook, shots, on-screen text.' },
          { id: 'role', bonus: true, w: 0.5 },
          { id: 'goal', label: 'Business goal', bonus: true, w: 0.5, tip: 'Bonus: say what the Reels should achieve, e.g. more weekend bookings.' }
        ],
        expert:
          'You’re a short-form video strategist for restaurants. Our client is Dakshin Table, a premium South Indian restaurant in Bandra, Mumbai.\nAudience: 25–40 year-old professionals. Goal: more weekend brunch bookings.\n\nGive me 5 Instagram Reel concepts. For each: a title, a 3-second hook, a shot-by-shot outline (max 5 shots), on-screen text, and why it will work for this audience.\n\nRules: under 30 seconds each, shootable on a phone in one afternoon, no clichés like “foodie heaven”.',
        task: 'Write a prompt asking Claude for 5 Instagram Reel concepts for a restaurant.',
        saveAs: 'reels',
        saveTitle: 'Reel concepts prompt'
      },

      {
        type: 'summary',
        takeaway: 'Real Creatives Give Insanely Clear Orders.',
        points: [
          '**R**ole, **C**ontext, **G**oal, **I**nput, **C**onstraints, **O**utput.',
          'Better information beats longer prompts.',
          'Pro move: end with “Ask me any questions before you start.”'
        ],
        template: PU.BRIEF_TEMPLATE,
        templateLabel: 'Your brief template (copy it)'
      }
    ]
  };
})();
