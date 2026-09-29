# CLAUDE.md: Claude Power-Up

An interactive, game-like Claude training for Brij Design Studio (BDS) staff. It's plain HTML, CSS and JavaScript, with no framework and no install step. Open `index.html` to run it. `START-HERE.md` has the project history, links, current status and open questions. Read it first.

## Working with the owner

- The owner isn't technical. Keep replies short and plain, with no jargon. Always say the next step and how to do it. Ask when something is unclear.
- After any change to the training, run `python3 tools/build.py` and give the owner `dist/claude-power-up.html`. That's the file staff get.

## Rules for the content

- **Audience:** non-technical marketing and design staff. Avoid technical words. When one is unavoidable, add it to `assets/js/glossary.js` and write `[[word]]` (or `[[shown text|key]]`) so people can tap it for a plain-English meaning.
- **Teach by doing:** explain, show, let them try, give feedback, apply to real work. Keep steps short. Where people need to act in the real Claude app, use a `guide` step (a checklist) or a `howto` step (expandable steps).
- **No time estimates anywhere.** The owner asked for this.
- **Be honest:**
  - Example chats are pre-written and labelled "Simulated".
  - Prompt scores come from the fixed checklist in `core.js` (`PU.checks`, `PU.scorePrompt`). Never suggest Claude graded something.
- **Product facts were checked in September 2026:** menus, model names, effort levels, Cowork, connectors, plans and Skills. Check Claude's help centre before changing them. Model names appear in Level 3, the bonus level and the cheat sheet (search for "Sonnet").
- **Branding:** the BDS name, logo and Google Sheet link live in `assets/js/brand.js`.

## How the code is organised

`index.html` loads plain scripts in this order. They all share one global object, `window.PU`:

1. `core.js`
2. `brand.js`
3. `glossary.js`
4. `components.js`
5. `levels/level0.js` to `level10.js`
6. `final.js`
7. `bonus.js`
8. `tracking.js`
9. `app.js`

**`assets/js/core.js`** provides:
- the element builder: `PU.h('div.card#id', props, ...children)`;
- text formatting: `PU.md` for markdown and `PU.rich` for inline text, where `==highlight==` highlights a phrase;
- saved progress in `localStorage` under the key `claude-power-up:v1`, via `PU.state`, `PU.save` and `PU.saveNow`;
- XP and ranks (`PU.award`, `PU.RANKS`);
- events (`PU.on`, `PU.emit`);
- prompt scoring, toasts, copy and download helpers, and the live-Claude bridge.

**`assets/js/components.js`** holds:
- **Step types** (`PU.steps`): `hero`, `intro`, `quiz`, `multi`, `sort`, `order`, `poll`, `compare`, `showdown`, `guesses`, `builder`, `write`, `chat`, `guide`, `howto`, `cards`, `concept`, `flow`, `tiers`, `library`, `menu`, `mission`, `project`, `screens`, `contextsim`, `cowork`, `build`, `wfbuilder`, `summary`, `certificate`.
- **Level helpers:** `PU.levelLabel`, `PU.levelCode`, `PU.nextLevel`.
- The glossary pop-up, the tiles and the cheat sheet.

**`assets/js/levels/*.js`** has one file per level. Each sets `PU.levels[index] = { id, num, title, short, tagline, learn, steps: [...] }`.

The position in the list and the ID don't always match. IDs stay fixed, so saved progress survives reordering. The `LAYOUT` and `LEGACY_ORDER` migration in `app.js` handles older saves.

| Position | ID | File | Level |
|---|---|---|---|
| 0–7 | `L0`–`L7` | `level0.js`–`level7.js` | Levels 0–7 |
| 8 | `LC` | `level8.js` | Level 8, "Claude as the brain" |
| 9 | `L8` | `level9.js` | Level 9, Claude Code |
| 10 | `L9` | `level10.js` | Level 10, your own workflow |
| 11 | `LF` | `final.js` | Final |
| 12 | `LB` | `bonus.js` | Bonus. It has `optional: true`, is always open, and doesn't count towards progress or the certificate. |

**`assets/js/tracking.js`** measures active time and pace, and sends progress to the Google Sheet:
- It sends a `text/plain` POST using `fetch(..., {mode: 'no-cors'})`, and `sendBeacon` when the page closes.
- It never sends in Preview mode or before a name is entered.

**`assets/js/app.js`** runs the app itself:
- the top bar, the level list, moving between steps, and Settings;
- Preview mode (`#preview`);
- the `#bonus` and `#level-N` links;
- updating older saved progress.

**`assets/styles.css`** has all the styles. Colours are tokens, so light and dark mode both work, and it's built for phones first.

**`tools/build.py`** puts every file into one:
- `dist/claude-power-up.html` is the file to share.
- `dist/artifact.html` is for publishing as a Claude artifact. The Sheet link is blanked there, because pages hosted by Claude can't send data out.

**`tools/google-sheet/`** holds the Apps Script receiver (`Code.gs`) and its setup and troubleshooting guide.

**`tools/smoke-test.js`** clicks through every step in headless Chromium.

## Commands

- **Run:** open `index.html` in a browser.
- **Build:** `python3 tools/build.py`
- **Test:** run `npm i -D playwright` once, then `node tools/smoke-test.js`. Also try `WIDTH=390 HEIGHT=844 node tools/smoke-test.js` for a phone and `DARK=1 node tools/smoke-test.js` for dark mode. It should end with "No problems found."

## Watch out for

- **Never send test data to the real Google Sheet.** Tests must block `script.google.com` and stub `navigator.sendBeacon`, as `tools/smoke-test.js` does.
- **The name box:** it's required on the first screen only when a Sheet link is set and Preview mode is off.
- **Class names:** the glossary uses `.gloss`, `.gloss-pop` and `.gloss-missing`. `.term` belongs to the terminal mock-up in Level 9.
- **Plain text only:** the quiz `why` field is shown as plain text, so markdown and backticks won't render there.
- **Rebuild after every change.** The shareable file doesn't update itself.
- **If the Apps Script link changes,** update `sheet.url` in `brand.js` and rebuild. If `KEY` in `Code.gs` changes, update `sheet.key` in `brand.js` to match.
