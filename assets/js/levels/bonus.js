/* Bonus — Claude Code for web & SEO (optional, always open) */
(function () {
  'use strict';
  var PU = window.PU;

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
            'Audit this codebase for technical SEO. Check every page template for: title tags, meta descriptions, canonical URLs, robots meta, heading order (one H1), image alt text, hreflang, structured data and internal links. Also check robots.txt and the sitemap. Don’t change anything yet. Give me a table: page or template, issue, why it matters, fix, priority. Site: [domain]. Framework: [framework].'
        },
        {
          title: 'Meta titles and descriptions at scale',
          desc: 'Hundreds of pages, each one unique and within the limits.',
          template:
            'I’m attaching [a CSV of URLs with their current title, description and main keyword]. Write a new title (max 60 characters) and meta description (max 155 characters) for each. Keyword near the start, every one unique, in [brand]’s tone, no clickbait. Return a CSV: URL, title, characters, description, characters. Flag pages where the keyword doesn’t fit naturally.'
        },
        {
          title: 'Structured data (JSON-LD)',
          desc: 'Schema markup built from data already in the templates.',
          template:
            'Add JSON-LD structured data to [page type, e.g. product pages] using data already in the templates. Use the schema.org types [e.g. Product, Offer, BreadcrumbList]. Only mark up content that’s visible on the page. Put it in [file or component]. Then show me one example of the final output so I can test it in Google’s Rich Results Test.'
        },
        {
          title: 'Redirect map for a site move',
          desc: 'Old URLs matched to new ones, with a ready redirect file.',
          template:
            'We’re moving from [old URL structure] to [new URL structure]. Old URLs: [attach or paste]. New URLs: [attach or paste]. Match each old URL to the best new one by topic, not just by slug, and flag anything with no good match. Output a CSV (old URL, new URL, confidence) and a 301 redirect file for [server or platform]. Don’t touch the live config.'
        },
        {
          title: 'Search Console quick wins',
          desc: 'Pages that are close to page one, and what to change.',
          template:
            'I’m attaching a Search Console export [queries and pages, last 3 months]. Find pages with high impressions but low click-through, queries ranking in positions 5 to 15, and pages losing clicks. For each, suggest one specific fix: title, description, content or internal links. Rank the list by likely impact. Only use numbers that are in the file.'
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
            'Here’s the PageSpeed Insights report for [URL]: [attach or paste]. Explain the 5 biggest problems in plain English. Then fix them in order of impact: image sizes and formats, lazy loading, font loading, render-blocking scripts, and layout shift from missing width and height. One fix per commit. Run the build after each.'
        },
        {
          title: 'Landing page from a design',
          desc: 'A screenshot in, a responsive page out, using your components.',
          template:
            'Build this landing page from the attached design [screenshot]. Use our existing components in [folder] and the brand colours in [file]. Semantic HTML, one H1, responsive down to 360px wide, and every image with alt text, width and height. Title: [title]. Meta description: [description]. Show me the plan before you write any code.'
        },
        {
          title: 'Accessibility check',
          desc: 'The WCAG basics, fixed without changing the design.',
          template:
            'Check [page or component] against WCAG 2.2 AA basics: colour contrast, alt text, form labels, keyboard access and focus states, heading order, and link text. List the problems by severity, then fix the high ones. Don’t change the visual design without asking me first.'
        },
        {
          title: 'Fix broken links and 404s',
          desc: 'A crawl export in, clean links out.',
          template:
            'I’m attaching a crawl export [e.g. a Screaming Frog CSV]. Find broken internal links, redirect chains and pages returning 404. Fix the links in the files where they live. For deleted pages, suggest the best redirect target. Finish with a summary of every change.'
        },
        {
          title: 'Internal links for a new article',
          desc: 'Links in and out, with natural anchor text.',
          template:
            'Here’s a new article: [path or paste]. Find 5 to 8 existing pages on our site [sitemap URL or content folder] that it should link to, and 3 to 5 pages that should link to it. Suggest natural anchor text, no keyword stuffing. Show me the edits before you make them.'
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

  PU.levels[11] = {
    id: 'LB',
    num: 11,
    label: 'Bonus',
    code: 'B',
    optional: true,
    color: 'var(--sw-11)',
    title: 'Claude Code for ==web & SEO==',
    short: 'Claude Code for web & SEO',
    tagline: 'For the web team: ship SEO fixes and pages faster, without breaking the site.',
    deliverable: 'A CLAUDE.md for your site and 10 ready workflows',
    learn: [
      'Set Claude Code up so it knows your site',
      'Which model and effort to use for coding',
      '10 ready-made web and SEO workflows',
      'The safety rules: secrets, staging and reviewing every change'
    ],
    steps: [
      { type: 'intro' },

      {
        type: 'concept',
        eyebrow: 'For the web team',
        title: 'A pair programmer ==inside your codebase==.',
        lede: 'Claude Code reads the whole project, edits files, runs commands and checks its own work. You review and approve.',
        visual: function () {
          return PU.tiles([
            { icon: 'terminal', title: 'Terminal', text: 'Run “claude” in your project folder.', color: 'var(--sw-8)' },
            { icon: 'layers', title: 'VS Code and JetBrains', text: 'The extension works right next to your code.', color: 'var(--sw-1)' },
            { icon: 'home', title: 'Desktop app', text: 'Claude Code inside the Claude desktop app.', color: 'var(--sw-6)' },
            { icon: 'external', title: 'On the web', text: 'claude.ai/code, for projects on GitHub.', color: 'var(--sw-2)' }
          ]);
        },
        body:
          '**Not a developer?** This bonus level is optional. Skip it and you can still finish the training.\n\n**New to Claude Code?** Level 8 covers the basics. Inside Claude Code, type `/powerup` for its built-in interactive lessons.'
      },

      {
        type: 'cards',
        xp: 15,
        eyebrow: 'Set it up right',
        title: 'Six habits of developers who get ==great results==',
        lede: 'Open each card.',
        cards: [
          {
            icon: 'book',
            title: 'Run /init once',
            color: '#2e3bff',
            body: 'It writes a **CLAUDE.md**: your project’s rulebook. Claude reads it at the start of every session. Keep it short, under 200 lines.'
          },
          {
            icon: 'compass',
            title: 'Plan before you build',
            color: '#7a4dff',
            body: 'Press **Shift+Tab** until you see “plan mode on”. Claude reads the code and proposes a plan. No edits until you approve.'
          },
          {
            icon: 'target',
            title: 'Point at the right files',
            color: '#ff7a00',
            body: 'Type **@** to add a file or folder, like `@src/components/Seo.tsx`. Paste screenshots straight in.'
          },
          {
            icon: 'check',
            title: 'Small steps, then test',
            color: '#00a676',
            body: 'One change at a time. Ask Claude to run the build, lint and tests before it says it’s done.'
          },
          {
            icon: 'refresh',
            title: 'Keep an undo button',
            color: '#e0418b',
            body: 'Commit before big changes. `/rewind` (or **Esc** twice) undoes Claude’s file edits, but not commands it ran. Git is your real safety net.'
          },
          {
            icon: 'wand',
            title: 'Save repeat jobs as skills',
            color: '#00a3e0',
            body: 'Write the steps once in `.claude/skills/seo-audit/SKILL.md`. Then run them any time with `/seo-audit`.'
          }
        ]
      },

      {
        type: 'concept',
        eyebrow: 'Model and effort',
        title: 'Turn up the ==effort== before you change the model.',
        lede: 'Effort decides how many files Claude reads, how much it checks, and how far it goes before checking in with you.',
        body:
          '| The job | Model | Effort |\n|---|---|---|\n| Meta tags, alt text, copy tweaks | Sonnet | Low or medium |\n| Everyday features and fixes | Opus, the usual default | Leave the default |\n| Multi-file changes, tricky bugs | Opus | High or extra high |\n| Migrations, deep debugging, big refactors | Fable | High or above |\n\n- **Claude cut corners** (skipped a file, didn’t run the tests)? Raise the effort: `/effort high`.\n- **Claude doesn’t understand the problem,** even with more effort? Try a bigger model: `/model opus` or `/model fable`.\n- **Can’t afford a mistake** (checkout, tracking, redirects)? Use `max`, then review every line.',
        note: 'Type `/model` to see and switch your model (the ← and → keys change the effort there too). `/effort` opens the effort slider. Models and defaults change, so check `/model` now and then.'
      },

      {
        type: 'menu',
        xp: 30,
        eyebrow: 'Ready-made workflows',
        title: 'Pick a job. Get a ==ready-made prompt==.',
        lede: 'Ten workflows for web and SEO work. Fill in the brackets, then paste into Claude Code. Star the ones you’ll reuse.',
        departments: WORKFLOWS
      },

      {
        type: 'concept',
        eyebrow: 'Your rulebook',
        title: 'Start every site with a ==CLAUDE.md==.',
        lede: 'Run /init, then add the rules Claude can’t work out on its own. Copy this starter and fill in the brackets.',
        visual: function () {
          return PU.promptBlock(CLAUDE_MD, { label: 'CLAUDE.md starter', copy: true });
        },
        note: 'Commit it, so everyone on the project works to the same rules. Personal preferences go in `CLAUDE.local.md`, which stays out of git.'
      },

      {
        type: 'quiz',
        xp: 20,
        eyebrow: 'Stay safe',
        title: 'Claude wants to delete a folder on the ==live server== “to clean up”. What do you do?',
        options: [
          { label: 'Approve it. Claude knows what it’s doing.', why: 'Deleting live files wasn’t your task, and /rewind can’t undo a command.' },
          {
            label: 'Say no, ask why, and do any clean-up on staging with a backup first.',
            correct: true,
            why: 'You stay in charge of anything live. Test on staging, keep a backup, then decide.'
          },
          { label: 'Turn off the permission prompts so it stops asking.', why: 'Those prompts are what just saved you.' },
          { label: 'Approve it, then check the site later.', why: 'By then the files are gone.' }
        ],
        explain: '**Say no to anything you didn’t ask for,** especially on live servers. Work on a branch or staging, and review every change before it ships.'
      },

      {
        type: 'multi',
        xp: 15,
        eyebrow: 'Safe habits',
        title: 'Which of these are ==safe habits==?',
        lede: 'Tap every safe habit, then press Check.',
        columns: '250px',
        options: [
          { label: 'Keep API keys in .env files, and tell Claude never to open them', status: 'correct', why: 'Secrets stay out of the chat and out of git.' },
          { label: 'Paste the live database password into the chat to debug faster', status: 'wrong', why: 'Never share passwords or keys in a chat.' },
          { label: 'Work on a branch, review the diff, then merge', status: 'correct', why: 'You see every change before it’s real.' },
          { label: 'Let Claude push straight to the live site on a Friday evening', status: 'wrong', why: 'Changes go through review, and never straight to live.' },
          { label: 'Ask Claude to explain any change you don’t understand before approving it', status: 'correct', why: 'If you can’t explain it, don’t ship it.' },
          { label: 'Skip the build because Claude said it’s done', status: 'wrong', why: 'Check it yourself. Run the build and look at the page.' }
        ],
        perfect: 'Spot on. Secrets stay secret, changes go through review, and you check the result yourself.'
      },

      {
        type: 'summary',
        takeaway: 'Plan first. Small steps. ==Review every change.==',
        points: [
          'Run /init and keep your CLAUDE.md short and specific.',
          'Claude cut corners? Raise the effort. Didn’t understand? Try a bigger model.',
          'Never share secrets, and never let changes reach the live site unreviewed.'
        ],
        template: SEO_SKILL,
        templateLabel: 'Keep this: save as .claude/skills/seo-audit/SKILL.md, run with /seo-audit'
      }
    ]
  };
})();
