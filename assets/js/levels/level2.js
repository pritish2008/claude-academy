/* Level 2 — Think in context, not questions */
(function () {
  'use strict';
  var PU = window.PU;

  PU.levels[2] = {
    id: 'L2',
    num: 2,
    color: 'var(--sw-2)',
    title: 'Think in ==context==, not questions',
    short: 'Think in context, not questions',
    tagline: 'Don’t make Claude guess. Give it what a new hire would need.',
    deliverable: 'Answers that sound like they came from inside the account',
    learn: ['Why vague prompts get generic answers', 'The kinds of context that change everything', 'The “interview me” trick for when you don’t know what to say'],
    steps: [
      { type: 'intro' },

      {
        type: 'guesses',
        xp: 5,
        eyebrow: 'Why answers go generic',
        title: 'Every gap in your prompt gets filled with a ==guess==.',
        lede: 'Here’s the most common prompt in any agency. Look at what Claude has to guess.',
        prompt: 'Make this better.',
        guesses: [
          'Better how? Shorter? Funnier?',
          'Better for who?',
          'Which platform is this for?',
          'What’s the brand voice?',
          'What did the client hate last time?',
          'Is “better” more sales or more likes?',
          'What is “this” even for?'
        ],
        reply: 'Here’s a more polished version! ✨ I’ve tightened the wording, added some energy and included a call to action to boost engagement. 🚀',
        caption: 'When Claude has to guess, it picks the safest, most average answer. That’s where “generic” comes from.'
      },

      {
        type: 'compare',
        eyebrow: 'Same request, with context',
        title: 'Don’t make Claude ==guess==.',
        lede: 'Here’s the same request, once as a question and once as a brief.',
        cols: [
          {
            tag: 'Bad',
            kind: 'bad',
            prompt: 'Make this better.',
            result: '“I’ve tightened the wording and added some emojis for engagement! 🚀”'
          },
          {
            tag: 'Good',
            kind: 'good',
            prompt: 'Here is our client’s current Instagram strategy, target audience, previous 10 posts and brand guidelines. Identify what’s weak and propose improvements.',
            result:
              '“Three things are holding this account back. **1.** 7 of your last 10 posts are product shots with no hook in the first line. **2.** Your audience is 28–40 working parents, but you post at 11 am when they’re at work. **3.** The brand guide says ‘expert but warm’, but the captions read corporate…”'
          }
        ],
        callout: { title: 'Context turns Claude from a stranger into ==someone who knows the account==.' }
      },

      {
        type: 'multi',
        xp: 30,
        eyebrow: 'Pack the briefing kit',
        title: 'What would you give Claude?',
        lede: 'You need next month’s content plan for Luma Skin, a skincare client. Pick everything that would genuinely help.',
        columns: '280px',
        options: [
          { label: 'Brand guidelines and tone-of-voice doc', status: 'correct', why: 'Keeps everything on-brand.' },
          { label: 'A short description of the target audience', status: 'correct', why: 'Who it’s for changes every idea.' },
          { label: 'Last month’s top 5 and bottom 5 posts, with numbers', status: 'correct', why: 'Past work shows what actually works.' },
          { label: 'Next month’s launches and key dates', status: 'correct', why: 'The plan has to fit the calendar.' },
          { label: '3 competitor posts the client loved', status: 'correct', why: 'References show what “good” means to this client.' },
          { label: 'The client’s no-go list: words, claims, topics', status: 'correct', why: 'Rules save you a round of revisions.' },
          { label: '“MAKE IT VIRAL” in capital letters', status: 'wrong', why: 'Shouting adds no information.' },
          { label: 'Telling Claude it’s the best AI in the world', status: 'wrong', why: 'Flattery adds no facts.' },
          { label: 'Your entire 3-year email history with the client', status: 'wrong', why: 'Too much noise. Pick what’s relevant to this task.' },
          { label: '“Be creative”', status: 'wrong', why: 'Claude already tries. Tell it what creative means for this brand.' }
        ],
        perfect: 'Perfect kit. Background, audience, past work, dates, references and rules. That’s a brief a senior strategist would be happy to get.'
      },

      {
        type: 'contextsim',
        xp: 40,
        eyebrow: 'Watch context work',
        title: 'Add context. Watch the answer ==improve==.',
        lede: 'The job: an email to a client whose campaign underperformed. Press “Add context” five times.',
        base: 'Write an email to the client about the campaign results.',
        contexts: [
          {
            label: 'The numbers',
            text: 'It’s Luma Skin’s October Meta campaign. Target: 1,200 purchases. We got 740. Click-through fell from 1.8% to 0.9% in week 2, and ad costs rose 40% during the festive season.'
          },
          {
            label: 'Who’s reading',
            text: 'It goes to Ananya, Luma’s Head of Marketing. She’s numbers-driven, short on time, and her CEO is already asking questions.'
          },
          {
            label: 'What we found',
            text: 'Our analysis: we ran the same 3 ads all month and they wore out by week 2. Retargeting still returned ₹4.10 for every ₹1 spent.'
          },
          {
            label: 'Your goal',
            text: 'Keep her trust, own the mistake, and get approval for a 2-week test with 6 new ads and a ₹2 lakh budget.'
          },
          {
            label: 'Tone & format',
            text: 'Honest, not defensive. No jargon. Under 170 words, max 3 bullets, and end with one clear yes/no question.'
          }
        ],
        quality: [12, 30, 48, 66, 82, 96],
        versions: [
          'Subject: Campaign update\n\nDear Client,\n\nI hope this email finds you well. I wanted to reach out regarding the recent campaign results. While the campaign faced some challenges, there were also valuable learnings. We remain committed to your success and look forward to discussing next steps.\n\nBest regards',
          'Subject: October campaign results\n\nHi,\n\nThe October campaign delivered 740 purchases against a target of 1,200. Click-through dropped from 1.8% to 0.9% in week 2, and ad costs rose 40% during the festive season.\n\nWe apologise for the shortfall and are reviewing what went wrong. We’ll share more soon.\n\nRegards',
          'Subject: October results: 740 purchases vs 1,200 target\n\nHi Ananya,\n\nQuick version for you and your CEO: we delivered 740 purchases against a target of 1,200.\n\nTwo things drove the gap. Click-through halved in week 2 (1.8% to 0.9%), and festive-season ad costs rose 40%.\n\nWe’re looking into the cause and will come back with a plan.\n\nBest,\nRohan',
          'Subject: October results: 740 vs 1,200, and what happened\n\nHi Ananya,\n\nWe delivered 740 purchases against a target of 1,200. Here’s why:\n\n- **Worn-out ads:** we ran the same 3 ads all month. By week 2, click-through had halved (1.8% to 0.9%).\n- **Festive costs:** ad costs rose 40% across the category.\n- **What worked:** retargeting returned ₹4.10 for every ₹1 spent.\n\nWe’ll come back with a recovery plan.\n\nBest,\nRohan',
          'Subject: October results + a 2-week fix\n\nHi Ananya,\n\nWe delivered 740 purchases against a target of 1,200. That’s on us, and here’s what happened:\n\n- **Worn-out ads:** we ran the same 3 ads all month. By week 2, click-through had halved (1.8% to 0.9%). We should have rotated sooner.\n- **Festive costs:** ad costs rose 40% across the category.\n- **What worked:** retargeting returned ₹4.10 for every ₹1 spent. We’ll keep it running.\n\n**Our proposal:** a 2-week test with 6 new ads and a ₹2 lakh budget, rotating weekly.\n\nCan we get your approval to start?\n\nBest,\nRohan',
          'Subject: October results + a 2-week fix (need your OK by Thursday)\n\nHi Ananya,\n\nStraight answer first: we delivered 740 purchases against a target of 1,200. That’s on us, and here’s what happened.\n\n- **Worn-out ads:** we ran the same 3 ads all month. By week 2, click-through had halved (1.8% to 0.9%). We should have rotated sooner.\n- **Festive costs:** ad costs rose 40% across the category.\n- **What worked:** retargeting returned ₹4.10 for every ₹1 spent. We’ll keep it running.\n\n**Our proposal:** a 2-week test with 6 new ads and a ₹2 lakh budget, rotating weekly, with a check-in after week 1.\n\nCan we start the test on Monday? A yes or no by Thursday keeps us on schedule.\n\nBest,\nRohan'
        ],
        callout: {
          eyebrow: 'Same Claude',
          title: 'Five extra sentences. That’s the ==whole trick==.',
          text: 'None of that context was hard to write. You already knew all of it. Claude didn’t.'
        }
      },

      {
        type: 'cards',
        xp: 10,
        eyebrow: 'Getting context fast',
        title: 'Where to get context in ==30 seconds==',
        lede: 'You don’t need to type essays. Open each card.',
        wide: true,
        cards: [
          {
            icon: 'clipboard',
            title: 'Paste the brief',
            q: 'Emails, briefs, meeting notes',
            color: '#2e3bff',
            body: 'Paste them as they are. Messy is fine. Claude is good at finding what matters.'
          },
          {
            icon: 'file',
            title: 'Upload files',
            q: 'PDFs, decks, spreadsheets, docs',
            color: '#e0418b',
            body: 'Drag them into the chat. Claude reads PDFs, Word, PowerPoint, Excel and CSV files.'
          },
          {
            icon: 'image',
            title: 'Drop a screenshot',
            q: 'Faster than describing anything',
            color: '#00a3e0',
            body: 'Analytics, a competitor’s grid, a design draft. Remove personal details first.'
          },
          {
            icon: 'chat',
            title: 'Brain dump',
            q: 'Type or dictate for 2 minutes',
            color: '#00a676',
            body: 'Everything in your head, in any order. Claude turns mess into structure. On your phone, you can just talk.'
          },
          {
            icon: 'star',
            title: 'Show past work',
            q: '“Here’s what the client approved”',
            color: '#e89a00',
            body: 'Paste 3 captions the client loved and say “match this style”. One example beats a paragraph of adjectives.'
          },
          {
            icon: 'users',
            title: 'Let Claude interview you',
            q: 'When you don’t know what to say',
            color: '#7a4dff',
            body: 'Ask: “Before you start, ask me the 5 questions you most need answered.” The next step shows how.'
          }
        ]
      },

      {
        type: 'chat',
        xp: 10,
        eyebrow: 'The interview trick',
        title: 'Don’t know what context to give? ==Ask Claude.==',
        lede: 'Press Send and see what Claude asks for.',
        turns: [
          {
            role: 'user',
            text: 'I need a launch plan for Luma Skin’s new sunscreen. Before you start, ask me the 5 questions you most need answered to do this brilliantly.'
          },
          {
            role: 'claude',
            text:
              'Happy to. Five questions first:\n\n1. **Who is it for?** Existing Luma customers, new buyers, or both? Any age range or skin type to focus on?\n2. **What makes it different?** Texture, SPF level, no white cast, price? What’s the one thing people should remember?\n3. **What does success look like?** First-month sales, reviews, awareness, retail listings?\n4. **Budget and channels?** Paid social only, or influencers, retail and email too?\n5. **Any no-gos?** Claims legal won’t allow, competitors not to mention, words the brand avoids?\n\nAnswer in any order. Rough notes are fine.'
          },
          {
            role: 'user',
            send: 'Send my answers',
            text: '1. Both, mostly 22–35 with sensitive skin. 2. Gel texture, no white cast. 3. 5,000 units in month one. 4. ₹15 lakh, paid social plus 10 creators. 5. No “sunburn-proof” or medical claims.'
          },
          {
            role: 'claude',
            text:
              'Perfect, that’s everything I need. Here’s the shape of the plan:\n\n**Big idea:** “Sunscreen you’ll actually wear.” We lead with the gel texture and no white cast, the two biggest reasons people skip SPF.\n\n**Weeks 1–2:** 10 creators with sensitive skin do a 7-day wear test on Reels.\n**Weeks 2–4:** paid social built from the best creator clips, aimed at 22–35 skincare buyers.\n**Always on:** retargeting with reviews, and a bundle offer for existing customers.\n\nWant the full plan with the budget split and a week-by-week calendar?'
          }
        ],
        callout: { title: 'Rough answers to good questions beat a ==polished guess==.' }
      },

      {
        type: 'quiz',
        xp: 20,
        eyebrow: 'Relevant, not random',
        title: 'Which prompt gets the better proposal intro?',
        options: [
          {
            label:
              '“Our agency has won lots of awards. We have a great team, a lovely office and happy clients across India. Write a proposal intro for a real estate client.”',
            why: 'Lots of words about you, nothing about the client or what the intro must do.'
          },
          {
            label:
              '“Write a proposal intro for Orbit Realty, a Pune developer launching premium 3BHKs for young families. They told us their last agency ‘never understood the buyer’. Open with a sharp insight about first-time family homebuyers. 120 words, confident, no clichés.”',
            correct: true,
            why: 'Relevant context: who they are, what worries them, what the intro must do.'
          }
        ],
        explain: 'More context isn’t always better. **Relevant** context is. Ask yourself: would a new hire need this to do the job?'
      },

      {
        type: 'summary',
        takeaway: 'Don’t make Claude guess. Brief it like a ==new hire== on day one.',
        points: [
          'Give background, examples, past work, audience, goal, rules and references.',
          'Messy context beats no context. Paste it, upload it, screenshot it.',
          'Stuck? Ask Claude to interview you first.'
        ]
      }
    ]
  };
})();
