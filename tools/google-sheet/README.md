# Progress reports in a Google Sheet

When this is set up, the training sends each person's progress to a Google Sheet you own. It fills two tabs:

- **People:** one row per person, with progress, levels done, active time, pace, rushed steps, quiz score, best prompt score, XP, rank, certificate date and when they were last active.
- **Levels:** one row per person per level, with the time they spent against the time the level takes to read, their pace, rushed steps and quiz score.

## What the numbers mean

- **Active time** only counts while the training is open on screen and the person has clicked, typed or scrolled in the last 90 seconds. A tab left open overnight doesn't count.
- **Time needed to read** is the level's text at 240 words a minute.
- **Rushed step:** a step finished faster than even a quick skim (480 words a minute, and at least 4 seconds).
- **Pace:**
  - **Rushing:** 40% or more of the steps were rushed, or they spent less than a third of the reading time.
  - **Thorough:** they spent at least 90% of the reading time, and fewer than 20% of the steps were rushed.
  - **Good pace:** anything in between.
- **Quiz score %:** how well they did on the quizzes and sorting exercises. Getting a quiz right first time scores 100%, getting it on the second try scores 50%.
- Each device counts separately. Someone who switches from their laptop to their phone gets a second row.

These are estimates. Treat them as a conversation starter, not a verdict.

## Set it up (one time)

1. Create a new Google Sheet (go to sheets.new) and name it “Claude Power-Up progress”.
2. In the Sheet, click **Extensions → Apps Script**.
3. Delete everything in the editor, paste in all of `Code.gs` from this folder, and click the **Save** icon.
4. Click **Deploy → New deployment**. Click the gear icon next to “Select type” and choose **Web app**.
5. Set **Execute as** to **Me**, and **Who has access** to **Anyone**. Click **Deploy**.
6. Google asks you to authorise it. Click **Authorize access** and pick your account. If you see “Google hasn’t verified this app”, click **Advanced**, then **Go to (your project) (unsafe)**. It’s your own script, so this is fine. Then click **Allow**.
7. Copy the **Web app URL** (it ends in `/exec`).
8. Paste it into `assets/js/brand.js`, under `sheet`, as `url`. Then run `python3 tools/build.py` and share the new `dist/claude-power-up.html`.

To check it works, open the Web app URL in your browser. It should say “Claude Power-Up progress receiver is running.”

## Good to know

- The training only sends data when the link is set, and never in Preview mode.
- Staff see a note on the opening screen, and in Settings, saying their progress is shared.
- The key in `Code.gs` must match `key` in `brand.js`. It stops random junk getting into your Sheet, but it isn't a password. Anyone who opens the training file could find it.
- If you change `Code.gs` later, use **Deploy → Manage deployments → Edit → New version**, so the link stays the same.
