/* Bonus — Claude Code for web & SEO (optional, always open) */
(function () {
  'use strict';
  var PU = window.PU;
  var h = PU.h;

  var WORKFLOWS = [
    {
      key: 'dev-seo',
      label: 'Technical SEO',
      icon: 'search',
      color: '#13b5a6',
      blurb: 'Find and fix what stops pages ranking.',
      items: [
        {
          title: 'SEO audit of the codebase',
          desc: 'Every missing title, description, canonical and heading problem.',
          template:
            'Audit this codebase for technical SEO. Check every page template for: title tags, meta descriptions, canonical URLs, robots meta, heading order (one H1), image alt text, hreflang, structured data and internal links. Also check robots.txt and the sitemap. Don’t change anything yet. Give me a table: page or template, issue, why it matters, fix, priority. Site: [domain]. Framework: [framework].',
          tip: 'Nothing changes: Claude only reports. You choose which fixes to make.'
        },
        {
          title: 'Meta titles and descriptions at scale',
          desc: 'Hundreds of pages, each one unique and within the limits.',
          template:
            'I’m attaching [a CSV of URLs with their current title, description and main keyword]. Write a new title (max 60 characters) and meta description (max 155 characters) for each. Keyword near the start, every one unique, in [brand]’s tone, no clickbait. Return a CSV: URL, title, characters, description, characters. Flag pages where the keyword doesn’t fit naturally.',
          tip: 'Export the list of pages as a [[CSV]] from your SEO tool or website admin.'
        },
        {
          title: 'Structured data (JSON-LD)',
          desc: 'Schema markup built from data already in the templates.',
          template:
            'Add JSON-LD structured data to [page type, e.g. product pages] using data already in the templates. Use the schema.org types [e.g. Product, Offer, BreadcrumbList]. Only mark up content that’s visible on the page. Put it in [file or component]. Then show me one example of the final output so I can test it in Google’s Rich Results Test.',
          tip: '[[Structured data]] helps Google show extra details, like prices and star ratings.'
        },
        {
          title: 'Redirect map for a site move',
          desc: 'Old URLs matched to new ones, with a ready redirect file.',
          template:
            'We’re moving from [old URL structure] to [new URL structure]. Old URLs: [attach or paste]. New URLs: [attach or paste]. Match each old URL to the best new one by topic, not just by slug, and flag anything with no good match. Output a CSV (old URL, new URL, confidence) and a 301 redirect file for [server or platform]. Don’t touch the live config.',
          tip: 'A [[301 redirect|redirect]] sends people from an old web address to the new one.'
        },
        {
          title: 'Search Console quick wins',
          desc: 'Pages that are close to page one, and what to change.',
          template:
            'I’m attaching a Search Console export [queries and pages, last 3 months]. Find pages with high impressions but low click-through, queries ranking in positions 5 to 15, and pages losing clicks. For each, suggest one specific fix: title, description, content or internal links. Rank the list by likely impact. Only use numbers that are in the file.',
          tip: 'Get the file from [[Search Console]]: open the Performance report and press Export.'
        }
      ]
    },
    {
      key: 'dev-build',
      label: 'Build & fix',
      icon: 'terminal',
      color: '#7a4dff',
      blurb: 'Faster pages, cleaner code, fewer broken links.',
      items: [
        {
          title: 'Speed up slow pages',
          desc: 'From a PageSpeed report to fixes, biggest win first.',
          template:
            'Here’s the PageSpeed Insights report for [URL]: [attach or paste]. Explain the 5 biggest problems in plain English. Then fix them in order of impact: image sizes and formats, lazy loading, font loading, render-blocking scripts, and layout shift from missing width and height. One fix per commit. Run the build after each.',
          tip: 'Get the report free at pagespeed.web.dev. It measures [[Core Web Vitals]].'
        },
        {
          title: 'Landing page from a design',
          desc: 'A screenshot in, a responsive page out, using your components.',
          template:
            'Build this landing page from the attached design [screenshot]. Use our existing components in [folder] and the brand colours in [file]. Semantic HTML, one H1, responsive down to 360px wide, and every image with alt text, width and height. Title: [title]. Meta description: [description]. Show me the plan before you write any code.',
          tip: 'Claude shows its plan before writing any code, so you can correct it first.'
        },
        {
          title: 'Accessibility check',
          desc: 'The WCAG basics, fixed without changing the design.',
          template:
            'Check [page or component] against WCAG 2.2 AA basics: colour contrast, alt text, form labels, keyboard access and focus states, heading order, and link text. List the problems by severity, then fix the high ones. Don’t change the visual design without asking me first.',
          tip: 'Uses [[WCAG]], the standard rules for websites everyone can use.'
        },
        {
          title: 'Fix broken links and 404s',
          desc: 'A crawl export in, clean links out.',
          template:
            'I’m attaching a crawl export [e.g. a Screaming Frog CSV]. Find broken internal links, redirect chains and pages returning 404. Fix the links in the files where they live. For deleted pages, suggest the best redirect target. Finish with a summary of every change.',
          tip: 'Any website crawler that exports a [[CSV]] works.'
        },
        {
          title: 'Internal links for a new article',
          desc: 'Links in and out, with natural anchor text.',
          template:
            'Here’s a new article: [path or paste]. Find 5 to 8 existing pages on our site [sitemap URL or content folder] that it should link to, and 3 to 5 pages that should link to it. Suggest natural anchor text, no keyword stuffing. Show me the edits before you make them.',
          tip: 'Claude shows every edit first, so you approve each link.'
        }
      ]
    }
  ];

  var CLAUDE_MD =
    '# [Client] website\n\n' +
    '## About\n' +
    '[One line: what the site is, who it’s for, which market.]\n\n' +
    '## Stack and commands\n' +
    '- Framework: [e.g. Next.js, WordPress theme, Shopify theme]\n' +
    '- Run locally: [npm run dev]\n' +
    '- Build: [npm run build]\n' +
    '- Lint and tests: [npm run lint], [npm test]\n' +
    '- Hosting: [e.g. Vercel]. Deploys go out from [branch]. Never deploy yourself.\n\n' +
    '## SEO rules\n' +
    '- Every page: a unique title (max 60 characters) and meta description (max 155).\n' +
    '- One H1 per page. Headings in order, no skipped levels.\n' +
    '- Every image: alt text, width and height. Use WebP or AVIF.\n' +
    '- Set meta tags through [our SEO component or plugin]. Never hard-code them.\n' +
    '- Canonical URLs are absolute: https://[www.domain.com]/...\n' +
    '- Never change or delete a live URL without a 301 redirect in [file].\n' +
    '- Structured data: JSON-LD only, and only for content visible on the page.\n\n' +
    '## Code rules\n' +
    '- Reuse the components in [folder] before making new ones.\n' +
    '- Brand colours and fonts live in [file]. Don’t add new ones.\n' +
    '- Keep changes small. Run the build and lint before saying you’re done.\n' +
    '- Never open, print or edit .env files or API keys.';

  var SEO_SKILL =
    '---\n' +
    'description: Technical SEO audit. Use when asked to audit SEO or check pages before launch.\n' +
    '---\n\n' +
    'Audit the pages I name (or the whole site if I don’t) for:\n' +
    '- A unique title (max 60 characters) and meta description (max 155)\n' +
    '- One H1, and headings in order\n' +
    '- Canonical URL, robots meta and hreflang\n' +
    '- Image alt text, width and height\n' +
    '- JSON-LD structured data that matches the visible content\n' +
    '- Internal links, and any broken links\n\n' +
    'Don’t change anything. Return a table: page, issue, fix, priority.\n' +
    'Then ask me which fixes to make.';

  PU.levels[12] = {
    id: 'LB',
    num: 12,
    label: 'Bonus',
    code: 'B',
    optional: true,
    color: 'var(--sw-11)',
    title: 'Claude Code for ==web & SEO==',
    short: 'Claude Code for web & SEO',
    tagline: 'For whoever looks after the websites. We start from zero: no Claude Code experience needed.',
    deliverable: 'Claude Code set up on your site, and 10 ready prompts',
    learn: [
      'What Claude Code is, in plain words',
      'How to set it up, one step at a time',
      'What a real session looks like, screen by screen',
      '10 ready-made prompts for SEO and website jobs',
      'How to stay safe when working on a live website'
    ],
    steps: [
      { type: 'intro' },

      {
        type: 'concept',
        eyebrow: 'What is Claude Code?',
        title: 'Claude, working ==inside your website’s files==.',
        lede: 'In a normal chat you copy code in and out. [[Claude Code]] opens your website’s files itself, makes the change and checks it. You stay in charge: you see every change before it counts.',
        visual: function () {
          return h(
            'div.flow',
            { style: 'grid-template-columns:repeat(3,minmax(0,1fr))' },
            [
              ['You', 'Say what you want changed'],
              ['Claude Code', 'Finds the files and makes the change'],
              ['You', 'Check it, then say yes or no']
            ].map(function (x, i) {
              return h('div.fnode', { style: 'cursor:default' }, h('span.fn-num', '0' + (i + 1)), h('span.fn-title', x[0]), h('span.fn-short', x[1]));
            })
          );
        },
        body:
          '**You can use it in four places. Pick one:**\n- **The Claude [[desktop app]]:** click the **Code** tab at the top. The easiest start.\n- **[[VS Code]]**, if you already build sites in it: add the free Claude Code extension.\n- **A [[terminal]]**, if you like typing commands.\n- **On the web** at claude.ai/code, for websites stored on GitHub.\n\nYou need a paid Claude plan: Pro, Max, Team or Enterprise.\n\n**Not a developer?** This bonus level is optional. You can skip it and still finish the training.'
      },

      {
        type: 'guide',
        xp: 25,
        eyebrow: 'Set it up once',
        title: 'Get Claude Code working on ==your website==',
        lede: 'Tick each step as you go. Not at your computer right now? Continue, and come back to this list later.',
        items: [
          {
            title: 'Open Claude Code',
            body:
              '**Easiest:** open the Claude [[desktop app]] and click the **Code** tab at the top.\n\n**Using VS Code?** Press **Ctrl + Shift + X** (on a Mac, **Cmd + Shift + X**), search for “Claude Code”, and click **Install**. Then click the small Claude spark icon at the top right of the editor.'
          },
          {
            title: 'Sign in',
            body: 'The first time, it asks you to sign in. A browser window opens: sign in with your work Claude account and approve. You only do this once.'
          },
          {
            title: 'Open your website’s folder',
            body:
              'Claude Code only works inside the folder you open, so pick the folder that holds the website’s files (the [[project folder]]).\n- **Desktop app:** click the folder option next to the message box and choose the folder.\n- **VS Code:** go to **File → Open Folder** and choose it.'
          },
          {
            title: 'Set it to ask before changing anything',
            body:
              'Find the **mode** button next to the message box and choose **Manual**: Claude then asks before every change and shows you what it wants to change. Or choose **Plan**: Claude only reads and suggests, and changes nothing.'
          },
          {
            title: 'Ask a safe first question',
            body: 'Type: “Explain how this website is organised, in plain English. Don’t change anything.” You learn your way around, and nothing changes.'
          },
          {
            title: 'Give Claude its rulebook',
            body:
              'Type **/init** and press **Enter**. Anything that starts with “/” is a built-in [[command|slash command]]. This one tells Claude to look through your site and write a file called [[CLAUDE.md]] into the folder.\n\nYou don’t need to connect it to anything. Claude finds it by itself every time you open this folder.'
          },
          {
            title: 'Add your own rules to it',
            body: 'Later in this level there’s a ready-made set of rules. Copy it, then tell Claude: “Add these rules to CLAUDE.md”, and paste them.'
          }
        ],
        footer: 'Buttons and menus move around between versions. If something looks different, look for the same three things: open your site’s folder, choose how much Claude asks, then type what you want.',
        callout: { title: 'Set up once. From now on, Claude ==knows your site== every time.' }
      },

      {
        type: 'chat',
        xp: 20,
        eyebrow: 'See it in action',
        title: 'What a real session ==looks like==',
        lede: 'This is what you’ll see in Claude Code, step by step. Press the blue button to move on. The shaded notes explain each moment.',
        chatTitle: 'Claude Code · simulated',
        turns: [
          { role: 'note', text: 'You’ve opened your website’s folder and set the mode to **Plan**, so Claude can read but not change anything yet. Now type what you want.' },
          { role: 'user', text: 'Our product pages have no meta descriptions. Add one to each product page: max 155 characters, using the product name and its main benefit.' },
          {
            role: 'claude',
            think: 1100,
            text:
              'Here’s my plan:\n\n1. The product pages all use one template: `src/pages/product.tsx`\n2. I’ll add a meta description built from each product’s name and short description\n3. I’ll keep each one under 155 characters\n4. Then I’ll run the build to check nothing breaks\n\nShall I go ahead?'
          },
          { role: 'note', text: 'Claude has only **read** files so far. Read the plan. Wrong? Say what to change. Right? Switch the mode to **Manual** and approve it.' },
          { role: 'user', send: 'Approve the plan', text: 'Looks good. Go ahead.' },
          {
            role: 'screen',
            title: 'Claude wants to edit src/pages/product.tsx',
            lines: [
              { t: '  <title>{product.name} | Kora Coffee</title>' },
              { t: '- <meta name="description" content="" />', kind: 'del' },
              { t: '+ <meta name="description" content={product.shortDescription} />', kind: 'add' },
              { t: '  Allow this change?   Yes  ·  No  ·  Tell Claude what to do instead', kind: 'dim' }
            ]
          },
          { role: 'note', text: 'This before-and-after view is called a [[diff]]. **Red** lines are removed, **green** lines are added. Nothing is saved until you say yes.' },
          { role: 'user', send: 'Say yes', text: 'Yes.' },
          {
            role: 'screen',
            lines: [
              { t: '✓ Edited src/pages/product.tsx', kind: 'ok' },
              { t: '▶ Running the build…', kind: 'dim' },
              { t: '✓ Build passed. 24 product pages now have a meta description.', kind: 'ok' }
            ]
          },
          {
            role: 'note',
            text: 'The [[build]] is a quick health check: if it passes, nothing is broken. Now open one product page in your browser and check it yourself. Then save a snapshot, so you can always come back to this point.'
          },
          { role: 'user', send: 'Save a snapshot', text: 'Commit this with a clear message.' },
          { role: 'claude', text: 'Done. Saved as: “Add meta descriptions to product pages”.' },
          { role: 'note', text: 'That snapshot is a [[commit]], a saved point in [[Git]]. If anything goes wrong later, you can go back to it.' }
        ],
        callout: {
          title: 'Plan → approve → check → ==save a snapshot==.',
          text: 'That’s the whole routine. Every job in this level works the same way.'
        }
      },

      {
        type: 'howto',
        xp: 15,
        eyebrow: 'Good habits',
        title: 'Six habits, ==explained simply==',
        lede: 'Open each one to see what it is, why it matters and exactly how to do it.',
        items: [
          {
            title: 'Plan before anything changes',
            what: 'Claude reads and suggests a plan, but changes nothing.',
            why: 'you catch a wrong idea before it touches your site.',
            steps: [
              'Click the **mode** button next to the message box and choose **Plan**. (In a terminal, press **Shift + Tab** until the bottom line says “plan mode on”.)',
              'Describe the change you want.',
              'Read the plan. If something’s wrong, say what to change. If it’s right, switch to **Manual** and say “go ahead”.'
            ],
            tryIt: 'Before you change anything, explain your plan in plain English.'
          },
          {
            title: 'Point Claude at the right file',
            what: 'Tell Claude exactly which file you mean.',
            why: 'Claude starts in the right place instead of searching the whole site.',
            steps: [
              'In the message box, type **@**.',
              'Start typing the file’s name, for example “header”.',
              'Pick the file from the list, then finish your message.'
            ],
            note: 'Screenshots help too. Copy a screenshot, click in the message box and paste it (**Ctrl + V**, or **Cmd + V** on a Mac).'
          },
          {
            title: 'One change at a time, then check it',
            what: 'Small steps you check as you go.',
            why: 'if something breaks, you know exactly which change did it.',
            steps: [
              'Ask for one change only.',
              'Ask Claude to run the checks (see below).',
              'Open the page in your browser and look at it yourself.'
            ],
            tryIt: 'Run the build and any tests, and tell me in plain English if anything failed.',
            note: 'The [[build]] checks the site still works. [[tests]] are extra automatic checks, and not every site has them.'
          },
          {
            title: 'Keep an undo button',
            what: 'Save snapshots, so you can always go back.',
            why: 'mistakes happen. With a snapshot, fixing one takes seconds.',
            steps: [
              'Before a big change, type: “Commit everything first.” That saves a snapshot (a [[commit]]).',
              'Don’t like what Claude just did? Type **/rewind** and press Enter, then pick the point to go back to. (In a terminal, pressing **Esc** twice does the same.)',
              '/rewind can’t undo commands Claude ran, like deleting files. That’s why snapshots matter.'
            ]
          },
          {
            title: 'Save jobs you repeat as skills',
            what: 'A saved checklist you can run by typing one word.',
            why: 'you write your SEO checklist once, and it runs the same way every time.',
            steps: [
              'Type: “Turn this checklist into a skill called seo-audit”, then paste your checklist.',
              'Claude saves it inside your project folder.',
              'From then on, just type **/seo-audit** and press Enter.'
            ],
            note: 'There’s a ready-made SEO checklist at the end of this level.'
          },
          {
            title: 'Ask Claude to explain it',
            what: 'Plain-English explanations of any change.',
            why: 'never put something live that you don’t understand.',
            steps: ['After any change, ask Claude to explain it.', 'If the answer still isn’t clear, ask for an example or a simpler version.'],
            tryIt: 'Explain what you just changed and why, as if I’m not a developer.'
          }
        ]
      },

      {
        type: 'concept',
        eyebrow: 'Model and effort',
        title: 'The same two settings, ==inside Claude Code==.',
        lede: 'Level 3 explains model and effort for everyone. Here’s how to change them in Claude Code, and what to pick for website work.',
        body:
          '**To change the model:** click the model name next to the message box and pick one. (In a terminal, type **/model** and press Enter, then use the arrow keys.)\n\n**To change the effort:** it’s in the same menu. (In a terminal, type **/effort** and press Enter.)\n\n| The job | Model | Effort |\n|---|---|---|\n| Small text changes: titles, alt text | Sonnet | Low or medium |\n| Everyday fixes and new sections | Opus, usually already selected | Leave it as it is |\n| Tricky bugs, changes across many files | Opus | High or extra high |\n| Moving a whole site, big rebuilds | Fable | High or above |\n\n- **Claude skipped a file or didn’t check its work?** It didn’t try hard enough. Raise the effort.\n- **Claude doesn’t understand the problem at all?** Try a bigger model.',
        note: 'Not sure what you’re on? The model name is shown next to the message box. Bigger models and more effort use up your plan’s [[limit]] faster.'
      },

      {
        type: 'menu',
        xp: 30,
        eyebrow: 'Ready-made prompts',
        title: 'Pick a job. Get a ==ready-made prompt==.',
        lede: 'Ten prompts for web and SEO work. Open one, fill in the [brackets], then paste it into Claude Code. Star the ones you’ll reuse.',
        departments: WORKFLOWS
      },

      {
        type: 'concept',
        eyebrow: 'Your rulebook',
        title: 'Teach Claude your site’s rules: ==CLAUDE.md==.',
        lede: '[[CLAUDE.md]] is a plain text file in your website’s folder. Claude reads it by itself every time you start, so you never repeat the same rules. You don’t connect it to anything: being in the folder is enough.',
        visual: function () {
          return h(
            'div.stack',
            h('div.md', {
              html: PU.md(
                '**How to use this starter:**\n1. If you haven’t yet, type **/init** in Claude Code and press Enter. Claude creates CLAUDE.md for you.\n2. Press **Copy** on the box below.\n3. In Claude Code, type: “Add these rules to CLAUDE.md, and fill in what you can from the project:”, then paste.\n4. Claude fills in the [brackets] it can work out. Check the rest yourself.\n5. Save a snapshot: type “Commit CLAUDE.md”.'
              )
            }),
            PU.promptBlock(CLAUDE_MD, { label: 'CLAUDE.md starter', copy: true })
          );
        },
        note: 'Keep it short: Claude follows a short rulebook better than a long one. The file is shared with everyone who works on the site, so it’s the same for the whole team.'
      },

      {
        type: 'quiz',
        xp: 20,
        eyebrow: 'Stay safe',
        title: 'Claude wants to delete a folder on the ==live website== “to tidy up”. What do you do?',
        options: [
          { label: 'Say yes. Claude knows best.', why: 'Deleting files wasn’t your request, and /rewind can’t bring back files deleted by a command.' },
          {
            label: 'Say no, ask why, and try any tidying on a test copy of the site first, with a backup.',
            correct: true,
            why: 'You stay in charge of anything live. Try it safely first, then decide.'
          },
          { label: 'Switch off the questions so it stops asking.', why: 'Those questions are what just saved you.' },
          { label: 'Say yes, and check the site later.', why: 'By then the files are gone.' }
        ],
        explain:
          '**Say no to anything you didn’t ask for,** especially on the [[live site]]. Try changes on a [[staging]] copy first, and look at every change before it goes live.'
      },

      {
        type: 'multi',
        xp: 15,
        eyebrow: 'Safe habits',
        title: 'Which of these are ==safe habits==?',
        lede: 'Tap every safe habit, then press Check.',
        columns: '250px',
        options: [
          { label: 'Keep the site’s passwords in its private settings file, and tell Claude never to open it', status: 'correct', why: 'Passwords stay out of the chat, and out of the shared code.' },
          { label: 'Paste the website’s database password into the chat so Claude can fix things faster', status: 'wrong', why: 'Never paste passwords or secret keys into a chat.' },
          { label: 'Try changes on a separate copy of the code, check them, then add them to the main site', status: 'correct', why: 'You see every change before it’s real.' },
          { label: 'Let Claude put changes on the live site on a Friday evening, without checking', status: 'wrong', why: 'Changes get checked first, and never go straight to the live site.' },
          { label: 'Ask Claude to explain any change you don’t understand before you approve it', status: 'correct', why: 'If you can’t explain it, don’t put it live.' },
          { label: 'Skip checking the page because Claude said it’s done', status: 'wrong', why: 'Always open the page and look at it yourself.' }
        ],
        perfect: 'Spot on. Passwords stay private, changes get tried on a copy first, and you check the result yourself.'
      },

      {
        type: 'summary',
        takeaway: 'Plan first. Small steps. ==Check every change.==',
        points: [
          'Open your site’s folder, choose Plan or Manual mode, then say what you want.',
          'Type /init once, and keep your CLAUDE.md rulebook short.',
          'Passwords stay private. Nothing goes live without a check.'
        ],
        template: SEO_SKILL,
        templateLabel: 'Keep this: in Claude Code, type “Save this as a skill called seo-audit” and paste it. Then type /seo-audit any time.'
      }
    ]
  };
})();
