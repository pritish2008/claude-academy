/* ==========================================================================
   Claude Power-Up — app shell: top bar, level rail, step navigation,
   drawers (levels, cheat sheet, settings) and boot.
   ========================================================================== */
(function () {
  'use strict';

  var PU = window.PU;
  var h = PU.h;

  var root, xpPill, xpNum, rankChip, progressFill, rail, stageHead, stepsBar, stepHost, stageInner, previewBar;
  var backBtn, nextBtn, nextLabel, hintEl, actionbar;
  var leaveFns = [];
  var themeTouched = false;
  var nextEnabled = false;
  var building = false;

  function plain(t) {
    return String(t).replace(/==|\*\*/g, '');
  }
  function levelName(L) {
    return PU.levelLabel(L);
  }
  function stepKey(L, i) {
    return L.id + '.' + i;
  }

  /* ---------- level bookkeeping ---------- */

  function prepareLevels() {
    PU.levels = PU.levels.filter(Boolean);
    PU.levels.forEach(function (L, i) {
      if (typeof L.num !== 'number') L.num = i;
      var max = 0;
      L.steps.forEach(function (st) {
        if (st.type === 'summary') st.xp = 50;
        max += st.xp || 0;
      });
      L.maxXp = max;
    });
  }

  function levelProgress(L) {
    var n = 0;
    L.steps.forEach(function (s, i) {
      if (PU.state.stepsDone[stepKey(L, i)]) n++;
    });
    return n;
  }

  /** The main-path level before this one (bonus levels don't count). */
  function prevMain(idx) {
    for (var j = idx - 1; j >= 0; j--) if (!PU.levels[j].optional) return j;
    return -1;
  }

  /** Same, going forward. */
  function nextMain(idx) {
    for (var j = idx + 1; j < PU.levels.length; j++) if (!PU.levels[j].optional) return j;
    return -1;
  }

  /** Bonus levels are always open. Main levels open once the one before is done. */
  function isUnlocked(idx) {
    var L = PU.levels[idx];
    if (idx === 0 || L.optional || PU.state.unlockAll || PU.state.preview) return true;
    var prev = PU.levels[prevMain(idx)];
    return !prev || !!PU.state.levelsDone[prev.id] || levelProgress(L) > 0;
  }

  function overallPct() {
    var tot = 0;
    var done = 0;
    PU.levels.forEach(function (L) {
      if (L.optional) return;
      L.steps.forEach(function (s, i) {
        tot++;
        if (PU.state.stepsDone[stepKey(L, i)]) done++;
      });
    });
    return tot ? Math.round((done / tot) * 100) : 0;
  }

  /* ---------- shell ---------- */

  function buildShell() {
    root = document.getElementById('app');
    PU.clear(root);
    progressFill = h('span');
    xpNum = h('span', '0');
    xpPill = h('button.xp-pill', { type: 'button', title: 'Your XP and rank' }, PU.icon('bolt'), xpNum, h('span', 'XP'));
    xpPill.addEventListener('click', openLevels);
    rankChip = h('span.rank-chip.only-wide');
    var levelsBtn = h('button.icon-btn.only-narrow', { type: 'button' }, PU.icon('grid'), h('span.hide-sm', 'Levels'));
    levelsBtn.setAttribute('aria-label', 'Levels');
    levelsBtn.addEventListener('click', openLevels);
    var sheetBtn = h('button.icon-btn', { type: 'button', 'aria-label': 'Cheat sheet' }, PU.icon('book'), h('span.only-wide', 'Cheat sheet'));
    sheetBtn.addEventListener('click', openSheet);
    var setBtn = h('button.icon-btn', { type: 'button', 'aria-label': 'Settings' }, PU.icon('sliders'));
    setBtn.addEventListener('click', openSettings);
    var B = PU.brand || {};
    var brand = h(
      'button.brand',
      { type: 'button', 'aria-label': 'Claude Power-Up' + (B.name ? ' by ' + B.name : '') + ': show all levels' },
      B.logo ? h('span.brand-logo', h('img', { src: B.logo, alt: (B.name || 'Agency') + ' logo' })) : null,
      h('span.brand-mark', { class: B.logo ? 'with-logo' : '' }, PU.icon('bolt')),
      h('span.brand-text', h('span.brand-name', 'Claude Power-Up'), h('span.brand-tag.hide-sm', B.name ? 'by ' + B.name : 'Stop using Claude like Google'))
    );
    brand.addEventListener('click', openLevels);
    var topbar = h('header.topbar', brand, h('div.topbar-spacer'), rankChip, xpPill, levelsBtn, sheetBtn, setBtn, h('div.progress-line', { 'aria-hidden': 'true' }, progressFill));

    rail = h('aside.rail', { 'aria-label': 'Levels' });
    stageHead = h('div.stage-head');
    stepsBar = h('div.steps-bar', { role: 'group', 'aria-label': 'Steps in this level' });
    stepHost = h('div');
    var previewOff = h('button.btn.btn-ghost.btn-sm', { type: 'button' }, 'Turn off');
    previewOff.addEventListener('click', function () {
      setPreview(false);
    });
    previewBar = h(
      'div.preview-bar',
      { hidden: true, role: 'status' },
      PU.icon('eye', 'icon-sm'),
      h('span', h('b', 'Preview mode. '), 'Every level is open and every answer is shown. Nothing is scored or saved.'),
      previewOff
    );
    stageInner = h('div.stage-inner', { tabindex: '-1' }, previewBar, stageHead, stepsBar, stepHost);

    backBtn = h('button.btn.btn-ghost', { type: 'button', 'aria-label': 'Back' }, PU.icon('arrowLeft'), h('span.hide-sm', 'Back'));
    backBtn.addEventListener('click', goBack);
    nextLabel = h('span', 'Continue');
    nextBtn = h('button.btn.btn-primary', { type: 'button' }, nextLabel, PU.icon('arrowRight'));
    nextBtn.addEventListener('click', function () {
      if (!nextEnabled) {
        PU.toast('Finish the activity above to continue.', { icon: 'info' });
        nextBtn.classList.remove('shake');
        void nextBtn.offsetWidth;
        nextBtn.classList.add('shake');
        return;
      }
      goNext();
    });
    hintEl = h('div.hint', { 'aria-live': 'polite' });
    actionbar = h('nav.actionbar', { 'aria-label': 'Step navigation' }, h('div.actionbar-inner', backBtn, hintEl, nextBtn));

    var stage = h('main.stage', stageInner, actionbar);
    PU.put(root, topbar, h('div.layout', rail, stage));
  }

  function setNextEnabled(on) {
    nextEnabled = !!on || !!PU.state.unlockAll || !!PU.state.preview;
    nextBtn.classList.toggle('is-locked', !nextEnabled);
    nextBtn.setAttribute('aria-disabled', String(!nextEnabled));
  }

  function updateXP(animate) {
    xpNum.textContent = String(PU.state.xp);
    var r = PU.rankFor(PU.state.xp);
    PU.fill(rankChip, 'Rank: ', h('b', r.name));
    xpPill.setAttribute('aria-label', PU.state.xp + ' XP, rank ' + r.name + '. Show progress');
    if (animate && !PU.reduced) {
      xpPill.classList.remove('bump');
      void xpPill.offsetWidth;
      xpPill.classList.add('bump');
    }
  }

  function updateProgress() {
    progressFill.style.width = overallPct() + '%';
  }

  /* ---------- rail + level list ---------- */

  function rankCard() {
    var xp = PU.state.xp;
    var r = PU.rankFor(xp);
    var nx = PU.nextRank(xp);
    var pct = nx ? Math.round(((xp - r.min) / (nx.min - r.min)) * 100) : 100;
    return h(
      'div.rank-card',
      h('span.eyebrow', 'Your rank'),
      h('div.rank-name', r.name),
      h('div.bar.bar-marker', h('span', { style: { width: pct + '%' } })),
      h('div.rank-next', nx ? nx.min - xp + ' XP to ' + nx.name : r.desc)
    );
  }

  function levelList() {
    return h(
      'ol.level-list',
      PU.levels.map(function (L, i) {
        var done = !!PU.state.levelsDone[L.id];
        var locked = !isUnlocked(i);
        var cur = PU.state.pos.level === i;
        var prog = levelProgress(L);
        var b = h(
          'button.level-item',
          {
            type: 'button',
            class: [cur ? 'is-current' : '', done ? 'is-done' : '', locked ? 'is-locked' : ''].join(' '),
            'aria-current': cur ? 'step' : null
          },
          h('span.chip-swatch', { style: { '--sw': L.color }, 'aria-hidden': 'true' }, h('i'), h('b', PU.levelCode(L))),
          h(
            'span',
            h('span.li-title', L.short || plain(L.title)),
            h('span.li-meta', levelName(L) + ' · ' + (done ? 'done' : prog ? prog + ' of ' + L.steps.length + ' steps' : L.steps.length + ' steps'))
          ),
          h('span.li-status', done ? PU.icon('check') : locked ? PU.icon('lock', 'icon-sm') : null)
        );
        if (locked) b.setAttribute('aria-label', plain(L.title) + ' (locked)');
        b.addEventListener('click', function () {
          if (locked) {
            PU.toast('Finish ' + levelName(PU.levels[prevMain(i)]) + ' first. To look around, turn on Preview mode in Settings.', { icon: 'lock', ms: 3600 });
            return;
          }
          closeDrawer();
          goLevel(i);
        });
        return h('li', b);
      })
    );
  }

  function renderRail() {
    PU.fill(rail, 
      rankCard(),
      h('div.rail-head', h('span.eyebrow', 'Levels'), h('span.mono.small.muted', overallPct() + '% done')),
      levelList(),
      h(
        'div.rail-foot',
        h('div.rf-org', '© ' + new Date().getFullYear() + ' ' + ((PU.brand && PU.brand.name) || 'Claude Power-Up')),
        h('div', 'Internal training. For team use only.'),
        h('div', 'Not affiliated with Anthropic. Example chats are simulated.')
      )
    );
  }

  /* ---------- navigation ---------- */

  function runLeave() {
    var fns = leaveFns;
    leaveFns = [];
    fns.forEach(function (fn) {
      try {
        fn();
      } catch (e) {
        /* ignore */
      }
    });
  }

  function go(level, step) {
    PU.state.pos = { level: level, step: step };
    PU.save();
    render();
    window.scrollTo(0, 0);
    try {
      stageInner.focus({ preventScroll: true });
    } catch (e) {
      /* ignore */
    }
  }

  function goLevel(i) {
    var L = PU.levels[i];
    if (PU.state.pos.level === i) return go(i, PU.state.pos.step);
    if (PU.state.levelsDone[L.id]) return go(i, 0);
    var first = 0;
    for (var k = 0; k < L.steps.length; k++) {
      if (!PU.state.stepsDone[stepKey(L, k)]) {
        first = k;
        break;
      }
    }
    go(i, first);
  }

  function goNext() {
    var pos = PU.state.pos;
    var L = PU.levels[pos.level];
    var n = nextMain(pos.level);
    if (pos.step < L.steps.length - 1) go(pos.level, pos.step + 1);
    else if (n >= 0) go(n, 0);
  }

  function goBack() {
    var pos = PU.state.pos;
    var p = prevMain(pos.level);
    if (pos.step > 0) go(pos.level, pos.step - 1);
    else if (p >= 0 && !PU.levels[pos.level].optional) go(p, PU.levels[p].steps.length - 1);
  }

  function render() {
    runLeave();
    var pos = PU.state.pos;
    if (!PU.levels[pos.level]) pos = PU.state.pos = { level: 0, step: 0 };
    var L = PU.levels[pos.level];
    var idx = PU.clamp(pos.step, 0, L.steps.length - 1);
    var st = L.steps[idx];
    var key = stepKey(L, idx);

    PU.fill(stageHead, h('div.eyebrow', levelName(L) + ' · ' + plain(L.title)), h('div.eyebrow', 'Step ' + (idx + 1) + ' of ' + L.steps.length));
    var preview = !!PU.state.preview;
    previewBar.hidden = !preview;
    PU.clear(stepsBar);
    L.steps.forEach(function (s, i) {
      var doneI = !!PU.state.stepsDone[stepKey(L, i)];
      var reachable = preview || PU.state.unlockAll || doneI || i === idx || (i > 0 && PU.state.stepsDone[stepKey(L, i - 1)]);
      var seg = h('button', {
        type: 'button',
        class: i === idx ? 'now' : doneI ? 'done' : '',
        disabled: !reachable,
        title: 'Step ' + (i + 1),
        'aria-label': 'Step ' + (i + 1) + (i === idx ? ', current' : ''),
        'aria-current': i === idx ? 'step' : null
      });
      if (reachable && i !== idx)
        seg.addEventListener('click', function () {
          go(pos.level, i);
        });
      stepsBar.appendChild(seg);
    });

    var ctx = {
      level: L,
      index: idx,
      key: key,
      preview: preview,
      data: preview ? PU.previewData(st) : PU.stepData(key),
      done: preview || !!PU.state.stepsDone[key],
      complete: function () {
        if (preview) {
          setNextEnabled(true);
          return;
        }
        var fresh = !PU.state.stepsDone[key];
        if (fresh) {
          PU.state.stepsDone[key] = true;
          PU.save();
          updateProgress();
          renderRail();
          var seg = stepsBar.children[idx];
          if (seg) seg.className = 'now';
        }
        setNextEnabled(true);
        if (!building) hintEl.textContent = idx === L.steps.length - 1 ? '' : 'Done. Continue when ready.';
      },
      award: function (sub, amt, label, anchor) {
        return preview ? 0 : PU.award(key + ':' + sub, amt, label, anchor);
      },
      next: function () {
        setTimeout(goNext, 0);
      },
      save: function () {
        PU.save();
      },
      setHint: function (t) {
        if (!nextEnabled || building) hintEl.textContent = t || '';
      },
      onLeave: function (fn) {
        leaveFns.push(fn);
      }
    };

    hintEl.textContent = '';
    setNextEnabled(ctx.done);
    building = true;
    var content;
    var comp = PU.steps[st.type];
    try {
      content = comp ? comp(st, ctx) : h('p', 'Unknown step type: ' + st.type);
    } catch (e) {
      if (window.console) console.error(e);
      content = PU.note('Something went wrong showing this step. You can skip it with **Continue**.', 'alert');
      ctx.complete();
    }
    building = false;
    if (nextEnabled && !PU.state.unlockAll) hintEl.textContent = '';
    var stepEl = h('div.step', { class: PU.reduced ? '' : 'enter' }, content);
    PU.clear(stepHost).appendChild(stepEl);

    backBtn.disabled = idx === 0 && (pos.level === 0 || !!L.optional);
    var isLast = idx === L.steps.length - 1;
    var nextL = PU.levels[nextMain(pos.level)];
    nextLabel.textContent = isLast ? (nextL ? 'Next level' : 'Finish') : st.nextLabel || 'Continue';
    nextBtn.hidden = !!st.hideNext || (isLast && !nextL);
    actionbar.hidden = !!st.hideBar;

    renderRail();
    updateProgress();
  }

  /* ---------- drawers ---------- */

  var drawerEl = null;
  var scrimEl = null;
  var lastFocus = null;

  function escClose(e) {
    if (e.key === 'Escape') closeDrawer();
  }

  function openDrawer(title, body, side) {
    closeDrawer();
    lastFocus = document.activeElement;
    scrimEl = h('div.scrim');
    scrimEl.addEventListener('click', closeDrawer);
    var closeB = h('button.icon-btn', { type: 'button', 'aria-label': 'Close' }, PU.icon('x'));
    closeB.addEventListener('click', closeDrawer);
    drawerEl = h('div.drawer', { class: side === 'left' ? 'left' : '', role: 'dialog', 'aria-modal': 'true', 'aria-label': title }, h('div.drawer-head', h('h3', title), closeB), h('div.drawer-body', body));
    document.body.append(scrimEl, drawerEl);
    closeB.focus();
    document.addEventListener('keydown', escClose);
  }

  function closeDrawer() {
    if (!drawerEl) return;
    drawerEl.remove();
    scrimEl.remove();
    drawerEl = scrimEl = null;
    document.removeEventListener('keydown', escClose);
    if (lastFocus && lastFocus.focus) {
      try {
        lastFocus.focus({ preventScroll: true });
      } catch (e) {
        /* ignore */
      }
    }
  }

  function openLevels() {
    var ladder = h(
      'ol.level-list',
      PU.RANKS.map(function (r) {
        var cur = PU.rankFor(PU.state.xp).name === r.name;
        var reached = PU.state.xp >= r.min;
        return h(
          'li',
          h(
            'div.level-item',
            { class: cur ? 'is-current' : reached ? '' : 'is-locked', style: 'cursor:default' },
            h('span.li-status', reached ? PU.icon('check', 'icon-sm') : PU.icon('lock', 'icon-sm')),
            h('span', h('span.li-title', r.name), h('span.li-meta', r.min + ' XP · ' + r.desc)),
            h('span')
          )
        );
      })
    );
    ladder.querySelectorAll('.level-item').forEach(function (el) {
      el.style.gridTemplateColumns = '20px minmax(0,1fr) 0';
    });
    openDrawer(
      'Your progress',
      h(
        'div.stack',
        rankCard(),
        h('div.rail-head', { style: 'margin:4px 2px 0' }, h('span.eyebrow', 'Levels'), h('span.mono.small.muted', overallPct() + '% done')),
        levelList(),
        h('div.eyebrow', { style: 'margin-top:8px' }, 'Rank ladder'),
        ladder
      ),
      'left'
    );
  }

  function openSheet() {
    var dl = h('button.btn.btn-ghost.btn-sm', { type: 'button', hidden: true }, PU.icon('download', 'icon-sm'), 'Download (.md)');
    PU.canDownload().then(function (ok) {
      dl.hidden = !ok;
    });
    dl.addEventListener('click', function () {
      PU.saveFile('claude-power-up-cheat-sheet.md', PU.cheatSheetText()).then(function (r) {
        if (r === 'saved') PU.toast('Cheat sheet saved', { icon: 'check' });
        else if (r !== 'declined') PU.toast('Download isn’t available here. Use Copy instead.', { icon: 'info' });
      });
    });
    openDrawer(
      'Cheat sheet',
      h(
        'div.stack',
        h('p.small.muted', 'The 10 rules, the brief template, which model and effort to use, and anything you’ve saved along the way.'),
        h('div.btn-row', PU.copyBtn(PU.cheatSheetText, 'Copy everything'), dl),
        PU.renderSheet(true)
      )
    );
  }

  function openSettings() {
    var themeSeg = h('div.seg', { role: 'group', 'aria-label': 'Theme' });
    function paintTheme() {
      PU.clear(themeSeg);
      [
        ['system', 'System'],
        ['light', 'Light'],
        ['dark', 'Dark']
      ].forEach(function (t) {
        var b = h('button', { type: 'button', class: PU.state.theme === t[0] ? 'is-on' : '', 'aria-pressed': String(PU.state.theme === t[0]) }, t[1]);
        b.addEventListener('click', function () {
          PU.state.theme = t[0];
          PU.save();
          applyTheme();
          paintTheme();
        });
        themeSeg.appendChild(b);
      });
    }
    paintTheme();

    var sw = h('button.switch', { type: 'button', role: 'switch', 'aria-checked': String(!!PU.state.preview) }, h('span.trk'), h('span', 'Preview mode'));
    sw.addEventListener('click', function () {
      setPreview(!PU.state.preview);
      sw.setAttribute('aria-checked', String(!!PU.state.preview));
    });

    var confirmHost = h('div');
    var resetBtn = h('button.btn.btn-ghost.btn-sm', { type: 'button' }, PU.icon('refresh', 'icon-sm'), 'Reset my progress');
    resetBtn.addEventListener('click', function () {
      if (confirmHost.firstChild) return;
      var yes = h('button.btn.btn-danger.btn-sm', { type: 'button' }, 'Yes, erase everything');
      var no = h('button.btn.btn-ghost.btn-sm', { type: 'button' }, 'Cancel');
      yes.addEventListener('click', function () {
        PU.emit('reset');
      });
      no.addEventListener('click', function () {
        PU.clear(confirmHost);
      });
      confirmHost.appendChild(h('div.inline-confirm', h('b', 'Erase all progress, XP and saved prompts on this device?'), h('div.btn-row', yes, no)));
    });

    var liveLine =
      PU.live.status === 'ready'
        ? 'Live Claude is available here: “Try it with real Claude” boxes use your own Claude account.'
        : 'Live Claude buttons appear only when this page is opened inside Claude and you allow it. Everything else works everywhere.';

    openDrawer(
      'Settings',
      h(
        'div.stack',
        h('div.setting', h('div.st-title', 'Theme'), themeSeg),
        h(
          'div.setting',
          h('div.st-title', 'Preview mode'),
          h('div.st-sub', 'Skim every level and question without solving anything. All levels open, answers are shown, and nothing is scored or saved. Tap the step dots to jump around, or use the ← → keys.'),
          sw
        ),
        h('div.setting', h('div.st-title', 'Progress'), h('div.st-sub', 'Saved in this browser only. Nobody else can see it.'), h('div', resetBtn), confirmHost),
        h(
          'div.setting',
          h('div.st-title', 'About this training'),
          h('div.st-sub', 'Made for the ' + ((PU.brand && PU.brand.name) || 'agency') + ' team. Simulated chats show pre-written example answers so everyone sees the same thing. Prompt scores come from an automatic checklist that looks for the parts of a good brief. ' + liveLine),
          h('div.st-sub', 'Keyboard: ← and → move between steps.')
        )
      )
    );
  }

  function applyTheme() {
    var t = PU.state.theme;
    var el = document.documentElement;
    if (t === 'light' || t === 'dark') {
      el.setAttribute('data-theme', t);
      themeTouched = true;
    } else if (themeTouched) {
      el.removeAttribute('data-theme');
      themeTouched = false;
    }
  }

  /* ---------- events + boot ---------- */

  function onKey(e) {
    if (drawerEl) return;
    var t = e.target;
    var tag = t && t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight' && nextEnabled && !nextBtn.hidden && !actionbar.hidden) goNext();
    else if (e.key === 'ArrowLeft' && !backBtn.disabled && !actionbar.hidden) goBack();
  }

  function wireEvents() {
    PU.on('xp', function (e) {
      updateXP(true);
      var shown = e.anchor ? PU.floatXP(e.anchor, e.delta) : false;
      if (!shown) PU.toast(e.label || 'Nice', { xp: e.delta, icon: 'bolt' });
    });
    PU.on('rankup', function (r) {
      setTimeout(function () {
        PU.toast('Rank up: ' + r.name, { icon: 'trophy', ms: 3400 });
      }, 700);
      renderRail();
    });
    PU.on('levels', renderRail);
    PU.on('reset', function () {
      PU.resetAll();
      closeDrawer();
      updateXP(false);
      go(0, 0);
      PU.toast('Progress reset', { icon: 'refresh' });
    });
  }

  /**
   * Preview mode: skim everything, answers shown, nothing scored or saved.
   * Turning it off goes back to where you were before, so skimming never
   * counts as reaching a step (a level summary would otherwise mark it done).
   */
  function setPreview(on) {
    if (on && !PU.state.preview) PU.state.prePreviewPos = PU.state.pos;
    if (!on && PU.state.preview && PU.state.prePreviewPos) PU.state.pos = PU.state.prePreviewPos;
    if (!on) delete PU.state.prePreviewPos;
    PU.state.preview = !!on;
    PU.save();
    render();
    PU.toast(on ? 'Preview mode on' : 'Preview mode off', { icon: 'eye' });
  }

  function boot() {
    prepareLevels();
    buildShell();
    applyTheme();
    wireEvents();
    PU.live.init();
    var hash = window.location.hash || '';
    if (hash === '#preview' && !PU.state.preview) {
      PU.state.prePreviewPos = PU.state.pos;
      PU.state.preview = true;
      PU.save();
    }
    if (hash === '#bonus') {
      for (var b = 0; b < PU.levels.length; b++) {
        if (PU.levels[b].optional) {
          PU.state.pos = { level: b, step: 0 };
          break;
        }
      }
    }
    var m = /^#level-(\d+)$/.exec(hash);
    if (m) {
      var n = parseInt(m[1], 10);
      for (var i = 0; i < PU.levels.length; i++) {
        if (PU.levels[i].num === n && isUnlocked(i)) {
          PU.state.pos = { level: i, step: 0 };
          break;
        }
      }
    }
    // The link has done its job: clear it so a reload doesn't jump again.
    if (hash === '#preview' || hash === '#bonus' || m) {
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (e) {
        /* not allowed here: harmless */
      }
    }
    updateXP(false);
    render();
    document.addEventListener('keydown', onKey);
  }

  PU.boot = boot;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
