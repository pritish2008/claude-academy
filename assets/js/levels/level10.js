/* Level 10 — Build your own AI workflow. (Its id stays 'L9' so saved progress keeps working.) */
(function () {
  'use strict';
  var PU = window.PU;

  PU.levels[10] = {
    id: 'L9',
    num: 10,
    color: 'var(--sw-9)',
    title: 'Build your own ==AI workflow==',
    short: 'Build your own AI workflow',
    tagline: 'One great prompt helps once. A workflow helps every week.',
    deliverable: 'One reusable system for your weekly work',
    learn: ['Which Claude tool fits which job', 'The five parts of a repeatable workflow', 'Your own workflow, ready to use tomorrow'],
    steps: [
      { type: 'intro' },

      {
        type: 'sort',
        xp: 30,
        eyebrow: 'Warm-up',
        title: 'Which Claude tool ==for the job==?',
        lede: 'Everything from the last few levels, in one quick sort.',
        buckets: [
          { key: 'chat', label: 'Chat' },
          { key: 'project', label: 'Project' },
          { key: 'research', label: 'Research' },
          { key: 'cowork', label: 'Cowork' },
          { key: 'code', label: 'Claude Code' }
        ],
        items: [
          { text: 'A quick rewrite of an email', answer: 'chat', why: 'Small and one-off: chat.' },
          { text: 'Everything about one client, reused every day', answer: 'project', why: 'Reusable context lives in a Project.' },
          { text: 'A market overview with sources', answer: 'research', why: 'Research mode searches widely and cites its sources.' },
          { text: 'Turn a folder of exports into a finished report deck', answer: 'cowork', why: 'Files in, finished file out: Cowork.' },
          { text: 'A UTM link builder for the whole team', answer: 'code', why: 'Building a tool: Claude Code.' },
          { text: 'Keep the brand voice consistent across the team', answer: 'project', why: 'Shared instructions and files in a Project.' },
          { text: 'Organise 500 photos into folders', answer: 'cowork', why: 'Batch file work: Cowork.' }
        ],
        success: 'All correct. You know your toolkit now.'
      },

      {
        type: 'tiers',
        xp: 10,
        eyebrow: 'Anatomy of a workflow',
        title: 'Trigger → Input → Steps → Output → ==Your check==',
        lede: 'Every good workflow has the same five parts. Here are four real ones. Tap through them.',
        tabs: [
          {
            label: 'Monday content engine',
            kind: 'good',
            prompt:
              'Here are last week’s top 3 posts and this week’s key dates. Plan 5 posts for the week: analyse what worked, pick the angles, write the captions, critique them against the brand voice, then give me the final plan as a table.',
            notes: ['+ Trigger: every Monday, 10 am', '+ Lives in: the client’s Project, with brand files already inside', '+ Output: a content plan table with captions', '+ Your check: brand voice, facts, client sensitivities'],
            result: 'A week of posts planned in minutes instead of hours.'
          },
          {
            label: 'Monthly client report',
            kind: 'good',
            prompt:
              'Using the exports in this folder, build this month’s report in last month’s layout, write a short client email, and check every number against the source files.',
            notes: ['+ Trigger: first working day of the month', '+ Lives in: Cowork, pointed at the client’s report folder', '+ Output: report deck and summary email', '+ Your check: every number, the story, the tone'],
            result: 'A finished deck and email, waiting for your review.'
          },
          {
            label: 'New business sprint',
            kind: 'good',
            prompt:
              'Research [prospect] using their website and recent news. Summarise their business, marketing strengths and gaps, then give me 3 pitch angles and a cold email for each.',
            notes: ['+ Trigger: a new lead comes in', '+ Lives in: chat with web search, or Research for bigger pitches', '+ Output: a one-page prospect brief and emails', '+ Your check: facts, sources, tone'],
            result: 'You walk into every first call already knowing the business.'
          },
          {
            label: 'Campaign idea machine',
            kind: 'good',
            prompt: 'From this brief, name the audience tension and the product truth, write 5 insights, generate 20 ideas, score them on originality and fit, and develop the top 3.',
            notes: ['+ Trigger: a new brief lands', '+ Lives in: the client’s Project', '+ Output: 3 developed concepts with the thinking behind them', '+ Your check: originality, budget, brand fit'],
            result: 'Better first ideas, faster, with the reasoning attached.'
          }
        ],
        callout: { title: 'A workflow is a prompt you ==never have to write again==.' }
      },

      {
        type: 'wfbuilder',
        xp: 60,
        eyebrow: 'Build yours',
        title: 'Design ==your== workflow',
        lede: 'Pick a recurring task from your real job. Seven quick questions, and you get a workflow card plus a master prompt.',
        presets: {
          'Monthly client report': {
            match: /report/,
            freq: 'Monthly',
            where: 'Cowork',
            inputs: ['Data exports', 'Last month’s report', 'Client goals'],
            output: 'A report deck plus a 5-line summary email for the client',
            steps: {
              analyse: 'Calculate month-on-month changes for the key numbers in the exports.',
              think: 'Pick the 3 things the client most needs to know, and explain why they happened.',
              create: 'Build the report in last month’s layout and write the summary email.',
              critique: 'Check every number against the source files. Flag anything that sounds like an excuse.',
              improve: 'Tighten the summary to 5 lines a busy client will actually read.'
            }
          },
          'Weekly content plan': {
            match: /content|posts|calendar|social/,
            freq: 'Weekly',
            where: 'Project',
            inputs: ['Brand guidelines', 'Past examples', 'Key dates'],
            output: 'A table of 5 posts: date, format, hook, caption and call to action',
            steps: {
              analyse: 'Review last week’s best and worst posts and this week’s key dates.',
              think: 'Pick the 2–3 angles that fit this week’s goal and audience.',
              create: 'Plan 5 posts and write the captions.',
              critique: 'Check each post against the brand voice and cut anything generic.',
              improve: 'Rewrite the weakest post and give me the final table.'
            }
          },
          'Competitor round-up': {
            match: /competitor/,
            freq: 'Monthly',
            where: 'Chat',
            inputs: ['Competitor screenshots', 'Client goals'],
            output: 'A one-page round-up: what changed, what’s working for them, and 3 opportunities for us',
            steps: {
              analyse: 'Summarise each competitor’s posts, offers and campaigns from the screenshots and a web search.',
              think: 'What changed since last month, and what’s working for them?',
              create: 'Write the round-up with 3 opportunities for our client.',
              critique: 'Separate facts from guesses, and flag anything without a source.',
              improve: 'Cut it to one page with the most important point first.'
            }
          },
          'New business research': {
            match: /pitch|prospect|new business|lead/,
            freq: 'Every new project',
            where: 'Chat',
            inputs: ['Prospect website', 'Meeting notes'],
            output: 'A one-page prospect brief with 3 pitch angles and a cold email for each',
            steps: {
              analyse: 'Research the prospect’s business, audience and current marketing.',
              think: 'Find their biggest marketing gap and what they probably care about most right now.',
              create: 'Write 3 pitch angles and a short cold email for each.',
              critique: 'Read it as a skeptical marketing head. What would make you ignore this?',
              improve: 'Sharpen the best angle and its email.'
            }
          },
          'Meeting notes to actions': {
            match: /meeting|notes|call/,
            freq: 'Daily',
            where: 'Project',
            inputs: ['Meeting notes', 'Client feedback'],
            output: 'An email with a 5-line summary, decisions, action items with owners and deadlines, and open questions',
            steps: {
              analyse: 'Read my rough notes and pull out every decision, task and open question.',
              think: 'Work out who owns each task and what’s urgent.',
              create: 'Write the follow-up email.',
              critique: 'Check that nothing is missing or vague. Flag anything I need to confirm.',
              improve: 'Make it scannable in 30 seconds.'
            }
          },
          'Ad copy variations': {
            match: /ad copy|ads|meta|google ads/,
            freq: 'Weekly',
            where: 'Project',
            inputs: ['Brand guidelines', 'Customer reviews', 'Past examples'],
            output: '12 ad variations across 4 angles, with the top 5 ranked for testing',
            steps: {
              analyse: 'Pull the top reasons people buy and the top objections from the reviews.',
              think: 'Pick 4 distinct angles: pain, aspiration, social proof and offer.',
              create: 'Write 3 variations per angle: primary text, headline and call to action.',
              critique: 'Flag anything generic, or any claim we can’t back up.',
              improve: 'Rewrite the flagged ones and rank the top 5 to test.'
            }
          }
        },
        freqs: ['Daily', 'Weekly', 'Monthly', 'Every new project'],
        inputs: [
          'Brand guidelines',
          'Past examples',
          'Audience notes',
          'Data exports',
          'Last month’s report',
          'Meeting notes',
          'Client feedback',
          'Client goals',
          'Competitor screenshots',
          'Customer reviews',
          'Key dates',
          'Prospect website'
        ],
        wheres: ['Chat', 'Project', 'Cowork', 'Claude Code'],
        whereWhy: {
          Chat: 'Quick and flexible: paste the master prompt into a new chat each time.',
          Project: 'The brand files and rules live there, so every run starts briefed.',
          Cowork: 'It works through your files and hands back finished documents. Recurring jobs can run on a schedule.',
          'Claude Code': 'Best when the answer is a tool your team can reuse.'
        },
        whereHow: {
          Chat: 'paste the master prompt into a new chat each time',
          Project: 'save the master prompt in the Project instructions',
          Cowork: 'point it at the folder, then schedule it',
          'Claude Code': 'use the steps as the spec for a tool'
        },
        checks: ['Numbers', 'Facts & sources', 'Brand voice', 'Client sensitivities', 'Legal claims', 'Names & spelling'],
        levelUp: '**Level up:** turn your workflow into a [[Skill]], so Claude follows it by itself every time. The next screen shows you how.'
      },

      {
        type: 'guide',
        xp: 20,
        eyebrow: 'Try it now',
        title: 'Save your workflow as a ==Skill==',
        lede: 'A [[Skill]] is a saved set of instructions. Once it’s saved, you don’t paste your master prompt any more: you just ask for the job, and Claude follows your steps. Open Claude in another tab and follow along.',
        items: [
          { title: 'Copy your master prompt', body: 'It’s in your cheat sheet: press **Cheat sheet** at the top right of this page.' },
          { title: 'Open Skills', body: 'In Claude, go to **Customize**, then **Skills**.' },
          { title: 'Add a new skill, and let Claude write it', body: 'Add a skill and choose the option to **create it with Claude**. Claude asks you a few questions and writes the skill for you.' },
          { title: 'Give Claude your workflow', body: 'Paste your master prompt and say: “Turn this into a skill for [the task].” Answer its questions.' },
          { title: 'Save it and switch it on', body: 'Save the skill, and check it’s switched on in your Skills list.' },
          { title: 'Test it', body: 'In a normal chat, ask for the task the way you usually would. Claude uses your skill by itself. If something is off, ask Claude to update the skill.' }
        ],
        footer:
          'Don’t see Skills? It needs a setting called code execution to be on: ask whoever manages your Claude account. On a Team plan, an admin can also add a skill once for the whole company.'
      },

      {
        type: 'summary',
        takeaway: 'One great prompt helps once. ==A workflow helps every week.==',
        points: [
          'Trigger → Input → Steps → Output → Your check.',
          'Put it where it runs best: Chat, Project, Cowork or Claude Code.',
          'Save the workflows you use every week as Skills.',
          'Your workflow is saved in your cheat sheet.'
        ]
      }
    ]
  };
})();
