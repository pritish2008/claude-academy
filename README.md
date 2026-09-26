# Claude Power-Up

**“Stop using Claude like Google.”**

An interactive training for the Brij Design Studio (BDS) team. People learn to use Claude properly: better prompts, context, step-by-step workflows, research, files, Projects, Cowork and Claude Code. It ends with a challenge on their own real work.

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
| 1 | Stop writing terrible prompts | Learn the 6-part brief, build a prompt, spot missing pieces, write their own |
| 2 | Think in context, not questions | Pack a briefing kit, press “Add context” and watch an answer improve |
| 3 | Make Claude work like an employee | Run a 6-step workflow, browse 13 agency workflows, order steps |
| 4 | Claude for your actual job | 10 departments × 5 ready-made prompts they can fill in and save |
| 5 | Research, files & images | Send screenshots to Claude, research with sources, verify facts |
| 6 | Projects, memory & reusable context | Set up a client Project and see a 9-word prompt get on-brand work |
| 7 | Claude Cowork | Delegate a monthly report and decide what Claude may delete |
| 8 | Claude Code without being a coder | “Build” a caption checker or UTM builder, then actually use it |
| 9 | Build your own AI workflow | Design a repeatable workflow and get a master prompt |
| Final | The real work challenge | Brief a real task, do it in Claude with a focus clock, get the certificate |

## Good to know

- **Simulated chats** use pre-written example answers, so everyone sees the same thing. They're labelled “Simulated”.
- **Prompt scores** come from an automatic checklist (role, context, audience, goal, rules, format…). It checks for the parts of a good brief, not creativity.
- **Live Claude:** when the page is published as a Claude artifact and opened inside Claude, “Try it with real Claude” boxes appear on the writing challenges. They use the viewer's own Claude account and ask permission first.
- **Preview mode** lets managers and trainers skim everything: every level opens, every question shows its answer, and the step dots jump anywhere. Nothing is scored or saved. Turn it on in Settings, or add `#preview` to the end of the link.
- The page works on phones, and in light and dark mode.

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

Not an official Anthropic product. Product details (Projects, memory, Cowork, Claude Code) were checked against Claude's help centre in September 2026. Features change, so review the Level 6–8 wording every few months.
