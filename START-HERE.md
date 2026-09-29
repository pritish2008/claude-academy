# Claude Power-Up: start here

*Snapshot from 29 September 2026. Everything about this project so far, in one place.*

## If you're a Claude picking this up

1. Read this file first. Then read `CLAUDE.md`, which explains how the code works and the rules for the content.
2. The owner may ask you to change the training, or to finish the open problem in section 6: progress isn't reaching the Google Sheet yet.
3. Talk to the owner in short, plain English, with no jargon. Always say the next step and how to do it. Ask when something is unclear. They use a Mac and Chrome.
4. After any change, run `python3 tools/build.py` and give the owner the new `dist/claude-power-up.html`.

**A first message the owner can paste:**

> This is my Claude Power-Up training project. Read START-HERE.md and CLAUDE.md, then tell me in 3 short lines where things stand and what you'd do next.

---

## 1. What it is

**Claude Power-Up** (tagline: "Stop using Claude like Google.") is an interactive training for the staff of **Brij Design Studio (BDS)**, a design and marketing agency. It teaches non-technical people to use Claude properly in their everyday work.

- **It feels like a product or a game, not a course.** It has XP, ranks, levels, quizzes, a prompt builder, simulated Claude chats, "fix this prompt" challenges with instant feedback, and a certificate with a personal cheat sheet at the end.
- **It teaches by doing:** explain, show, let them try, give feedback, then apply it to real work.
- **It's honest.** Example chats are labelled "Simulated", and prompt scores come from a fixed checklist. Claude never grades anything.
- **It's BDS-branded** with the name and logo, and shows no time estimates (the owner asked for that).
- **It works everywhere:** on phones, in light and dark mode, and as one file that opens in any browser.

---

## 2. Links and files

| What | Where |
|---|---|
| **The training to share with staff** | `dist/claude-power-up.html` in this folder. It's one file: email it, WhatsApp it or put it on Google Drive. Staff download it and double-click it. |
| Claude link version (for previewing) | https://claude.ai/artifact/EW5gWL3mzSYVjaPKTCi2PF (private to the owner). It **doesn't send progress** to the Google Sheet, because pages inside Claude can't send data to outside sites. |
| Source code on GitHub | https://github.com/pritish2008/claude-academy, branch `claude/power-up-training-experience-c0b531`. All the work is on this branch. It isn't merged into `main`, and there's no pull request. |
| Google Apps Script (the code that fills the Sheet) | https://script.google.com/u/0/home/projects/1EG4P_mG7d2p7Z9SyY8vCZAXxYcwQeLZrdmAZmVlWHJDOHG1YkOEjwteK/edit |
| Report link, which is also the check page | https://script.google.com/macros/s/AKfycbwej8lXy97M_giB33ZAmYQA73NFITM1yTBGAnERS5HHNRq3fdzi1AaxzmZEkhq-waj8Jg/exec |
| Report key | `bds-pu-7k3q9x2m`. It must match in `assets/js/brand.js` and `tools/google-sheet/Code.gs`. It keeps junk out, but it isn't a password. |
| The Google Sheet | In the owner's Google Drive, probably named "Untitled spreadsheet". Once the fix in section 6 is in, the check page has an **Open your Google Sheet** link. |

---

## 3. The training, level by level

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

The bonus level is optional, is always open, and isn't needed for the certificate. It's meant for the web developer. Add `#bonus` to the end of the link to open it directly.

### How ready staff will be afterwards

| | Before | After |
|---|---|---|
| How they ask | One-line questions | Clear requests with background and rules |
| What they get | Generic answers | Usable first drafts |
| Checking | Copy and paste | Check facts, numbers and tone |
| What they use | Chat only | Chat, Projects, Cowork, connected tools, small tools |

- **Ready from day one:** writing clear requests, everyday writing and research, improving drafts, and picking the model and effort.
- **Needs a bit of practice:** client Projects, handing bigger jobs to Cowork, connecting tools, and building small tools and Skills.
- **Not covered yet:** clear rules on client data, design work (Claude Design, Canva and Adobe in depth), and examples from branding and packaging work.

---

## 4. What's in the product

- **Game layer:** XP, ranks, progress bar, level map, confetti, and a certificate with a personal cheat sheet.
- **Activities:** quizzes, multiple choice, sorting, putting steps in order, before/after comparisons, simulated chats, a prompt builder, and prompt writing scored by a checklist.
- **Plain-English help:**
  - Tap any word with a dotted underline to see what it means, such as CLAUDE.md, connector or effort. The cheat sheet has a full "Words to know" list.
  - "Try it now" checklists walk people through the real Claude app, click by click.
- **Ready-made material:** 55 fill-in prompts (11 departments × 5), 13 agency workflows, and 10 SEO and web prompts in the bonus level.
- **Preview mode:** managers can skim every level and see every answer without solving anything. Nothing is scored or saved. Turn it on in Settings, or add `#preview` to the link.
- **Live Claude (Claude link version only):** "Try it with real Claude" boxes appear on the writing challenges. They use the viewer's own Claude account and ask permission first.
- **Progress reports to a Google Sheet:**
  - A **People** tab with one row per person: progress, levels done, active time, pace, rushed steps, quiz score, best prompt score, XP, rank and certificate.
  - A **Levels** tab showing where each person spent time or rushed.
  - Staff are told on the first screen that their progress is shared, and they must enter a name.

**How the pace numbers work:**
- **Active time** only counts while the page is open and the person clicked, typed or scrolled in the last 90 seconds.
- A step is **rushed** if it was finished faster than a quick skim (480 words a minute, with a 4-second minimum).
- **Pace** can be:
  - **Rushing:** 40% or more of the steps were rushed, or they spent under 35% of the reading time (240 words a minute).
  - **Thorough:** at least 90% of the reading time, and under 20% of steps rushed.
  - **Good pace:** anything in between.

These are estimates: a reason for a chat, not a verdict.

---

## 5. The whole conversation, in order

1. **The brief.** Build "Claude Power-Up". It's an interactive, premium, game-like training for non-technical marketing staff:
   - short levels, from a wake-up call to building their own workflow, ending with a real-work challenge;
   - constant doing, instant feedback, and professional rather than childish.

   *Done: the whole training was built.*
2. **"Add our agency name and logo. Don't say it's 50 minutes or put any time on it."** *Done: BDS name and logo from the BDS website, and every time number removed.*
3. **"What's the most important thing I'm missing?"** *Advice given:*
   - Give each client a shared Claude Project (brand guidelines, tone, approved work, rules), plus one BDS house-style Project. Sharing needs a Team plan.
   - Swap in examples from BDS's real work: branding, packaging and web.
4. **"The text looks too AI; make it more professional."** *Done: cleaner, more professional wording.*
5. **"Let me skim every level and question without solving them."** *Done: Preview mode.*
6. **"Add how to connect Cowork, something for our web developer who does SEO coding, which model and effort to use, and using ChatGPT-style AI to help write prompts."** *Done:*
   - Cowork setup (Level 7);
   - model and effort (Level 3);
   - an AI prompt helper (Level 1);
   - a bonus level for web and SEO.
7. **"What are we missing to fully educate staff and make it stick?"** *Advice given (see section 7), with three questions that are still open.*
8. **"Too much is just dumped there. Staff won't know what CLAUDE.md or /init is. Be more basic."** And: **"Effort applies to everyone, not just web and SEO."** *Done:*
   - step-by-step "how to" sections and "Try it now" checklists;
   - tap-to-explain words;
   - the bonus level rewritten from zero;
   - the model and effort lesson made for everyone.
9. **"Explain in simple words what staff will learn and how equipped they'll be."** *Answered (see section 3).*
10. **"Add how to connect Canva, Adobe, ImagineArt and so on, with Claude as the brain doing the work."** *Done: new Level 8.*
11. **"Save this app so I can share it."** *Done: the one-file version and the Claude link.*
12. **"Can we create a backend where the data comes to me?"** The owner chose a Google Sheet and wanted progress, scores, and whether people really spend time learning or rush through. *Done: progress reports with active time, pace and rushed steps.*
13. **Setting up the Sheet.** The owner made a Google Sheet, pasted the Apps Script code, deployed it and sent the report link.
   - Claude explained it runs on a cloud computer and can't click inside the owner's Google account.
   - *Done: reporting switched on in the training file.*
14. **"My name isn't showing."**
   - The training file was tested: it sends the name the moment Start is clicked, so the problem is on the Google side.
   - *Done:* new Apps Script code, with a check page and a fallback Sheet, plus steps for the owner.
   - **Not yet confirmed as fixed** (see section 6).
15. **"Summarise this for my other Claude with Cowork, so it can solve this."** *Done: a handoff file plus the training file were sent (27 September).*
16. **"Summarise everything, with the product, in a single file."** *This bundle.*

---

## 6. Open problem: progress isn't reaching the Google Sheet

**The symptom:** the owner typed their name in the training and clicked Start, but their name didn't appear in the Sheet.

**What's already known:**
- **The training file works.** Opened from disk in a browser, it sends a report as soon as Start is clicked. This was tested with a stand-in receiver.
- **The new Apps Script code works** against a fake Google Sheet, whether or not the script is attached to a Sheet.
- **The real Google setup is untested.** The Claude that built this ran on a cloud computer that couldn't reach Google.

**Check this first.** Open the report link (section 2).
- **Old code:** you only see the line "Claude Power-Up progress receiver is running."
- **New code:** you also see **Open your Google Sheet** and **Last progress saved: …** (or **No progress has arrived yet.**).

**Likely causes, most likely first:**
1. **Who has access** isn't set to **Anyone**. The training sends without a Google sign-in, so any other setting blocks it. The owner opening the link while signed in still sees the page, which hides the problem.
2. The training was opened somewhere that can't send: inside the Claude app, from the Claude link, from an old copy, or in a phone preview.
3. The script was made at script.google.com instead of from the Sheet's **Extensions → Apps Script**. The old code then fails on every report. The new code fixes this by making its own Sheet.
4. The owner is looking at a different Sheet.

### The fix

1. **Paste the new code.** Open the Apps Script project, open **Code.gs**, select all, delete, and paste all of `tools/google-sheet/Code.gs`. Save.
2. **Redeploy on the same link.**
   - Click **Deploy → Manage deployments**, then the **pencil icon**.
   - Set **Version** to **New version**, **Execute as** to **Me**, and **Who has access** to **Anyone**.
   - Click **Deploy**, and allow permissions if Google asks.
   - Don't use **New deployment**, because that changes the link.
3. **Test the link while signed out.** Open the report link in an Incognito window. You should see the check page, not a Google sign-in page.
4. **Test the training.**
   - Double-click `dist/claude-power-up.html` so it opens in Chrome, type a name, and click **Start Level 0**.
   - The check page should then say **Last progress saved: just now**.
   - Click **Open your Google Sheet**. The name should be in **People**.
5. **See what happened (optional).** In Apps Script, the **Executions** page in the left sidebar shows each report and any error.
6. **If the link ever changes,** put the new link in `assets/js/brand.js` (`sheet.url`), run `python3 tools/build.py`, and share the new file.

There's more help in `tools/google-sheet/README.md`.

A test report without the training (the reply should be `ok`; delete the "Test (delete me)" row afterwards):

```bash
curl -sL -H 'Content-Type: text/plain;charset=utf-8' \
  --data '{"key":"bds-pu-7k3q9x2m","v":1,"person":{"id":"p_test_delete_me","name":"Test (delete me)","progress":0,"levelsDone":"0 of 12","xp":0,"lastActive":"2026-09-29T12:00:00Z"},"levels":[]}' \
  'https://script.google.com/macros/s/AKfycbwej8lXy97M_giB33ZAmYQA73NFITM1yTBGAnERS5HHNRq3fdzi1AaxzmZEkhq-waj8Jg/exec'
```

---

## 7. Advice given to the owner (not acted on yet)

**Missing from the training:**
- **Rules for client data:**
  - what never goes into Claude: passwords, bank details, customers' personal details, and anything under an NDA without the client's OK;
  - always use the work account;
  - check facts, numbers, claims and copyright before anything reaches a client.
- **Design work.** BDS is a design studio, but the training is mostly about writing. It should cover Claude Design and working in Canva and Adobe.
- **Skills,** which save a way of working (like "BDS house style") for everyone to reuse. The training covers this only briefly.
- **Examples from BDS's own work:** branding, packaging and websites, not mostly social media and ads.

**Needed to make it stick:**
- One company plan (Claude Team). It lets the team share Projects and Skills, and Team chats aren't used to train Claude.
- A shared Project for each main client, plus one for BDS house style.
- A one-page AI policy that everyone reads and agrees to.
- A way to see who finished. The Google Sheet now covers this.
- A "Claude champion" in each team, a short weekly "one thing that worked" share, and a shared list of prompts that work. Time 3 repeat jobs before and after, to show the time saved.

**Rollout:** try it with 2–3 people first, including the web developer. Ask what confused them, fix that, then give it to everyone.

---

## 8. Open questions for the owner

1. Is BDS on a Claude **Team** plan, or does everyone use a personal account? On a Team plan, an Owner must switch on connectors for everyone.
2. Which 2–3 clients should get a shared Claude Project first?
3. Should these be built next?
   - a data-safety level, plus the one-page AI policy;
   - a "Claude for designers" level (Claude Design, Canva, Adobe, and BDS-style examples).
4. Keep the 30-minute focus clock in the Final, and the "60 seconds" and "30 minutes a week" lines?
5. Will staff get the file, or a web link? A web link (for example Netlify Drop or GitHub Pages) is easier, because staff just click it.

---

## 9. Suggested next steps

1. Confirm the Google Sheet works (section 6).
2. Try the training with 2–3 people, including the web developer, and fix what confused them.
3. Get answers to section 8, then build what the owner picks.
4. Share it with everyone, and check the Sheet weekly.
5. Every few months, re-check product facts (menus, model names, effort levels, Cowork, connectors), because Claude changes fast. Model names appear in Level 3, the bonus level and the cheat sheet (search the code for "Sonnet").
