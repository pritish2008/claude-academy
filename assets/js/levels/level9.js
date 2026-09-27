/* Level 9 — Claude Code without being a coder. (Its id stays 'L8' so saved progress keeps working.) */
(function () {
  'use strict';
  var PU = window.PU;

  PU.levels[9] = {
    id: 'L8',
    num: 9,
    color: 'var(--sw-8)',
    title: 'Claude Code ==without being a coder==',
    short: 'Claude Code for non-coders',
    tagline: 'If you can describe it, Claude can build it.',
    deliverable: 'Your first tool, built by describing it',
    learn: ['What marketers build with Claude', 'How to ask for a tool in plain English, and where to do it', 'How to report problems so they get fixed'],
    steps: [
      { type: 'intro' },

      {
        type: 'concept',
        eyebrow: 'What is Claude Code?',
        title: 'If you can ==describe it==, Claude can build it.',
        lede: 'Claude Code writes and runs code for you. You describe what you want in plain English, it builds it, and you test it. You never have to read the code.',
        visual: function () {
          return PU.tiles([
            { icon: 'external', title: 'UTM link builder', text: 'Stop hand-typing campaign links.', color: '#2e3bff' },
            { icon: 'check', title: 'Caption checker', text: 'Length, hashtags and banned words, checked instantly.', color: '#00a676' },
            { icon: 'layers', title: 'Landing page prototype', text: 'A real page to show the client before development starts.', color: '#7a4dff' },
            { icon: 'clipboard', title: 'Report automation', text: 'Merge 10 CSV exports into one clean sheet every month.', color: '#e89a00' },
            { icon: 'target', title: 'Campaign quiz or calculator', text: 'Interactive content for a campaign microsite.', color: '#e0418b' },
            { icon: 'spark', title: 'This training', text: 'Everything you’re clicking through right now was built with Claude Code.', color: '#ff5a36' }
          ]);
        },
        body:
          '**Two ways to start:**\n- **Small tools** (a calculator, a checker, a simple form): just ask in a normal chat. Claude builds it in a panel next to the chat, called an [[artifact]], and you can use it straight away. You’ll try this in a moment.\n- **Bigger things** that work with files on your computer: use [[Claude Code]]. Open the Claude [[desktop app]] and click the **Code** tab at the top.'
      },

      {
        type: 'build',
        xp: 30,
        eyebrow: 'Build a tool',
        title: 'Build a tool in ==60 seconds==',
        lede: 'Pick one. Your request is written in plain English, exactly how you’d say it to a colleague.',
        tools: {
          caption: {
            title: 'Caption checker',
            desc: 'Paste a caption, see its length, hashtags and banned words.',
            icon: 'check',
            color: '#00a676',
            request:
              'Build me a simple web page where I can paste an Instagram caption and instantly see:\n- the character count (Instagram’s limit is 2,200)\n- how many hashtags it has (limit 30)\n- what shows before “…more” (roughly the first 125 characters)\n- a warning if it uses any of these banned words: elevate, indulge, unleash, game-changer.\nMake it clean and easy to use.',
            log: [
              { t: 'I’ll build a single web page with a text box and live checks. Plan: layout → counters → banned words → test.', kind: 'dim', ms: 900 },
              { t: '✎ Creating caption-checker.html' },
              { t: '✎ Adding live character and hashtag counters' },
              { t: '✎ Adding the “…more” preview' },
              { t: '✎ Adding banned-word warnings' },
              { t: '▶ Testing with a sample caption… 4 checks passed', kind: 'ok', ms: 900 },
              { t: 'Done. Open caption-checker.html in your browser. Want a copy button or more banned words?', kind: 'ok' }
            ]
          },
          utm: {
            title: 'UTM link builder',
            desc: 'Fill in a short form, get a clean tracking link.',
            icon: 'external',
            color: '#2e3bff',
            request:
              'Build me a simple page where I enter a website link, a source (like Instagram), a medium (like paid social), a campaign name and an optional content label, and it gives me the full tracking link with UTM tags and a copy button.\nMake everything lowercase and replace spaces with underscores so our reports stay clean.',
            log: [
              { t: 'I’ll make a small form that builds the link as you type. Plan: form → link builder → clean-up rules → copy button → test.', kind: 'dim', ms: 900 },
              { t: '✎ Creating utm-builder.html' },
              { t: '✎ Adding the form fields' },
              { t: '✎ Adding lowercase and underscore clean-up' },
              { t: '✎ Adding the copy button' },
              { t: '▶ Testing with “SPF50 Launch”… spf50_launch ✓', kind: 'ok', ms: 900 },
              { t: 'Done. Open utm-builder.html in your browser. Want it to remember your recent links?', kind: 'ok' }
            ]
          }
        },
        doneCallout: {
          eyebrow: 'That’s the whole skill',
          title: 'Describe the outcome. ==Test it.== Say what to change.',
          text: 'A real Claude Code session works the same way. At the end you get a real file on your computer.'
        }
      },

      {
        type: 'guide',
        xp: 15,
        eyebrow: 'Try it now',
        title: 'Build your first tool in a ==normal chat==',
        lede: 'No installing, no code. Open Claude in another tab and follow along, ticking each step.',
        items: [
          { title: 'Start a new chat', body: 'Open Claude and start a new chat, like you always do.' },
          {
            title: 'Describe the tool',
            body: 'Paste the request from the last screen, or describe your own tool in plain English: who uses it, and what it should do.'
          },
          { title: 'Watch it appear', body: 'Claude builds it in a panel next to the chat. Try it right there: type in it, click the buttons.' },
          { title: 'Ask for changes', body: 'Just say what you want different: “Make the button bigger”, “Add a copy button”, “Use our brand colours”.' },
          {
            title: 'Share it with the team',
            body: 'Use the **Share** or **Publish** button on the panel. On a Team plan, it’s shared only inside the company. On personal plans, publishing makes a public link, so check nothing private is in it first.'
          }
        ],
        footer: 'Buttons move around between versions. If something looks different, look for the panel next to the chat and its share option.'
      },

      {
        type: 'cards',
        xp: 10,
        eyebrow: 'Talking to Claude Code',
        title: 'Six habits of ==non-coders who ship==',
        lede: 'Open each card.',
        cards: [
          { icon: 'target', title: 'Describe the outcome', color: '#2e3bff', body: 'Who uses it and what should it do? Not how to code it.' },
          { icon: 'eye', title: 'Ask for a plan first', color: '#00a676', body: '“Before you build anything, explain your plan in plain English.”' },
          { icon: 'layers', title: 'Start small', color: '#e89a00', body: 'Get a basic version working, then add one feature at a time.' },
          { icon: 'alert', title: 'Report bugs like a client', color: '#e0418b', body: '“When I click X, Y happens. I expected Z.” Add a screenshot.' },
          { icon: 'chat', title: 'Ask it to explain', color: '#7a4dff', body: '“Explain what you built as if I’m not technical.”' },
          { icon: 'lock', title: 'Keep secrets out', color: '#ff5a36', body: 'Never paste passwords or client logins. Ask IT before connecting anything to company systems.' }
        ]
      },

      {
        type: 'quiz',
        xp: 20,
        eyebrow: 'Bug report',
        title: 'Your caption checker shows “NaN” instead of a number. Best next message?',
        options: [
          { label: '“It’s broken. Fix it.”', why: 'It might work, but Claude has to guess what’s broken.' },
          {
            label: '“When I paste a caption with emojis and click Check, the character count shows ‘NaN’. I expected a number. Screenshot attached.”',
            correct: true,
            why: 'What you did, what happened and what you expected, plus a screenshot. That gets fixed first time.'
          },
          { label: '“Learn JavaScript over the weekend.”', why: 'You don’t need to. That’s Claude’s job.' },
          { label: '“Give up and do it by hand.”', why: 'One clear sentence usually fixes it.' }
        ],
        explain: '**Great bug reports have three parts:** what you did, what happened, and what you expected.'
      },

      {
        type: 'summary',
        takeaway: 'If you can describe it, ==Claude can build it==.',
        points: [
          'Describe the outcome, ask for a plan, start small.',
          'Report problems like a client: what you did, what happened, what you expected.',
          'Start with a tool that saves you 30 minutes a week.'
        ],
        note: '**Build websites or do SEO?** There’s a bonus level for you: Claude Code for web & SEO. It’s at the bottom of the level list, and always open.',
        noteIcon: 'terminal'
      }
    ]
  };
})();
