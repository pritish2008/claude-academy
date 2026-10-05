/* Level 9 — Claude for designers: branding, packaging and web */
(function () {
  'use strict';
  var PU = window.PU;
  var h = PU.h;

  function shotBar(label) {
    return h('div.shot-bar', h('i'), h('i'), h('i'), h('span', { style: 'margin-left:6px' }, label));
  }

  /* A tea box front panel with a few deliberate problems for Claude to spot. */
  function packMock() {
    return h(
      'div.shot.narrow',
      shotBar('kesar-tea-front-v2.png · front panel'),
      h(
        'div.pack',
        h(
          'div.pack-box',
          h('div.pack-logo', 'KESAR'),
          h('div.pack-name', 'Assam Gold'),
          h('div.pack-art', h('span', 'tea garden illustration')),
          h('div.pack-claims', h('span', '100% Natural'), h('span', 'Hand Picked'), h('span', 'Rich Aroma'), h('span', 'Strong Taste'), h('span', 'Since 1952')),
          h('div.pack-weight', '250 g')
        )
      )
    );
  }

  /* A website home page, top section. */
  function webMock() {
    return h(
      'div.shot',
      shotBar('aangan-interiors-home.png · 1440 wide'),
      h(
        'div.webhero',
        h('div.wh-nav', h('b', 'AANGAN'), h('span', 'Home · About · Projects · Services · Press · Careers · Blog · Contact')),
        h(
          'div.wh-main',
          h(
            'div.wh-copy',
            h('div.wh-h', 'Welcome to Aangan Interiors'),
            h('div.wh-p', 'We are a passionate team of designers who believe every space tells a story. Founded in 2009, we have completed over 300 homes and offices across Pune and Mumbai, bringing warmth and function to every project we touch.'),
            h('div.wh-btns', h('span.wh-btn', 'Learn more'), h('span.wh-btn', 'Our story'), h('span.wh-btn', 'Contact'))
          ),
          h('div.wh-img', h('span', 'living room photo'))
        )
      )
    );
  }

  /* A client's WhatsApp feedback on a logo. */
  function feedbackMock() {
    return h(
      'div.shot.narrow',
      shotBar('whatsapp-feedback.png'),
      h(
        'div.wa',
        h('div.wa-logo', h('b', 'kesar'), h('span', 'tea co.')),
        h('div.wa-msg', 'Looks nice but not premium enough. Can we make the logo bigger? And the colour feels a bit sad, make it more happy. My wife also said the font looks “too modern”. Need by Friday 🙏'),
        h('div.wa-time', 'Mr. Bora · 9:42 pm')
      )
    );
  }

  PU.levels[9] = {
    id: 'LD',
    num: 9,
    color: 'var(--sw-4)',
    title: 'Claude for ==designers==',
    short: 'Claude for designers',
    tagline: 'Your eye stays in charge. Claude takes the briefs, the words and the busywork.',
    deliverable: 'More time at the drawing board, less on everything around it',
    learn: [
      'Which design jobs to hand to Claude, and which stay yours',
      'How to ask for design directions that aren’t generic',
      'How to get honest feedback on your work from a screenshot',
      'How to turn vague client feedback into clear changes',
      'How to roll out an approved design in Canva and Adobe with one message'
    ],
    steps: [
      { type: 'intro' },

      {
        type: 'concept',
        eyebrow: 'The big idea',
        title: 'Claude won’t replace your eye. It ==clears the way== for it.',
        lede: 'A designer’s day is full of work that isn’t design: decoding briefs, writing copy for layouts, answering feedback, listing sizes, renaming files. That’s where Claude saves you hours.',
        visual: function () {
          return PU.tiles([
            { icon: 'clipboard', title: 'Briefs', text: 'Turns a messy call or WhatsApp into a clear brief, plus the questions you still need to ask.', color: '#e0418b' },
            { icon: 'type', title: 'Words on the design', text: 'Brand names, taglines, back-of-pack copy, website headlines. Real words, not lorem ipsum.', color: '#7a4dff' },
            { icon: 'compass', title: 'Directions', text: 'Distinct creative routes with mood, colour, type and references to look for, before you open a design app.', color: '#00a3e0' },
            { icon: 'eye', title: 'A second pair of eyes', text: 'Paste a screenshot and get an honest critique: hierarchy, readability, what to fix first.', color: '#ff5a36' },
            { icon: 'chat', title: 'Client feedback', text: 'Turns “make it pop” into specific changes, and helps you write a calm reply.', color: '#00a676' },
            { icon: 'grid', title: 'Rollouts', text: 'With [[connectors|connector]], resizes and adapts approved work in Canva and Adobe for you.', color: '#ff7a00' }
          ]);
        },
        body:
          '**What stays yours:** taste, the final call, the craft, and the final artwork files. Claude gives you options and a head start. You decide what’s good.\n\nClaude also doesn’t draw photos or illustrations on its own. For pictures, it writes the prompt for your image tool, or works in Canva and Adobe through a [[connector]] (Level 8).'
      },

      {
        type: 'sort',
        xp: 20,
        eyebrow: 'Who does what',
        title: 'Hand it to Claude, or ==keep it yours==?',
        buckets: [
          { key: 'claude', label: 'Hand it to Claude' },
          { key: 'you', label: 'Keep it yours' }
        ],
        items: [
          { text: 'Turn the client’s 20-minute call notes into a one-page brief', answer: 'claude', why: 'Claude is great at sorting messy notes. You check it against what the client really said.' },
          { text: 'Write 3 rough options for the back-of-pack copy', answer: 'claude', why: 'Real words make a layout look real. You and the client pick and polish.' },
          { text: 'List every size needed for a launch across Instagram, website and print', answer: 'claude', why: 'A boring list that’s easy to get wrong by hand. Double-check the print sizes with the printer.' },
          { text: 'Decide which logo route goes to the client', answer: 'you', why: 'That’s your judgement. Claude can help you explain the choice, not make it.' },
          { text: 'Approve the colours on the printed proof', answer: 'you', why: 'Colour on paper has to be seen with your own eyes.' },
          { text: 'Give the first round of comments on your own draft', answer: 'claude', why: 'A free second opinion before anyone else sees it. Keep the comments you agree with.' },
          { text: 'Send the final print files to the printer', answer: 'you', why: 'Final files are checked and sent by a person, every time.' }
        ],
        success: 'Spot on. Claude does the sorting, writing and listing. You make the calls and sign off the final work.'
      },

      {
        type: 'tiers',
        xp: 10,
        eyebrow: 'Better directions',
        title: 'From generic ideas to ==routes worth sketching==',
        lede: 'The job: a new look for Kesar Tea, a family tea brand from Assam. Same ask, three ways. Tap through all three.',
        tabs: [
          {
            label: 'Bad',
            kind: 'bad',
            prompt: 'Give me logo ideas for a tea brand.',
            notes: ['- No brand, no audience, no competitors', '- “Ideas” could mean anything'],
            result: 'A leaf, a cup and a steam swirl. Every tea logo ever made.'
          },
          {
            label: 'Better',
            kind: 'mid',
            prompt: 'Give me 5 logo ideas for Kesar Tea, a premium Assam tea brand. Make them modern and premium.',
            notes: ['+ Has the brand and a number', '- “Modern and premium” means something different to everyone', '- Nothing about who buys it or what to avoid'],
            result: 'Five tidy ideas: gold leaf, a monogram, a tea garden line drawing… All fine. None surprising.'
          },
          {
            label: 'Expert',
            kind: 'good',
            prompt:
              'You’re a senior brand designer. Our client is Kesar Tea, a family tea estate in Assam since 1952, moving from local shops to premium gift stores and online.\nBuyers: 30–55, buying tea as a gift. Competitors use gold leaves and tea garden scenes, so we want to stand apart.\nGive me 3 distinct brand directions. For each: a name, the idea in one line, mood in 5 words, colour palette, type feel, how the logo could work, and 5 search terms for reference images.\nAvoid leaves, cups and steam. Ask me questions before you start if anything is unclear.',
            notes: ['+ The brand’s story and where it’s going', '+ Who buys it, and what competitors do', '+ Exactly what to hand back, and what to avoid'],
            result: 'Three routes you could actually sketch tomorrow, each with its own mood, palette and references to look for.'
          }
        ],
        callout: {
          title: 'Tell Claude what ==everyone else does==.',
          text: 'Naming the clichés to avoid is the fastest way to get ideas that aren’t generic.'
        }
      },

      {
        type: 'screens',
        xp: 30,
        eyebrow: 'A second pair of eyes',
        title: 'Paste a screenshot. ==Get a straight answer.==',
        lede: 'Three everyday studio moments. Attach the screenshot and see what Claude says.',
        footer: 'Tip: tell Claude who the design is for and what it must do. Then decide for yourself which comments to act on.',
        tabs: [
          {
            label: 'Packaging',
            file: 'kesar-tea-front-v2.png',
            mock: packMock,
            prompt: 'This is the front of a premium Assam tea box. It will sit on a gift-store shelf next to 20 other teas. Critique it and give me the top 3 fixes.',
            answer:
              '**Top 3 fixes**\n\n1. **Five claims is four too many.** “100% Natural, Hand Picked, Rich Aroma, Strong Taste, Since 1952” all shout at once, so none of them lands. Keep **Since 1952**: it’s the only one competitors can’t copy. Move the rest to the back.\n2. **The name of the tea is hard to find.** “Assam Gold” is smaller than the illustration. From two metres away, a shopper should read Kesar, then Assam Gold, in that order.\n3. **It looks like every other tea.** A tea garden picture is what most of the shelf already shows. Try a bolder idea, like a single strong colour or pattern, so the box stands out from far away.\n\n**Also check:** the weight is in the right place for your market’s label rules. Ask the client or their legal team.'
          },
          {
            label: 'Website',
            file: 'aangan-interiors-home.png',
            mock: webMock,
            prompt: 'This is the top of an interior design studio’s home page. The goal is more enquiries from homeowners. What would you change first?',
            answer:
              '**What I’d change first**\n\n1. **The headline says nothing.** “Welcome to Aangan Interiors” could be any company. Say what you do and for whom, like “Warm, liveable homes in Pune and Mumbai”.\n2. **Three buttons, no clear next step.** “Learn more”, “Our story” and “Contact” compete. Keep one strong button, “Book a free consultation”, and make the others plain links.\n3. **The menu has 8 items.** Homeowners need Projects, Services and Contact. Move the rest to the footer.\n\n**Also:** the best proof you have, “300 homes”, is hidden in the paragraph. Pull it out as a big number next to the photo.'
          },
          {
            label: 'Client feedback',
            file: 'whatsapp-feedback.png',
            mock: feedbackMock,
            prompt: 'This is the client’s feedback on our logo. Turn it into specific design changes I could try, and draft a short, polite reply that asks the right questions.',
            answer:
              '**What they probably mean**\n\n| They said | Things to try |\n|---|---|\n| Not premium enough | More space around the logo, a finer weight, fewer elements |\n| Make the logo bigger | Check it at real size on the box first. Often it needs more contrast, not more size |\n| The colour feels sad | Warmer and brighter: try the saffron from the brand name instead of the grey-green |\n| The font looks too modern | Show one option with a classic serif, and one with a custom touch on the K |\n\n**Draft reply**\n\n“Thank you, Mr. Bora, this is really helpful. We’ll share two updated options by Thursday. Quick question so we get it right: are there any tea brands or gift boxes you feel look truly premium? A photo or two would help us a lot.”'
          }
        ]
      },

      {
        type: 'quiz',
        xp: 20,
        eyebrow: 'Trust, but check',
        title: 'Claude suggests the perfect name for a new tea range: “Brahma Brew”. The client loves it. What now?',
        options: [
          { label: 'Put it on the packaging. Claude checked it.', why: 'Claude can’t reliably tell you a name is free to use. That needs a proper legal check.' },
          { label: 'Ask Claude “Is this name taken?” and trust the answer.', why: 'Claude may sound sure, but it can’t give a legal answer. A person has to check the official records.' },
          {
            label: 'Have the client or their lawyer check trademarks, and check the web address and social handles too.',
            correct: true,
            why: 'Names are legal property. Claude can help you shortlist, but a real check happens before anything is printed.'
          },
          { label: 'Change one letter so it’s definitely original.', why: 'A similar name can still clash with an existing brand.' }
        ],
        reveal: {
          eyebrow: 'The rule',
          big: 'Claude gives you options. ==People check== what gets printed.',
          text: 'Names, claims on packs, legal text and image rights all get checked by a person before they go to the client or the printer.'
        }
      },

      {
        type: 'chat',
        xp: 25,
        eyebrow: 'See it in action',
        title: 'One approved design, ==every size== in one message',
        lede: 'The client approved the Diwali gift box key visual in Canva. Now it needs to go everywhere. Press the blue button to move on.',
        chatTitle: 'Claude · simulated',
        turns: [
          {
            role: 'user',
            text:
              'The Kesar Tea Diwali key visual in Canva is approved. Make versions for an Instagram post, an Instagram Story, a website banner and an A4 poster, using the Kesar brand kit. Cut out the 6 gift box photos in the “Diwali shoot” folder with Adobe and put them on a plain cream background. Don’t change the headline or the colours.'
          },
          {
            role: 'claude',
            think: 1100,
            text: 'On it. My plan:\n\n1. Cut out the 6 gift box photos in Adobe and place them on cream\n2. Make the 4 sizes in Canva from the approved design, with the Kesar brand kit\n3. Keep the headline and colours exactly as approved\n4. List anything that needs your eye'
          },
          {
            role: 'screen',
            title: 'Claude is working in your apps',
            lines: [
              { t: 'Adobe · cutting out 6 gift box photos… done', kind: 'ok' },
              { t: 'Adobe · placing them on a cream background… done', kind: 'ok' },
              { t: 'Canva · Instagram post (1080 × 1080)… done', kind: 'ok' },
              { t: 'Canva · Instagram Story (1080 × 1920)… done', kind: 'ok' },
              { t: 'Canva · website banner (1920 × 600)… done', kind: 'ok' },
              { t: 'Canva · A4 poster… done', kind: 'ok' },
              { t: '  Headline and colours unchanged', kind: 'dim' }
            ]
          },
          {
            role: 'claude',
            text:
              'Done. All 4 sizes are in your Canva account, and the 6 photos are cut out.\n\n**Please check:**\n- **The website banner:** the headline only fits on two lines, so the box is smaller than in the original.\n- **Photo 4:** the ribbon has a fine edge. The cut-out may need a touch-up.\n- **The A4 poster:** ask the printer if they need bleed, and which file type they want.'
          },
          {
            role: 'note',
            text: 'Claude did the repetitive part, and told you exactly where to look. You spend your time on the three things that need a designer’s eye.'
          },
          { role: 'user', send: 'Ask for a change', text: 'For the banner, put the gift box on the right and the headline on the left, on one line.' },
          { role: 'claude', text: 'Done. The banner now has the headline on one line on the left, and the box on the right at full size.' }
        ],
        callout: {
          title: 'You design the ==hero==. Claude handles the rollout.',
          text: 'Resizing and adapting is where hours disappear. Keep your eye for the final check.'
        }
      },

      {
        type: 'write',
        xp: 80,
        eyebrow: 'Your turn',
        title: 'Turn a client message into ==a real brief==',
        lede: 'A client sent this on WhatsApp. Write a prompt asking Claude to turn it into a proper design brief. Use the facts below. Messy is fine.',
        bad: '“Hi! We need new packaging for our cold-pressed oils. Something premium but not boring. Can you share ideas by next week?”',
        badLabel: 'The client’s message',
        facts: {
          title: 'What you know',
          tag: 'Ghani Oils',
          rows: [
            ['Client', 'Ghani Oils, a family business making cold-pressed oils in Jaipur'],
            ['The job', 'New packaging for 4 bottles: mustard, groundnut, sesame and coconut'],
            ['Buyers', 'Health-conscious families, 28–45, shopping in premium stores and online'],
            ['Goal', 'Get listed in premium stores, next to expensive imported oils'],
            ['Rules', 'Keep the family name. Avoid the usual green leaves and golden drops.']
          ]
        },
        label: 'Your prompt',
        placeholder: 'e.g. You’re a senior packaging designer. Turn this client message into a design brief…',
        chips: [
          { label: 'Role', insert: 'You’re a senior packaging designer.' },
          { label: 'Client', insert: 'The client: ' },
          { label: 'Buyers', insert: 'Buyers: ' },
          { label: 'Goal', insert: 'Goal: ' },
          { label: 'Rules', insert: 'Rules: ' },
          { label: 'Format', insert: 'Give me a one-page brief with: objective, audience, key message, must-haves, formats, tone and references to look for.' },
          { label: 'Questions', insert: 'Then list the questions we still need to ask the client.' }
        ],
        checks: [
          {
            id: 'objective',
            label: 'Clear objective',
            what: 'Asks for a design brief',
            tip: 'Say exactly what you want: “Turn this into a design brief.”',
            test: function (t) {
              return /\bbrief\b/i.test(t);
            }
          },
          {
            id: 'brand',
            label: 'The client',
            what: 'Says who the client is',
            tip: 'Name the client and what they make: “Ghani Oils, a family business making cold-pressed oils in Jaipur.”',
            test: function (t) {
              return /ghani|cold[- ]pressed|\boils?\b/i.test(t) && (PU.RX.descriptor.test(t) || /family|jaipur/i.test(t));
            }
          },
          {
            id: 'job',
            label: 'The job',
            what: 'Says what needs designing',
            tip: 'Say what’s being designed: “packaging for 4 bottles”.',
            test: function (t) {
              return /packag|bottles?|labels?/i.test(t);
            }
          },
          { id: 'audience', tip: 'Add who buys it: “health-conscious families, 28–45”.' },
          { id: 'goal', tip: 'Add the goal: “get listed in premium stores”.' },
          { id: 'constraints', label: 'Rules', tip: 'Add the rules: “Keep the family name. Avoid green leaves and golden drops.”' },
          { id: 'format', tip: 'Say what the brief should include: objective, audience, key message, must-haves, formats, tone, references.' },
          { id: 'questions', bonus: true, w: 0.5, tip: 'Bonus: ask Claude to list the questions you still need to ask the client.' },
          { id: 'role', bonus: true, w: 0.5 }
        ],
        expert:
          'You’re a senior packaging designer. Turn the client message below into a one-page design brief.\n\nThe client: Ghani Oils, a family business in Jaipur making cold-pressed oils. The job: new packaging for 4 bottles (mustard, groundnut, sesame, coconut).\nBuyers: health-conscious families, 28–45, shopping in premium stores and online. Goal: get listed in premium stores, next to imported oils.\nRules: keep the family name. Avoid green leaves and golden oil drops, because every competitor uses them.\n\nThe brief should cover: objective, audience, key message, must-haves, formats, tone and references to look for. Then list the questions we still need to ask the client.\n\nClient message: “Hi! We need new packaging for our cold-pressed oils. Something premium but not boring. Can you share ideas by next week?”',
        expertNote: 'Notice the last line: Claude lists the questions, so you look prepared on the next call.',
        task: 'Write a prompt asking Claude to turn a client’s WhatsApp message into a design brief for Ghani Oils’ new packaging.',
        saveAs: 'design-brief',
        saveTitle: 'Design brief prompt'
      },

      {
        type: 'cards',
        xp: 15,
        eyebrow: 'Prompts to keep',
        title: 'Six prompts for ==real studio work==',
        lede: 'Open each card. Copy the example, then swap in your own client.',
        wide: true,
        cards: [
          {
            icon: 'star',
            title: 'Branding',
            q: 'Names and taglines',
            color: '#e0418b',
            body: 'Get a long list fast, grouped by idea, so you can pick a direction with the client.',
            example: '“Suggest 20 names for [brand], grouped into 4 styles: descriptive, made-up, Indian words, and bold. For each, one line on why it works. Avoid [competitor names].”'
          },
          {
            icon: 'layers',
            title: 'Packaging',
            q: 'Copy for every side of the box',
            color: '#7a4dff',
            body: 'Real words for the front, back and sides, so your layout looks finished from the first draft.',
            example: '“Write the copy for each side of [product]’s box: front (name and one line), back (story in 50 words, how to use), side (key benefits). Leave legal text as [placeholder].”'
          },
          {
            icon: 'grid',
            title: 'Websites',
            q: 'Page plan and headlines',
            color: '#00a3e0',
            body: 'A plan of the pages and the words for each section, before you start the layout.',
            example: '“Plan the home page for [studio or brand]: the sections in order, a headline and one line for each, and the main button. Our visitors are [audience] and the goal is [goal].”'
          },
          {
            icon: 'brief',
            title: 'Presenting work',
            q: 'The story behind each route',
            color: '#00a676',
            body: 'Clear, confident words for why each design works, ready for the presentation.',
            example: '“Here are my 3 logo routes [attach]. Write a short rationale for each: the idea, why it suits [brand], and where it could go next. Plain words, no design jargon.”'
          },
          {
            icon: 'folder',
            title: 'Handover',
            q: 'Specs and file lists',
            color: '#ff7a00',
            body: 'Turn your final design into a checklist for the printer, the developer or the client’s team.',
            example: '“From this design [attach], write a handover sheet: colours, fonts, sizes, and a list of every file to deliver with a clear name for each.”'
          },
          {
            icon: 'wand',
            title: 'Image tools',
            q: 'Prompts for mood images',
            color: '#ff5a36',
            body: 'Claude writes detailed prompts for image tools like ImagineArt or Firefly, matched to your route.',
            example: '“Write 5 image prompts for the [route name] direction: subject, setting, light, colours and mood. Keep them on-brand for [brand].”'
          }
        ]
      },

      {
        type: 'guide',
        xp: 20,
        eyebrow: 'Try it now',
        title: 'Get feedback on ==your own design==',
        lede: 'Pick something you’re working on right now. Open Claude in another tab and follow along.',
        items: [
          { title: 'Take a screenshot', body: 'On a Mac, press **Cmd + Shift + 4** and drag over the design. On Windows, press **Windows + Shift + S**. Crop out anything private.' },
          { title: 'Paste it into Claude', body: 'Click in the message box and press **Cmd + V** (Mac) or **Ctrl + V** (Windows).' },
          {
            title: 'Say who it’s for and what it must do',
            body: 'For example: “This is a [poster, pack, web page] for [client]. It’s for [audience] and must [goal]. Critique it and give me the top 3 fixes.”'
          },
          { title: 'Push back', body: 'If you disagree with a point, say so and why. Ask: “What would you keep exactly as it is?”' },
          { title: 'Decide for yourself', body: 'Keep the comments that make the work better, and ignore the rest. You’re the designer.' }
        ],
        footer: 'Only share client work if the client allows it. When in doubt, ask your manager first.'
      },

      {
        type: 'summary',
        takeaway: 'Your eye decides. ==Claude does the rest.==',
        points: [
          'Hand Claude the briefs, the words, the lists and the first round of comments.',
          'Name the clichés to avoid, and you’ll get directions worth sketching.',
          'Paste a screenshot to get an honest critique of your work.',
          'People check names, claims and final files before they go out.'
        ]
      }
    ]
  };
})();
