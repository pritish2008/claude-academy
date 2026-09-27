/* ==========================================================================
   Words to know. In any lesson text, write [[word]] (or [[shown text|word]])
   and it becomes a dotted-underlined word people can tap for a plain-English
   explanation. Keys are lower case. Keep every explanation jargon-free.
   ========================================================================== */
(function () {
  'use strict';
  window.PU.GLOSSARY = {
    /* ---------- Using Claude ---------- */
    prompt: { t: 'Prompt', d: 'Whatever you type to Claude: a question, a request or a full brief.' },
    model: {
      t: 'Model',
      d: 'Which version of Claude’s “brain” answers you. Bigger models are better at hard jobs, but slower, and they use up your limit faster.'
    },
    effort: {
      t: 'Effort',
      d: 'How hard Claude thinks before it answers. More effort means a more careful answer that takes longer and uses more of your limit.'
    },
    limit: {
      t: 'Usage limit',
      d: 'Every plan lets you use Claude a certain amount before you have to wait for it to reset. Bigger models and more effort use it up faster.'
    },
    project: {
      t: 'Project',
      d: 'A workspace in Claude for one client or campaign. You add instructions and files once, and every chat inside it starts already briefed.'
    },
    'project instructions': {
      t: 'Project instructions',
      d: 'Standing rules for a Project, like the tone of voice or words to avoid. Claude follows them in every chat inside that Project.'
    },
    memory: {
      t: 'Memory',
      d: 'Things Claude remembers about you from past chats, like your role and how you like things written. You can see and change them in Settings.'
    },
    'incognito chat': { t: 'Incognito chat', d: 'A chat that isn’t saved to your chat history or to Claude’s memory.' },
    context: { t: 'Context', d: 'Everything Claude can see while it answers: your message, attached files, the chat so far and any Project instructions.' },
    artifact: {
      t: 'Artifact',
      d: 'Something Claude makes in its own panel next to the chat, like a document, a web page or a small tool. You can use it, change it and share it.'
    },
    skill: {
      t: 'Skill',
      d: 'A saved set of instructions for a job you do often, like “write in our house style”. Claude uses it by itself whenever that job comes up.'
    },
    connector: {
      t: 'Connector',
      d: 'A link between Claude and another app you use, like Google Drive, Gmail or Canva, so Claude can read from it or work in it.'
    },
    'custom connector': {
      t: 'Custom connector',
      d: 'A connector you add yourself by pasting a link from the tool’s own website, for tools that aren’t in Claude’s list.'
    },
    'web search': { t: 'Web search', d: 'Lets Claude look things up on the internet and show you links to where it found them.' },
    research: {
      t: 'Research',
      d: 'A deeper web search. Claude reads many sources and writes a report with links to each one. It takes longer than a normal answer.'
    },
    cowork: {
      t: 'Cowork',
      d: 'The part of the Claude app where Claude works through a many-step job on its own, using the files you give it, and hands back finished files.'
    },
    'folder instructions': {
      t: 'Folder instructions',
      d: 'Notes for Claude about one folder: what’s in it, how files are named and what it must never touch. Claude reads them every time it works there.'
    },
    'claude code': {
      t: 'Claude Code',
      d: 'A version of Claude that works directly inside a project’s files. It can read them, change them and run them, and you approve what it does.'
    },
    'desktop app': { t: 'Claude desktop app', d: 'The Claude app you install on your computer, from claude.com/download. It has Chat, Cowork and Code.' },

    /* ---------- Websites and code ---------- */
    terminal: {
      t: 'Terminal',
      d: 'A window where you type commands instead of clicking. On a Mac it’s the Terminal app. On Windows it’s called PowerShell.'
    },
    command: { t: 'Command', d: 'A short instruction you type and send, like “claude” in a terminal, or “/init” inside Claude Code.' },
    'slash command': {
      t: 'Slash command',
      d: 'A command that starts with “/”, typed into Claude Code, like /init or /model. It runs one of Claude Code’s built-in jobs.'
    },
    'code editor': { t: 'Code editor', d: 'An app for opening and editing a website’s files, like VS Code. Think of it as Word, but for code.' },
    'vs code': { t: 'VS Code', d: 'A free code editor from Microsoft, used by lots of web developers. Claude Code can run inside it.' },
    'project folder': {
      t: 'Project folder',
      d: 'The folder on your computer that holds all of a website’s files. Claude Code only works inside the folder you open.'
    },
    'claude.md': {
      t: 'CLAUDE.md',
      d: 'A plain text file in your website’s folder with rules for Claude. Claude finds it and reads it by itself every time you start. You don’t need to connect it.'
    },
    '/init': {
      t: '/init',
      d: 'A Claude Code command. Type it and press Enter: Claude looks through your website’s files and writes a first CLAUDE.md for you.'
    },
    'plan mode': {
      t: 'Plan mode',
      d: 'A Claude Code setting where Claude only reads and suggests a plan. It changes nothing until you say yes.'
    },
    'manual mode': { t: 'Manual mode', d: 'A Claude Code setting where Claude asks before every change, and shows you exactly what it wants to change.' },
    '/rewind': {
      t: '/rewind',
      d: 'A Claude Code command that undoes Claude’s recent changes to your files. It can’t undo commands Claude ran, like deleting files.'
    },
    git: {
      t: 'Git',
      d: 'A save history for code, a bit like version history in Google Docs. Every saved point can be brought back.'
    },
    commit: {
      t: 'Commit',
      d: 'A saved point in Git: a snapshot of your files that you can go back to. Just ask Claude to “commit” and it makes one.'
    },
    branch: { t: 'Branch', d: 'A separate copy of the code for trying changes, without touching the main version of the site.' },
    diff: { t: 'Diff', d: 'A before-and-after view of a change: lines being removed show in red, lines being added in green.' },
    build: {
      t: 'Build',
      d: 'The step that turns a website’s code into the finished site. If the build fails, something is broken, so it’s a quick health check.'
    },
    lint: { t: 'Lint', d: 'An automatic checker that spots mistakes and messy code, like a spell-checker for code.' },
    tests: { t: 'Tests', d: 'Small automatic checks that confirm the site still works after a change. Not every website has them.' },
    staging: { t: 'Staging site', d: 'A private copy of the website for trying changes safely before they go on the real site.' },
    'live site': { t: 'Live site', d: 'The real website that visitors and clients see.' },
    deploy: { t: 'Deploy', d: 'Putting changes onto the live website.' },
    '.env file': {
      t: '.env file',
      d: 'A private file that holds a website’s passwords and secret keys. Never share it or paste it into a chat.'
    },
    'api key': { t: 'API key', d: 'A secret code that lets one app use another app’s service. Treat it like a password.' },

    /* ---------- SEO and marketing ---------- */
    'meta description': { t: 'Meta description', d: 'The short summary that shows under a page’s title in Google results.' },
    'title tag': { t: 'Title tag', d: 'A page’s title: the blue link in Google results and the text on the browser tab.' },
    canonical: { t: 'Canonical URL', d: 'The main web address of a page, so search engines don’t treat copies of it as separate pages.' },
    'structured data': {
      t: 'Structured data (JSON-LD)',
      d: 'Extra code that tells search engines exactly what a page is about, like a product’s price or its reviews.'
    },
    redirect: {
      t: '301 redirect',
      d: 'A permanent forward from an old web address to a new one, so visitors and Google end up on the right page.'
    },
    'core web vitals': { t: 'Core Web Vitals', d: 'Google’s measures of how fast and steady a page feels to the people visiting it.' },
    wcag: { t: 'WCAG', d: 'The international rules for making websites usable by people with disabilities.' },
    csv: { t: 'CSV', d: 'A simple spreadsheet file that almost every tool can open and export.' },
    utm: { t: 'UTM tags', d: 'Labels added to the end of a link, so your analytics show exactly where each visitor came from.' },
    'search console': { t: 'Search Console', d: 'Google’s free tool that shows how your site appears in Google search, and what people searched to find it.' }
  };
})();
