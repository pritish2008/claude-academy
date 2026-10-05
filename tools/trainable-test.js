// Clicks through Trainable in headless Chromium with a pretend Claude.
// Usage: node tools/trainable-test.js   (WIDTH=390 HEIGHT=844 or DARK=1 also work)
// SHOTS=dir saves screenshots of each screen.
const path = require('path');
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (e) {
  ({ chromium } = require(path.join(process.env.NODE_PATH || '/opt/node22/lib/node_modules', 'playwright')));
}

const FILE = 'file://' + path.resolve(__dirname, '../dist/trainable.html');
const W = +process.env.WIDTH || 1280;
const H = +process.env.HEIGHT || 900;
const SHOTS = process.env.SHOTS;

// A stand-in for the artifact "sample" capability. It never contacts Claude.
const FAKE = `
window.__calls = [];
(function () {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function sample(input, opts) {
    window.__calls.push(input);
    const answers = input.filter((t, i) => i > 0 && t.role === 'user').length;
    const text = answers >= 4
      ? 'Thanks, that is everything I need. I will build your activity now.\\n<<DONE>>'
      : (answers ? 'Got it. ' : 'Hi, I am your Trainable coach! ') + 'Question ' + (answers + 1) + ': what do you do each week?';
    await wait(30);
    opts && opts.onText && opts.onText({ text, delta: text });
    return { text, truncated: false };
  }
  sample.json = async function (input, opts) {
    window.__calls.push(input);
    await wait(30);
    if (/Pull out what we learned/.test(input)) {
      return { role: 'You run sales at a bike shop.', tasks: 'Quotes and emails.', tools: 'Gmail', pains: 'Slow quotes', aiLevel: 'New', focus: 'Writing quotes' };
    }
    const t = '{"title":"Faster quotes"}';
    opts && opts.onText && opts.onText({ text: t, delta: t });
    return {
      title: 'Faster quotes with Claude', why: 'Quotes take ages.', skill: 'Giving background', teamNotes: 'Pair people up.',
      steps: [1, 2, 3, 4].map((n) => ({ title: 'Step thing ' + n, do: 'Do it.', prompt: 'Write a quote for [customer]', tip: 'Check prices.' })),
      quiz: [{ q: 'Best fix?', options: ['A', 'B', 'C'], answer: 2, why: 'Because C.' }, { q: 'Then?', options: ['X', 'Y'], answer: 0, why: 'X wins.' }],
      doneWhen: ['One', 'Two', 'Three'], next: ['Emails', 'Invoices', 'Reviews']
    };
  };
  window.claude = { use: (name) => Promise.resolve(name === 'sample' ? sample : null) };
})();
`;

(async () => {
  const problems = [];
  const browser = await chromium.launch();
  const shot = async (page, name) => SHOTS && page.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: true });

  async function run(label, mode, withClaude) {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, colorScheme: process.env.DARK ? 'dark' : 'light' });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => problems.push(label + ': ' + e.message));
    // Web fonts are optional; skip them so tests run offline.
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
    page.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && problems.push(label + ': console ' + m.text()));
    page.on('dialog', (d) => d.accept());
    if (withClaude) await page.addInitScript(FAKE);
    await page.goto(FILE);

    if (!withClaude) {
      await page.waitForSelector('.notice');
      await shot(page, label + '-welcome');
      await page.click('#example');
      await page.click('#build');
      await page.waitForSelector('.prompt-box');
    } else {
      if (mode === 'team') await page.click('text=My team');
      await page.waitForSelector('#start:not([disabled])');
      await shot(page, label + '-welcome');
      await page.click('#start');
      for (let i = 0; i < 4; i++) {
        await page.waitForSelector('#answer:not([disabled])');
        await page.fill('#answer', 'My answer number ' + (i + 1));
        await page.keyboard.press('Enter');
      }
      await page.waitForSelector('#to-summary');
      await shot(page, label + '-interview');
      const bubbles = await page.$$eval('.bubble', (b) => b.map((x) => x.textContent));
      if (bubbles.some((t) => t.includes('DONE'))) problems.push(label + ': DONE marker shown');
      if (bubbles.length !== 9) problems.push(label + ': expected 9 bubbles, got ' + bubbles.length);
      await page.click('#to-summary');
      await page.waitForSelector('#build');
      await page.fill('#f-focus', 'Writing quotes for bikes');
      await shot(page, label + '-summary');
      await page.click('#build');
      await page.waitForSelector('.prompt-box');
      const prompt = await page.evaluate(() => window.__calls[window.__calls.length - 1]);
      if (!prompt.includes('Writing quotes for bikes')) problems.push(label + ': edited summary not used');
      if (mode === 'team' && !(await page.$('text=Running it with your team'))) problems.push(label + ': team notes missing');
    }

    // Do the activity
    const steps = await page.locator('.step input[type=checkbox]').count();
    for (let i = 0; i < steps; i++) await page.locator('.step input[type=checkbox]').nth(i).check();
    if ((await page.locator('.step.done').count()) !== steps) problems.push(label + ': steps not marked done');
    const firstQ = await page.$$('.quiz-q');
    for (let i = 0; i < firstQ.length; i++) {
      await page.locator('.quiz-q').nth(i).locator('.quiz-opt').first().click();
    }
    if ((await page.$$('.feedback')).length !== firstQ.length) problems.push(label + ': quiz feedback missing');
    await page.click('.stars button >> nth=3');
    await page.fill('#reflection', 'Monday emails');
    await page.click('#finish');
    await page.waitForSelector('.done-banner');
    await shot(page, label + '-activity');

    // Reload keeps progress
    await page.reload();
    await page.waitForSelector('.done-banner');
    if ((await page.inputValue('#reflection')) !== 'Monday emails') problems.push(label + ': reflection not saved');

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (overflow) problems.push(label + ': page scrolls sideways');
    await ctx.close();
    console.log('ok  ' + label);
  }

  await run('example', 'me', false);
  await run('me', 'me', true);
  await run('team', 'team', true);
  await browser.close();
  if (problems.length) {
    console.log('\nProblems:\n- ' + problems.join('\n- '));
    process.exit(1);
  }
  console.log('No problems found.');
})();
