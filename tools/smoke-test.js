// Clicks through every step of Claude Power-Up in a headless browser, doing
// each activity, and reports script errors, stuck steps and sideways scrolling.
//
// Usage:   node tools/smoke-test.js
// Options: WIDTH=390 HEIGHT=844 DARK=1 node tools/smoke-test.js
// Needs Playwright (npm i -D playwright), with a Chromium browser installed.
const path = require('path');

let playwright;
try {
  playwright = require('playwright');
} catch (e) {
  console.error('Playwright is not installed. Run: npm i -D playwright');
  process.exit(1);
}

const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
const W = +(process.env.WIDTH || 1280);
const H = +(process.env.HEIGHT || 900);
const SAMPLE =
  'You’re a short-form video strategist for restaurants. Our client is Dakshin Table, a premium South Indian restaurant in Bandra, Mumbai. ' +
  'Audience: 25–40 year-old professionals. Goal: more weekend brunch bookings. Give me 5 Instagram Reel concepts and 3 captions for the new filter coffee tiramisu dessert. ' +
  'For each: a title, a hook, shots and on-screen text. Rules: under 30 seconds, no clichés.';

(async () => {
  const browser = await playwright.chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    reducedMotion: 'reduce',
    colorScheme: process.env.DARK ? 'dark' : 'light'
  });
  const page = await ctx.newPage();
  const problems = [];
  page.on('pageerror', (e) => problems.push('script error: ' + e.message));
  await page.goto(URL);
  await page.waitForSelector('.hero');

  const pos = () =>
    page.evaluate(() => {
      const p = PU.state.pos;
      const L = PU.levels[p.level];
      return { level: p.level, step: p.step, type: L.steps[p.step].type, key: L.id + '.' + p.step, last: p.step === L.steps.length - 1 };
    });
  const isDone = (key) => page.evaluate((k) => !!PU.state.stepsDone[k], key);
  const btn = (name) => page.getByRole('button', { name, exact: typeof name === 'string' });

  const handlers = {
    hero: async () => {
      await page.fill('#pu-name', 'Tester');
      await page.click('.hero .btn-primary');
    },
    poll: () => page.locator('.options .opt').first().click(),
    showdown: () => btn('Run both prompts').click(),
    quiz: async () => {
      const opts = page.locator('.options .opt');
      for (let i = 0; i < (await opts.count()); i++) {
        if (await page.locator('.opt.is-right').count()) break;
        if (!(await opts.nth(i).isDisabled())) await opts.nth(i).click();
      }
    },
    multi: async () => {
      await page.locator('.toggle-list .toggle').first().click();
      await btn('Check').click();
    },
    write: async () => {
      await page.fill('.editor textarea', SAMPLE);
      await btn('Check my prompt').click();
    },
    builder: async () => {
      const rows = page.locator('.slot');
      for (let i = 0; i < (await rows.count()); i++) await rows.nth(i).locator('.chip').first().click();
      await btn('Run this prompt').click();
    },
    tiers: async () => {
      const tabs = page.locator('.tabs .tab');
      for (let i = 0; i < (await tabs.count()); i++) await tabs.nth(i).click();
    },
    cards: async () => {
      while (await page.locator('button.rcard').count()) await page.locator('button.rcard').first().click();
    },
    guide: async () => {
      const ticks = page.locator('.guide-tick');
      for (let i = 0; i < (await ticks.count()); i++) await ticks.nth(i).click();
    },
    chat: async (info) => {
      for (let k = 0; k < 400 && !(await isDone(info.key)); k++) {
        const b = page.locator('.composer .btn-primary');
        if (!(await b.isDisabled())) await b.click();
        await page.waitForTimeout(100);
      }
    },
    guesses: () => page.getByRole('button', { name: /Look inside/ }).click(),
    contextsim: async (info) => {
      for (let k = 0; k < 400 && !(await isDone(info.key)); k++) {
        const b = page.locator('.ctx-grid .btn-primary');
        if (!(await b.isDisabled())) await b.click();
        await page.waitForTimeout(100);
      }
    },
    flow: () => page.getByRole('button', { name: /Run the whole workflow/ }).click(),
    library: async () => {
      await page.locator('.step .chips .chip').nth(0).click();
      await page.locator('.step .chips .chip').nth(1).click();
    },
    order: async () => {
      const pool = page.locator('.order-cols .order-box').first().locator('button.order-item');
      while (await pool.count()) await pool.first().click();
      await btn('Check order').click();
    },
    sort: async () => {
      const rows = page.locator('.sort-row');
      for (let i = 0; i < (await rows.count()); i++) await rows.nth(i).locator('.seg button').first().click();
      await btn('Check answers').click();
    },
    menu: async () => {
      await page.locator('.dept').nth(0).click();
      await page.locator('.dept').nth(1).click();
    },
    screens: async () => {
      await btn('Attach & send').click();
    },
    project: async () => {
      const t = page.locator('.proj .toggle');
      for (let i = 0; i < (await t.count()); i++) await t.nth(i).click();
      await page.getByRole('button', { name: /Start a chat/ }).click();
    },
    cowork: async () => {
      await btn('Start task').click();
      await page.getByRole('button', { name: /Looks good/ }).click();
      await page.getByRole('button', { name: /Deny/ }).click({ timeout: 20000 });
    },
    build: async () => {
      await page.locator('button.rcard').first().click();
      await btn('Send to Claude Code').click();
      await page.waitForSelector('.browser', { timeout: 20000 });
    },
    wfbuilder: async () => {
      await page.locator('.wf-q').nth(0).locator('.chip').first().click();
      await btn('Generate my workflow').click();
    },
    mission: async () => {
      await page.fill('#m-role', 'a senior social media strategist');
      await page.fill('#m-context', 'Luma Skin, a skincare brand for sensitive skin, audience 22–35');
      await page.fill('#m-goal', 'more saves and website visits');
      await btn('Complete the mission').click();
    }
  };

  // Do each step's activity, press Continue, and repeat until stop(step) is true.
  async function walk(stop) {
    let last = '';
    for (let guard = 0; guard < 200; guard++) {
      const info = await pos();
      const tag = 'Level ' + info.level + ' step ' + (info.step + 1) + ' (' + info.type + ')';
      if (tag === last) {
        problems.push('stuck at ' + tag);
        return;
      }
      last = tag;
      try {
        if (handlers[info.type]) await handlers[info.type](info);
      } catch (e) {
        problems.push(tag + ': ' + e.message.split('\n')[0]);
      }
      await page.waitForTimeout(100);
      const sideways = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (sideways > 1) problems.push('page scrolls sideways by ' + sideways + 'px at ' + tag);
      if (stop(info)) return;
      const after = await pos();
      if (after.level === info.level && after.step === info.step) {
        try {
          await page.waitForFunction(() => {
            const b = document.querySelector('.actionbar .btn-primary');
            return b && !b.hidden && !b.classList.contains('is-locked');
          }, null, { timeout: 25000 });
          await page.click('.actionbar .btn-primary');
        } catch (e) {
          problems.push('could not continue from ' + tag);
          return;
        }
      }
    }
  }

  // The main path, from the opening screen to the certificate.
  await walk((info) => info.type === 'certificate');

  // The bonus level isn't on the main path: open it from the level list.
  try {
    await page.click('.brand');
    await page.locator('.drawer button.level-item').last().click();
    const at = await pos();
    const isBonus = await page.evaluate((i) => !!PU.levels[i].optional, at.level);
    if (!isBonus) problems.push('the last item in the level list is not the bonus level');
    else await walk((info) => info.last);
  } catch (e) {
    problems.push('could not open the bonus level: ' + e.message.split('\n')[0]);
  }

  const xp = await page.evaluate(() => PU.state.xp);
  console.log('Finished with ' + xp + ' XP.');
  console.log(problems.length ? 'Problems:\n- ' + problems.join('\n- ') : 'No problems found.');
  await browser.close();
  process.exit(problems.length ? 1 : 0);
})();
