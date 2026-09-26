/* Level 3 — Make Claude work like an employee */
(function () {
  'use strict';
  var PU = window.PU;

  PU.levels[3] = {
    id: 'L3',
    num: 3,
    color: 'var(--sw-3)',
    title: 'Make Claude ==work like an employee==',
    short: 'Make Claude work like an employee',
    tagline: 'Stop ordering outputs. Assign a process.',
    deliverable: 'Thinking, not just output',
    learn: [
      'The 6-step workflow: Task, Analyse, Think, Create, Critique, Improve',
      'Ready-made workflows for 13 everyday agency jobs',
      'How to give feedback that actually improves the next draft'
    ],
    steps: [
      { type: 'intro' },

      {
        type: 'compare',
        eyebrow: 'Vending machine vs employee',
        title: 'Stop asking for ==one output== at a time.',
        lede: 'You wouldn’t ask a strategist for “10 ideas” with no thinking first. Don’t ask Claude either.',
        cols: [
          {
            tag: 'Vending machine',
            kind: 'bad',
            prompt: 'Give me 10 Instagram ideas.',
            result: '10 random ideas. You pick one and hope.'
          },
          {
            tag: 'Employee',
            kind: 'good',
            prompt: 'Analyse the brand → find audience insights → spot the content gaps → generate concepts → rank them against our criteria → turn the top 3 into scripts.',
            result: 'Ideas with reasons behind them. Ranked. Ready to present.'
          }
        ],
        callout: {
          title: 'Ask for the thinking first. The output gets ==smarter==.',
          text: 'Same as a good strategist: research, insight, ideas, then quality control.'
        }
      },

      {
        type: 'flow',
        xp: 30,
        eyebrow: 'The workflow',
        title: 'Task → Analyse → Think → Create → Critique → ==Improve==',
        lede: 'Tap each step, or run the whole thing. The example: a month of content for Pulse Studio, a boutique fitness studio in Pune.',
        nodes: [
          {
            title: 'Task',
            short: 'Set the job',
            does: 'Say what you need and what success looks like.',
            prompt: 'We need a month of Instagram content for Pulse Studio, a boutique fitness studio in Pune. Goal: 40 trial class bookings.',
            sample: 'Got it: one month of content, measured by trial class bookings. I’ll start by looking at what’s already working.'
          },
          {
            title: 'Analyse',
            short: 'Look before leaping',
            does: 'Have Claude study the real material first.',
            prompt: 'First, analyse the attached last 20 posts and top 50 comments. What gets saves and shares? What do people ask about?',
            sample:
              '- Posts featuring a trainer’s face get about **2x more saves** than equipment shots.\n- The most common question in the comments: **“Is it OK for beginners?”** (asked 14 times).\n- Timetable posts get the fewest likes but the most link clicks.'
          },
          {
            title: 'Think',
            short: 'Find the insight',
            does: 'Ask for the insight before the ideas.',
            prompt: 'Based on that, what’s the biggest content gap and the most useful insight about our audience?',
            sample: '**Insight:** beginners want to join but feel intimidated. Almost no fitness brand in Pune talks to them directly.\n\n**Gap:** there’s no “your first class” content anywhere on the account.'
          },
          {
            title: 'Create',
            short: 'Now make things',
            does: 'Generate options built on the insight.',
            prompt: 'Generate 12 post concepts that use this insight, across Reels, carousels and stories.',
            sample:
              '1. **Your first class, minute by minute** (Reel)\n2. **Things beginners worry about that trainers don’t care about** (carousel)\n3. **Meet the trainer who’ll be nicest to you** (Reel)\n4. **Motivation Monday quote** (static)\n\n…plus 8 more.'
          },
          {
            title: 'Critique',
            short: 'Judge it harshly',
            does: 'Make Claude score its own work against your criteria.',
            prompt: 'Score each concept 1–5 on insight, brand fit and effort to produce. Be harsh. Cut anything generic.',
            sample:
              '- **Motivation Monday quote: 1/5.** Generic, any gym could post it. Cut.\n- **Your first class, minute by minute: 5/5.** Answers the beginner fear directly. Easy to shoot.\n- **Things beginners worry about: 5/5.** Very saveable.'
          },
          {
            title: 'Improve',
            short: 'Polish the winners',
            does: 'Develop only the best ideas.',
            prompt: 'Take the top 3 and write full Reel scripts: hook, shots, on-screen text and caption.',
            sample:
              '**Script 1: Your first class, minute by minute**\n\n**Hook (0–3s):** “Scared of your first class? Here’s exactly what happens.”\n**Shots:** arrival and welcome → warm-up with a trainer demo → the “you can stop anytime” moment → high five at the end.\n**On-screen text:** “Minute 0: someone learns your name.”'
          }
        ],
        combined:
          'We need a month of Instagram content for Pulse Studio, a boutique fitness studio in Pune. Goal: 40 trial class bookings.\n\nWork through this step by step and show your thinking before the final output:\n1. Analyse the attached last 20 posts and top comments. What gets saves and shares? What do people ask about?\n2. Tell me the biggest content gap and the most useful audience insight.\n3. Generate 12 concepts that use this insight (a mix of Reels, carousels and stories).\n4. Score each 1–5 on insight, brand fit and effort. Be harsh. Cut anything generic.\n5. Write full scripts for the top 3: hook, shots, on-screen text and caption.',
        tip: 'Send it as one message, or one step at a time so you can steer. For big or important work, go step by step.'
      },

      {
        type: 'library',
        xp: 15,
        eyebrow: 'Workflow library',
        title: 'Workflows for real ==agency work==',
        lede: 'Pick any task. Each comes as a ready-made workflow you can copy. Open at least two.',
        footer: 'Swap the [brackets] for your client’s details. The steps stay the same.',
        items: [
          {
            title: 'Social media strategy',
            task: 'Build a 3-month social media strategy for [client]. Goal: [goal].',
            analyse: 'Review the attached brand guide, audience notes and last 30 posts. What’s working, what isn’t, and why?',
            think: 'What does our audience actually need from this brand on social? Give me 3 insights.',
            create: 'Propose 4 content pillars and a posting rhythm for each platform.',
            critique: 'Stress-test the pillars. Which ones could any competitor run? Replace those.',
            improve: 'Turn the final plan into a one-page summary for the client.'
          },
          {
            title: 'Content calendar',
            task: 'Plan next month’s content calendar for [client] on [platforms].',
            analyse: 'List the key dates, launches and cultural moments this month that matter to this audience.',
            think: 'Map each week to one content pillar and one business goal.',
            create: 'Build the calendar as a table: date, platform, format, pillar, hook, call to action.',
            critique: 'Check for repetition, too many product posts and gaps in formats.',
            improve: 'Fix the issues and add 3 backup posts for slow weeks.'
          },
          {
            title: 'Ad copy',
            task: 'Write Meta ad copy for [product] aimed at [audience]. Goal: [purchases or leads].',
            analyse: 'From the attached reviews, pull out the top 5 reasons people buy and the top 3 objections.',
            think: 'Pick 4 distinct angles: pain, aspiration, social proof and offer.',
            create: 'Write 3 variations per angle: primary text, headline (under 40 characters) and call to action.',
            critique: 'Flag anything that sounds like every other ad in the category, or makes a claim we can’t back up.',
            improve: 'Rewrite the flagged ones and rank the top 5 to test first.'
          },
          {
            title: 'Competitor research',
            task: 'Understand how [3 competitors] show up on Instagram and where [client] can win.',
            analyse: 'Here are screenshots of their last 12 posts each. Summarise their formats, topics, tone and how often they post.',
            think: 'What is everyone doing the same? What is nobody doing?',
            create: 'Propose 3 content territories [client] could own.',
            critique: 'For each territory, what’s the risk and how hard is it to execute?',
            improve: 'Turn the best one into a slide: headline, 3 proof points and 2 example posts.'
          },
          {
            title: 'Client presentation',
            task: 'Build the storyline for [client]’s quarterly review deck.',
            analyse: 'From the attached results, find the 3 most important things that happened and why.',
            think: 'What does the client most need to believe by the end of this meeting?',
            create: 'Draft a 10-slide storyline: each slide’s title as a full sentence, the key point and a visual idea.',
            critique: 'Read it as the client’s CEO. Where would you get bored or push back?',
            improve: 'Tighten it to 8 slides and write speaker notes for the tough ones.'
          },
          {
            title: 'Proposal',
            task: 'Draft a proposal for [prospect] based on the attached call notes.',
            analyse: 'Pull out their stated goals, unstated worries, budget signals and who makes the decision.',
            think: 'What’s the one insight about their business that would make them say “they get us”?',
            create: 'Draft the proposal: insight, approach, deliverables, timeline, team and investment.',
            critique: 'Review it as a skeptical procurement head. What’s vague or missing?',
            improve: 'Fix those gaps and write a 3-line executive summary.'
          },
          {
            title: 'Sales email',
            task: 'Write a cold email to [name], [role] at [company].',
            analyse: 'Here’s their website copy and last 10 LinkedIn posts. What are they focused on right now?',
            think: 'What’s a specific, relevant reason for us to reach out now?',
            create: 'Write 3 versions under 90 words, each with a different opening line.',
            critique: 'Which version sounds like a template? Which one would you reply to?',
            improve: 'Polish the best one and write a 2-line follow-up for day 5.'
          },
          {
            title: 'Market research',
            task: 'Research the [category] market in [country] for a pitch to [client].',
            analyse: 'Search the web for recent reports and news. List the key facts, each with a source and date.',
            think: 'Separate facts from opinions. What are the 3 biggest shifts?',
            create: 'Write a one-page market snapshot with what it means for [client].',
            critique: 'Flag any number you’re unsure about or that has no reliable source.',
            improve: 'Remove or verify the flagged items and add a “so what” line to each section.'
          },
          {
            title: 'Campaign ideas',
            task: 'Generate campaign ideas for [brand]’s [launch or moment]. Goal: [goal].',
            analyse: 'From the brief, name the audience tension and the product truth.',
            think: 'Write 5 possible insights that connect the two.',
            create: 'For the 2 strongest insights, generate 10 one-line campaign ideas each.',
            critique: 'Score each on originality, brand fit and budget. Cut anything we’ve seen before.',
            improve: 'Develop the top 3 into mini concepts: name, big idea and 3 executions.'
          },
          {
            title: 'Website copy',
            task: 'Rewrite the homepage for [client].',
            analyse: 'Here’s the current homepage text and 20 customer reviews. What do customers say that the website doesn’t?',
            think: 'Define the one message the homepage must land, and for whom.',
            create: 'Write it section by section: hero, proof, benefits, how it works, FAQ, call to action.',
            critique: 'Check it against the brand voice guide. Mark every line that sounds generic.',
            improve: 'Rewrite the marked lines and give me 3 hero headline options.'
          },
          {
            title: 'Creative brief',
            task: 'Turn the client’s email (pasted below) into a creative brief for our design team.',
            analyse: 'Pull out the objective, audience, deliverables, must-haves and deadline. List anything missing.',
            think: 'What’s the single-minded message?',
            create: 'Write the brief: background, objective, audience, message, tone, must-haves, deliverables, timeline.',
            critique: 'Would a designer know exactly what to make? What would they ask?',
            improve: 'Answer those questions in the brief, or list them for the client.'
          },
          {
            title: 'Client report',
            task: 'Write the monthly performance report for [client].',
            analyse: 'From the attached exports, calculate month-on-month changes for the key numbers.',
            think: 'What are the 3 things the client needs to know, and why did they happen?',
            create: 'Write the report: summary, wins, concerns, what we’ll change next month.',
            critique: 'Check every number against the data. Flag anything that sounds like an excuse.',
            improve: 'Tighten the summary to 5 lines a busy client will actually read.'
          },
          {
            title: 'Meeting prep',
            task: 'Prep me for tomorrow’s meeting with [client] about [topic].',
            analyse: 'Here are the last 3 email threads and meeting notes. What’s still unresolved?',
            think: 'What will the client probably ask or push back on?',
            create: 'Give me an agenda, 5 likely questions with suggested answers, and the decisions we need.',
            critique: 'What’s the riskiest moment in this meeting, and how do I handle it?',
            improve: 'Condense everything into a one-page cheat sheet I can read in 3 minutes.'
          }
        ]
      },

      {
        type: 'order',
        xp: 25,
        seed: 5,
        eyebrow: 'Your turn',
        title: 'Put this workflow ==in order==',
        task: '**The job:** competitor research for Luma Skin. Tap the steps in the order you’d run them.',
        items: [
          'Collect: screenshots of 3 competitors’ last 12 posts',
          'Analyse: summarise their formats, topics and tone',
          'Think: what is everyone doing? What is nobody doing?',
          'Create: propose 3 content territories Luma could own',
          'Critique: rate each territory on risk and effort',
          'Improve: turn the winner into a pitch-ready slide'
        ],
        success: 'Perfect. Collect, analyse, think, create, critique, improve. That rhythm works for almost any job.'
      },

      {
        type: 'chat',
        xp: 15,
        eyebrow: 'The critique trick',
        title: 'Claude is a better ==editor== than first-draft writer.',
        lede: 'Watch what happens when you ask it to judge its own work.',
        turns: [
          { role: 'user', text: 'Write a tagline for Pulse Studio’s beginner classes.' },
          { role: 'claude', text: '**Unleash your inner strength at Pulse Studio!** 💪' },
          {
            role: 'user',
            send: 'Ask for a critique',
            text: 'Critique that like a harsh creative director. What’s generic? What would a nervous 30-something beginner in Pune think?'
          },
          {
            role: 'claude',
            text:
              'Honestly, it’s weak.\n\n- **“Unleash your inner strength”** is one of the most overused lines in fitness. It could be any gym.\n- **It talks to people who already feel strong.** Beginners feel nervous, not powerful.\n- **The emoji adds nothing.**\n\nA beginner would scroll past it. It doesn’t answer their real worry: “Will I look stupid?”'
          },
          { role: 'user', send: 'Ask for better options', text: 'Good. Now write 5 better options that fix those problems.' },
          {
            role: 'claude',
            text:
              '1. **Nobody here was good at this on day one.**\n2. **Your first class is for learning, not performing.**\n3. **Come as you are. Leave a little stronger.**\n4. **Zero experience needed. Seriously.**\n5. **The friendliest hard workout in Pune.**'
          }
        ],
        callout: { title: 'Never accept the first draft. Ask Claude to ==critique it==, then improve it.' }
      },

      {
        type: 'quiz',
        xp: 20,
        eyebrow: 'Feedback like a creative director',
        title: 'Claude’s draft is close. Which reply gets the best second draft?',
        options: [
          { label: '“Make it better.”', why: 'Better how? Claude has to guess again.' },
          { label: '“Not quite. Make it more exciting and engaging!!”', why: 'Adjectives, not directions. You’ll get more exclamation marks.' },
          {
            label: '“Option 2 is closest. Keep its opening line, cut the emojis, make the call to action about weekend brunch, and give me 3 variations.”',
            correct: true,
            why: 'It says what to keep, what to change and what to hand back.'
          },
          { label: '“Start over.”', why: 'You throw away what was working.' }
        ],
        explain: '**Specific feedback gets specific improvements.** Say what to keep, what to change, and what you want back.'
      },

      {
        type: 'summary',
        takeaway: 'Don’t ask for outputs. ==Assign a process.==',
        points: ['Analyse → Think → Create → Critique → Improve.', 'Always ask Claude to critique its own draft.', 'Feedback formula: keep this, change that, give me X.']
      }
    ]
  };
})();
