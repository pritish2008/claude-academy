/* Level 4 — Claude for your actual job */
(function () {
  'use strict';
  var PU = window.PU;

  var DEPARTMENTS = [
    {
      key: 'social',
      label: 'Social media',
      icon: 'hash',
      color: '#e0418b',
      blurb: 'From messy ideas to a month of on-brand posts.',
      items: [
        {
          title: 'Turn raw ideas into content pillars',
          desc: 'Got a messy list of ideas? Claude groups them into clear pillars.',
          template:
            'You’re a social media strategist. Here are my raw content ideas for [brand]: [paste ideas]. Group them into 3–5 content pillars. For each pillar give me a name, what it’s for, 3 example posts and how often to post it. Audience: [audience].'
        },
        {
          title: 'Analyse competitors’ content',
          desc: 'See what everyone else is doing, and what nobody is.',
          template:
            'Here are screenshots of the last 12 posts from [competitor 1], [competitor 2] and [competitor 3]. Compare their formats, topics, tone and hooks. Then tell me 3 things none of them are doing that [brand] could own.',
          tip: 'Screenshots of their grids work better than describing them.'
        },
        {
          title: 'Create a content calendar',
          desc: 'A month of posts in a table you can hand to the team.',
          template:
            'Plan [month]’s Instagram calendar for [brand]. Pillars: [pillars]. Key dates: [launches, festivals]. [Number] posts per week. Give me a table: date, format, pillar, hook, caption idea, call to action.'
        },
        {
          title: 'Write captions in the brand’s voice',
          desc: 'Teach Claude the voice with examples, then write more.',
          template:
            'Here are 5 captions [brand] loved: [paste]. Study the voice: length, rhythm, humour, emoji use. Now write 5 captions in exactly that voice for [post topic].'
        },
        {
          title: 'Turn one post into ten',
          desc: 'Repurpose your best performer into every format.',
          template:
            'Here’s our best-performing post: [paste]. Turn it into a carousel outline, a Reel script, 3 story frames, a LinkedIn version and 3 short text versions. Keep the core message, adapt the format.'
        }
      ]
    },
    {
      key: 'content',
      label: 'Content',
      icon: 'type',
      color: '#2e3bff',
      blurb: 'Blogs, newsletters, scripts and everything in between.',
      items: [
        {
          title: 'Brain dump to blog outline',
          desc: 'Talk it out messily, get a clean structure back.',
          template:
            'Here’s my messy brain dump about [topic]: [paste]. Turn it into a clear blog outline for [audience]: a strong title, section headings and the key point of each section. Flag any gaps in my thinking.'
        },
        {
          title: 'Edit to the style guide',
          desc: 'Consistent voice without a manual line edit.',
          template: 'Here’s our style guide: [paste or attach]. Edit this draft to match it: [paste draft]. List the changes you made, then give me the clean version.'
        },
        {
          title: 'Headline and hook variations',
          desc: 'Fifteen angles in seconds, with the best ones marked.',
          template:
            'Write 15 headline options for [piece] aimed at [audience]. Use 5 different angles: curiosity, benefit, number, contrarian, story. Mark your top 3 and say why.'
        },
        {
          title: 'SEO content brief',
          desc: 'A writer-ready brief built around a keyword.',
          template:
            'Create a content brief for a blog targeting “[keyword]” for [audience]. Include the search intent, a suggested title, an outline, the questions to answer and internal link ideas.',
          tip: 'Claude doesn’t have live search volumes. Check those in your SEO tool.'
        },
        {
          title: 'Repurpose long content',
          desc: 'A webinar or podcast becomes a month of posts.',
          template:
            'Here’s the transcript of our [webinar or podcast]: [paste]. Pull out 10 standalone insights. For each, write a LinkedIn post under 120 words in [brand]’s voice.'
        }
      ]
    },
    {
      key: 'design',
      label: 'Design',
      icon: 'palette',
      color: '#7a4dff',
      blurb: 'Claude won’t replace your eye. It makes briefs and feedback painless.',
      items: [
        {
          title: 'Turn a vague request into a design brief',
          desc: 'From “can you make something nice” to a real brief.',
          template:
            'The client said: “[paste client message]”. Turn this into a clear design brief: objective, audience, key message, must-haves, formats and sizes, tone, and references to look for. List the questions we still need to ask.'
        },
        {
          title: 'Decode feedback like “make it pop”',
          desc: 'Translate client-speak into actual design changes.',
          template:
            'The client’s feedback on this design is: “[feedback]”. [Attach a screenshot of the design.] Translate it into 5 specific, actionable design changes, and explain each one in a line I can share with the client.'
        },
        {
          title: 'Critique a layout from a screenshot',
          desc: 'A second pair of eyes before the client sees it.',
          template:
            '[Attach a screenshot.] Critique this [social post, banner or landing page] for hierarchy, readability, brand fit and how clear the call to action is. Be specific and prioritise the top 3 fixes.'
        },
        {
          title: 'Art direction options',
          desc: 'Distinct directions to explore before you open your design tool.',
          template:
            'Give me 3 distinct art directions for [campaign]. For each: a name, the mood in 5 words, a colour palette, typography feel, photography style, and 5 search terms to find reference images.'
        },
        {
          title: 'Write prompts for image tools',
          desc: 'Claude doesn’t make photos, but it writes great prompts for the tools that do.',
          template:
            'I need visuals for [concept]. Write 5 detailed prompts for an AI image tool, covering subject, setting, lighting, lens, mood and colours. Keep them on-brand for [brand], whose look is [describe].'
        }
      ]
    },
    {
      key: 'video',
      label: 'Video',
      icon: 'video',
      color: '#ff5a36',
      blurb: 'Scripts, shot lists and hooks, ready before the shoot.',
      items: [
        {
          title: 'Reel scripts with hooks',
          desc: 'Scripts with the first 3 seconds nailed.',
          template:
            'Write 3 Reel scripts for [brand] about [topic]. Each under [30] seconds: hook (first 3 seconds), shot-by-shot outline, on-screen text, voiceover and caption. Audience: [audience].'
        },
        {
          title: 'Shot lists and storyboards',
          desc: 'Turn a script into a plan the shoot team can follow.',
          template:
            'Turn this script into a shot list table: shot number, shot type, what’s in frame, camera movement, duration, props and notes for the shoot day. Script: [paste].'
        },
        {
          title: 'Find clips in long videos',
          desc: 'Mine interviews and events for short-form moments.',
          template:
            'Here’s the transcript of our [interview or event video], with timestamps: [paste]. Find 5 moments that would work as standalone short clips. Give me the timestamps, a hook line and why each works.',
          tip: 'Claude can’t watch video files, so give it the transcript.'
        },
        {
          title: 'First-3-seconds hooks',
          desc: 'Fifteen ways to stop the scroll.',
          template: 'Give me 15 hook ideas for the first 3 seconds of a Reel about [topic] for [audience]. Mix visual hooks, text hooks and spoken hooks. No clickbait.'
        },
        {
          title: 'Subtitles and translations',
          desc: 'Clean captions and natural-sounding regional versions.',
          template:
            'Clean up these auto-generated subtitles: fix errors, keep lines under 42 characters and don’t change the meaning. Then translate them into [language] in a natural spoken style. Subtitles: [paste].',
          tip: 'Have a native speaker check translations before they go live.'
        }
      ]
    },
    {
      key: 'ads',
      label: 'Performance ads',
      icon: 'trend',
      color: '#00a676',
      blurb: 'More variations, faster analysis, cleaner reporting.',
      items: [
        {
          title: 'Ad copy by angle',
          desc: 'Structured variations you can actually test.',
          template:
            'Write Meta ad copy for [product] aimed at [audience]. Use 4 angles: pain point, aspiration, social proof and offer. 3 variations each: primary text (under 125 characters), headline (under 40) and call to action.'
        },
        {
          title: 'Make sense of campaign exports',
          desc: 'Upload the export, get the story behind the numbers.',
          template:
            '[Attach the campaign export.] Which ads, audiences and placements are working, and which are wasting money? Show the numbers behind each point, then recommend 3 changes.'
        },
        {
          title: 'A/B test plans',
          desc: 'Tests with a clear hypothesis, not random tweaks.',
          template:
            'Plan 3 A/B tests for [campaign]. For each: the hypothesis, what we change, what stays the same, the success metric, the budget split and how long to run it.'
        },
        {
          title: 'Audience angles',
          desc: 'New segments and the message that fits each one.',
          template:
            'For [product], list 8 different audience segments we could target. For each: who they are, what they care about, the message that would work, and one ad hook.'
        },
        {
          title: 'Weekly performance summaries',
          desc: 'Raw numbers in, client-friendly update out.',
          template:
            'Here are this week’s numbers: [paste]. Write a client-friendly summary: 3 bullets on what happened, 1 on why, 1 on what we’ll do next. Plain English, no jargon, under 100 words.'
        }
      ]
    },
    {
      key: 'web',
      label: 'Web & SEO',
      icon: 'layers',
      color: '#3f7cff',
      blurb: 'Pages people find, read and act on.',
      items: [
        {
          title: 'Keyword ideas by search intent',
          desc: 'What people search for, grouped by what they want.',
          template:
            'You’re an SEO strategist. Our client is [brand], a [type of business] in [city or market]. Their customers are [audience]. List 30 keyword ideas they could realistically rank for, grouped by search intent: informational, commercial and local. For each group, suggest one page or article to create. Don’t invent search volumes; mark anything we should check in an SEO tool.',
          tip: 'Claude can’t see real search volumes. Check the shortlist in your SEO tool.'
        },
        {
          title: 'SEO content brief',
          desc: 'Everything a writer needs to rank, on one page.',
          template:
            'Write a content brief for an article targeting “[main keyword]” for [brand]. Include: the search intent, a title (max 60 characters), a meta description (max 155 characters), an H2/H3 outline, the questions to answer, internal links to [pages], and what would make it better than the current top results. Audience: [audience].'
        },
        {
          title: 'Meta titles and descriptions',
          desc: 'Unique, keyword-first and within the limits.',
          template:
            'Write a title tag (max 60 characters) and a meta description (max 155 characters) for each page below. Put the main keyword near the start, make each one unique, and write in [brand]’s tone. Give 2 options per page with character counts. Pages: [list each page with its main keyword].'
        },
        {
          title: 'FAQs from real customer questions',
          desc: 'Turn what customers ask into answers on the page.',
          template:
            'Write 8 FAQs for [brand]’s [service] page, based on questions real customers ask: [paste questions from sales calls, reviews or “People also ask”]. Short, direct answers of 40–60 words. Mark any answer we need the client to confirm.'
        },
        {
          title: 'Google Business Profile posts',
          desc: 'A month of local posts in one go.',
          template:
            'Write 4 Google Business Profile posts for [business] in [area] for [month]: one offer, one event, one update and one tip. Each under 1,500 characters, with a clear call to action and the area name used naturally. Tone: [tone].'
        }
      ]
    },
    {
      key: 'sales',
      label: 'Sales',
      icon: 'brief',
      color: '#e89a00',
      blurb: 'Walk into every pitch prepared.',
      items: [
        {
          title: 'Research a prospect',
          desc: 'Know their business before the first call.',
          template:
            'I’m pitching to [company]. Here’s their website text and recent posts: [paste]. Summarise their business, audience, marketing strengths and gaps, and give me 3 ideas I could open the meeting with.'
        },
        {
          title: 'Personalised cold outreach',
          desc: 'Emails that don’t read like templates.',
          template:
            'Write a cold email to [name], [role] at [company]. Reason to reach out: [trigger]. Our relevant work: [case study]. Under 90 words, no buzzwords, one clear ask.'
        },
        {
          title: 'Proposal first drafts',
          desc: 'From discovery call notes to a structured draft.',
          template:
            'Here are my notes from the discovery call with [prospect]: [paste]. Draft a proposal: their goals, our approach, deliverables, timeline, team and 3 pricing options.'
        },
        {
          title: 'Objection handling prep',
          desc: 'Rehearse the tough questions before they’re asked.',
          template:
            'I’m pitching [service] to [prospect]. List the 8 objections they’re most likely to raise (price, in-house team, timing…) and give me a short, honest response to each.'
        },
        {
          title: 'Case study write-ups',
          desc: 'Turn project results into proof.',
          template:
            'Turn this project info into a case study: [paste the brief, what we did and the results]. Structure: challenge, insight, idea, execution, results. Under 300 words, with a punchy title.'
        }
      ]
    },
    {
      key: 'servicing',
      label: 'Client servicing',
      icon: 'chat',
      color: '#00a3e0',
      blurb: 'Clear, calm, fast communication with clients.',
      items: [
        {
          title: 'Meeting notes to action items',
          desc: 'Rough notes in, a send-ready follow-up out.',
          template:
            'Here are my rough notes from today’s call with [client]: [paste]. Turn them into a 5-line summary, the decisions made, action items (owner and deadline) and open questions. Format it as an email I can send.'
        },
        {
          title: 'Tricky emails',
          desc: 'Delays, bad results, scope creep: handled well.',
          template:
            'Help me write an email to [client] about [delay, bad result or scope creep]. What happened: [details]. I want to [goal]. Tone: honest, calm and solution-focused. Under 150 words.'
        },
        {
          title: 'Decode client feedback',
          desc: 'Turn a wall of comments into a team task list.',
          template:
            'Here’s the client’s feedback: [paste]. Turn it into a task list for the team, grouped by designer, copywriter and strategist. Flag anything unclear or contradictory that we should confirm.'
        },
        {
          title: 'Weekly status reports',
          desc: 'Scannable updates in two minutes.',
          template:
            'Write this week’s status update for [client]. Done: [list]. In progress: [list]. Blocked: [list]. Needed from the client: [list]. Keep it scannable and under 150 words.'
        },
        {
          title: 'Prep for a client call',
          desc: 'Walk in knowing the likely questions.',
          template:
            'Tomorrow I have a call with [client] about [topic]. Background: [paste]. Give me an agenda, the 5 questions they’ll most likely ask with answers, and the one thing I must get agreement on.'
        }
      ]
    },
    {
      key: 'research',
      label: 'Research',
      icon: 'search',
      color: '#13b5a6',
      blurb: 'Hours of reading, done in minutes. With sources you can check.',
      items: [
        {
          title: 'Summarise long reports',
          desc: 'The key findings, with page numbers so you can check.',
          template:
            '[Attach the report.] Summarise this for a busy marketer: 5 key findings, 3 surprising facts, and what it means for [client or category]. Quote the exact lines, with page numbers.'
        },
        {
          title: 'Market overview with sources',
          desc: 'A landscape view you can verify.',
          template:
            'Search the web and give me an overview of the [category] market in [country]: size, growth, key players and trends. Cite a source and date for every fact, and mark anything you’re unsure about.',
          tip: 'Turn on web search, or use Research mode for bigger questions. Then click the sources.'
        },
        {
          title: 'Find themes in reviews or surveys',
          desc: 'What hundreds of customers are actually saying.',
          template:
            'Here are [number] customer reviews: [paste or attach]. Group them into themes. For each theme: how common it is, 2 real quotes, and what it means for our marketing.'
        },
        {
          title: 'Trend scouting',
          desc: 'Real trends, separated from hype.',
          template:
            'What are the emerging trends in [category] for [audience] from the last 6 months? Search the web, cite sources, and separate real trends from hype. Give me 3 ways [brand] could act on them.'
        },
        {
          title: 'Personas from real data',
          desc: 'Personas built on evidence, not guesses.',
          template:
            'Using the attached survey results and reviews, build 3 audience personas for [brand]: who they are, their goals and frustrations, where they spend time online, and what would make them buy. Base everything on the data.'
        }
      ]
    },
    {
      key: 'strategy',
      label: 'Strategy',
      icon: 'compass',
      color: '#ff7a00',
      blurb: 'A sparring partner that never gets tired of “what if”.',
      items: [
        {
          title: 'Pressure-test an idea',
          desc: 'Hear the objections before the client raises them.',
          template:
            'Here’s our campaign idea: [describe]. Play devil’s advocate as the client’s CFO, their head of sales and a cynical customer. What would each one say? Then tell me how to make the idea stronger.'
        },
        {
          title: 'Positioning options',
          desc: 'Three clear directions to debate.',
          template:
            'Here’s everything about [brand]: [paste]. Write 3 different positioning statements (for [audience], [brand] is the [category] that [benefit] because [reason]). Compare the pros and cons of each.'
        },
        {
          title: 'Messaging framework',
          desc: 'One core message, supported everywhere.',
          template:
            'Build a messaging house for [brand]: one core message, 3 supporting pillars, proof points for each, and example lines for social, ads and the website.'
        },
        {
          title: 'Campaign architecture',
          desc: 'From big idea to a channel-by-channel plan.',
          template:
            'Turn this big idea into a campaign plan: [idea]. Show how it works across [channels], the role of each channel, the key assets, and a phased timeline over [number] weeks.'
        },
        {
          title: 'Deck storyline',
          desc: 'The narrative before you open PowerPoint.',
          template:
            'I need to present [strategy] to [audience]. Write a slide-by-slide storyline: each slide’s headline as a full sentence, the key point and the evidence. Maximum [12] slides.'
        }
      ]
    },
    {
      key: 'admin',
      label: 'Admin',
      icon: 'clipboard',
      color: '#6b7280',
      blurb: 'The boring stuff, handled.',
      items: [
        {
          title: 'Write SOPs from how you explain things',
          desc: 'Say it once; get a process document.',
          template:
            'Here’s how I explain [process] to new joiners: [paste or brain dump]. Turn it into a clear step-by-step guide with a checklist, common mistakes and who to ask for help.'
        },
        {
          title: 'Spreadsheet help',
          desc: 'Formulas explained in plain English.',
          template:
            'I have a spreadsheet with these columns: [describe]. I want to [goal, e.g. total spend by client per month]. Give me the exact formula and explain it in plain English.',
          tip: 'Or attach the file and ask Claude to do it and send back the finished sheet.'
        },
        {
          title: 'Project plans and timelines',
          desc: 'Phases, owners and deadlines in a table.',
          template:
            'Create a project plan for [project], starting [date] with a deadline of [date]. Break it into phases and tasks with owners, durations and dependencies. Show it as a table.'
        },
        {
          title: 'Email thread summaries',
          desc: '47 emails, summarised, with your reply drafted.',
          template: 'Here’s a long email thread: [paste]. Summarise what was decided, what’s still open and who’s waiting on whom. Then draft my reply.'
        },
        {
          title: 'Internal comms and agendas',
          desc: 'Announcements and agendas in a minute.',
          template: 'Write [an announcement or meeting agenda] about [topic] for [team]. Key points: [list]. Tone: [friendly or formal]. Keep it under [150] words.'
        }
      ]
    }
  ];

  PU.levels[4] = {
    id: 'L4',
    num: 4,
    color: 'var(--sw-4)',
    title: 'Claude for ==your actual job==',
    short: 'Claude for your actual job',
    tagline: 'Eleven departments. Fifty-five jobs Claude can take off your plate.',
    deliverable: 'Your personal list of Claude jobs',
    learn: ['What Claude can do for your role, with ready-made prompts', 'How to turn a template into your own prompt in seconds', 'What you should never fully hand over'],
    steps: [
      { type: 'intro' },

      {
        type: 'menu',
        xp: 40,
        eyebrow: 'What are you doing today?',
        title: 'Pick what you’re ==working on==',
        lede: 'Each area has 5 jobs with a ready-made prompt. Star the ones you’ll use this week. They go into your cheat sheet.',
        departments: DEPARTMENTS
      },

      {
        type: 'quiz',
        xp: 20,
        eyebrow: 'Know the limits',
        title: 'Which of these should you ==never== hand over completely?',
        options: [
          { label: 'First drafts of 20 ad copy variations', why: 'Great use of Claude. You pick and polish.' },
          { label: 'Summarising a 40-page research report', why: 'Great use of Claude. Ask for page numbers so you can check.' },
          {
            label: 'Final sign-off on the numbers in a client invoice or report',
            correct: true,
            why: 'Claude can draft and double-check, but a person must verify and own the final numbers.'
          },
          { label: 'Brainstorming campaign names', why: 'Perfect Claude job. Quantity first, then you choose.' }
        ],
        explain: 'Claude drafts, analyses and checks. **You** approve anything involving money, legal claims, client data or your agency’s name.'
      },

      {
        type: 'summary',
        takeaway: 'Claude isn’t one tool. It’s a ==junior on every team==.',
        points: [
          'Before any task, ask: could Claude do the first 80%?',
          'Your starred prompts are in the cheat sheet (top right).',
          'You stay the approver.'
        ]
      }
    ]
  };
})();
