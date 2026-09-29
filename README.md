# Claude Power-Up

**“Stop using Claude like Google.”**

> New here, or continuing with a different Claude? Read [START-HERE.md](START-HERE.md) (history, links, status and next steps) and [CLAUDE.md](CLAUDE.md) (how the code works).

An interactive training for the Brij Design Studio (BDS) team. People learn to use Claude properly: better prompts, context, step-by-step workflows, which model and effort to pick, research, files, Projects, Cowork (including how to set it up), connecting tools like Canva and Adobe so Claude can work in them, and Claude Code. It ends with a challenge on their own real work. There's also a bonus level for web developers.

It's built like a product, not a course: XP, ranks, levels, quizzes, a prompt builder, simulated Claude chats, “fix this prompt” challenges with instant feedback, and a certificate with a personal cheat sheet at the end.

## Open it

- **Quickest:** open `dist/claude-power-up.html` in any browser. It's one file with everything inside, so you can also email it, put it on Google Drive or upload it to your intranet.
- **From this folder:** open `index.html`.
- **As a website:** turn on GitHub Pages for this repo (Settings → Pages → deploy from the main branch). The site is `index.html`.

Progress, XP and anything people write are saved in their own browser. Nobody else sees it.

## The levels

| # | Level | What people do |
|---|---|---|
| 0 | The wake-up call | Watch two employees get very different results, then rescue a bad prompt |
| 1 | Stop writing terrible prompts | Learn the 6-part brief, build a prompt, spot missing pieces, write their own, get AI to help write prompts |
| 2 | Think in context, not questions | Pack a briefing kit, press “Add context” and watch an answer improve |
| 3 | Make Claude work like an employee | Run a 6-step workflow, browse 13 agency workflows, order steps, pick the right model and effort |
| 4 | Claude for your actual job | 11 departments (including Web & SEO) × 5 ready-made prompts they can fill in and save |
| 5 | Research, files & images | Send screenshots to Claude, research with sources, verify facts |
| 6 | Projects, memory & reusable context | Set up a client Project and see a 9-word prompt get on-brand work, then make a real one step by step |
| 7 | Claude Cowork | Delegate a monthly report, decide what Claude may delete, and set Cowork up step by step |
| 8 | Claude as the brain: connect your tools | Connect Canva, Adobe, ImagineArt, Meta Ads and more, then watch one request run a job across five apps |
| 9 | Claude Code without being a coder | “Build” a caption checker or UTM builder, then build a real tool in a normal chat |
| 10 | Build your own AI workflow | Design a repeatable workflow, get a master prompt and save it as a Skill |
| Final | The real work challenge | Brief a real task, do it in Claude with a focus clock, get the certificate |
| Bonus | Claude Code for web & SEO | Starts from zero: what Claude Code is, one-time setup, a screen-by-screen session, habits explained simply, 10 SEO and web prompts, safety |

## Good to know

- **Simulated chats** use pre-written example answers, so everyone sees the same thing. They're labelled “Simulated”.
- **Prompt scores** come from an automatic checklist (role, context, audience, goal, rules, format…). It checks for the parts of a good brief, not creativity.
- **Live Claude:** when the page is published as a Claude artifact and opened inside Claude, “Try it with real Claude” boxes appear on the writing challenges. They use the viewer's own Claude account and ask permission first.
- **Tap a word to see what it means.** Words with a dotted underline (like CLAUDE.md, connector or effort) open a plain-English explanation. The full list is under “Words to know” in the cheat sheet. To add or change a word, edit `assets/js/glossary.js`, then write `[[word]]` in any lesson text.
- **“Try it now” checklists** walk people through the real app step by step (turning on web search, making a Project, changing the model and effort, saving a Skill, setting up Cowork and Claude Code).
- **The bonus level** is optional and always open. It isn't needed for the certificate. To send someone straight to it, add `#bonus` to the end of the link.
- **Preview mode** lets managers and trainers skim everything: every level opens, every question shows its answer, and the step dots jump anywhere. Nothing is scored or saved. Turn it on in Settings, or add `#preview` to the end of the link.
- The page works on phones, and in light and dark mode.

## Progress reports to a Google Sheet

The training can send each person's progress to a Google Sheet you own. You get a **People** tab with one row per person (progress, levels done, active time, pace, rushed steps, quiz score, best prompt score, XP, certificate) and a **Levels** tab showing where each person spent time or rushed. Active time only counts while the page is open and the person is active.

Setup takes a few minutes: see `tools/google-sheet/README.md`. It's off until you paste the Sheet's link into `assets/js/brand.js`. Staff see a note saying their progress is shared. Open the link in a browser any time to see which Sheet it fills and when progress last arrived.

## Agency name and logo

Both live in `assets/js/brand.js`. To show the logo, put the file in `assets/brand/` (for example `assets/brand/bds-logo.png`) and set `logo: 'assets/brand/bds-logo.png'`. It appears in the top bar, on the opening screen and on the certificate. Run `python3 tools/build.py` afterwards so the shareable files include it.

## Change the content

All the words live in `assets/js/levels/` (one file per level). Edit the text, save, and refresh the page.

- Level structure and behaviour: `assets/js/components.js`
- App shell (top bar, level list, navigation): `assets/js/app.js`
- Look and feel: `assets/styles.css`

After editing, rebuild the single-file version:

```
python3 tools/build.py
```

This updates `dist/claude-power-up.html` (to share) and `dist/artifact.html` (to publish as a Claude artifact).

To click through every step automatically and check nothing broke (needs Playwright):

```
node tools/smoke-test.js
```

Not an official Anthropic product. Product details (Projects, memory, Cowork, Claude Code, models and effort levels) were checked against Claude's help centre and docs in September 2026. Features and model names change, so review Levels 3 and 6–9 and the bonus level every few months. To update model names, search the code for “Sonnet”: they appear in Level 3, the bonus level and the cheat sheet.
