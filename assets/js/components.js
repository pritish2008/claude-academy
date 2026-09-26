/* ==========================================================================
   Claude Power-Up — interactive step components.
   Each step type is PU.steps[type](step, ctx) and returns DOM nodes.
   ctx: { level, index, key, data, done, complete(), award(sub, xp, label, anchor),
          next(), save(), setHint(text), onLeave(fn) }
   ========================================================================== */
(function () {
  'use strict';

  var PU = window.PU;
  var h = PU.h;
  var S = PU.steps;
  var LETTERS = 'ABCDEFGH';

  /* ---------------------------------------------------------------------
     Shared pieces
     --------------------------------------------------------------------- */
  function head(step) {
    return h(
      'div.step-head',
      step.eyebrow ? h('div.eyebrow', step.eyebrow) : null,
      step.title ? h('h2.title', { html: PU.rich(step.title) }) : null,
      step.lede ? h('p.lede', { html: PU.rich(step.lede) }) : null
    );
  }
  PU.stepHead = head;

  function promptBlock(text, o) {
    o = o || {};
    var actions = null;
    if (o.copy || o.open) {
      actions = h('span.btn-row', o.copy ? PU.copyBtn(text) : null, o.open ? PU.openInClaude(text) : null);
    }
    return h(
      'div.prompt',
      { class: o.kind ? 'is-' + o.kind : '' },
      h('div.prompt-label', h('span', o.label || 'Prompt'), actions),
      h('div.prompt-text', { html: PU.promptHTML(text) })
    );
  }
  PU.promptBlock = promptBlock;

  function callout(c) {
    return h(
      'div.callout',
      c.eyebrow ? h('div.eyebrow', c.eyebrow) : null,
      h('div.callout-title', { html: PU.rich(c.title) }),
      c.text ? h('p', { html: PU.rich(c.text) }) : null
    );
  }
  PU.callout = callout;

  function note(text, icon) {
    return h('div.note', PU.icon(icon || 'info'), h('div', { html: PU.md(text) }));
  }
  PU.note = note;

  function chatFrame(title) {
    var body = h('div.chat-body');
    var composer = h('div.composer');
    var el = h(
      'div.chat',
      h(
        'div.chat-bar',
        h('span.who', h('span.avatar', { style: 'width:22px;height:22px;border-radius:6px' }, PU.icon('spark')), title || 'Claude'),
        h('span.tag', { title: 'Pre-written example responses' }, 'Simulated')
      ),
      body,
      composer
    );
    return { el: el, body: body, composer: composer };
  }
  PU.chatFrame = chatFrame;

  /** Static capability tiles: [{icon, title, text, color}] */
  PU.tiles = function (list) {
    return h(
      'div.cards',
      list.map(function (t) {
        return h(
          'div.rcard.is-open',
          { style: { '--c': t.color || 'var(--accent)' }, 'aria-label': t.title },
          h('div.rc-top', h('span', { style: 'color:var(--c)' }, PU.icon(t.icon, 'icon-lg'))),
          h('div.rc-title', t.title),
          h('div.rc-q', t.text)
        );
      })
    );
  };

  /** How a level is named and numbered: "Level 3" / "03", "Final" / "10", "Bonus" / "B". */
  PU.levelLabel = function (L) {
    return L.label || 'Level ' + L.num;
  };
  PU.levelCode = function (L) {
    return L.code || pad(L.num);
  };

  /** The next level on the main path. Optional (bonus) levels are skipped. */
  PU.nextLevel = function (L) {
    for (var j = PU.levels.indexOf(L) + 1; j < PU.levels.length; j++) {
      if (!PU.levels[j].optional) return PU.levels[j];
    }
    return null;
  };

  function factsCard(f) {
    return h(
      'div.facts',
      h('div.facts-head', h('span.eyebrow', f.title || 'The brief'), f.tag ? h('span.mono.small', f.tag) : null),
      f.rows.map(function (r) {
        return h('div.fact', h('span.k', r[0]), h('span', r[1]));
      })
    );
  }

  function scoreDial(score, tier) {
    var C = 2 * Math.PI * 36;
    var val = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 84 84');
    var trk = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    [trk, val].forEach(function (c) {
      c.setAttribute('cx', '42');
      c.setAttribute('cy', '42');
      c.setAttribute('r', '36');
      c.setAttribute('fill', 'none');
      c.setAttribute('stroke-width', '8');
      c.setAttribute('stroke-linecap', 'round');
    });
    trk.setAttribute('class', 'trk');
    val.setAttribute('class', 'val');
    val.setAttribute('stroke-dasharray', C.toFixed(2));
    val.setAttribute('stroke-dashoffset', C.toFixed(2));
    svg.appendChild(trk);
    svg.appendChild(val);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        val.setAttribute('stroke-dashoffset', (C * (1 - score / 100)).toFixed(2));
      });
    });
    return h('div.dial', { class: 't-' + tier, role: 'img', 'aria-label': 'Score ' + score + ' out of 100' }, svg, h('span.num', String(score)));
  }

  function insertAtCursor(ta, text) {
    var start = typeof ta.selectionStart === 'number' ? ta.selectionStart : ta.value.length;
    var end = typeof ta.selectionEnd === 'number' ? ta.selectionEnd : ta.value.length;
    var before = ta.value.slice(0, start);
    var after = ta.value.slice(end);
    var sep = before && !/\n$/.test(before) ? '\n' : '';
    ta.value = before + sep + text + after;
    var pos = (before + sep + text).length;
    ta.focus();
    try {
      ta.setSelectionRange(pos, pos);
    } catch (e) {
      /* ignore */
    }
    ta.dispatchEvent(new Event('input'));
  }

  function autoGrow(ta, min, max) {
    ta.style.height = 'auto';
    ta.style.height = Math.min(max || 520, Math.max(min || 150, ta.scrollHeight + 2)) + 'px';
  }

  function cap(s) {
    s = String(s);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function coachPrompt(task, text) {
    return (
      'You are a friendly prompt coach at a marketing agency. You help non-technical employees get better results from Claude.\n\n' +
      'The exercise: ' +
      task +
      '\n\nTheir prompt:\n"""\n' +
      String(text).slice(0, 6000) +
      '\n"""\n\n' +
      'Reply in plain English (no jargon), under 190 words, in exactly this structure:\n' +
      '**Score:** X/10\n' +
      '**What works:** one sentence.\n' +
      '**Fix these 3 things:**\n- ...\n- ...\n- ...\n' +
      '**Improved version:**\n(the full improved prompt; keep their facts, and mark anything they still need to fill in with [square brackets])'
    );
  }

  /** "Try it with real Claude" box. Hidden unless the viewer can use Claude from this page. */
  function liveBox(ctx, getText, task) {
    var out = h('div.live-out', { hidden: true });
    var err = h('p.live-err', { hidden: true });
    var fb = h('button.btn.btn-primary.btn-sm', { type: 'button' }, PU.icon('spark', 'icon-sm'), 'Get Claude’s feedback');
    var run = h('button.btn.btn-ghost.btn-sm', { type: 'button' }, PU.icon('play', 'icon-sm'), 'Run my prompt for real');
    var stop = h('button.btn.btn-quiet.btn-sm', { type: 'button', hidden: true }, PU.icon('stop', 'icon-sm'), 'Stop');
    var box = h(
      'div.live-box',
      { hidden: !PU.live.available() },
      h('div', h('span.tag.live', PU.icon('spark', 'icon-sm'), 'Live'), ' ', h('b', 'Try it with real Claude')),
      h('p.small', 'Get a coach’s feedback, or see what Claude actually writes with your prompt. This uses your own Claude account, and Claude asks your permission the first time.'),
      h('div.btn-row', fb, run, stop),
      out,
      err
    );
    var ctl = null;
    function ask(input, label) {
      if (PU.wordCount(getText()) < 3) {
        PU.toast('Write your prompt first.', { icon: 'info' });
        return;
      }
      ctl = new AbortController();
      out.hidden = false;
      err.hidden = true;
      out.classList.add('md');
      PU.clear(out).appendChild(PU.thinking(label));
      fb.disabled = run.disabled = true;
      stop.hidden = false;
      PU.live
        .ask(input, {
          signal: ctl.signal,
          onText: function (u) {
            out.innerHTML = PU.md(u.text);
          }
        })
        .then(function (res) {
          out.innerHTML = PU.md(res.text);
          if (res.truncated) out.appendChild(h('p.small.muted', 'Claude’s answer was cut short. Ask for less at a time.'));
          ctx.award('live', 10, 'Tried it for real', fb);
        })
        .catch(function (e) {
          if (e && e.text) out.innerHTML = PU.md(e.text);
          else out.hidden = true;
          var m = PU.live.errorText(e);
          if (m) {
            err.textContent = m;
            err.hidden = false;
          }
        })
        .then(function () {
          fb.disabled = run.disabled = false;
          stop.hidden = true;
          ctl = null;
        });
    }
    fb.addEventListener('click', function () {
      ask(coachPrompt(task, getText()), 'Claude is reviewing your prompt');
    });
    run.addEventListener('click', function () {
      ask(String(getText()).slice(0, 12000), 'Claude is working on it');
    });
    stop.addEventListener('click', function () {
      if (ctl) ctl.abort();
    });
    var off = PU.live.onChange(function () {
      box.hidden = !PU.live.available();
    });
    ctx.onLeave(function () {
      if (ctl) ctl.abort();
      if (off) off();
    });
    return box;
  }
  PU.liveBox = liveBox;

  /** Data describing a finished, correctly-answered step (used by Preview mode; never saved). */
  PU.previewData = function (step) {
    var d = {};
    function all(list) {
      var o = {};
      (list || []).forEach(function (x, i) {
        o[i] = true;
      });
      return o;
    }
    switch (step.type) {
      case 'showdown':
        d.ran = true;
        break;
      case 'quiz':
        d.solved = true;
        d.wrong = [];
        break;
      case 'multi':
        d.sel = [];
        step.options.forEach(function (o, i) {
          if (o.status === 'correct') d.sel.push(i);
        });
        d.checked = true;
        break;
      case 'builder':
        d.pick = {};
        step.slots.forEach(function (s) {
          var best = 0;
          s.options.forEach(function (o, i) {
            if (o.q > s.options[best].q) best = i;
          });
          d.pick[s.key] = best;
        });
        d.ran = 'strong';
        break;
      case 'tiers':
        d.seen = all(step.tabs);
        d.cur = 0;
        break;
      case 'cards':
        d.open = all(step.cards);
        break;
      case 'guide':
        d.ticked = all(step.items);
        break;
      case 'chat':
      case 'guesses':
        d.done = true;
        break;
      case 'contextsim':
        d.n = step.contexts.length;
        break;
      case 'flow':
        d.seen = all(step.nodes);
        d.cur = 0;
        break;
      case 'library':
        d.opened = { 0: true };
        d.cur = 0;
        break;
      case 'order':
        d.seq = step.items.map(function (t, i) {
          return i;
        });
        d.checked = true;
        d.tries = 1;
        break;
      case 'sort':
        d.a = {};
        step.items.forEach(function (it, i) {
          d.a[i] = it.answer;
        });
        d.checked = true;
        break;
      case 'menu':
        d.seen = { 0: true };
        d.cur = 0;
        break;
      case 'screens':
        d.seen = all(step.tabs);
        d.cur = 0;
        break;
      case 'project':
        d.name = step.defaultName;
        d.ins = {};
        d.files = {};
        step.instructions.forEach(function (o, i) {
          if (o.good) d.ins[i] = true;
        });
        step.files.forEach(function (o, i) {
          if (o.good) d.files[i] = true;
        });
        d.ran = true;
        break;
      case 'cowork':
        d.done = true;
        d.allowed = false;
        break;
      case 'build':
        d.tool = Object.keys(step.tools)[0];
        d.built = {};
        d.built[d.tool] = true;
        break;
      default:
        break;
    }
    return d;
  };

  /* ---------------------------------------------------------------------
     hero — Level 0 opener
     --------------------------------------------------------------------- */
  S.hero = function (step, ctx) {
    var name = h('input.input#pu-name', {
      type: 'text',
      placeholder: 'Your first name',
      value: PU.state.name || '',
      autocomplete: 'given-name',
      maxlength: '40'
    });
    var go = h('button.btn.btn-primary', { type: 'button' }, h('span', ctx.done ? 'Continue' : 'Start Level 0'), PU.icon('arrowRight'));
    go.addEventListener('click', function () {
      PU.state.name = name.value.trim().slice(0, 40);
      PU.save();
      PU.emit('name');
      ctx.award('start', step.xp || 10, 'You showed up', go);
      ctx.complete();
      ctx.next();
    });
    name.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') go.click();
    });
    var meter = h(
      'div.meter-hero',
      { role: 'img', 'aria-label': 'Most people use about 20 percent of Claude’s potential. Goal: 100 percent.' },
      h('span.meter-flag.f-now', 'Most people · 20%'),
      h('div.meter-track', h('div.meter-ghost'), h('div.meter-fill')),
      h('span.meter-flag.f-goal', 'You, after this training →')
    );
    var B = PU.brand || {};
    return h(
      'div.hero',
      B.logo ? h('img.hero-logo', { src: B.logo, alt: (B.name || 'Agency') + ' logo' }) : null,
      h('div.eyebrow', step.eyebrow),
      h('h1', { html: PU.rich(step.title) }),
      h('p.lede', { html: PU.rich(step.lede) }),
      meter,
      h('div.name-row', h('div.field', h('label', { for: 'pu-name' }, 'What should we call you?'), name), go),
      h(
        'div.meta-row',
        (step.meta || []).map(function (m) {
          return h('span', PU.icon(m[0], 'icon-sm'), m[1]);
        })
      )
    );
  };

  /* ---------------------------------------------------------------------
     intro — the "job ticket" that opens each level
     --------------------------------------------------------------------- */
  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  S.intro = function (step, ctx) {
    var L = ctx.level;
    ctx.complete();
    function tf(k, v) {
      return h('div.tf', h('span.eyebrow', k), h('span.v', String(v)));
    }
    return h(
      'div.ticket',
      { style: { '--sw': L.color } },
      h(
        'div.ticket-top',
        h(
          'div.ticket-row',
          h(
            'div.stack-sm',
            h('div.eyebrow', 'Job Nº PU-' + PU.levelCode(L) + ' · ' + PU.levelLabel(L)),
            h('h2', { html: PU.rich(L.title) }),
            h('p.tagline', L.tagline)
          ),
          h('div.ticket-chip', { 'aria-hidden': 'true' }, h('i'), h('b', 'PU ' + PU.levelCode(L)))
        )
      ),
      h('div.perf'),
      h('div.ticket-fields', tf('Client', PU.state.name || 'You'), tf('Deliverable', L.deliverable), tf('Steps', L.steps.length), tf('XP on offer', L.maxXp)),
      h(
        'div.ticket-learn',
        h('div.eyebrow', 'You’ll learn'),
        h(
          'ul.learn-list',
          L.learn.map(function (x) {
            return h('li', PU.icon('arrowRight', 'icon-sm'), h('span', { html: PU.rich(x) }));
          })
        )
      )
    );
  };

  /* ---------------------------------------------------------------------
     concept — short explanation, optional visual + callout
     --------------------------------------------------------------------- */
  S.concept = function (step, ctx) {
    ctx.complete();
    return [
      head(step),
      step.visual ? step.visual(ctx) : null,
      step.body ? h('div.md', { html: PU.md(step.body) }) : null,
      step.note ? note(step.note, step.noteIcon) : null,
      step.callout ? callout(step.callout) : null
    ];
  };

  /* ---------------------------------------------------------------------
     poll — self-check, no wrong answers
     --------------------------------------------------------------------- */
  S.poll = function (step, ctx) {
    var d = ctx.data;
    var replyHost = h('div');
    var btns = step.options.map(function (o, i) {
      var b = h('button.opt', { type: 'button' }, h('span.key', LETTERS[i]), h('span', o.label), h('span.st'));
      b.addEventListener('click', function () {
        pick(i, true);
      });
      return b;
    });
    function pick(i, fresh) {
      d.pick = i;
      ctx.save();
      btns.forEach(function (b, j) {
        b.classList.toggle('is-picked', i === j);
        b.setAttribute('aria-pressed', String(i === j));
      });
      PU.clear(replyHost).appendChild(h('div.reply', h('div.avatar', PU.icon('spark')), h('p', step.options[i].reply)));
      if (fresh) ctx.award('pick', step.xp || 10, 'Honesty bonus', btns[i]);
      ctx.complete();
    }
    if (typeof d.pick === 'number') pick(d.pick, false);
    return [head(step), h('div.options', btns), replyHost];
  };

  /* ---------------------------------------------------------------------
     showdown — Employee A vs Employee B, same task
     --------------------------------------------------------------------- */
  S.showdown = function (step, ctx) {
    var d = ctx.data;
    function side(p) {
      var out = h('div.out-box', h('span.muted.small', 'Output appears here'));
      var verdict = h(
        'div.chips',
        { hidden: true },
        p.verdict.map(function (v) {
          return h('span.tag', { class: p.good ? 'good' : 'bad' }, v);
        })
      );
      var el = h(
        'div.duelist',
        h('div.person', h('div.face', { style: { background: p.color } }, p.initial), h('div', h('div.nm', p.name), h('div.rl', p.role))),
        promptBlock(p.prompt, { label: 'Their prompt', kind: p.good ? 'good' : 'bad' }),
        out,
        verdict
      );
      return { el: el, out: out, verdict: verdict, p: p };
    }
    var A = side(step.a);
    var B = side(step.b);
    var run = h('button.btn.btn-primary', { type: 'button' }, PU.icon('play'), h('span', 'Run both prompts'));
    var running = false;
    var ctls = [];
    function play(S2, delay, dur, instant) {
      if (instant) {
        S2.out.classList.add('has-text');
        S2.out.innerHTML = PU.md(S2.p.output);
        S2.out.classList.add('md');
        S2.verdict.hidden = false;
        return Promise.resolve();
      }
      PU.clear(S2.out).appendChild(PU.thinking('Claude is writing'));
      S2.verdict.hidden = true;
      return PU.wait(delay).then(function () {
        S2.out.classList.add('has-text');
        PU.clear(S2.out);
        var s = PU.stream(S2.out, S2.p.output, { duration: dur });
        ctls.push(s);
        return s.promise.then(function () {
          S2.verdict.hidden = false;
        });
      });
    }
    run.addEventListener('click', function () {
      if (running) return;
      running = true;
      run.disabled = true;
      run.lastChild.textContent = 'Running…';
      Promise.all([play(A, 500, 1.2), play(B, 1100, 4.2)]).then(function () {
        running = false;
        run.disabled = false;
        run.lastChild.textContent = 'Run again';
        d.ran = true;
        ctx.save();
        ctx.award('watch', step.xp || 10, 'Showdown watched', run);
        ctx.complete();
      });
    });
    ctx.onLeave(function () {
      ctls.forEach(function (c) {
        c.cancel();
      });
    });
    if (d.ran) {
      play(A, 0, 0, true);
      play(B, 0, 0, true);
      run.lastChild.textContent = 'Run again';
      ctx.complete();
    } else ctx.setHint('Press “Run both prompts”');
    return [head(step), h('div.btn-row', run, h('span.small.muted', step.runHint || '')), h('div.duel', A.el, B.el)];
  };

  /* ---------------------------------------------------------------------
     quiz — single answer, instant feedback, optional big reveal
     --------------------------------------------------------------------- */
  S.quiz = function (step, ctx) {
    var d = ctx.data;
    d.wrong = d.wrong || [];
    var revealHost = h('div');
    var items = step.options.map(function (o, i) {
      var why = h('span.why', { hidden: true }, o.why || '');
      var st = h('span.st');
      var b = h('button.opt', { type: 'button' }, h('span.key', LETTERS[i]), h('span', h('span', o.label), why), st);
      b.addEventListener('click', function () {
        choose(i);
      });
      return { b: b, why: why, st: st };
    });
    function paint() {
      items.forEach(function (x, i) {
        var o = step.options[i];
        var isWrong = d.wrong.indexOf(i) !== -1;
        var isRight = !!d.solved && !!o.correct;
        x.b.classList.toggle('is-wrong', isWrong);
        x.b.classList.toggle('is-right', isRight);
        x.b.classList.toggle('is-dim', !!d.solved && !o.correct && !isWrong);
        x.b.disabled = !!d.solved || isWrong;
        x.why.hidden = !(isWrong || isRight || ctx.preview) || !o.why;
        PU.clear(x.st);
        if (isWrong) x.st.appendChild(PU.icon('x'));
        if (isRight) x.st.appendChild(PU.icon('check'));
      });
      if (d.solved && !revealHost.firstChild) {
        if (step.reveal) {
          revealHost.appendChild(
            h(
              'div.reveal-big',
              step.reveal.eyebrow ? h('div.eyebrow', { style: 'color:var(--muted-on-ink)' }, step.reveal.eyebrow) : null,
              h('div.big', { html: PU.rich(step.reveal.big) }),
              step.reveal.text ? h('p', { html: PU.rich(step.reveal.text) }) : null
            )
          );
        } else if (step.explain) revealHost.appendChild(note(step.explain, 'check'));
        if (step.after) revealHost.appendChild(step.after(ctx));
      }
    }
    function choose(i) {
      var o = step.options[i];
      if (o.correct) {
        d.solved = true;
        ctx.save();
        var tries = d.wrong.length;
        var xp = step.xp || 20;
        var amt = tries === 0 ? xp : tries === 1 ? Math.round(xp / 2) : 5;
        ctx.award('q', amt, tries === 0 ? 'Right first time' : 'Got there', items[i].b);
        ctx.complete();
      } else {
        if (d.wrong.indexOf(i) === -1) d.wrong.push(i);
        ctx.save();
        var b = items[i].b;
        b.classList.add('shake');
        setTimeout(function () {
          b.classList.remove('shake');
        }, 400);
      }
      paint();
    }
    paint();
    if (!d.solved) ctx.setHint('Pick an answer');
    return [
      head(step),
      step.context ? (step.context.prompt ? promptBlock(step.context.prompt, { label: step.context.label, kind: step.context.kind }) : h('div.md', { html: PU.md(step.context.md) })) : null,
      h('div.options', items.map(function (x) {
        return x.b;
      })),
      revealHost
    ];
  };

  /* ---------------------------------------------------------------------
     multi — tap all that apply
     option.status: 'correct' | 'wrong' | 'neutral'
     --------------------------------------------------------------------- */
  S.multi = function (step, ctx) {
    var d = ctx.data;
    d.sel = d.sel || [];
    var msg = h('div');
    var btns = step.options.map(function (o, i) {
      var extra = h('span.warn-text', { hidden: true });
      var b = h(
        'button.toggle',
        { type: 'button', 'aria-pressed': 'false' },
        h('span.box', PU.icon('check')),
        h('span', h('span', { html: PU.rich(o.label) }), o.sub ? h('span.job-desc', o.sub) : null, extra)
      );
      b.addEventListener('click', function () {
        if (d.checked) return;
        var k = d.sel.indexOf(i);
        if (k === -1) d.sel.push(i);
        else d.sel.splice(k, 1);
        ctx.save();
        paint();
      });
      return { b: b, extra: extra };
    });
    var check = h('button.btn.btn-primary', { type: 'button' }, PU.icon('check'), 'Check');
    var retry = h('button.btn.btn-ghost', { type: 'button', hidden: true }, PU.icon('refresh'), 'Try again');
    function counts() {
      var correct = 0;
      var hits = 0;
      var wrong = 0;
      step.options.forEach(function (o, i) {
        var on = d.sel.indexOf(i) !== -1;
        if (o.status === 'correct') {
          correct++;
          if (on) hits++;
        } else if (o.status === 'wrong' && on) wrong++;
      });
      return { correct: correct, hits: hits, wrong: wrong };
    }
    function paint() {
      btns.forEach(function (x, i) {
        var o = step.options[i];
        var on = d.sel.indexOf(i) !== -1;
        x.b.classList.toggle('is-on', on);
        x.b.setAttribute('aria-pressed', String(on));
        x.b.disabled = !!d.checked;
        x.b.style.borderColor = '';
        x.b.style.background = '';
        x.extra.hidden = true;
        if (d.checked) {
          var good = (o.status === 'correct' && on) || (o.status === 'wrong' && !on);
          var missed = o.status === 'correct' && !on;
          var bad = o.status === 'wrong' && on;
          if (o.status === 'correct' || bad) {
            x.b.style.borderColor = good ? 'var(--good)' : 'var(--bad-line)';
            x.b.style.background = good ? 'var(--good-soft)' : 'var(--bad-soft)';
          }
          if ((missed || bad || ctx.preview || o.status === 'neutral' || (o.status === 'correct' && on)) && o.why) {
            x.extra.hidden = false;
            x.extra.textContent = (missed ? 'Missed: ' : '') + o.why;
            x.extra.style.color = good ? 'var(--good)' : missed || bad ? 'var(--bad)' : 'var(--muted)';
          }
        }
      });
      check.disabled = !!d.checked || d.sel.length === 0;
      retry.hidden = !d.checked;
    }
    function showMsg() {
      var c = counts();
      var txt =
        c.hits === c.correct && c.wrong === 0
          ? step.perfect || 'Spot on.'
          : 'You found ' + c.hits + ' of ' + c.correct + (c.wrong ? ', with ' + c.wrong + ' extra pick' + (c.wrong > 1 ? 's' : '') : '') + '. Check the notes above.';
      PU.clear(msg).appendChild(note(txt + (step.explain ? '\n\n' + step.explain : ''), c.hits === c.correct && !c.wrong ? 'check' : 'info'));
    }
    check.addEventListener('click', function () {
      d.checked = true;
      ctx.save();
      var c = counts();
      var sc = Math.max(0, (c.hits - c.wrong) / c.correct);
      ctx.award('m', Math.round((step.xp || 15) * sc), sc === 1 ? 'Perfect' : 'Checked', check);
      ctx.complete();
      paint();
      showMsg();
    });
    retry.addEventListener('click', function () {
      d.checked = false;
      d.sel = [];
      ctx.save();
      PU.clear(msg);
      paint();
    });
    paint();
    if (d.checked) showMsg();
    else ctx.setHint('Tap all that apply, then Check');
    return [
      head(step),
      step.context ? promptBlock(step.context.prompt, { label: step.context.label || 'The prompt', kind: step.context.kind }) : null,
      h('div.toggle-list', { style: step.columns ? 'grid-template-columns:repeat(auto-fill,minmax(' + step.columns + ',1fr))' : '' }, btns.map(function (x) {
        return x.b;
      })),
      h('div.btn-row', check, retry),
      msg
    ];
  };

  /* ---------------------------------------------------------------------
     write — the prompt-writing challenge with an automatic checklist
     --------------------------------------------------------------------- */
  S.write = function (step, ctx) {
    var d = ctx.data;
    var checks = PU.buildChecks(step.checks);
    var id = 'w-' + ctx.key.replace(/[^a-z0-9]/gi, '-');
    var ta = h('textarea.textarea', { id: id, placeholder: step.placeholder || 'Write your prompt here…', rows: '7', spellcheck: 'true' });
    ta.value = d.text || '';
    var wc = h('span');
    function updWC() {
      var n = PU.wordCount(ta.value);
      wc.textContent = n + (n === 1 ? ' word' : ' words');
    }
    ta.addEventListener('input', function () {
      d.text = ta.value;
      ctx.save();
      updWC();
      autoGrow(ta);
    });
    updWC();
    requestAnimationFrame(function () {
      autoGrow(ta);
    });

    var chips = step.chips
      ? h(
          'div.chips',
          h('span.small.muted', { style: 'align-self:center' }, 'Add:'),
          step.chips.map(function (c) {
            var b = h('button.chip', { type: 'button' }, PU.icon('plus', 'icon-sm'), c.label);
            b.addEventListener('click', function () {
              insertAtCursor(ta, c.insert);
            });
            return b;
          })
        )
      : null;

    var resultHost = h('div');
    var expertHost = h('div');
    var checkBtn = h('button.btn.btn-primary', { type: 'button' }, PU.icon('check'), 'Check my prompt');
    var expertBtn = h('button.btn.btn-ghost', { type: 'button' }, PU.icon('eye'), h('span', 'Show an expert version'));

    function renderResult(r) {
      var g = PU.grade(r.score);
      PU.clear(resultHost).appendChild(
        h(
          'div.result',
          { 'aria-live': 'polite' },
          h('div.result-top', scoreDial(r.score, g.tier), h('div', h('div.grade', g.title), h('p.muted.small', g.text), d.best > r.score ? h('p.small.muted', 'Your best so far: ' + d.best) : null)),
          r.notes.length ? note(r.notes.join(' ')) : null,
          h(
            'ul.checklist',
            r.results.map(function (c) {
              return h(
                'li',
                { class: c.pass ? 'pass' : 'fail' },
                h('span.ck', PU.icon(c.pass ? 'check' : 'x')),
                h('div', h('span.lbl', c.label), c.bonus ? h('span.bonus', 'bonus') : null, h('span.tip', c.pass ? c.what : c.tip))
              );
            })
          ),
          h('p.sim-note', PU.icon('info', 'icon-sm'), 'Automatic checklist. It looks for the ingredients of a good brief, not for creativity. Edit and check again as often as you like.')
        )
      );
    }

    checkBtn.addEventListener('click', function () {
      if (PU.wordCount(ta.value) < 3) {
        PU.toast('Write your prompt first. A few sentences is plenty.', { icon: 'info' });
        ta.focus();
        return;
      }
      var r = PU.scorePrompt(ta.value, checks);
      d.best = Math.max(d.best || 0, r.score);
      d.last = r.score;
      ctx.save();
      renderResult(r);
      var got = ctx.award('score', Math.round(((step.xp || 60) * r.score) / 100), r.score >= 90 ? 'Expert brief' : 'Prompt checked', checkBtn);
      if (!got && r.score < d.best) PU.toast('XP counts your best score (' + d.best + ').', { icon: 'info' });
      if (step.saveAs) {
        var saved = (PU.state.data.prompts = PU.state.data.prompts || {});
        if (!saved[step.saveAs] || r.score >= (saved[step.saveAs].score || 0)) {
          saved[step.saveAs] = { title: step.saveTitle || step.title, text: ta.value, score: r.score };
          PU.save();
        }
      }
      ctx.complete();
      PU.scrollNear(resultHost);
    });

    expertBtn.addEventListener('click', function () {
      if (expertHost.firstChild) {
        PU.clear(expertHost);
        expertBtn.lastChild.textContent = 'Show an expert version';
        return;
      }
      expertBtn.lastChild.textContent = 'Hide expert version';
      expertHost.appendChild(
        h(
          'div.stack-sm',
          promptBlock(step.expert, { label: 'One expert version', kind: 'good', copy: true, open: true }),
          step.expertNote ? h('p.small.muted', step.expertNote) : null
        )
      );
    });

    if (d.best !== undefined && d.text) {
      renderResult(PU.scorePrompt(d.text, checks));
      ctx.complete();
    } else ctx.setHint('Write your prompt, then press “Check my prompt”');
    if (ctx.preview) expertBtn.click();

    return [
      head(step),
      step.bad ? promptBlock(step.bad, { label: step.badLabel || 'The prompt to rescue', kind: 'bad' }) : null,
      step.facts ? factsCard(step.facts) : null,
      h(
        'div.editor',
        h('label.eyebrow', { for: id }, step.label || 'Your prompt'),
        ta,
        chips,
        h('div.editor-foot', wc, h('span', 'Saved on this device as you type.'))
      ),
      h('div.btn-row', checkBtn, expertBtn),
      resultHost,
      expertHost,
      liveBox(
        ctx,
        function () {
          return ta.value;
        },
        step.task || step.title
      )
    ];
  };

  /* ---------------------------------------------------------------------
     builder — click one piece per row, watch the prompt assemble, run it
     --------------------------------------------------------------------- */
  S.builder = function (step, ctx) {
    var d = ctx.data;
    d.pick = d.pick || {};
    var rows = step.slots.map(function (slot) {
      var chips = slot.options.map(function (o, i) {
        var b = h('button.chip', { type: 'button', 'aria-pressed': 'false', style: o.text ? '' : 'color:var(--muted)' }, o.text || o.label || 'Skip it');
        b.addEventListener('click', function () {
          d.pick[slot.key] = i;
          ctx.save();
          paint();
        });
        return b;
      });
      var el = h(
        'div.slot',
        { style: { '--c': slot.color } },
        h('div.slot-head', h('span.slot-key', slot.key), h('span.slot-q', slot.q)),
        h('div.chips', chips)
      );
      return { slot: slot, chips: chips, el: el };
    });
    var preview = h('div.prompt-text');
    var bar = h('span');
    var sLabel = h('b');
    var sHint = h('span.muted');
    var strength = h('div.strength', h('div.strength-row', h('span', 'Prompt strength: ', sLabel), sHint), h('div.bar', bar));
    var runBtn = h('button.btn.btn-primary', { type: 'button' }, PU.icon('play'), 'Run this prompt');
    var chatHost = h('div');

    function chosen(slot) {
      var i = d.pick[slot.key];
      return typeof i === 'number' ? slot.options[i] : null;
    }
    function val() {
      var q = 0;
      var max = 0;
      step.slots.forEach(function (s) {
        max += 2;
        var o = chosen(s);
        if (o) q += o.q;
      });
      return Math.round((q / max) * 100);
    }
    function text() {
      return step.slots
        .map(function (s) {
          var o = chosen(s);
          return o && o.text ? o.text : '';
        })
        .filter(Boolean)
        .join(' ');
    }
    function paint() {
      rows.forEach(function (r) {
        r.chips.forEach(function (c, i) {
          var on = d.pick[r.slot.key] === i;
          c.classList.toggle('is-on', on);
          c.setAttribute('aria-pressed', String(on));
        });
      });
      PU.clear(preview);
      var any = false;
      step.slots.forEach(function (s) {
        var o = chosen(s);
        if (o && o.text) {
          if (any) preview.appendChild(document.createTextNode(' '));
          preview.appendChild(h('span.pseg', { style: { '--c': s.color } }, o.text));
          any = true;
        }
      });
      if (!any) preview.appendChild(h('span.muted', 'Pick one piece from each row. Your prompt builds itself here.'));
      var v = val();
      bar.style.width = v + '%';
      var tier = v >= 80 ? 'high' : v >= 45 ? 'mid' : 'low';
      strength.className = 'strength t-' + tier;
      sLabel.textContent = v + '%';
      var filled = step.slots.filter(function (s) {
        return chosen(s);
      }).length;
      sHint.textContent = filled < step.slots.length ? filled + ' of ' + step.slots.length + ' rows chosen' : tier === 'high' ? 'Expert level' : 'Swap in stronger pieces';
      runBtn.disabled = filled < step.slots.length;
    }
    runBtn.addEventListener('click', function () {
      var v = val();
      var tier = v >= 80 ? 'strong' : v >= 45 ? 'ok' : 'weak';
      d.ran = tier;
      ctx.save();
      var frame = chatFrame('Claude · simulated');
      PU.clear(chatHost).appendChild(frame.el);
      frame.composer.remove();
      frame.body.appendChild(PU.userMsg(text()));
      runBtn.disabled = true;
      PU.claudeReply(frame.body, step.outputs[tier].text, { scroll: true }).then(function () {
        var o = step.outputs[tier];
        frame.body.appendChild(h('div', h('span.tag.verdict', { class: tier === 'strong' ? 'good' : tier === 'weak' ? 'bad' : 'warn' }, o.verdict)));
        runBtn.disabled = false;
        var xp = step.xp || 40;
        var amt = tier === 'strong' ? xp : tier === 'ok' ? Math.round(xp * 0.5) : Math.round(xp * 0.2);
        ctx.award('run', amt, tier === 'strong' ? 'Expert build' : 'Prompt run', runBtn);
        if (tier !== 'strong') ctx.setHint('Tip: swap in stronger pieces and run it again for full XP');
        ctx.complete();
      });
    });
    paint();
    if (d.ran) {
      ctx.complete();
      var frame0 = chatFrame('Claude · simulated');
      frame0.composer.remove();
      frame0.body.appendChild(PU.userMsg(text()));
      var tier0 = d.ran;
      PU.claudeReply(frame0.body, step.outputs[tier0].text, { instant: true });
      frame0.body.appendChild(h('div', h('span.tag.verdict', { class: tier0 === 'strong' ? 'good' : tier0 === 'weak' ? 'bad' : 'warn' }, step.outputs[tier0].verdict)));
      chatHost.appendChild(frame0.el);
    } else ctx.setHint('Choose a piece in every row, then run it');
    return [
      head(step),
      step.task ? note(step.task, 'brief') : null,
      h('div.builder', rows.map(function (r) {
        return r.el;
      })),
      h('div.assembled', h('div.prompt', h('div.prompt-label', h('span', 'Your prompt'), PU.copyBtn(text)), preview), strength),
      h('div.btn-row', runBtn),
      chatHost
    ];
  };

  /* ---------------------------------------------------------------------
     tiers — tabs comparing prompt versions (bad / better / expert…)
     --------------------------------------------------------------------- */
  S.tiers = function (step, ctx) {
    var d = ctx.data;
    d.seen = d.seen || {};
    var panel = h('div.stack');
    var calloutHost = h('div');
    var tabs = step.tabs.map(function (t, i) {
      var b = h('button.tab', { type: 'button', role: 'tab', 'aria-selected': 'false' }, h('span', t.label));
      b.addEventListener('click', function () {
        show(i);
      });
      return b;
    });
    function show(i) {
      d.seen[i] = true;
      d.cur = i;
      ctx.save();
      tabs.forEach(function (b, j) {
        b.classList.toggle('is-on', i === j);
        b.setAttribute('aria-selected', String(i === j));
        if (d.seen[j] && !b.querySelector('.seen')) b.appendChild(h('span.seen', { 'aria-hidden': 'true' }));
      });
      var t = step.tabs[i];
      PU.fill(panel, 
        promptBlock(t.prompt, { label: t.label + ' prompt', kind: t.kind }),
        t.notes
          ? h(
              'ul.annot',
              t.notes.map(function (n) {
                return h('li', { class: n[0] === '+' ? 'pos' : 'neg' }, PU.icon(n[0] === '+' ? 'check' : 'x'), h('span', n.slice(1).trim()));
              })
            )
          : null,
        t.result ? h('div.cmp', h('div.eyebrow', 'What Claude gives back'), h('div.md', { html: PU.md(t.result) })) : null
      );
      if (Object.keys(d.seen).length >= step.tabs.length) {
        ctx.complete();
        ctx.award('seen', step.xp || 10, 'Compared them all', tabs[i]);
        if (step.callout && !calloutHost.firstChild) calloutHost.appendChild(callout(step.callout));
      } else ctx.setHint('Look at all ' + step.tabs.length + ' tabs');
    }
    show(typeof d.cur === 'number' ? d.cur : 0);
    return [head(step), h('div.tabs', { role: 'tablist' }, tabs), panel, calloutHost];
  };

  /* ---------------------------------------------------------------------
     cards — tap-to-open cards (frameworks, tips, rules)
     --------------------------------------------------------------------- */
  S.cards = function (step, ctx) {
    var d = ctx.data;
    d.open = d.open || {};
    var need = step.min || step.cards.length;
    var calloutHost = h('div');
    var grid = h('div.cards', { class: step.wide ? 'cards-wide' : '' });
    function top(c) {
      return h(
        'div.rc-top',
        c.letter ? h('span.rc-letter', c.letter) : c.icon ? h('span', { style: 'color:var(--c,var(--accent))' }, PU.icon(c.icon, 'icon-lg')) : h('span'),
        null
      );
    }
    function openCard(c) {
      return h(
        'div.rcard.is-open',
        { style: { '--c': c.color || 'var(--accent)' } },
        top(c),
        h('div.rc-title', c.title),
        h(
          'div.rc-body',
          c.body ? h('div', { html: PU.md(c.body) }) : null,
          c.example ? h('div.rc-ex', h('div.eyebrow', { style: 'margin-bottom:4px' }, c.exampleLabel || 'Example'), h('div', c.example)) : null,
          c.why ? h('div.rc-why', { html: PU.rich(c.why) }) : null
        )
      );
    }
    function closedCard(c, i) {
      var b = h(
        'button.rcard',
        { type: 'button', style: { '--c': c.color || 'var(--accent)' }, 'aria-expanded': 'false' },
        h('div.rc-top', top(c).firstChild, h('span.rc-open', 'Open', PU.icon('chevron', 'icon-sm'))),
        h('div.rc-title', c.title),
        c.q ? h('div.rc-q', c.q) : null
      );
      b.addEventListener('click', function () {
        d.open[i] = true;
        ctx.save();
        var n = openCard(c);
        b.replaceWith(n);
        check(n);
      });
      return b;
    }
    step.cards.forEach(function (c, i) {
      grid.appendChild(d.open[i] ? openCard(c) : closedCard(c, i));
    });
    function check(anchor) {
      var n = Object.keys(d.open).length;
      if (n >= need) {
        ctx.complete();
        if (anchor) ctx.award('open', step.xp || 10, step.xpLabel || 'Opened them all', anchor);
        if (step.callout && !calloutHost.firstChild) calloutHost.appendChild(callout(step.callout));
      } else ctx.setHint(n + ' of ' + need + ' opened');
    }
    check(null);
    var mn = step.mnemonic
      ? h(
          'div.mnemonic',
          { 'aria-label': step.mnemonic.map(function (m) { return m.word; }).join(' ') },
          step.mnemonic.map(function (m) {
            return h('span', { style: { '--c': m.color } }, h('b', m.word.charAt(0)), m.word.slice(1));
          })
        )
      : null;
    return [head(step), mn, grid, step.footer ? note(step.footer) : null, calloutHost];
  };

  /* ---------------------------------------------------------------------
     guide — a setup checklist people tick off as they do each step.
     Reading is enough to continue; ticking everything earns the XP.
     --------------------------------------------------------------------- */
  S.guide = function (step, ctx) {
    var d = ctx.data;
    d.ticked = d.ticked || {};
    var total = step.items.length;
    var count = h('span.guide-count');
    var fill = h('span');
    var calloutHost = h('div');
    ctx.complete();
    function paint(anchor) {
      var n = Object.keys(d.ticked).length;
      count.textContent = n + ' of ' + total + ' done';
      fill.style.width = Math.round((n / total) * 100) + '%';
      if (n >= total) {
        if (anchor) ctx.award('all', step.xp || 20, step.xpLabel || 'All set up', anchor);
        if (step.callout && !calloutHost.firstChild) calloutHost.appendChild(callout(step.callout));
      }
    }
    var list = h(
      'ol.guide',
      step.items.map(function (it, i) {
        var tick = h(
          'button.guide-tick',
          { type: 'button', role: 'checkbox', 'aria-checked': String(!!d.ticked[i]), 'aria-label': 'Done: ' + it.title },
          PU.icon('check', 'icon-sm'),
          h('span', 'Done')
        );
        var row = h(
          'li.guide-item',
          { class: d.ticked[i] ? 'is-done' : '' },
          h('span.guide-num', { 'aria-hidden': 'true' }, String(i + 1)),
          h(
            'div.guide-main',
            h('div.guide-title', it.title),
            it.body ? h('div.guide-body.md', { html: PU.md(it.body) }) : null
          ),
          tick
        );
        tick.addEventListener('click', function () {
          if (d.ticked[i]) delete d.ticked[i];
          else d.ticked[i] = true;
          ctx.save();
          row.classList.toggle('is-done', !!d.ticked[i]);
          tick.setAttribute('aria-checked', String(!!d.ticked[i]));
          paint(tick);
        });
        return row;
      })
    );
    paint(null);
    return [
      head(step),
      h('div.guide-progress', h('span.eyebrow', 'Checklist'), count, h('div.bar', fill)),
      list,
      step.extras ? h('div.stack-sm', h('div.eyebrow', 'When you’re ready'), PU.tiles(step.extras)) : null,
      step.footer ? note(step.footer) : null,
      calloutHost
    ];
  };

  /* ---------------------------------------------------------------------
     chat — scripted conversation, user presses Send for each turn
     --------------------------------------------------------------------- */
  S.chat = function (step, ctx) {
    var d = ctx.data;
    var frame = chatFrame(step.chatTitle || 'Claude · simulated');
    var calloutHost = h('div.stack');
    var composerText = h('div.fake-input');
    var send = h('button.btn.btn-primary.btn-sm', { type: 'button' }, PU.icon('send', 'icon-sm'), h('span', 'Send'));
    PU.put(frame.composer, composerText, send);
    var idx = 0;
    var busy = false;
    /** Shown once the conversation is over: callout, prompts to copy, footnote. */
    function showAfter() {
      if (calloutHost.firstChild) return;
      PU.put(
        calloutHost,
        step.callout ? callout(step.callout) : null,
        (step.templates || []).map(function (t) {
          return promptBlock(t.text, { label: t.label, copy: true, open: true });
        }),
        step.footer ? note(step.footer) : null
      );
    }
    function finish() {
      composerText.textContent = step.endText || 'Conversation complete.';
      send.disabled = true;
      d.done = true;
      ctx.save();
      ctx.award('chat', step.xp || 10, step.xpLabel || 'Conversation complete', frame.el);
      ctx.complete();
      showAfter();
    }
    function prepare() {
      var t = step.turns[idx];
      if (!t) return finish();
      composerText.textContent = t.text;
      send.lastChild.textContent = t.send || 'Send';
      send.disabled = false;
      ctx.setHint('Press “' + (t.send || 'Send') + '”');
    }
    send.addEventListener('click', function () {
      var t = step.turns[idx];
      if (busy || !t || t.role !== 'user') return;
      busy = true;
      send.disabled = true;
      frame.body.appendChild(PU.userMsg(t.text));
      idx++;
      composerText.textContent = '';
      var r = step.turns[idx];
      if (r && r.role === 'claude') {
        idx++;
        PU.claudeReply(frame.body, r.text, { scroll: true, think: r.think || 800 }).then(function () {
          busy = false;
          prepare();
        });
      } else {
        busy = false;
        prepare();
      }
    });
    if (d.done) {
      step.turns.forEach(function (t) {
        if (t.role === 'user') frame.body.appendChild(PU.userMsg(t.text));
        else PU.claudeReply(frame.body, t.text, { instant: true });
      });
      idx = step.turns.length;
      composerText.textContent = step.endText || 'Conversation complete.';
      send.disabled = true;
      ctx.complete();
      showAfter();
    } else prepare();
    return [head(step), frame.el, calloutHost];
  };

  /* ---------------------------------------------------------------------
     guesses — what Claude has to guess when the prompt is vague
     --------------------------------------------------------------------- */
  S.guesses = function (step, ctx) {
    var d = ctx.data;
    var cloud = h('div.thought-cloud');
    var after = h('div.stack');
    var btn = h('button.btn.btn-primary', { type: 'button' }, PU.icon('eye'), 'Look inside Claude’s head');
    function play(instant) {
      btn.disabled = true;
      PU.clear(cloud);
      step.guesses.forEach(function (g, i) {
        cloud.appendChild(h('span.thought', { style: instant ? '' : 'animation-delay:' + i * 0.42 + 's' }, g));
      });
      var wait = instant ? 0 : step.guesses.length * 420 + 500;
      setTimeout(function () {
        if (after.firstChild) return;
        var frame = chatFrame('Claude · simulated');
        frame.composer.remove();
        frame.body.appendChild(PU.userMsg(step.prompt));
        after.appendChild(frame.el);
        PU.claudeReply(frame.body, step.reply, { instant: instant, think: 500 }).then(function () {
          if (step.caption) after.appendChild(note(step.caption));
          d.done = true;
          ctx.save();
          ctx.complete();
          ctx.award('g', step.xp || 5, 'Mind read', btn);
        });
      }, wait);
    }
    btn.addEventListener('click', function () {
      play(false);
    });
    if (d.done) play(true);
    else ctx.setHint('Tap “Look inside Claude’s head”');
    return [
      head(step),
      h('div.thoughts', promptBlock(step.prompt, { label: 'The prompt', kind: 'bad' }), h('div.eyebrow', 'What Claude has to guess'), cloud, h('div.btn-row', btn)),
      after
    ];
  };

  /* ---------------------------------------------------------------------
     compare — two columns, static
     --------------------------------------------------------------------- */
  S.compare = function (step, ctx) {
    ctx.complete();
    function col(c) {
      return h(
        'div.cmp',
        { class: c.kind || '' },
        h('div.cmp-head', h('span.tag', { class: c.kind === 'good' ? 'good' : c.kind === 'bad' ? 'bad' : '' }, c.tag), c.title ? h('b', c.title) : null),
        c.prompt ? promptBlock(c.prompt, { label: c.promptLabel || 'Prompt', kind: c.kind === 'good' ? 'good' : c.kind === 'bad' ? 'bad' : '' }) : null,
        c.steps
          ? h(
              'ol.steps-list',
              c.steps.map(function (s) {
                return h('li', h('span', { html: PU.rich(s) }));
              })
            )
          : null,
        c.body ? h('div.md', { html: PU.md(c.body) }) : null,
        c.stat ? h('div.bigstat', h('b', c.stat[0]), h('span', c.stat[1])) : null,
        c.result ? h('div.result-lite', h('div.eyebrow', { style: 'margin-bottom:6px' }, c.resultLabel || 'What you get'), h('div.md', { html: PU.md(c.result) })) : null
      );
    }
    return [
      head(step),
      step.visual ? step.visual(ctx) : null,
      h('div.compare', step.cols.map(col)),
      step.body ? h('div.md', { html: PU.md(step.body) }) : null,
      step.callout ? callout(step.callout) : null
    ];
  };

  /* ---------------------------------------------------------------------
     contextsim — press "Add context" and watch the answer improve
     --------------------------------------------------------------------- */
  S.contextsim = function (step, ctx) {
    var d = ctx.data;
    d.n = d.n || 0;
    var total = step.contexts.length;
    var lines = h('div.ctx-lines');
    var dots = h('div.dots', { 'aria-hidden': 'true' });
    var qbar = h('span');
    var qLabel = h('b');
    var nextHint = h('p.small.muted');
    var calloutHost = h('div');
    var addBtn = h('button.btn.btn-primary', { type: 'button' }, PU.icon('plus'), h('span', 'Add context'));
    var frame = chatFrame('Claude · simulated');
    frame.composer.remove();
    var ctl = null;

    function fullPrompt() {
      var s = step.base;
      for (var i = 0; i < d.n; i++) s += '\n\n' + step.contexts[i].text;
      return s;
    }
    function paint() {
      PU.clear(lines);
      lines.appendChild(h('div.ctx-line', h('span.tag', 'Original'), h('span', step.base)));
      for (var i = 0; i < d.n; i++) {
        lines.appendChild(h('div.ctx-line', h('span.tag.good', '+ ' + step.contexts[i].label), h('span', step.contexts[i].text)));
      }
      PU.clear(dots);
      for (var k = 0; k < total; k++) dots.appendChild(h('i', { class: k < d.n ? 'on' : '' }));
      var q = step.quality[d.n];
      qbar.style.width = q + '%';
      qLabel.textContent = q + '%';
      if (d.n < total) {
        addBtn.lastChild.textContent = 'Add context: ' + step.contexts[d.n].label;
        nextHint.textContent = total - d.n + ' piece' + (total - d.n > 1 ? 's' : '') + ' of context left';
      } else {
        addBtn.lastChild.textContent = 'All context added';
        nextHint.textContent = 'That’s the full brief.';
      }
      addBtn.disabled = d.n >= total;
    }
    function reply(instant) {
      if (ctl) ctl.cancel();
      PU.clear(frame.body);
      frame.body.appendChild(PU.userMsg(fullPrompt()));
      var msg = PU.claudeMsg();
      frame.body.appendChild(msg.row);
      if (instant) {
        msg.body.innerHTML = PU.md(step.versions[d.n]);
        return Promise.resolve();
      }
      msg.body.appendChild(PU.thinking('Rewriting with the new context'));
      return PU.wait(550).then(function () {
        PU.clear(msg.body);
        ctl = PU.stream(msg.body, step.versions[d.n], { duration: 2.4 });
        return ctl.promise;
      });
    }
    function done() {
      d.done = true;
      ctx.save();
      ctx.complete();
      ctx.award('ctx', step.xp || 40, 'Fully briefed', addBtn);
      if (step.callout && !calloutHost.firstChild) calloutHost.appendChild(callout(step.callout));
    }
    addBtn.addEventListener('click', function () {
      if (d.n >= total) return;
      d.n++;
      ctx.save();
      paint();
      addBtn.disabled = true;
      reply(false).then(function () {
        addBtn.disabled = d.n >= total;
        if (d.n >= total) done();
      });
    });
    ctx.onLeave(function () {
      if (ctl) ctl.cancel();
    });
    paint();
    reply(true);
    if (d.n >= total) done();
    else ctx.setHint('Keep adding context');
    return [
      head(step),
      h(
        'div.ctx-grid',
        h(
          'div.stack',
          h('div.eyebrow', 'Your message'),
          lines,
          h('div.btn-row', addBtn),
          nextHint,
          h(
            'div.ctx-meters.panel.panel-tight',
            h('div.strength-row', h('span', 'Context given'), dots),
            h('div.strength-row', h('span', 'Client-ready'), qLabel),
            h('div.bar', qbar)
          )
        ),
        h('div.stack', h('div.eyebrow', 'Claude’s answer'), frame.el)
      ),
      calloutHost
    ];
  };

  /* ---------------------------------------------------------------------
     flow — interactive TASK → … → IMPROVE diagram
     --------------------------------------------------------------------- */
  S.flow = function (step, ctx) {
    var d = ctx.data;
    d.seen = d.seen || {};
    var detail = h('div');
    var combinedHost = h('div');
    var running = false;
    var ctl = null;
    var nodes = step.nodes.map(function (n, i) {
      var b = h('button.fnode', { type: 'button' }, h('span.fn-num', '0' + (i + 1)), h('span.fn-title', n.title), h('span.fn-short', n.short));
      b.addEventListener('click', function () {
        if (!running) select(i, false);
      });
      return b;
    });
    var runBtn = h('button.btn.btn-primary', { type: 'button' }, PU.icon('play'), h('span', 'Run the whole workflow'));
    function select(i, animate) {
      d.seen[i] = true;
      d.cur = i;
      ctx.save();
      nodes.forEach(function (b, j) {
        b.classList.toggle('is-on', j === i);
        b.classList.toggle('is-seen', !!d.seen[j]);
      });
      var n = step.nodes[i];
      var out = h('div.md');
      PU.clear(detail).appendChild(
        h(
          'div.fdetail',
          h('div.eyebrow', 'Step ' + (i + 1) + ' of ' + step.nodes.length + ' · ' + n.title),
          h('p', h('b', n.does)),
          promptBlock(n.prompt, { label: 'What you ask' }),
          h('div.stack-sm', h('div.eyebrow', 'What Claude gives back'), out)
        )
      );
      if (ctl) ctl.cancel();
      ctl = PU.stream(out, n.sample, { duration: animate ? 1.5 : 0.9 });
      checkDone();
      return ctl.promise;
    }
    function checkDone() {
      if (Object.keys(d.seen).length >= step.nodes.length) {
        ctx.complete();
        ctx.award('flow', step.xp || 30, 'Workflow mastered', runBtn);
        if (!combinedHost.firstChild) {
          combinedHost.appendChild(
            h(
              'div.stack-sm',
              h('div.eyebrow', 'The whole workflow in one message'),
              promptBlock(step.combined, { label: 'Copy and adapt', kind: 'good', copy: true, open: true }),
              step.tip ? note(step.tip) : null
            )
          );
        }
      } else ctx.setHint('Tap every step, or run the whole workflow');
    }
    runBtn.addEventListener('click', function () {
      if (running) return;
      running = true;
      runBtn.disabled = true;
      runBtn.lastChild.textContent = 'Running…';
      var i = 0;
      function nextNode() {
        if (i > 0) nodes[i - 1].classList.remove('is-running');
        if (i >= nodes.length) {
          running = false;
          runBtn.disabled = false;
          runBtn.lastChild.textContent = 'Run it again';
          return;
        }
        nodes[i].classList.add('is-running');
        var cur = i;
        i++;
        select(cur, true).then(function () {
          return PU.wait(650);
        }).then(nextNode);
      }
      nextNode();
    });
    ctx.onLeave(function () {
      if (ctl) ctl.cancel();
    });
    select(typeof d.cur === 'number' ? d.cur : 0, false);
    return [head(step), h('div.flow', nodes), h('div.btn-row', runBtn, h('span.small.muted', 'or tap any step')), detail, combinedHost];
  };

  /* ---------------------------------------------------------------------
     library — ready-made workflows for agency tasks
     --------------------------------------------------------------------- */
  S.library = function (step, ctx) {
    var d = ctx.data;
    d.opened = d.opened || {};
    var panel = h('div');
    var KEYS = [
      ['analyse', 'Analyse'],
      ['think', 'Think'],
      ['create', 'Create'],
      ['critique', 'Critique'],
      ['improve', 'Improve']
    ];
    function text(it) {
      return (
        it.task +
        '\n\nWork through this step by step and show your thinking before the final output:\n' +
        KEYS.map(function (k, i) {
          return i + 1 + '. ' + k[1] + ': ' + it[k[0]];
        }).join('\n')
      );
    }
    var chips = step.items.map(function (it, i) {
      var b = h('button.chip', { type: 'button' }, it.title);
      b.addEventListener('click', function () {
        open(i, true);
      });
      return b;
    });
    function open(i, fresh) {
      d.opened[i] = true;
      d.cur = i;
      ctx.save();
      chips.forEach(function (c, j) {
        c.classList.toggle('is-on', i === j);
      });
      var it = step.items[i];
      PU.clear(panel).appendChild(
        h(
          'div.wf-card',
          h('div.wf-card-head', h('div.eyebrow', 'Workflow'), h('div.n', it.title)),
          h(
            'div.wf-chain',
            h('div.wf-link', h('span.k', 'Task'), h('span', { html: PU.promptHTML(it.task) })),
            KEYS.map(function (k) {
              return h('div.wf-link', h('span.k', k[1]), h('span', { html: PU.promptHTML(it[k[0]]) }));
            })
          ),
          h(
            'div.wf-link',
            h('span.k', 'Use it'),
            h('div.btn-row', PU.copyBtn(function () {
              return text(it);
            }, 'Copy workflow'), PU.openInClaude(function () {
              return text(it);
            }))
          )
        )
      );
      var n = Object.keys(d.opened).length;
      if (fresh) ctx.award('open', Math.min(n, 3) * 5, 'Workflow unlocked', chips[i]);
      if (n >= (step.min || 2)) ctx.complete();
      else ctx.setHint('Open one more workflow');
    }
    if (typeof d.cur === 'number') open(d.cur, false);
    else ctx.setHint('Pick a task to see its workflow');
    return [head(step), h('div.chips', chips), panel, step.footer ? note(step.footer) : null];
  };

  /* ---------------------------------------------------------------------
     order — put the steps in the right order
     --------------------------------------------------------------------- */
  S.order = function (step, ctx) {
    var d = ctx.data;
    d.seq = d.seq || [];
    d.tries = d.tries || 0;
    var n = step.items.length;
    var shuffled = PU.shuffle(
      step.items.map(function (t, i) {
        return i;
      }),
      step.seed || 11
    );
    var pool = h('div.order-box');
    var list = h('div.order-box');
    var msg = h('div');
    var check = h('button.btn.btn-primary', { type: 'button' }, PU.icon('check'), 'Check order');
    var reset = h('button.btn.btn-ghost', { type: 'button', hidden: true }, PU.icon('refresh'), 'Try again');
    function correctCount() {
      return d.seq.filter(function (v, i) {
        return v === i;
      }).length;
    }
    function render() {
      PU.clear(pool);
      PU.clear(list);
      shuffled
        .filter(function (i) {
          return d.seq.indexOf(i) === -1;
        })
        .forEach(function (i) {
          var b = h('button.order-item', { type: 'button' }, h('span.n', '·'), h('span', step.items[i]), PU.icon('plus', 'icon-sm'));
          b.addEventListener('click', function () {
            d.seq.push(i);
            ctx.save();
            render();
          });
          pool.appendChild(b);
        });
      if (!pool.firstChild) pool.appendChild(h('p.small.muted', 'All steps placed.'));
      d.seq.forEach(function (i, pos) {
        var ok = d.checked ? i === pos : null;
        var b = h(
          'button.order-item',
          { type: 'button', class: ok === true ? 'ok' : ok === false ? 'no' : '', disabled: !!d.checked, 'aria-label': 'Remove: ' + step.items[i] },
          h('span.n', String(pos + 1)),
          h('span', step.items[i]),
          d.checked ? PU.icon(ok ? 'check' : 'x', 'icon-sm') : PU.icon('x', 'icon-sm')
        );
        b.addEventListener('click', function () {
          if (d.checked) return;
          d.seq.splice(pos, 1);
          ctx.save();
          render();
        });
        list.appendChild(b);
      });
      if (!d.seq.length) list.appendChild(h('p.small.muted', 'Tap the steps on the left in the order you’d run them.'));
      check.disabled = d.seq.length !== n || !!d.checked;
      reset.hidden = !d.checked || correctCount() === n;
      if (!d.checked) ctx.setHint(d.seq.length + ' of ' + n + ' placed');
    }
    function showMsg() {
      var c = correctCount();
      if (c === n) PU.clear(msg).appendChild(note(step.success || 'Perfect order.', 'check'));
      else {
        var txt = c + ' of ' + n + ' are in the right spot. Try again.';
        if (d.tries >= 2)
          txt +=
            '\n\nThe right order:\n' +
            step.items
              .map(function (s, i) {
                return i + 1 + '. ' + s;
              })
              .join('\n');
        PU.clear(msg).appendChild(note(txt, 'info'));
      }
    }
    check.addEventListener('click', function () {
      d.checked = true;
      d.tries++;
      ctx.save();
      var c = correctCount();
      ctx.award('order', Math.round(((step.xp || 25) * c) / n), c === n ? 'Perfect order' : 'Order checked', check);
      ctx.complete();
      render();
      showMsg();
    });
    reset.addEventListener('click', function () {
      d.checked = false;
      d.seq = [];
      ctx.save();
      PU.clear(msg);
      render();
    });
    render();
    if (d.checked) {
      showMsg();
      ctx.complete();
    }
    return [
      head(step),
      step.task ? note(step.task, 'brief') : null,
      h('div.order-cols', h('div.stack-sm', h('div.eyebrow', 'Steps (shuffled)'), pool), h('div.stack-sm', h('div.eyebrow', 'Your order'), list)),
      h('div.btn-row', check, reset),
      msg
    ];
  };

  /* ---------------------------------------------------------------------
     sort — assign each item to a bucket
     --------------------------------------------------------------------- */
  S.sort = function (step, ctx) {
    var d = ctx.data;
    d.a = d.a || {};
    var n = step.items.length;
    var msg = h('div');
    var rows = step.items.map(function (it, i) {
      var why = h('div.why', { hidden: true });
      var btns = step.buckets.map(function (bk) {
        var b = h('button', { type: 'button', 'aria-pressed': 'false' }, bk.label);
        b.addEventListener('click', function () {
          if (d.checked) return;
          d.a[i] = bk.key;
          ctx.save();
          paint();
        });
        return { b: b, key: bk.key };
      });
      var row = h(
        'div.sort-row',
        h('div.item', it.text),
        h('div.seg', { role: 'group', 'aria-label': it.text }, btns.map(function (x) {
          return x.b;
        })),
        why
      );
      return { row: row, btns: btns, why: why, it: it };
    });
    var check = h('button.btn.btn-primary', { type: 'button' }, PU.icon('check'), 'Check answers');
    var retry = h('button.btn.btn-ghost', { type: 'button', hidden: true }, PU.icon('refresh'), 'Fix my mistakes');
    function correctCount() {
      return rows.filter(function (r, i) {
        return d.a[i] === r.it.answer;
      }).length;
    }
    function bucketLabel(key) {
      var b = step.buckets.filter(function (x) {
        return x.key === key;
      })[0];
      return b ? b.label : key;
    }
    function paint() {
      rows.forEach(function (r, i) {
        var a = d.a[i];
        r.btns.forEach(function (x) {
          var on = a === x.key;
          x.b.classList.toggle('is-on', on);
          x.b.setAttribute('aria-pressed', String(on));
          x.b.disabled = !!d.checked;
          x.b.classList.toggle('is-answer', !!d.checked && a !== r.it.answer && x.key === r.it.answer);
        });
        if (d.checked) {
          var ok = a === r.it.answer;
          r.row.classList.toggle('ok', ok);
          r.row.classList.toggle('no', !ok);
          var showWhy = r.it.why && (!ok || step.showAllWhy || ctx.preview);
          r.why.hidden = !showWhy;
          if (showWhy) r.why.textContent = (ok ? '' : 'Best answer: ' + bucketLabel(r.it.answer) + '. ') + r.it.why;
        } else {
          r.row.classList.remove('ok', 'no');
          r.why.hidden = true;
        }
      });
      var answered = Object.keys(d.a).length;
      check.disabled = answered < n || !!d.checked;
      retry.hidden = !d.checked || correctCount() === n;
      if (!d.checked) ctx.setHint(answered + ' of ' + n + ' sorted');
    }
    function showMsg() {
      var c = correctCount();
      PU.clear(msg).appendChild(note(c === n ? step.success || 'All correct.' : c + ' of ' + n + ' correct. The right answers are outlined in green.', c === n ? 'check' : 'info'));
    }
    check.addEventListener('click', function () {
      d.checked = true;
      ctx.save();
      var c = correctCount();
      ctx.award('sort', Math.round(((step.xp || 25) * c) / n), c === n ? 'Perfect sort' : 'Sorted', check);
      ctx.complete();
      paint();
      showMsg();
    });
    retry.addEventListener('click', function () {
      d.checked = false;
      rows.forEach(function (r, i) {
        if (d.a[i] !== r.it.answer) delete d.a[i];
      });
      ctx.save();
      PU.clear(msg);
      paint();
    });
    paint();
    if (d.checked) {
      showMsg();
      ctx.complete();
    }
    return [head(step), h('div.sort', rows.map(function (r) {
      return r.row;
    })), h('div.btn-row', check, retry), msg];
  };

  /* ---------------------------------------------------------------------
     menu — "What are you doing today?" department menu with templates
     --------------------------------------------------------------------- */
  S.menu = function (step, ctx) {
    var d = ctx.data;
    d.seen = d.seen || {};
    var stars = (PU.state.data.stars = PU.state.data.stars || {});
    var fills = (PU.state.data.fills = PU.state.data.fills || {});
    var panel = h('div.stack');
    var deptBtns = step.departments.map(function (dep, i) {
      var b = h('button.dept', { type: 'button', style: { '--c': dep.color }, 'aria-pressed': 'false' }, PU.icon(dep.icon), h('span', dep.label), d.seen[i] ? h('span.seen-dot') : null);
      b.addEventListener('click', function () {
        openDept(i, true);
      });
      return b;
    });

    function filler(template, id) {
      var vals = (fills[id] = fills[id] || {});
      var out = h('div.prompt-text');
      function upd() {
        out.innerHTML = PU.promptHTML(PU.fillTemplate(template, vals));
      }
      var fields = PU.placeholders(template).map(function (p, k) {
        var fid = 'fill-' + id + '-' + k;
        var inp = h('input.input', { id: fid, type: 'text', placeholder: p, value: vals[p] || '' });
        inp.addEventListener('input', function () {
          vals[p] = inp.value;
          PU.save();
          upd();
        });
        return h('div.field', h('label', { for: fid }, cap(p)), inp);
      });
      upd();
      function filled() {
        return PU.fillTemplate(template, vals);
      }
      return h(
        'div.fill-form',
        h('div.small.muted', 'Fill in what you know. Anything left in [brackets] stays as a reminder.'),
        h('div.fill-grid', fields),
        h('div.prompt', h('div.prompt-label', h('span', 'Your ready-to-use prompt')), out),
        h('div.btn-row', PU.copyBtn(filled, 'Copy prompt'), PU.openInClaude(filled))
      );
    }

    function jobBody(dep, it, id) {
      var starBtn = h('button.btn.btn-ghost.btn-sm.star-btn', { type: 'button' }, PU.icon('star', 'icon-sm'), h('span', 'Save to cheat sheet'));
      function paintStar() {
        var on = !!stars[id];
        starBtn.classList.toggle('is-on', on);
        starBtn.lastChild.textContent = on ? 'Saved to cheat sheet' : 'Save to cheat sheet';
      }
      starBtn.addEventListener('click', function () {
        if (stars[id]) delete stars[id];
        else {
          stars[id] = { title: it.title, dept: dep.label, template: it.template };
          ctx.award('star', step.starXp || 10, 'Saved to your cheat sheet', starBtn);
        }
        PU.save();
        paintStar();
        PU.emit('stars');
      });
      paintStar();
      var fillHost = h('div');
      var fillBtn = h('button.btn.btn-primary.btn-sm', { type: 'button' }, PU.icon('pen', 'icon-sm'), h('span', 'Fill it in'));
      fillBtn.addEventListener('click', function () {
        if (fillHost.firstChild) {
          PU.clear(fillHost);
          fillBtn.lastChild.textContent = 'Fill it in';
          return;
        }
        fillBtn.lastChild.textContent = 'Close';
        fillHost.appendChild(filler(it.template, id));
      });
      return h(
        'div.job-body',
        h('div.prompt', h('div.prompt-label', h('span', 'Prompt template')), h('div.prompt-text', { html: PU.promptHTML(it.template) })),
        it.tip ? h('p.small.muted', { html: PU.rich(it.tip) }) : null,
        h('div.btn-row', fillBtn, PU.copyBtn(it.template, 'Copy template'), starBtn),
        fillHost
      );
    }

    function job(dep, it, k) {
      var id = dep.key + '-' + k;
      var wrap = h('div.job');
      var body = null;
      var hb = h(
        'button.job-head',
        { type: 'button', 'aria-expanded': 'false' },
        h('span.job-num', String(k + 1)),
        h('span', h('span.job-title', it.title), h('span.job-desc', it.desc)),
        PU.icon('chevron', 'job-chev')
      );
      hb.addEventListener('click', function () {
        var open = !wrap.classList.contains('is-open');
        wrap.classList.toggle('is-open', open);
        hb.setAttribute('aria-expanded', String(open));
        if (open && !body) {
          body = jobBody(dep, it, id);
          wrap.appendChild(body);
        }
        if (body) body.hidden = !open;
      });
      wrap.appendChild(hb);
      return wrap;
    }

    function openDept(i, fresh) {
      d.cur = i;
      if (!d.seen[i]) {
        d.seen[i] = true;
        deptBtns[i].appendChild(h('span.seen-dot'));
      }
      ctx.save();
      deptBtns.forEach(function (b, j) {
        b.classList.toggle('is-on', i === j);
        b.setAttribute('aria-pressed', String(i === j));
      });
      var dep = step.departments[i];
      PU.fill(panel, 
        h('div.stack-sm', h('div.eyebrow', dep.label), h('h3', { style: 'font-size:24px' }, 'Here are 5 things Claude can do for you.'), dep.blurb ? h('p.muted', dep.blurb) : null),
        h(
          'div.jobs',
          dep.items.map(function (it, k) {
            return job(dep, it, k);
          })
        ),
        h('p.small.muted', 'Open a job to see a ready-made prompt. “Fill it in” turns it into your own in seconds.')
      );
      var n = Object.keys(d.seen).length;
      if (fresh) {
        ctx.award('dept', Math.min(n, 3) * 10, 'New area explored', deptBtns[i]);
        if (window.innerWidth < 760) PU.scrollNear(panel);
      }
      if (n >= 2) ctx.complete();
      else ctx.setHint('Explore at least one more area');
    }
    if (typeof d.cur === 'number') openDept(d.cur, false);
    else ctx.setHint('Pick what you’re working on today');
    return [head(step), h('div.depts', deptBtns), panel];
  };

  /* ---------------------------------------------------------------------
     screens — attach a screenshot, watch Claude read it
     --------------------------------------------------------------------- */
  S.screens = function (step, ctx) {
    var d = ctx.data;
    d.seen = d.seen || {};
    var host = h('div.stack');
    var tabs = step.tabs.map(function (t, i) {
      var b = h('button.tab', { type: 'button', role: 'tab' }, h('span', t.label), d.seen[i] ? h('span.seen') : null);
      b.addEventListener('click', function () {
        show(i);
      });
      return b;
    });
    function attachment(t) {
      return h('div.attach.fly', h('span.thumb', PU.icon('image')), t.file);
    }
    function show(i) {
      d.cur = i;
      ctx.save();
      tabs.forEach(function (b, j) {
        b.classList.toggle('is-on', i === j);
      });
      var t = step.tabs[i];
      var frame = chatFrame('Claude · simulated');
      var composerText = h('div.fake-input', t.prompt);
      var sendBtn = h('button.btn.btn-primary.btn-sm', { type: 'button' }, PU.icon('clip', 'icon-sm'), 'Attach & send');
      PU.put(frame.composer, composerText, sendBtn);
      sendBtn.addEventListener('click', function () {
        sendBtn.disabled = true;
        composerText.textContent = '';
        frame.body.appendChild(PU.userMsg(t.prompt, attachment(t)));
        PU.claudeReply(frame.body, t.answer, { scroll: true, thinkingLabel: 'Reading the screenshot', think: 1000 }).then(function () {
          d.seen[i] = true;
          ctx.save();
          if (!tabs[i].querySelector('.seen')) tabs[i].appendChild(h('span.seen'));
          ctx.award('s' + i, 10, 'Screenshot decoded', sendBtn);
          ctx.complete();
          sendBtn.hidden = true;
          var left = step.tabs.length - Object.keys(d.seen).length;
          composerText.textContent = left ? 'Try the other ' + (left > 1 ? left + ' screenshots' : 'screenshot') + ' too (tabs above).' : 'All three decoded.';
        });
      });
      if (d.seen[i]) {
        frame.body.appendChild(PU.userMsg(t.prompt, h('div.attach', h('span.thumb', PU.icon('image')), t.file)));
        PU.claudeReply(frame.body, t.answer, { instant: true });
        sendBtn.hidden = true;
        composerText.textContent = 'Decoded. Try the other tabs.';
      }
      PU.fill(host, h('div.stack-sm', h('div.eyebrow', 'The screenshot: ' + t.file), t.mock()), frame.el);
    }
    show(typeof d.cur === 'number' ? d.cur : 0);
    if (Object.keys(d.seen).length) ctx.complete();
    else ctx.setHint('Press “Attach & send”');
    return [head(step), h('div.tabs', { role: 'tablist' }, tabs), host, step.footer ? note(step.footer) : null];
  };

  /* ---------------------------------------------------------------------
     project — set up a Project, then chat with a short prompt
     --------------------------------------------------------------------- */
  S.project = function (step, ctx) {
    var d = ctx.data;
    d.ins = d.ins || {};
    d.files = d.files || {};
    if (d.name === undefined) d.name = step.defaultName;
    var chatHost = h('div');
    var nameInput = h('input.input#proj-name', { type: 'text', value: d.name, maxlength: '60' });
    var cardName = h('div.proj-name');
    var cardIns = h('div.md', { style: 'font-size:14px' });
    var cardFiles = h('div.file-list');
    var startBtn = h('button.btn.btn-primary', { type: 'button' }, PU.icon('chat'), 'Start a chat in this project');
    var reqNote = h('p.small.muted');

    function toggleList(list, store) {
      return list.map(function (o, i) {
        var warn = h('span.warn-text', { hidden: true }, o.warn || '');
        var b = h(
          'button.toggle',
          { type: 'button', 'aria-pressed': 'false' },
          h('span.box', PU.icon('check')),
          h('span', o.type ? h('span.mono', { style: 'font-size:13.5px' }, o.text) : h('span', o.text), warn)
        );
        b.addEventListener('click', function () {
          store[i] = !store[i];
          ctx.save();
          paint();
        });
        return { b: b, warn: warn, o: o, store: store, i: i };
      });
    }
    var insT = toggleList(step.instructions, d.ins);
    var fileT = toggleList(step.files, d.files);

    function counts() {
      var c = { gi: 0, gf: 0, bad: 0, badFiles: [], gti: 0, gtf: 0 };
      step.instructions.forEach(function (o, i) {
        if (o.good) c.gti++;
        if (d.ins[i] && o.good) c.gi++;
        if (d.ins[i] && !o.good) c.bad++;
      });
      step.files.forEach(function (o, i) {
        if (o.good) c.gtf++;
        if (d.files[i] && o.good) c.gf++;
        if (d.files[i] && !o.good) {
          c.bad++;
          c.badFiles.push(o.text);
        }
      });
      return c;
    }
    function paint() {
      insT.concat(fileT).forEach(function (x) {
        var on = !!x.store[x.i];
        x.b.classList.toggle('is-on', on);
        x.b.setAttribute('aria-pressed', String(on));
        x.warn.hidden = !(on && x.o.warn);
      });
      cardName.textContent = d.name || 'Untitled project';
      var ins = step.instructions
        .filter(function (o, i) {
          return d.ins[i];
        })
        .map(function (o) {
          return o.text;
        });
      cardIns.innerHTML = ins.length ? PU.md(ins.join('\n')) : '<p class="muted">No instructions yet.</p>';
      PU.clear(cardFiles);
      var fl = step.files.filter(function (o, i) {
        return d.files[i];
      });
      if (!fl.length) cardFiles.appendChild(h('p.small.muted', 'No files yet.'));
      fl.forEach(function (o) {
        cardFiles.appendChild(h('div.file', h('span.ficon', { class: o.type }, o.type.toUpperCase()), h('span.fname', o.text), o.good ? null : h('span.tag.bad', 'Remove')));
      });
      var c = counts();
      var ready = c.gi >= 3 && c.gf >= 3;
      startBtn.disabled = !ready;
      reqNote.textContent = ready ? (c.bad ? 'Heads up: something in your project shouldn’t be there (see the red notes).' : 'Looks good. Your project is ready.') : 'Add at least 3 useful instructions and 3 useful files.';
    }
    nameInput.addEventListener('input', function () {
      d.name = nameInput.value;
      ctx.save();
      paint();
    });
    function runChat(instant) {
      var c = counts();
      var frame = chatFrame((d.name || 'Project') + ' · simulated');
      frame.composer.remove();
      PU.clear(chatHost).appendChild(h('div.stack-sm', h('div.eyebrow', 'A new chat inside the project'), frame.el));
      frame.body.appendChild(PU.userMsg(step.chatPrompt));
      return PU.claudeReply(frame.body, step.answer, { instant: instant, scroll: !instant, thinkingLabel: 'Reading project files' }).then(function () {
        var wc = PU.wordCount(step.chatPrompt);
        var extra = c.badFiles.length ? '\n\n**One problem:** you uploaded ' + c.badFiles.join(' and ') + '. Irrelevant files add noise, and confidential personal data never belongs in a chat or project.' : '';
        chatHost.appendChild(callout({ eyebrow: 'Look at the prompt', title: 'The prompt was ' + wc + ' words. The ==Project== did the rest.', text: 'Every chat in this project starts already briefed on the brand, the audience and the rules.' }));
        if (extra) chatHost.appendChild(note(extra.trim(), 'alert'));
        return c;
      });
    }
    startBtn.addEventListener('click', function () {
      startBtn.disabled = true;
      runChat(false).then(function (c) {
        startBtn.disabled = false;
        d.ran = true;
        ctx.save();
        var xp = step.xp || 40;
        var q = (c.gi + c.gf) / (c.gti + c.gtf);
        ctx.award('proj', Math.max(5, Math.round(xp * q) - c.bad * 10), c.bad ? 'Project built' : 'Project built right', startBtn);
        ctx.complete();
      });
    });
    paint();
    if (d.ran) {
      runChat(true);
      ctx.complete();
    } else ctx.setHint('Set up the project, then start a chat');
    return [
      head(step),
      h(
        'div.proj',
        h(
          'div.stack',
          h('div.field', h('label', { for: 'proj-name' }, 'Project name'), nameInput),
          h('div.stack-sm', h('div.eyebrow', 'Instructions (how Claude should behave)'), h('div.toggle-list', insT.map(function (x) {
            return x.b;
          }))),
          h('div.stack-sm', h('div.eyebrow', 'Files (what Claude should know)'), h('div.toggle-list', fileT.map(function (x) {
            return x.b;
          })))
        ),
        h(
          'div.stack',
          h(
            'div.proj-card',
            h('div.eyebrow', 'Project preview'),
            cardName,
            h('div.stack-sm', h('div.eyebrow', 'Instructions'), cardIns),
            h('div.stack-sm', h('div.eyebrow', 'Files'), cardFiles)
          ),
          h('div.btn-row', startBtn),
          reqNote
        )
      ),
      chatHost
    ];
  };

  /* ---------------------------------------------------------------------
     cowork — plan, run, approve, deliver
     --------------------------------------------------------------------- */
  function fileRow(f, extra) {
    return h('div.file', { class: extra || '' }, h('span.ficon', { class: f.type }, f.type.toUpperCase()), h('span.fname', f.name), f.badge ? h('span.tag.good', f.badge) : null);
  }

  S.cowork = function (step, ctx) {
    var d = ctx.data;
    var folder = h('div.file-list');
    var main = h('div.cw-main');
    var deliver = h('div');
    var state = { deleted: false, created: false };

    function paintFolder() {
      PU.clear(folder);
      step.files.forEach(function (f) {
        folder.appendChild(fileRow(f, f.junk && state.deleted ? 'is-gone' : ''));
      });
      if (state.created)
        step.outputs.forEach(function (f) {
          folder.appendChild(fileRow({ name: f.name, type: f.type, badge: 'New' }, 'is-new'));
        });
    }

    function planList() {
      return h(
        'ol.plan',
        step.plan.map(function (p) {
          return h('li', h('span.pi'), h('span', h('span', p.t), h('span.log', { hidden: true })));
        })
      );
    }

    function finalView(instant) {
      state.created = true;
      paintFolder();
      PU.fill(deliver, 
        h('div.stack-sm', h('div.eyebrow', 'What Claude delivered'), step.preview()),
        callout(step.doneCallout)
      );
      if (!instant) PU.scrollNear(deliver);
    }

    function start() {
      PU.clear(main);
      var plan = planList();
      var go = h('button.btn.btn-primary', { type: 'button' }, PU.icon('play'), 'Looks good. Go');
      PU.put(main, 
        h('div.stack-sm', h('div.eyebrow', 'Your task'), h('div.prompt', h('div.prompt-text', step.task))),
        h('div.stack-sm', h('div.eyebrow', 'Claude’s plan'), plan),
        h('p.small.muted', 'Claude shows its plan first, so you can correct it before any work starts.'),
        h('div.btn-row', go)
      );
      go.addEventListener('click', function () {
        go.remove();
        run(plan);
      });
      ctx.setHint('Approve the plan');
    }

    function run(plan) {
      var items = Array.prototype.slice.call(plan.children);
      var i = 0;
      function stepItem() {
        if (i >= items.length) return finish();
        var li = items[i];
        var p = step.plan[i];
        li.classList.add('is-run');
        var log = li.querySelector('.log');
        log.hidden = false;
        log.textContent = p.log;
        var idx = i;
        PU.wait(p.ms || 1100).then(function () {
          li.classList.remove('is-run');
          li.classList.add('is-done');
          li.querySelector('.pi').appendChild(PU.icon('check'));
          i++;
          if (idx === step.approval.after) approval(stepItem);
          else stepItem();
        });
      }
      stepItem();
    }

    function approval(cont) {
      var a = step.approval;
      var allow = h('button.btn.btn-ghost.btn-sm', { type: 'button' }, 'Allow');
      var deny = h('button.btn.btn-primary.btn-sm', { type: 'button' }, 'Deny: stick to the task');
      var box = h('div.approve', h('div.t', PU.icon('alert', 'icon-sm'), ' ', a.title), h('p.small', a.text), h('div.btn-row', deny, allow));
      main.appendChild(box);
      PU.scrollNear(box);
      ctx.setHint('Claude is waiting for your decision');
      function decide(allowed) {
        d.allowed = allowed;
        ctx.save();
        allow.disabled = deny.disabled = true;
        if (allowed) {
          state.deleted = true;
          paintFolder();
        } else ctx.award('deny', 10, 'Good call', deny);
        box.appendChild(note(allowed ? a.allowNote : a.denyNote, allowed ? 'info' : 'check'));
        cont();
      }
      allow.addEventListener('click', function () {
        decide(true);
      });
      deny.addEventListener('click', function () {
        decide(false);
      });
    }

    function finish() {
      d.done = true;
      ctx.save();
      finalView(false);
      ctx.award('cw', step.xp || 30, 'Task delivered', deliver);
      ctx.complete();
    }

    var startBtn = h('button.btn.btn-primary', { type: 'button' }, PU.icon('play'), 'Start task');
    startBtn.addEventListener('click', start);

    if (d.done) {
      state.deleted = !!d.allowed;
      PU.put(main, 
        h('div.stack-sm', h('div.eyebrow', 'Your task'), h('div.prompt', h('div.prompt-text', step.task))),
        h(
          'ol.plan',
          step.plan.map(function (p) {
            return h('li.is-done', h('span.pi', PU.icon('check')), h('span', h('span', p.t), h('span.log', p.log)));
          })
        ),
        h('div.btn-row', h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: function () {
          d.done = false;
          state.created = false;
          state.deleted = false;
          ctx.save();
          PU.clear(deliver);
          paintFolder();
          start();
        } }, PU.icon('refresh', 'icon-sm'), 'Run it again'))
      );
      finalView(true);
      ctx.complete();
    } else {
      PU.put(main, 
        h('div.stack-sm', h('div.eyebrow', 'Describe the outcome'), h('div.prompt', h('div.prompt-label', h('span', 'Task for Cowork')), h('div.prompt-text', step.task))),
        h('div.btn-row', startBtn)
      );
      ctx.setHint('Press “Start task”');
    }
    paintFolder();
    return [
      head(step),
      h('div.cw', h('div.cw-side', h('div.eyebrow', PU.icon('folder', 'icon-sm'), ' ' + step.folder), folder), main),
      deliver
    ];
  };

  /* ---------------------------------------------------------------------
     build — describe a tool, watch Claude Code build it, use it for real
     --------------------------------------------------------------------- */
  PU.tools = {};

  PU.tools.caption = function () {
    var BANNED = ['elevate', 'indulge', 'unleash', 'game-changer', 'game changer', 'revolutionary', 'next-level', 'next level'];
    var ta = h('textarea.textarea#tool-caption', { rows: '5', style: 'min-height:120px' });
    ta.value =
      'Elevate your mornings with our new SPF 50 gel ☀️ Lightweight, no white cast, and tested on sensitive skin. Your daily step, simplified. Tap the link in bio to shop the launch. #LumaSkin #SPFEveryday #SensitiveSkin';
    var chars = h('div.v');
    var tags = h('div.v');
    var charBar = h('span');
    var tagBar = h('span');
    var cStat = h('div.tstat', h('span.eyebrow', 'Characters (max 2,200)'), chars, h('div.bar', charBar));
    var tStat = h('div.tstat', h('span.eyebrow', 'Hashtags (max 30)'), tags, h('div.bar', tagBar));
    var cut = h('div.cutoff');
    var banned = h('div.chips');
    function upd() {
      var v = ta.value;
      var n = Array.from(v).length;
      var hashtags = (v.match(/#[\p{L}\p{N}_]+/gu) || []).length;
      chars.textContent = n.toLocaleString();
      tags.textContent = String(hashtags);
      charBar.style.width = Math.min(100, (n / 2200) * 100) + '%';
      tagBar.style.width = Math.min(100, (hashtags / 30) * 100) + '%';
      cStat.classList.toggle('over', n > 2200);
      tStat.classList.toggle('over', hashtags > 30);
      var arr = Array.from(v);
      PU.fill(cut, h('span', arr.slice(0, 125).join('')), arr.length > 125 ? h('span.rest', arr.slice(125).join('')) : null);
      PU.clear(banned);
      var low = v.toLowerCase();
      var found = BANNED.filter(function (w) {
        return new RegExp('(^|[^a-z])' + w.replace(/[-\s]/g, '[-\\s]') + '([^a-z]|$)', 'i').test(low);
      });
      if (!found.length) banned.appendChild(h('span.tag.good', PU.icon('check', 'icon-sm'), 'No banned words'));
      found.forEach(function (w) {
        banned.appendChild(h('span.tag.bad', PU.icon('alert', 'icon-sm'), '“' + w + '”'));
      });
    }
    ta.addEventListener('input', upd);
    upd();
    return {
      url: 'caption-checker.html',
      el: h(
        'div.stack',
        h('div.field', h('label', { for: 'tool-caption' }, 'Paste a caption'), ta),
        h('div.tool-stats', cStat, tStat),
        h('div.stack-sm', h('span.eyebrow', 'What shows before “…more” (first 125 characters)'), cut),
        h('div.stack-sm', h('span.eyebrow', 'Banned words'), banned)
      )
    };
  };

  PU.tools.utm = function () {
    var F = [
      ['url', 'Website link', 'https://lumaskin.in/spf50'],
      ['source', 'Source', 'Instagram'],
      ['medium', 'Medium', 'Paid Social'],
      ['campaign', 'Campaign', 'SPF50 Launch'],
      ['content', 'Content (optional)', 'Reel 01']
    ];
    var inputs = {};
    var out = h('div.utm-out');
    var errEl = h('p.live-err', { hidden: true });
    var fields = F.map(function (f) {
      var inp = h('input.input', { id: 'utm-' + f[0], type: 'text', value: f[2] });
      inputs[f[0]] = inp;
      inp.addEventListener('input', upd);
      return h('div.field', h('label', { for: 'utm-' + f[0] }, f[1]), inp);
    });
    function norm(v) {
      return v.trim().toLowerCase().replace(/\s+/g, '_');
    }
    function build() {
      var raw = inputs.url.value.trim();
      if (!raw) return '';
      if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
      var u;
      try {
        u = new URL(raw);
      } catch (e) {
        return null;
      }
      [['utm_source', 'source'], ['utm_medium', 'medium'], ['utm_campaign', 'campaign'], ['utm_content', 'content']].forEach(function (p) {
        var v = norm(inputs[p[1]].value);
        if (v) u.searchParams.set(p[0], v);
        else u.searchParams.delete(p[0]);
      });
      return u.toString();
    }
    function upd() {
      var r = build();
      errEl.hidden = r !== null;
      if (r === null) errEl.textContent = 'That website link doesn’t look right.';
      out.textContent = r || 'Add a website link to start.';
    }
    upd();
    return {
      url: 'utm-builder.html',
      el: h(
        'div.stack',
        h('div.fill-grid', fields),
        errEl,
        h('div.stack-sm', h('span.eyebrow', 'Your tracking link'), out),
        h('div.btn-row', PU.copyBtn(function () {
          return build() || '';
        }, 'Copy link'))
      )
    };
  };

  S.build = function (step, ctx) {
    var d = ctx.data;
    var chooser = h('div.grid-2');
    var work = h('div.stack');
    var timers = [];
    ctx.onLeave(function () {
      timers.forEach(clearTimeout);
    });

    function showTool(key, instant) {
      var tool = step.tools[key];
      var made = PU.tools[key]();
      var frame = h('div.browser', h('div.browser-bar', h('span.dots3', h('i'), h('i'), h('i')), h('span.url', made.url), h('span.tag.good', 'Working')), h('div.browser-body', made.el));
      work.appendChild(h('div.stack-sm', h('div.eyebrow', 'The tool Claude built. It works: try it.'), frame));
      work.appendChild(callout(step.doneCallout));
      if (!instant) PU.scrollNear(frame);
    }

    function build(key) {
      d.tool = key;
      ctx.save();
      var tool = step.tools[key];
      PU.clear(work);
      var body = h('div.term-body');
      var term = h('div.term', h('div.term-bar', PU.icon('terminal', 'icon-sm'), 'Claude Code · simulated'), body);
      var sendBtn = h('button.btn.btn-primary', { type: 'button' }, PU.icon('send'), 'Send to Claude Code');
      PU.put(work, promptBlock(tool.request, { label: 'Your request, in plain English' }), h('div.btn-row', sendBtn), term);
      body.appendChild(h('div.term-line.dim', 'Waiting for your request…'));
      sendBtn.addEventListener('click', function () {
        sendBtn.disabled = true;
        PU.clear(body);
        body.appendChild(h('div.term-line.you', '> ' + tool.request.split('\n')[0].slice(0, 90) + '…'));
        var delay = 300;
        tool.log.forEach(function (line, i) {
          delay += line.ms || 750;
          timers.push(
            setTimeout(function () {
              body.appendChild(h('div.term-line', { class: line.kind || '' }, line.t));
              if (i === tool.log.length - 1) {
                sendBtn.hidden = true;
                showTool(key, false);
                d.built = d.built || {};
                d.built[key] = true;
                ctx.save();
                ctx.award('build', step.xp || 30, 'You built a tool', sendBtn);
                ctx.complete();
              }
            }, PU.reduced ? 10 * (i + 1) : delay)
          );
        });
      });
      ctx.setHint('Send your request to Claude Code');
    }

    Object.keys(step.tools).forEach(function (key) {
      var t = step.tools[key];
      var b = h(
        'button.rcard',
        { type: 'button', style: { '--c': t.color } },
        h('div.rc-top', h('span', { style: 'color:var(--c)' }, PU.icon(t.icon, 'icon-lg')), d.built && d.built[key] ? h('span.tag.good', 'Built') : h('span.rc-open', 'Build it', PU.icon('chevron', 'icon-sm'))),
        h('div.rc-title', t.title),
        h('div.rc-q', t.desc)
      );
      b.addEventListener('click', function () {
        build(key);
      });
      chooser.appendChild(b);
    });

    if (d.tool && d.built && d.built[d.tool]) {
      var tool0 = step.tools[d.tool];
      var body0 = h('div.term-body');
      body0.appendChild(h('div.term-line.you', '> ' + tool0.request.split('\n')[0].slice(0, 90) + '…'));
      tool0.log.forEach(function (line) {
        body0.appendChild(h('div.term-line', { class: line.kind || '' }, line.t));
      });
      PU.put(work, promptBlock(tool0.request, { label: 'Your request, in plain English' }), h('div.term', h('div.term-bar', PU.icon('terminal', 'icon-sm'), 'Claude Code · simulated'), body0));
      showTool(d.tool, true);
      ctx.complete();
    } else ctx.setHint('Pick a tool to build');
    return [head(step), h('div.eyebrow', 'Pick one to build'), chooser, work];
  };

  /* ---------------------------------------------------------------------
     wfbuilder — design your own repeatable workflow
     --------------------------------------------------------------------- */
  S.wfbuilder = function (step, ctx) {
    var d = ctx.data;
    var P = step.presets;
    d.inputs = d.inputs || [];
    d.checks = d.checks || [];
    d.steps = d.steps || {};
    var STEPS = [
      ['analyse', 'Analyse'],
      ['think', 'Think'],
      ['create', 'Create'],
      ['critique', 'Critique'],
      ['improve', 'Improve']
    ];
    var resultHost = h('div');
    var taskInput = h('input.input#wf-task', { type: 'text', placeholder: 'e.g. Monthly performance report for my clients', value: d.task || '' });
    var outInput = h('input.input#wf-output', { type: 'text', placeholder: 'e.g. A one-page report with 3 wins, 2 concerns and next month’s plan', value: d.output || '' });
    var stepInputs = {};
    var whereWrap = h('div.chips');
    var freqWrap = h('div.chips');
    var inputsWrap = h('div.chips');
    var checksWrap = h('div.chips');
    var recNote = h('p.small.muted');

    function presetFor(task) {
      var t = String(task || '').toLowerCase();
      var keys = Object.keys(P);
      for (var i = 0; i < keys.length; i++) {
        var p = P[keys[i]];
        if (t === keys[i].toLowerCase()) return p;
        if (p.match && p.match.test(t)) return p;
      }
      return null;
    }
    function recommend() {
      var p = presetFor(d.task);
      if (p) return p.where;
      var inp = d.inputs.join(' ').toLowerCase();
      var t = String(d.task || '').toLowerCase();
      if (/tool|calculator|builder|automat|website|landing page|dashboard/.test(t)) return 'Claude Code';
      if (/export|spreadsheet|folder|files|report/.test(inp + ' ' + t)) return 'Cowork';
      if (d.freq === 'Daily' || d.freq === 'Weekly') return 'Project';
      return 'Project';
    }
    function chipGroup(wrap, options, isOn, onClick, extra) {
      PU.clear(wrap);
      options.forEach(function (o) {
        var b = h('button.chip', { type: 'button', class: isOn(o) ? 'is-on' : '', 'aria-pressed': String(isOn(o)) }, o, extra && extra(o) ? h('span.tag.live', { style: 'margin-left:4px' }, extra(o)) : null);
        b.addEventListener('click', function () {
          onClick(o);
        });
        wrap.appendChild(b);
      });
    }
    function applyPreset(p) {
      if (!p) return;
      d.freq = d.freq || p.freq;
      if (!d.inputs.length) d.inputs = p.inputs.slice();
      if (!d.output) {
        d.output = p.output;
        outInput.value = p.output;
      }
      STEPS.forEach(function (s) {
        if (!d.steps[s[0]]) {
          d.steps[s[0]] = p.steps[s[0]];
          stepInputs[s[0]].value = p.steps[s[0]];
        }
      });
    }
    function genericSteps() {
      var task = d.task || 'this task';
      var inp = d.inputs.length ? d.inputs.join(', ').toLowerCase() : 'what I give you';
      return {
        analyse: 'Review the ' + inp + ' and tell me what stands out for ' + task.toLowerCase() + '.',
        think: 'Identify the 3 most important insights or decisions, and why.',
        create: 'Produce the output described below.',
        critique: 'Check it like a demanding creative director. Flag anything generic, wrong or off-brand.',
        improve: 'Fix the issues and give me the final version, plus anything I should double-check.'
      };
    }
    function paintGroups() {
      var rec = recommend();
      chipGroup(
        freqWrap,
        step.freqs,
        function (o) {
          return d.freq === o;
        },
        function (o) {
          d.freq = o;
          ctx.save();
          paintGroups();
        }
      );
      chipGroup(
        inputsWrap,
        step.inputs,
        function (o) {
          return d.inputs.indexOf(o) !== -1;
        },
        function (o) {
          var k = d.inputs.indexOf(o);
          if (k === -1) d.inputs.push(o);
          else d.inputs.splice(k, 1);
          ctx.save();
          paintGroups();
        }
      );
      chipGroup(
        whereWrap,
        step.wheres,
        function (o) {
          return d.where === o;
        },
        function (o) {
          d.where = o;
          ctx.save();
          paintGroups();
        },
        function (o) {
          return o === rec ? 'Suggested' : '';
        }
      );
      chipGroup(
        checksWrap,
        step.checks,
        function (o) {
          return d.checks.indexOf(o) !== -1;
        },
        function (o) {
          var k = d.checks.indexOf(o);
          if (k === -1) d.checks.push(o);
          else d.checks.splice(k, 1);
          ctx.save();
          paintGroups();
        }
      );
      recNote.textContent = step.whereWhy[rec] ? 'Suggested: ' + rec + '. ' + step.whereWhy[rec] : '';
    }
    var taskChips = h(
      'div.chips',
      Object.keys(P).map(function (k) {
        var b = h('button.chip', { type: 'button' }, k);
        b.addEventListener('click', function () {
          d.task = k;
          taskInput.value = k;
          applyPreset(P[k]);
          ctx.save();
          paintGroups();
        });
        return b;
      })
    );
    taskInput.addEventListener('input', function () {
      d.task = taskInput.value;
      ctx.save();
      paintGroups();
    });
    taskInput.addEventListener('change', function () {
      applyPreset(presetFor(d.task));
      paintGroups();
    });
    outInput.addEventListener('input', function () {
      d.output = outInput.value;
      ctx.save();
    });
    var stepRows = STEPS.map(function (s) {
      var inp = h('input.input', { id: 'wf-' + s[0], type: 'text', value: d.steps[s[0]] || '' });
      inp.addEventListener('input', function () {
        d.steps[s[0]] = inp.value;
        ctx.save();
      });
      stepInputs[s[0]] = inp;
      return h('div.wf-step', h('label.k', { for: 'wf-' + s[0] }, s[1]), inp);
    });
    var fillGeneric = h('button.btn.btn-quiet.btn-sm', { type: 'button' }, PU.icon('wand', 'icon-sm'), 'Suggest steps for me');
    fillGeneric.addEventListener('click', function () {
      var p = presetFor(d.task);
      var g = p ? p.steps : genericSteps();
      STEPS.forEach(function (s) {
        d.steps[s[0]] = g[s[0]];
        stepInputs[s[0]].value = g[s[0]];
      });
      ctx.save();
    });

    function masterPrompt() {
      var lines = [];
      lines.push('Recurring task' + (d.freq ? ' (' + d.freq.toLowerCase() + ')' : '') + ': ' + (d.task || '[task]') + '.');
      if (d.inputs.length) lines.push('\nWhat I’m giving you: ' + d.inputs.join(', ') + '.');
      lines.push('\nWork through these steps and show your thinking before the final output:');
      STEPS.forEach(function (s, i) {
        lines.push(i + 1 + '. ' + s[1] + ': ' + (d.steps[s[0]] || '[describe this step]'));
      });
      lines.push('\nOutput: ' + (d.output || '[what you want back]') + '.');
      if (d.checks.length) lines.push('Flag anything I should double-check, especially: ' + d.checks.join(', ').toLowerCase() + '.');
      lines.push('Before you start, ask me any questions you need answered.');
      return lines.join('\n');
    }
    function completeness() {
      var s = 0;
      if (PU.wordCount(d.task) >= 2) s += 10;
      if (d.freq) s += 5;
      if (d.inputs.length >= 2) s += 15;
      else if (d.inputs.length === 1) s += 8;
      if (d.where) s += 10;
      var filled = STEPS.filter(function (x) {
        return PU.wordCount(d.steps[x[0]]) >= 3;
      }).length;
      s += filled * 6;
      if (PU.wordCount(d.output) >= 3) s += 15;
      if (d.checks.length) s += 15;
      return Math.min(100, s);
    }
    function renderCard(fresh) {
      var where = d.where || recommend();
      var prompt = masterPrompt();
      var sc = completeness();
      var wf = { task: d.task, freq: d.freq, inputs: d.inputs.slice(), where: where, steps: Object.assign({}, d.steps), output: d.output, checks: d.checks.slice(), prompt: prompt };
      PU.state.data.workflow = wf;
      PU.save();
      PU.fill(resultHost, 
        h(
          'div.wf-card',
          h('div.wf-card-head', h('div.eyebrow', 'Your workflow · ' + (d.freq || 'Recurring')), h('div.n', d.task || 'My workflow')),
          h(
            'div.wf-chain',
            h('div.wf-link', h('span.k', 'Lives in'), h('span', h('b', where), ' · ' + (step.whereHow[where] || ''))),
            h('div.wf-link', h('span.k', 'Input'), h('span', d.inputs.join(', ') || '—')),
            STEPS.map(function (s) {
              return h('div.wf-link', h('span.k', s[1]), h('span', d.steps[s[0]] || '—'));
            }),
            h('div.wf-link', h('span.k', 'Output'), h('span', d.output || '—')),
            h('div.wf-link', h('span.k', 'You check'), h('span', d.checks.join(', ') || '—'))
          )
        ),
        promptBlock(prompt, { label: 'Your master prompt', kind: 'good', copy: true, open: true }),
        note(step.levelUp),
        sc < 100 ? h('p.small.muted', 'Completeness ' + sc + '/100. Fill in the empty parts above and generate again for full XP.') : null
      );
      if (fresh) {
        ctx.award('wf', Math.round(((step.xp || 60) * sc) / 100), sc >= 100 ? 'Workflow complete' : 'Workflow drafted', genBtn);
        PU.scrollNear(resultHost);
      }
      ctx.complete();
    }
    var genBtn = h('button.btn.btn-primary', { type: 'button' }, PU.icon('wand'), 'Generate my workflow');
    genBtn.addEventListener('click', function () {
      if (PU.wordCount(d.task) < 2) {
        PU.toast('Start with the task (question 1).', { icon: 'info' });
        taskInput.focus();
        return;
      }
      if (!d.where) d.where = recommend();
      ctx.save();
      paintGroups();
      renderCard(true);
    });
    paintGroups();
    if (PU.state.data.workflow && d.task) renderCard(false);
    else ctx.setHint('Answer the questions, then generate your workflow');
    function q(n, title, body) {
      return h('div.wf-q', h('div.qn', n), h('div.qt', title), body);
    }
    return [
      head(step),
      q('1 / 7', 'Which recurring task eats your time?', h('div.stack-sm', taskInput, h('span.small.muted', 'Or pick one:'), taskChips)),
      q('2 / 7', 'How often does it come up?', freqWrap),
      q('3 / 7', 'What does Claude need every time?', inputsWrap),
      q('4 / 7', 'Where should it live?', h('div.stack-sm', whereWrap, recNote)),
      q('5 / 7', 'What are the steps?', h('div.stack-sm', h('div.wf-steps', stepRows), h('div', fillGeneric))),
      q('6 / 7', 'What should Claude hand back?', outInput),
      q('7 / 7', 'What will YOU check before it goes out?', checksWrap),
      h('div.btn-row', genBtn),
      resultHost
    ];
  };

  /* ---------------------------------------------------------------------
     mission — the final real-work challenge (brief + 30-minute clock)
     --------------------------------------------------------------------- */
  S.mission = function (step, ctx) {
    var d = ctx.data;
    d.f = d.f || {};
    d.moves = d.moves || {};
    var FIELDS = step.fields;
    var inputs = {};
    var preview = h('div.prompt-text');
    var scoreHost = h('div');
    var clockEl = h('div.clock');
    var clockBar = h('span');
    var timerBtns = h('div.btn-row');
    var tick = null;

    function roleLine(v) {
      v = v.trim().replace(/[.\s]+$/, '');
      if (!v) return '';
      if (/^(you are|you['’]re)\s/i.test(v)) return v + '.';
      return 'You’re ' + v.charAt(0).toLowerCase() + v.slice(1) + '.';
    }
    function assemble() {
      var f = d.f;
      var out = [];
      if (f.role) out.push(roleLine(f.role));
      if (f.context) out.push(f.context.trim());
      if (f.goal) out.push('Goal: ' + f.goal.trim());
      if (f.input) out.push('What I’m giving you: ' + f.input.trim());
      if (f.constraints) out.push('Rules: ' + f.constraints.trim());
      if (f.output) out.push('Output: ' + f.output.trim());
      step.toggles.forEach(function (t) {
        if (d[t.key]) out.push(t.line);
      });
      return out.join('\n\n');
    }
    function score() {
      var s = 0;
      FIELDS.forEach(function (f) {
        if (PU.wordCount(d.f[f.key]) >= (f.min || 3)) s += f.w;
      });
      step.toggles.forEach(function (t) {
        if (d[t.key]) s += t.w;
      });
      return Math.min(100, s);
    }
    function paint() {
      var text = assemble();
      preview.innerHTML = text ? PU.promptHTML(text) : '<span class="muted">Fill in the fields. Your prompt builds here.</span>';
      var sc = score();
      var g = PU.grade(sc);
      PU.clear(scoreHost).appendChild(h('div.result-top', scoreDial(sc, g.tier), h('div', h('div.grade', g.title), h('p.muted.small', 'Based on which parts of the brief you’ve filled in.'))));
    }
    var fieldEls = FIELDS.map(function (f) {
      var id = 'm-' + f.key;
      var el = f.long ? h('textarea.textarea', { id: id, rows: '3', style: 'min-height:84px', placeholder: f.ph }) : h('input.input', { id: id, type: 'text', placeholder: f.ph });
      el.value = d.f[f.key] || '';
      el.addEventListener('input', function () {
        d.f[f.key] = el.value;
        ctx.save();
        paintSoon();
      });
      inputs[f.key] = el;
      return h('div.field', h('label', { for: id }, f.label), el);
    });
    var paintSoon = PU.debounce(paint, 120);
    var taskInput = h('input.input#m-task', { type: 'text', placeholder: 'e.g. Plan next week’s Instagram posts for Luma Skin', value: d.task || '' });
    taskInput.addEventListener('input', function () {
      d.task = taskInput.value;
      ctx.save();
    });
    var taskChips = h(
      'div.chips',
      step.examples.map(function (x) {
        var b = h('button.chip', { type: 'button' }, x);
        b.addEventListener('click', function () {
          d.task = x;
          taskInput.value = x;
          ctx.save();
        });
        return b;
      })
    );
    var toggles = step.toggles.map(function (t) {
      var b = h('button.toggle', { type: 'button', 'aria-pressed': String(!!d[t.key]), class: d[t.key] ? 'is-on' : '' }, h('span.box', PU.icon('check')), h('span', h('b', t.label), h('span.job-desc', t.line)));
      b.addEventListener('click', function () {
        d[t.key] = !d[t.key];
        b.classList.toggle('is-on', !!d[t.key]);
        b.setAttribute('aria-pressed', String(!!d[t.key]));
        ctx.save();
        paint();
      });
      return b;
    });
    function savePrompt() {
      PU.state.data.mission = { task: d.task || '', prompt: assemble(), score: score() };
      PU.save();
    }
    var copyB = PU.copyBtn(function () {
      savePrompt();
      return assemble();
    }, 'Copy prompt');
    var openB = PU.openInClaude(function () {
      savePrompt();
      return assemble();
    });

    // ---- 30-minute clock ----
    var DUR = (step.minutes || 30) * 60;
    function remaining() {
      if (!d.clockStart) return DUR;
      return Math.max(0, DUR - (Date.now() - d.clockStart) / 1000);
    }
    function paintClock() {
      var r = remaining();
      clockEl.textContent = PU.fmtClock(r);
      clockBar.style.width = (1 - r / DUR) * 100 + '%';
      PU.clear(timerBtns);
      if (!d.clockStart) {
        var s = h('button.btn.btn-marker', { type: 'button' }, PU.icon('clock'), 'Start the ' + (step.minutes || 30) + '-minute clock');
        s.addEventListener('click', function () {
          d.clockStart = Date.now();
          savePrompt();
          ctx.save();
          startTick();
          paintClock();
        });
        timerBtns.appendChild(s);
      } else {
        var rs = h('button.btn.btn-ghost.btn-sm', { type: 'button' }, PU.icon('refresh', 'icon-sm'), 'Restart clock');
        rs.addEventListener('click', function () {
          d.clockStart = Date.now();
          ctx.save();
          paintClock();
        });
        timerBtns.appendChild(rs);
        if (r <= 0) timerBtns.appendChild(h('span.small', { style: 'color:var(--marker)' }, 'Time! Tick off what you did below.'));
      }
    }
    function startTick() {
      if (tick) clearInterval(tick);
      tick = setInterval(function () {
        paintClock();
        if (remaining() <= 0) {
          clearInterval(tick);
          tick = null;
        }
      }, 1000);
    }
    ctx.onLeave(function () {
      if (tick) clearInterval(tick);
    });

    var moves = step.moves.map(function (m, i) {
      var b = h('button.toggle', { type: 'button', class: d.moves[i] ? 'is-on' : '', 'aria-pressed': String(!!d.moves[i]) }, h('span.box', PU.icon('check')), h('span', h('b', m[0]), h('span.job-desc', m[1])));
      b.addEventListener('click', function () {
        d.moves[i] = !d.moves[i];
        b.classList.toggle('is-on', !!d.moves[i]);
        b.setAttribute('aria-pressed', String(!!d.moves[i]));
        ctx.save();
        if (d.moves[i]) ctx.award('move' + i, 10, 'Power move', b);
      });
      return b;
    });

    var finishBtn = h('button.btn.btn-primary', { type: 'button' }, PU.icon('flag'), 'Complete the mission');
    finishBtn.addEventListener('click', function () {
      if (PU.wordCount(assemble()) < 8) {
        PU.toast('Build your brief first (step 2).', { icon: 'info' });
        return;
      }
      savePrompt();
      d.finished = true;
      ctx.save();
      ctx.award('brief', Math.round(((step.xp || 60) * score()) / 100), 'Mission brief', finishBtn);
      ctx.award('finish', 50, 'Mission complete', finishBtn);
      ctx.complete();
      ctx.next();
    });

    paint();
    paintClock();
    if (d.clockStart && remaining() > 0) startTick();
    if (d.finished) ctx.complete();
    else ctx.setHint('Build your brief, then complete the mission');

    function sec(n, title, sub, body) {
      return h('div.wf-q', h('div.qn', n), h('div.qt', title), sub ? h('p.small.muted', sub) : null, body);
    }
    return [
      head(step),
      sec('Step 1', 'Pick a real task from today’s to-do list', null, h('div.stack-sm', taskInput, taskChips)),
      sec('Step 2', 'Brief Claude properly', 'Everything you’ve learned, in one place. Short answers are fine.', h('div.stack', h('div.fill-grid', fieldEls), h('div.stack-sm', h('div.eyebrow', 'Power-ups'), h('div.toggle-list', toggles)))),
      h(
        'div.panel.stack',
        h('div.panel-head', h('div.eyebrow', 'Your prompt'), h('div.btn-row', copyB, openB)),
        h('div.prompt', preview),
        scoreHost,
        h('p.small.muted', '“Open in Claude” starts a new chat with your prompt filled in. Attach your files there, then press send.')
      ),
      liveBox(ctx, assemble, 'Brief Claude on a real work task: ' + (d.task || 'their own task')),
      sec(
        'Step 3',
        'Do the real work: 30 minutes, in Claude',
        'Start the clock, switch to Claude, and get it done. Use the power moves below.',
        h('div.timer', h('div.eyebrow', 'Real work challenge'), clockEl, h('div.bar', clockBar), timerBtns)
      ),
      sec('Step 4', 'Tick the power moves you used', '+10 XP each. Be honest, nobody’s checking.', h('div.toggle-list', moves)),
      h('div.btn-row', finishBtn)
    ];
  };

  /* ---------------------------------------------------------------------
     summary — level complete (the "Approved" stamp)
     --------------------------------------------------------------------- */
  S.summary = function (step, ctx) {
    var L = ctx.level;
    var first = !ctx.preview && !PU.state.levelsDone[L.id];
    if (!ctx.preview) {
      PU.state.levelsDone[L.id] = true;
      PU.save();
    }
    ctx.complete();
    ctx.award('done', 50, PU.levelLabel(L) + ' complete', null);
    PU.emit('levels');
    var rank = PU.rankFor(PU.state.xp);
    function stat(k, v) {
      return h('div.ds', h('span.eyebrow', k), h('b', String(v)));
    }
    var card = h(
      'div.done-card',
      { class: first && !PU.reduced ? 'thud' : '' },
      h('div.eyebrow', PU.levelLabel(L) + ' complete · ' + L.title.replace(/==/g, '')),
      h('div.stamp', { class: first ? 'slam' : '' }, 'Approved'),
      h('div.takeaway', { html: PU.rich(step.takeaway) }),
      step.points
        ? h(
            'ul.learn-list',
            step.points.map(function (p) {
              return h('li', PU.icon('check', 'icon-sm'), h('span', { html: PU.rich(p) }));
            })
          )
        : null,
      h('div.done-stats', stat('XP this level', PU.xpForPrefix(L.id + '.')), stat('Total XP', PU.state.xp), stat('Rank', rank.name))
    );
    if (first) setTimeout(PU.confetti, 380);
    var next = L.optional ? null : PU.nextLevel(L);
    return [
      card,
      step.template ? promptBlock(step.template, { label: step.templateLabel || 'Keep this', copy: true }) : null,
      step.note ? note(step.note, step.noteIcon) : null,
      next ? note('**Up next: ' + PU.levelLabel(next) + ' · ' + next.title.replace(/==/g, '') + '.** ' + next.tagline, 'arrowRight') : null
    ];
  };

  /* ---------------------------------------------------------------------
     certificate — the finish line + personal cheat sheet
     --------------------------------------------------------------------- */
  PU.RULES = [
    ['A prompt is a brief', 'Brief Claude like a smart new hire. It only knows what you tell it.'],
    ['Real Creatives Give Insanely Clear Orders', 'Role, Context, Goal, Input, Constraints, Output.'],
    ['Better information beats longer prompts', 'Facts, examples and specifics. Not adjectives.'],
    ['Don’t make Claude guess', 'Give background, audience, past work and what good looks like.'],
    ['Let Claude interview you', 'End with: “Ask me any questions before you start.”'],
    ['Assign a process, not a task', 'Analyse → Think → Create → Critique → Improve.'],
    ['The first answer is a first draft', 'Give specific feedback: what to keep, what to change, what you want back.'],
    ['Show, don’t describe. Then verify', 'Files, screenshots, data. Check facts and numbers before a client sees them.'],
    ['Brief once, reuse forever', 'One Project per client, with instructions and files.'],
    ['Delegate outcomes', 'Cowork for finished files, Claude Code for tools. You review before it ships.']
  ];

  PU.BRIEF_TEMPLATE =
    'ROLE: You’re a [role, e.g. senior social media strategist for skincare brands].\n' +
    'CONTEXT: [Brand, audience, situation, what’s been tried before.]\n' +
    'GOAL: [What success looks like, e.g. more weekend bookings.]\n' +
    'INPUT: [What I’m attaching or pasting.]\n' +
    'CONSTRAINTS: [Tone, length, words to avoid, must-haves.]\n' +
    'OUTPUT: [Format, number of options, structure.]\n' +
    'Before you start, ask me any questions you need answered.';

  /** Which model and effort to pick. Model names change; the idea doesn't. */
  PU.SETTINGS = [
    ['Everyday work', 'Sonnet, default effort. Captions, emails, summaries, rewrites.'],
    ['Big, tricky or high-stakes work', 'Opus, or Fable for the hardest jobs. Effort on High or above.'],
    ['Claude cut corners?', 'It didn’t try hard enough. Raise the effort.'],
    ['Claude missed the point?', 'Check your brief first. Then try a bigger model.']
  ];

  PU.HELPER_PROMPT =
    'Improve this prompt: “[paste your rough prompt]”.\n' +
    'Rewrite it as a clear brief with a role, context, goal, input, constraints and output format. ' +
    'Ask me questions first about anything important that’s missing.';

  PU.cheatSheetText = function () {
    var s = PU.state;
    var out = [];
    out.push('# Claude Power-Up: my cheat sheet');
    if (PU.brand && PU.brand.name) out.push(PU.brand.name + ' · internal training  ');
    out.push('');
    if (s.name) out.push('Owner: ' + s.name + '  ');
    out.push('Rank: ' + PU.rankFor(s.xp).name + ' (' + s.xp + ' XP)');
    out.push('');
    out.push('## The 10 rules');
    PU.RULES.forEach(function (r, i) {
      out.push(i + 1 + '. **' + r[0] + '.** ' + r[1]);
    });
    out.push('');
    out.push('## The brief template');
    out.push('```');
    out.push(PU.BRIEF_TEMPLATE);
    out.push('```');
    out.push('');
    out.push('## Prompt helper (works in any AI chat)');
    out.push('```');
    out.push(PU.HELPER_PROMPT);
    out.push('```');
    out.push('');
    out.push('## Model and effort');
    PU.SETTINGS.forEach(function (r) {
      out.push('- **' + r[0] + ':** ' + r[1]);
    });
    var stars = s.data.stars || {};
    var keys = Object.keys(stars);
    if (keys.length) {
      out.push('');
      out.push('## My saved prompts');
      keys.forEach(function (k) {
        out.push('');
        out.push('### ' + stars[k].title + ' (' + stars[k].dept + ')');
        out.push('```');
        out.push(stars[k].template);
        out.push('```');
      });
    }
    var wf = s.data.workflow;
    if (wf && wf.prompt) {
      out.push('');
      out.push('## My workflow: ' + (wf.task || ''));
      out.push('Lives in: ' + (wf.where || '') + (wf.freq ? ' · ' + wf.freq : ''));
      out.push('```');
      out.push(wf.prompt);
      out.push('```');
    }
    var m = s.data.mission;
    if (m && m.prompt) {
      out.push('');
      out.push('## My real-work mission' + (m.task ? ': ' + m.task : ''));
      out.push('```');
      out.push(m.prompt);
      out.push('```');
    }
    out.push('');
    out.push('Made with Claude Power-Up.');
    return out.join('\n');
  };

  PU.renderSheet = function (compact) {
    var s = PU.state;
    var wrap = h('div.sheet');
    wrap.appendChild(
      h(
        'ol.rules',
        PU.RULES.map(function (r) {
          return h('li', h('div', h('b', r[0]), h('span', r[1])));
        })
      )
    );
    wrap.appendChild(promptBlock(PU.BRIEF_TEMPLATE, { label: 'The brief template', copy: true, open: true }));
    wrap.appendChild(promptBlock(PU.HELPER_PROMPT, { label: 'Prompt helper', copy: true, open: true }));
    wrap.appendChild(h('div.eyebrow', 'Model and effort'));
    wrap.appendChild(
      h(
        'ul.rules.rules-plain',
        PU.SETTINGS.map(function (r) {
          return h('li', h('div', h('b', r[0]), h('span', r[1])));
        })
      )
    );
    var stars = s.data.stars || {};
    var keys = Object.keys(stars);
    if (keys.length) {
      wrap.appendChild(h('div.eyebrow', 'Your saved prompts'));
      keys.forEach(function (k) {
        wrap.appendChild(promptBlock(stars[k].template, { label: stars[k].title, copy: true, open: true }));
      });
    } else if (!compact) wrap.appendChild(h('p.small.muted', 'Tip: star prompts in Level 4 and they’ll show up here.'));
    var wf = s.data.workflow;
    if (wf && wf.prompt) wrap.appendChild(promptBlock(wf.prompt, { label: 'Your workflow: ' + (wf.task || ''), copy: true, open: true }));
    var m = s.data.mission;
    if (m && m.prompt) wrap.appendChild(promptBlock(m.prompt, { label: 'Your mission brief', copy: true, open: true }));
    return wrap;
  };

  S.certificate = function (step, ctx) {
    ctx.complete();
    var s = PU.state;
    if (!ctx.preview && !s.levelsDone[ctx.level.id]) {
      s.levelsDone[ctx.level.id] = true;
      PU.save();
      PU.emit('levels');
    }
    var rank = PU.rankFor(s.xp);
    var mainLevels = PU.levels.filter(function (L) {
      return !L.optional;
    });
    var levelsDone = mainLevels.filter(function (L) {
      return s.levelsDone[L.id];
    }).length;
    var prompts = s.data.prompts || {};
    var best = 0;
    Object.keys(prompts).forEach(function (k) {
      best = Math.max(best, prompts[k].score || 0);
    });
    var date = new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
    function stat(k, v) {
      return h('div.ds', h('span.eyebrow', k), h('b', String(v)));
    }
    var dl = h('button.btn.btn-ghost', { type: 'button', hidden: true }, PU.icon('download'), 'Download cheat sheet (.md)');
    PU.canDownload().then(function (ok) {
      dl.hidden = !ok;
    });
    dl.addEventListener('click', function () {
      PU.saveFile('claude-power-up-cheat-sheet.md', PU.cheatSheetText()).then(function (r) {
        if (r === 'saved') PU.toast('Cheat sheet saved', { icon: 'check' });
        else if (r === 'failed' || r === 'unavailable') PU.toast('Download isn’t available here. Use “Copy cheat sheet” instead.', { icon: 'info', ms: 3600 });
      });
    });
    var confirmHost = h('div');
    var reset = h('button.btn.btn-quiet', { type: 'button' }, PU.icon('refresh'), 'Start over');
    reset.addEventListener('click', function () {
      if (confirmHost.firstChild) return;
      var yes = h('button.btn.btn-danger.btn-sm', { type: 'button' }, 'Yes, erase my progress');
      var no = h('button.btn.btn-ghost.btn-sm', { type: 'button' }, 'Cancel');
      yes.addEventListener('click', function () {
        PU.emit('reset');
      });
      no.addEventListener('click', function () {
        PU.clear(confirmHost);
      });
      confirmHost.appendChild(h('div.inline-confirm', h('b', 'Erase all progress, XP and saved prompts on this device?'), h('div.btn-row', yes, no)));
    });
    if (!ctx.preview && !s.data.certShown) {
      s.data.certShown = true;
      PU.save();
      setTimeout(PU.confetti, 300);
    }
    return [
      h(
        'div.cert',
        h(
          'div.cert-top',
          h('div.eyebrow', ((PU.brand && PU.brand.name) ? PU.brand.name + ' · ' : '') + 'Claude Power-Up · Certificate of completion'),
          PU.brand && PU.brand.logo ? h('img.cert-logo', { src: PU.brand.logo, alt: PU.brand.name + ' logo' }) : null
        ),
        h('div.stamp.slam', 'Approved'),
        h('div.who', s.name || 'You did it'),
        h('p.lede', { html: PU.rich('Officially stopped using Claude like Google. Rank: ==' + rank.name + '==.') }),
        h('div.done-stats', stat('Total XP', s.xp), stat('Levels', levelsDone + ' / ' + mainLevels.length), stat('Best prompt', best ? best + '/100' : '—'), stat('Date', date))
      ),
      h('div.btn-row', PU.copyBtn(PU.cheatSheetText, 'Copy cheat sheet'), dl, reset),
      confirmHost,
      h('div.step-head', h('div.eyebrow', 'Your cheat sheet'), h('h2.title', 'Everything that matters, on one page')),
      PU.renderSheet(false),
      note(step.nextSteps)
    ];
  };
})();
