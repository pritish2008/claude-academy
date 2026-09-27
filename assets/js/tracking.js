/* ==========================================================================
   Claude Power-Up — learning time and progress reports.

   1. Counts ACTIVE time on each step: only while the page is visible and the
      person has clicked, typed or scrolled in the last 90 seconds.
   2. Estimates how long each step takes to read (240 words a minute) and
      flags a step as "rushed" when it was finished faster than even a quick
      skim (480 words a minute, at least 4 seconds).
   3. If a Google Sheet link is set in brand.js, sends a snapshot of the
      person's progress to it: when a level is finished, every little while
      during activity, and when the page is closed. Nothing is sent in Preview
      mode or when no link is set.
   ========================================================================== */
(function () {
  'use strict';

  var PU = window.PU;
  var IDLE_MS = 90 * 1000;
  var READ_WPM = 240;
  var SKIM_WPM = 480;
  var MIN_SEC = 4;
  var SEND_EVERY_MS = 30 * 1000;
  var CHECK_TYPES = { quiz: ['q', 20], multi: ['m', 15], sort: ['sort', 25], order: ['order', 25] };
  /* Openers and wrap-ups: their time counts, but they don't count towards pace. */
  var NO_PACE = { hero: 1, intro: 1, summary: 1, certificate: 1 };

  var current = null; // { key, el }
  var lastInput = Date.now();
  var unsaved = 0;
  var timer = null;

  function sheet() {
    var s = PU.brand && PU.brand.sheet;
    return s && s.url ? s : null;
  }

  function pace() {
    return (PU.state.pace = PU.state.pace || {});
  }

  function words(el) {
    var text = (el && (el.innerText || el.textContent)) || '';
    var m = text.match(/\S+/g);
    return m ? m.length : 0;
  }

  function note(key) {
    var p = pace();
    return (p[key] = p[key] || { t: 0, w: 0 });
  }

  /* ---------- active time ---------- */

  function active() {
    return document.visibilityState !== 'hidden' && Date.now() - lastInput < IDLE_MS;
  }

  function tick() {
    if (!current || PU.state.preview || !active()) return;
    note(current.key).t += 1;
    PU.state.lastActive = Date.now();
    if (++unsaved >= 5) {
      unsaved = 0;
      PU.save();
    }
  }

  function remember() {
    if (!current || PU.state.preview) return;
    var n = note(current.key);
    n.w = Math.max(n.w, words(current.el));
  }

  PU.track = {
    /** A step was drawn. */
    enter: function (key, el) {
      current = { key: key, el: el };
      lastInput = Date.now();
      if (!PU.state.preview) {
        remember();
        report.soon();
      }
    },
    /** Leaving the step: measure its text now that everything is showing. */
    leave: function () {
      remember();
      current = null;
    },
    start: function () {
      ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll', 'mousemove'].forEach(function (evt) {
        window.addEventListener(
          evt,
          function () {
            lastInput = Date.now();
          },
          { passive: true, capture: true }
        );
      });
      setInterval(tick, 1000);
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
          remember();
          PU.saveNow();
          report.now(true);
        }
      });
      window.addEventListener('pagehide', function () {
        remember();
        PU.saveNow();
        report.now(true);
      });
      PU.on('name', function () {
        report.now(false);
      });
      PU.on('levels', function () {
        report.now(false);
      });
      if (PU.state.name) report.soon();
    }
  };

  /* ---------- the numbers ---------- */

  function stepFacts(L, i) {
    var key = L.id + '.' + i;
    var p = pace()[key] || { t: 0, w: 0 };
    var done = !!PU.state.stepsDone[key];
    var need = Math.max(MIN_SEC, (p.w / SKIM_WPM) * 60);
    return {
      key: key,
      done: done,
      t: p.t,
      paced: !NO_PACE[L.steps[i].type],
      expect: (p.w / READ_WPM) * 60,
      seen: done || p.t > 0,
      rushed: done && p.w > 0 && p.t < need
    };
  }

  function checkScore(L, i) {
    var st = L.steps[i];
    var c = CHECK_TYPES[st.type];
    if (!c) return null;
    var key = L.id + '.' + i;
    if (!PU.state.stepsDone[key]) return null;
    var got = PU.state.awarded[key + ':' + c[0]] || 0;
    var max = st.xp || c[1];
    return max ? Math.min(1, got / max) : null;
  }

  function paceLabel(active, expect, rushed, seen) {
    if (!seen) return '';
    if (rushed / seen >= 0.4 || active < expect * 0.35) return 'Rushing';
    if (active >= expect * 0.9 && rushed / seen < 0.2) return 'Thorough';
    return 'Good pace';
  }

  function mins(sec) {
    return Math.round((sec / 60) * 10) / 10;
  }

  function avg(list) {
    return list.length
      ? Math.round(
          (list.reduce(function (a, b) {
            return a + b;
          }, 0) /
            list.length) *
            100
        )
      : '';
  }

  /** Everything the Google Sheet receives. */
  PU.progressReport = function () {
    var s = PU.state;
    var doneAt = (s.data && s.data.doneAt) || {};
    var levels = [];
    var tot = { all: 0, active: 0, expect: 0, rushed: 0, seen: 0, steps: 0, done: 0, scores: [] };
    var main = 0;
    var mainDone = 0;
    PU.levels.forEach(function (L) {
      if (!L.optional) {
        main++;
        if (s.levelsDone[L.id]) mainDone++;
      }
      var lv = { all: 0, active: 0, expect: 0, rushed: 0, seen: 0, done: 0, scores: [] };
      L.steps.forEach(function (st, i) {
        var f = stepFacts(L, i);
        if (!L.optional) tot.steps++;
        if (f.done) lv.done++;
        lv.all += f.t;
        if (f.seen && f.paced) {
          lv.seen++;
          lv.active += f.t;
          lv.expect += f.expect;
          if (f.rushed) lv.rushed++;
        }
        var sc = checkScore(L, i);
        if (sc !== null) lv.scores.push(sc);
      });
      if (!lv.all && !lv.done) return;
      tot.all += lv.all;
      tot.active += lv.active;
      tot.expect += lv.expect;
      tot.rushed += lv.rushed;
      tot.seen += lv.seen;
      if (!L.optional) tot.done += lv.done;
      tot.scores = tot.scores.concat(lv.scores);
      levels.push({
        id: L.id,
        level: PU.levelLabel(L),
        title: String(L.title).replace(/==/g, ''),
        status: s.levelsDone[L.id] ? 'Done' : 'In progress',
        stepsDone: lv.done,
        steps: L.steps.length,
        activeMin: mins(lv.all),
        expectedMin: mins(lv.expect),
        rushed: lv.rushed,
        pace: paceLabel(lv.active, lv.expect, lv.rushed, lv.seen),
        quizScore: avg(lv.scores),
        xp: PU.xpForPrefix(L.id + '.'),
        xpMax: L.maxXp,
        finished: doneAt[L.id] || ''
      });
    });
    var prompts = (s.data && s.data.prompts) || {};
    var promptScores = Object.keys(prompts)
      .map(function (k) {
        return prompts[k].score || 0;
      })
      .filter(function (x) {
        return x > 0;
      });
    var here = PU.levels[s.pos.level];
    return {
      person: {
        id: s.pid,
        name: s.name || '',
        email: s.email || '',
        progress: tot.steps ? Math.round((tot.done / tot.steps) * 100) : 0,
        levelsDone: mainDone + ' of ' + main,
        nowOn: here ? PU.levelLabel(here) + ' · ' + (here.short || '') : '',
        activeMin: mins(tot.all),
        pace: paceLabel(tot.active, tot.expect, tot.rushed, tot.seen),
        rushed: tot.rushed + ' of ' + tot.seen,
        quizScore: avg(tot.scores),
        bestPrompt: promptScores.length ? Math.max.apply(null, promptScores) : '',
        xp: s.xp,
        rank: PU.rankFor(s.xp).name,
        certificate: (s.data && s.data.certAt) || '',
        started: s.started ? new Date(s.started).toISOString() : '',
        lastActive: new Date(s.lastActive || Date.now()).toISOString()
      },
      levels: levels
    };
  };

  /* ---------- sending to the Google Sheet ---------- */

  var report = {
    pending: null,
    lastBody: '',
    soon: function () {
      if (!sheet() || PU.state.preview || report.pending) return;
      report.pending = setTimeout(function () {
        report.pending = null;
        report.now(false);
      }, SEND_EVERY_MS);
    },
    now: function (leaving) {
      var cfg = sheet();
      if (!cfg || PU.state.preview || !PU.state.name) return;
      if (report.pending) {
        clearTimeout(report.pending);
        report.pending = null;
      }
      var r = PU.progressReport();
      var body = JSON.stringify({ key: cfg.key || '', v: 1, person: r.person, levels: r.levels });
      var same = body.replace(/"lastActive":"[^"]*"/, '');
      if (same === report.lastBody) return;
      report.lastBody = same;
      try {
        if (leaving && navigator.sendBeacon) {
          navigator.sendBeacon(cfg.url, new Blob([body], { type: 'text/plain;charset=utf-8' }));
          return;
        }
        fetch(cfg.url, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: body }).catch(function () {
          report.lastBody = '';
        });
      } catch (e) {
        report.lastBody = '';
      }
    }
  };
  PU.report = report;
  PU.tracking = function () {
    return !!sheet();
  };

  if (!PU.state.pid) {
    PU.state.pid = 'p_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    PU.save();
  }
})();
