/* ==========================================================================
   Claude Power-Up — core: DOM helpers, markdown, state, XP, scoring,
   clipboard, downloads, and the optional live-Claude bridge.
   ========================================================================== */
(function () {
  'use strict';

  var PU = (window.PU = window.PU || {});
  PU.levels = PU.levels || [];
  PU.steps = PU.steps || {};

  PU.reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------------------------------------------------------------------
     DOM helper: h('div.card#id', {props}, ...children)
     --------------------------------------------------------------------- */
  function h(sel, props) {
    var kids = Array.prototype.slice.call(arguments, 2);
    var tag = 'div';
    var id = null;
    var classes = [];
    String(sel).replace(/([.#]?)([^.#]+)/g, function (m, p, name) {
      if (p === '.') classes.push(name);
      else if (p === '#') id = name;
      else tag = name;
      return m;
    });
    var node = document.createElement(tag);
    if (id) node.id = id;
    if (classes.length) node.className = classes.join(' ');
    if (props !== null && props !== undefined && (typeof props !== 'object' || props instanceof Node || Array.isArray(props))) {
      kids.unshift(props);
      props = null;
    }
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v === undefined || v === null || v === false) return;
        if (k === 'class') {
          String(Array.isArray(v) ? v.filter(Boolean).join(' ') : v)
            .split(/\s+/)
            .filter(Boolean)
            .forEach(function (c) {
              node.classList.add(c);
            });
        } else if (k === 'text') node.textContent = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'style') {
          if (typeof v === 'string') node.setAttribute('style', v);
          else
            Object.keys(v).forEach(function (s) {
              if (s.indexOf('--') === 0) node.style.setProperty(s, v[s]);
              else node.style[s] = v[s];
            });
        } else if (k === 'data') {
          Object.keys(v).forEach(function (d) {
            node.dataset[d] = v[d];
          });
        } else if (k.indexOf('on') === 0 && typeof v === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), v);
        } else if (k === 'value') node.value = v;
        else if (k === 'checked' || k === 'disabled' || k === 'hidden' || k === 'selected' || k === 'readOnly') node[k] = !!v;
        else if (v === true) node.setAttribute(k, '');
        else node.setAttribute(k, v);
      });
    }
    append(node, kids);
    return node;
  }

  function append(node, kids) {
    kids.forEach(function (k) {
      if (k === null || k === undefined || k === false || k === true) return;
      if (Array.isArray(k)) append(node, k);
      else if (k instanceof Node) node.appendChild(k);
      else node.appendChild(document.createTextNode(String(k)));
    });
    return node;
  }

  PU.h = h;
  PU.append = append;

  PU.clear = function (node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
    return node;
  };

  /** Append children, skipping null/false (native append would print "null"). */
  PU.put = function (node) {
    append(node, Array.prototype.slice.call(arguments, 1));
    return node;
  };

  /** Replace all children, skipping null/false. */
  PU.fill = function (node) {
    PU.clear(node);
    append(node, Array.prototype.slice.call(arguments, 1));
    return node;
  };

  /* ---------------------------------------------------------------------
     Icons (static, trusted markup)
     --------------------------------------------------------------------- */
  var ICONS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    chevron: '<path d="M9 18l6-6-6-6"/>',
    bolt: '<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z"/>',
    star: '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
    folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    spark: '<path d="M12 1.5l2.4 7.1 7.1 2.4-7.1 2.4-2.4 7.1-2.4-7.1L2.5 11l7.1-2.4z"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    play: '<path d="M6 4l14 8-14 8z"/>',
    refresh: '<path d="M21 3v6h-6"/><path d="M21 9a9 9 0 1 0 1 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    clip: '<path d="M21.4 11.1l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    pen: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    video: '<path d="M23 7l-7 5 7 5z"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
    trend: '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
    brief: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
    layers: '<path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
    clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
    palette: '<path d="M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.5 3.3A2 2 0 0 1 12 22z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16.5" cy="10.5" r="1"/>',
    hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
    type: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    terminal: '<path d="M4 17l6-6-6-6M12 19h8"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    wand: '<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8 19 13M17.8 6.2 19 5M3 21l9-9M12.2 6.2 11 5"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>'
  };

  PU.icon = function (name, cls) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'icon' + (cls ? ' ' + cls : ''));
    svg.innerHTML = ICONS[name] || ICONS.spark;
    return svg;
  };

  /* ---------------------------------------------------------------------
     Text helpers
     --------------------------------------------------------------------- */
  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  PU.esc = esc;

  function inline(s) {
    // s must already be escaped
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/==([^=]+)==/g, '<mark>$1</mark>');
    s = s.replace(/(^|[\s(“"])_([^_\n]+?)_(?=[\s).,!?:;”"]|$)/g, '$1<em>$2</em>');
    s = s.replace(/(^|[\s(“"])\*([^*\n]+?)\*(?=[\s).,!?:;”"]|$)/g, '$1<em>$2</em>');
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return s;
  }

  /** Short rich text: ==highlight==, **bold**, _italic_. Returns HTML. */
  PU.rich = function (s) {
    var out = esc(s);
    out = out.replace(/==([^=]+)==/g, '<span class="hl">$1</span>');
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/(^|[\s(])_([^_\n]+?)_(?=[\s).,!?:;]|$)/g, '$1<em>$2</em>');
    return out;
  };

  function mdTable(rows) {
    function cells(r) {
      return r
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map(function (c) {
          return c.trim();
        });
    }
    var head = cells(rows[0]);
    var body = rows.slice(1);
    if (body.length && /^[\s|:\-]+$/.test(body[0])) body = body.slice(1);
    return (
      '<div class="table-wrap"><table><thead><tr>' +
      head
        .map(function (c) {
          return '<th>' + inline(esc(c)) + '</th>';
        })
        .join('') +
      '</tr></thead><tbody>' +
      body
        .map(function (r) {
          return (
            '<tr>' +
            cells(r)
              .map(function (c) {
                return '<td>' + inline(esc(c)) + '</td>';
              })
              .join('') +
            '</tr>'
          );
        })
        .join('') +
      '</tbody></table></div>'
    );
  }

  var RX_UL = /^\s*[-*•]\s+/;
  var RX_OL = /^\s*\d+[.)]\s+/;
  var RX_BLOCK = /^\s*(\||#{1,4}\s|>)/;

  /** Minimal markdown → HTML (paragraphs, lists, tables, headings, quotes). */
  PU.md = function (src) {
    var lines = String(src || '')
      .replace(/\r\n?/g, '\n')
      .split('\n');
    var out = [];
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];
      if (!line.trim()) {
        i++;
        continue;
      }
      var m;
      if (/^\s*\|/.test(line)) {
        var rows = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++]);
        out.push(mdTable(rows));
        continue;
      }
      if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
        var lvl = Math.min(4, m[1].length + 2);
        out.push('<h' + lvl + '>' + inline(esc(m[2])) + '</h' + lvl + '>');
        i++;
        continue;
      }
      if (/^\s*(---|\*\*\*)\s*$/.test(line)) {
        out.push('<hr>');
        i++;
        continue;
      }
      if (/^\s*>/.test(line)) {
        var q = [];
        while (i < lines.length && /^\s*>/.test(lines[i])) q.push(lines[i++].replace(/^\s*>\s?/, ''));
        out.push('<blockquote>' + inline(esc(q.join('\n'))).replace(/\n/g, '<br>') + '</blockquote>');
        continue;
      }
      if (RX_UL.test(line) || RX_OL.test(line)) {
        var ordered = RX_OL.test(line);
        var re = ordered ? RX_OL : RX_UL;
        var other = ordered ? RX_UL : RX_OL;
        var items = [];
        while (i < lines.length) {
          var l = lines[i];
          if (re.test(l)) {
            items.push(l.replace(re, ''));
            i++;
          } else if (l.trim() && items.length && !RX_BLOCK.test(l) && !other.test(l)) {
            items[items.length - 1] += '\n' + l.trim();
            i++;
          } else break;
        }
        var start = '';
        if (ordered) {
          var n = parseInt(line.trim(), 10);
          if (n > 1) start = ' start="' + n + '"';
        }
        var tag = ordered ? 'ol' : 'ul';
        out.push(
          '<' +
            tag +
            start +
            '>' +
            items
              .map(function (it) {
                return '<li>' + inline(esc(it)).replace(/\n/g, '<br>') + '</li>';
              })
              .join('') +
            '</' +
            tag +
            '>'
        );
        continue;
      }
      var buf = [];
      while (i < lines.length && lines[i].trim() && !RX_BLOCK.test(lines[i]) && !RX_UL.test(lines[i]) && !RX_OL.test(lines[i])) buf.push(lines[i++]);
      if (!buf.length) buf.push(lines[i++]);
      out.push('<p>' + inline(esc(buf.join('\n'))).replace(/\n/g, '<br>') + '</p>');
    }
    return out.join('');
  };

  /** Escaped prompt text with [placeholders] highlighted. */
  PU.promptHTML = function (text) {
    return esc(text).replace(/\[([^\]\n]{1,80})\]/g, '<span class="ph">[$1]</span>');
  };

  PU.placeholders = function (template) {
    var seen = {};
    var list = [];
    String(template).replace(/\[([^\]\n]{1,80})\]/g, function (m, p) {
      if (!seen[p]) {
        seen[p] = true;
        list.push(p);
      }
      return m;
    });
    return list;
  };

  PU.fillTemplate = function (template, values) {
    return String(template).replace(/\[([^\]\n]{1,80})\]/g, function (m, p) {
      var v = values && values[p];
      return v && String(v).trim() ? String(v).trim() : m;
    });
  };

  PU.wordCount = function (t) {
    var m = String(t || '')
      .trim()
      .match(/\S+/g);
    return m ? m.length : 0;
  };

  PU.clamp = function (v, a, b) {
    return Math.max(a, Math.min(b, v));
  };

  PU.debounce = function (fn, ms) {
    var t;
    return function () {
      var args = arguments;
      var self = this;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(self, args);
      }, ms);
    };
  };

  PU.wait = function (ms) {
    return new Promise(function (r) {
      setTimeout(r, PU.reduced ? Math.min(ms, 60) : ms);
    });
  };

  /** Deterministic shuffle so a step looks the same on every visit. */
  PU.shuffle = function (arr, seed) {
    var a = arr.slice();
    var s = seed || 7;
    function rnd() {
      s |= 0;
      s = (s + 0x6d2b79f5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  };

  PU.fmtClock = function (sec) {
    sec = Math.max(0, Math.round(sec));
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  };

  PU.claudeLink = function (prompt) {
    var base = 'https://claude.ai/new';
    if (!prompt) return base;
    var q = encodeURIComponent(prompt);
    return q.length > 7000 ? base : base + '?q=' + q;
  };

  /* ---------------------------------------------------------------------
     Streaming text (simulated Claude replies)
     --------------------------------------------------------------------- */
  function deepestLast(el) {
    var t = el;
    while (t.lastElementChild) {
      var c = t.lastElementChild;
      if (c.tagName === 'BR' || c.tagName === 'HR') break;
      t = c;
    }
    return t;
  }

  /**
   * Stream markdown text into `el`. opts: {duration (s), instant, onDone}
   * Returns {skip(), cancel(), promise}
   */
  PU.stream = function (el, text, opts) {
    opts = opts || {};
    text = String(text || '');
    el.classList.add('md');
    var total = text.length;
    var duration = opts.duration || PU.clamp(total / 340, 1.2, 5.5);
    var cps = total / duration;
    var shown = 0;
    var last = 0;
    var raf = 0;
    var finished = false;
    var cancelled = false;
    var resolveFn;
    var promise = new Promise(function (r) {
      resolveFn = r;
    });
    function finish() {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      el.innerHTML = PU.md(text);
      if (opts.onDone) opts.onDone();
      resolveFn();
    }
    if (PU.reduced || opts.instant || !total) {
      finish();
    } else {
      var caret = document.createElement('span');
      caret.className = 'caret';
      var tick = function (t) {
        if (cancelled || finished) return;
        if (!last) last = t;
        var dt = Math.min(0.1, (t - last) / 1000);
        last = t;
        shown = Math.min(total, shown + Math.max(1, cps * dt));
        var cut = Math.floor(shown);
        var guard = 0;
        while (cut < total && /\S/.test(text.charAt(cut)) && guard < 14) {
          cut++;
          guard++;
        }
        if (cut >= total) {
          finish();
          return;
        }
        el.innerHTML = PU.md(text.slice(0, cut));
        deepestLast(el).appendChild(caret);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    return {
      skip: finish,
      cancel: function () {
        cancelled = true;
        cancelAnimationFrame(raf);
        resolveFn();
      },
      promise: promise,
      get done() {
        return finished;
      }
    };
  };

  /** A Claude message row (avatar + body). Returns {row, body}. */
  PU.claudeMsg = function () {
    var body = h('div.md');
    var row = h('div.msg.msg-claude', h('div.avatar', { 'aria-hidden': 'true' }, PU.icon('spark')), body);
    return { row: row, body: body };
  };

  PU.userMsg = function (text, extra) {
    return h('div.msg.msg-user', extra || null, h('div.bubble', text));
  };

  PU.thinking = function (label) {
    return h('span.thinking', h('i'), h('i'), h('i'), h('span', { style: 'margin-left:6px' }, label || 'Thinking'));
  };

  /** Show thinking dots, then stream text into a new Claude message inside `into`. */
  PU.claudeReply = function (into, text, opts) {
    opts = opts || {};
    var msg = PU.claudeMsg();
    into.appendChild(msg.row);
    if (opts.instant || PU.reduced) {
      msg.body.innerHTML = PU.md(text);
      return Promise.resolve(msg);
    }
    msg.body.appendChild(PU.thinking(opts.thinkingLabel));
    if (opts.scroll) scrollNear(msg.row);
    return PU.wait(opts.think || 700).then(function () {
      msg.body.innerHTML = '';
      var s = PU.stream(msg.body, text, { duration: opts.duration });
      if (opts.onStream) opts.onStream(s);
      return s.promise.then(function () {
        return msg;
      });
    });
  };

  function scrollNear(el) {
    if (!el || !el.getBoundingClientRect) return;
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || 800;
    if (r.top > vh - 140 || r.top < 70) {
      try {
        window.scrollBy({ top: r.top - vh * 0.35, behavior: PU.reduced ? 'auto' : 'smooth' });
      } catch (e) {
        window.scrollBy(0, r.top - vh * 0.35);
      }
    }
  }
  PU.scrollNear = scrollNear;

  /* ---------------------------------------------------------------------
     Event bus
     --------------------------------------------------------------------- */
  var subs = {};
  PU.on = function (evt, fn) {
    (subs[evt] = subs[evt] || []).push(fn);
    return function () {
      subs[evt] = (subs[evt] || []).filter(function (f) {
        return f !== fn;
      });
    };
  };
  PU.emit = function (evt, payload) {
    (subs[evt] || []).slice().forEach(function (fn) {
      try {
        fn(payload);
      } catch (e) {
        if (window.console) console.error(e);
      }
    });
  };

  /* ---------------------------------------------------------------------
     State + persistence (per-viewer, best effort)
     --------------------------------------------------------------------- */
  var KEY = 'claude-power-up:v1';

  function fresh() {
    return {
      v: 1,
      name: '',
      xp: 0,
      awarded: {},
      stepsDone: {},
      levelsDone: {},
      pos: { level: 0, step: 0 },
      unlockAll: false,
      theme: 'system',
      data: {},
      started: Date.now()
    };
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (!s || s.v !== 1) return null;
      var base = fresh();
      Object.keys(base).forEach(function (k) {
        if (s[k] === undefined) s[k] = base[k];
      });
      return s;
    } catch (e) {
      return null;
    }
  }

  PU.state = load() || fresh();

  PU.saveNow = function () {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(PU.state));
    } catch (e) {
      /* storage unavailable: progress lives only in this tab */
    }
  };
  PU.save = PU.debounce(PU.saveNow, 150);

  PU.resetAll = function () {
    var theme = PU.state.theme;
    PU.state = fresh();
    PU.state.theme = theme;
    PU.saveNow();
  };

  PU.stepData = function (key) {
    var d = PU.state.data;
    if (!d[key] || typeof d[key] !== 'object') d[key] = {};
    return d[key];
  };

  /* ---------------------------------------------------------------------
     XP + ranks
     --------------------------------------------------------------------- */
  PU.RANKS = [
    { min: 0, name: 'Google Mode', desc: 'Short questions, first answers.' },
    { min: 100, name: 'Prompt Rookie', desc: 'Starting to brief instead of search.' },
    { min: 300, name: 'Brief Writer', desc: 'Role, context, goal, output.' },
    { min: 550, name: 'Context Crafter', desc: 'Claude rarely has to guess.' },
    { min: 850, name: 'AI Director', desc: 'Assigns processes, not tasks.' },
    { min: 1150, name: 'Workflow Architect', desc: 'Builds systems that repeat.' },
    { min: 1450, name: 'Claude Power-User', desc: 'Officially stopped using Claude like Google.' }
  ];

  PU.rankFor = function (xp) {
    var r = PU.RANKS[0];
    for (var i = 0; i < PU.RANKS.length; i++) if (xp >= PU.RANKS[i].min) r = PU.RANKS[i];
    return r;
  };

  PU.nextRank = function (xp) {
    for (var i = 0; i < PU.RANKS.length; i++) if (xp < PU.RANKS[i].min) return PU.RANKS[i];
    return null;
  };

  /**
   * Award XP once per key. Calling again with a higher amount pays only the
   * difference, so retries can improve a score without farming points.
   */
  PU.award = function (key, amount, label, anchor) {
    amount = Math.round(amount || 0);
    var prev = PU.state.awarded[key] || 0;
    if (amount <= prev) return 0;
    var delta = amount - prev;
    var oldRank = PU.rankFor(PU.state.xp);
    PU.state.awarded[key] = amount;
    PU.state.xp += delta;
    PU.save();
    PU.emit('xp', { delta: delta, label: label, anchor: anchor });
    var newRank = PU.rankFor(PU.state.xp);
    if (newRank.name !== oldRank.name) PU.emit('rankup', newRank);
    return delta;
  };

  PU.xpForPrefix = function (prefix) {
    var sum = 0;
    Object.keys(PU.state.awarded).forEach(function (k) {
      if (k.indexOf(prefix) === 0) sum += PU.state.awarded[k];
    });
    return sum;
  };

  /* ---------------------------------------------------------------------
     Toasts, floating XP, confetti
     --------------------------------------------------------------------- */
  var toastHost = null;
  PU.toast = function (msg, opts) {
    opts = opts || {};
    if (!toastHost) {
      toastHost = h('div.toasts', { role: 'status', 'aria-live': 'polite' });
      document.body.appendChild(toastHost);
    }
    var t = h('div.toast', opts.icon ? PU.icon(opts.icon) : null, opts.xp ? h('span.xp', '+' + opts.xp + ' XP') : null, h('span', msg));
    toastHost.appendChild(t);
    while (toastHost.children.length > 3) toastHost.removeChild(toastHost.firstChild);
    setTimeout(function () {
      t.classList.add('out');
      setTimeout(function () {
        if (t.parentNode) t.parentNode.removeChild(t);
      }, 320);
    }, opts.ms || 2400);
  };

  /** Floating "+XP" chip above an element. Returns false when it can't be shown. */
  PU.floatXP = function (anchor, delta) {
    if (!anchor || !anchor.getBoundingClientRect || PU.reduced || !anchor.isConnected) return false;
    var r = anchor.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    var x = r.left + r.width / 2;
    var y = r.top;
    if (y < 70 || y > (window.innerHeight || 800) - 90) return false;
    var f = h('span.xp-float', '+' + delta + ' XP');
    f.style.left = x + 'px';
    f.style.top = y - 6 + 'px';
    document.body.appendChild(f);
    setTimeout(function () {
      if (f.parentNode) f.parentNode.removeChild(f);
    }, 1300);
    return true;
  };

  PU.confetti = function () {
    if (PU.reduced) return;
    var c = h('canvas.confetti', { 'aria-hidden': 'true' });
    document.body.appendChild(c);
    var ctx = c.getContext('2d');
    if (!ctx) {
      c.remove();
      return;
    }
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var W = (c.width = window.innerWidth * dpr);
    var H = (c.height = window.innerHeight * dpr);
    var colors = ['#2e3bff', '#ffe45c', '#ff5a36', '#00a676', '#e0418b', '#00a3e0', '#7a4dff'];
    var parts = [];
    for (var i = 0; i < 140; i++) {
      parts.push({
        x: W * (0.2 + Math.random() * 0.6),
        y: H * 0.35 + Math.random() * H * 0.1,
        vx: (Math.random() - 0.5) * 16 * dpr,
        vy: (-Math.random() * 16 - 6) * dpr,
        w: (5 + Math.random() * 7) * dpr,
        h: (8 + Math.random() * 10) * dpr,
        r: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.35,
        c: colors[i % colors.length]
      });
    }
    var start = performance.now();
    function frame(t) {
      var el = t - start;
      ctx.clearRect(0, 0, W, H);
      parts.forEach(function (p) {
        p.vy += 0.55 * dpr;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - el / 2200);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (el < 2200) requestAnimationFrame(frame);
      else c.remove();
    }
    requestAnimationFrame(frame);
  };

  /* ---------------------------------------------------------------------
     Clipboard + downloads
     --------------------------------------------------------------------- */
  function fallbackCopy(text) {
    var ta = h('textarea', { style: 'position:fixed;top:-1000px;opacity:0', 'aria-hidden': 'true' });
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    ta.remove();
    return ok;
  }

  PU.copy = function (text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(
          function () {
            return true;
          },
          function () {
            return fallbackCopy(text);
          }
        );
      }
    } catch (e) {
      /* fall through */
    }
    return Promise.resolve(fallbackCopy(text));
  };

  /** A copy button. getText: string or () => string. */
  PU.copyBtn = function (getText, label, cls) {
    label = label || 'Copy';
    var txt = h('span', label);
    var b = h('button.btn.btn-ghost.btn-sm', { type: 'button', class: cls || '' }, PU.icon('copy', 'icon-sm'), txt);
    b.addEventListener('click', function () {
      var text = typeof getText === 'function' ? getText() : getText;
      PU.copy(text).then(function (ok) {
        txt.textContent = ok ? 'Copied' : 'Select + copy';
        b.classList.toggle('is-done', !!ok);
        if (!ok) PU.toast('Your browser blocked copying. Select the text and press Ctrl/Cmd + C.', { icon: 'info', ms: 3600 });
        setTimeout(function () {
          txt.textContent = label;
          b.classList.remove('is-done');
        }, 1800);
      });
    });
    return b;
  };

  /** "Open in Claude" link (real link, opens a new tab with the prompt filled in). */
  PU.openInClaude = function (getText, label) {
    var a = h(
      'a.btn.btn-ghost.btn-sm',
      { href: 'https://claude.ai/new', target: '_blank', rel: 'noopener' },
      PU.icon('external', 'icon-sm'),
      h('span', label || 'Open in Claude')
    );
    function refresh() {
      a.href = PU.claudeLink(typeof getText === 'function' ? getText() : getText);
    }
    a.addEventListener('mousedown', refresh);
    a.addEventListener('focus', refresh);
    a.addEventListener('touchstart', refresh, { passive: true });
    a.addEventListener('click', refresh);
    refresh();
    return a;
  };

  var dlPromise = null;
  function downloadsCap() {
    if (!dlPromise) {
      if (window.claude && typeof window.claude.use === 'function') {
        dlPromise = window.claude.use('downloads').then(
          function (d) {
            return d || null;
          },
          function () {
            return null;
          }
        );
      } else dlPromise = Promise.resolve('blob');
    }
    return dlPromise;
  }

  /** Resolves true when this view can offer a file download. */
  PU.canDownload = function () {
    return downloadsCap().then(function (d) {
      return !!d;
    });
  };

  PU.saveFile = function (filename, text) {
    return downloadsCap().then(function (d) {
      if (!d) return 'unavailable';
      if (d === 'blob') {
        try {
          var blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
          var url = URL.createObjectURL(blob);
          var a = h('a', { href: url, download: filename, style: 'display:none' });
          document.body.appendChild(a);
          a.click();
          setTimeout(function () {
            URL.revokeObjectURL(url);
            a.remove();
          }, 800);
          return 'saved';
        } catch (e) {
          return 'failed';
        }
      }
      return d.save({ filename: filename, data: text }).then(
        function () {
          return 'saved';
        },
        function (e) {
          return e && e.code === 'declined' ? 'declined' : 'failed';
        }
      );
    });
  };

  /* ---------------------------------------------------------------------
     Live Claude (only inside a claude.ai artifact viewer that grants it)
     --------------------------------------------------------------------- */
  var live = (PU.live = { fn: null, status: 'absent', subs: [] });

  live.onChange = function (fn) {
    live.subs.push(fn);
    return function () {
      var i = live.subs.indexOf(fn);
      if (i !== -1) live.subs.splice(i, 1);
    };
  };
  function liveNotify() {
    live.subs.slice().forEach(function (f) {
      try {
        f(live.status);
      } catch (e) {
        /* ignore */
      }
    });
  }
  live.available = function () {
    return live.status === 'ready';
  };
  live.init = function () {
    if (!window.claude || typeof window.claude.use !== 'function') return;
    live.status = 'pending';
    window.claude.use('sample').then(
      function (fn) {
        live.fn = typeof fn === 'function' ? fn : null;
        live.status = live.fn ? 'ready' : 'absent';
        liveNotify();
      },
      function () {
        live.status = 'absent';
        liveNotify();
      }
    );
  };
  var HIDE_CODES = ['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'];
  live.ask = function (input, opts) {
    if (!live.fn) return Promise.reject({ code: 'not_declared', message: 'unavailable' });
    return live.fn(input, opts || {}).catch(function (e) {
      if (e && HIDE_CODES.indexOf(e.code) !== -1) {
        live.status = 'off';
        liveNotify();
      }
      throw e;
    });
  };
  live.errorText = function (e) {
    var code = e && e.code;
    if (code === 'cancelled') return '';
    if (HIDE_CODES.indexOf(code) !== -1) return 'Live Claude isn’t available in this view. The instant check above still works.';
    if (code === 'rate_limited') return 'Claude is busy, or you’ve hit your usage limit. Try again in a little while.';
    if (code === 'session_expired') return 'Please sign in to Claude again, then retry.';
    if (code === 'refused') return 'Claude declined this one. Try rewording your prompt.';
    if (code === 'prompt_too_large') return 'That’s too long to send in one go. Shorten it a little.';
    if (code === 'empty_completion') return 'Claude didn’t return anything. Try a shorter request.';
    return 'Couldn’t reach Claude just now. Try again in a moment.';
  };

  /* ---------------------------------------------------------------------
     Prompt scoring: a transparent, deterministic checklist.
     It looks for the ingredients of a good brief. It does not judge taste.
     --------------------------------------------------------------------- */
  var RX = {
    role: /\b(you are|you['’]re|youre|act as|acting as|imagine you|pretend (to be|you)|role\s*:|as (a|an|the|my) (senior|expert|experienced|seasoned|professional|top|creative|social|content|brand|marketing|performance|video|short[- ]form|copy)|be (a|an|my) (senior|expert|experienced|social|content|brand|marketing|creative|short[- ]form|video|copy))/i,
    business: /\b(restaurant|caf[eé]|coffee|bistro|kitchen|diner|eatery|bar|brand|client|company|business|studio|store|shop|startup|salon|gym|hotel|resort|app|product|label|clinic|dhaba|bakery|pizzeria|brewery|joint|outlet|chain|place)\b/i,
    descriptor: /\b(premium|luxury|upscale|fine[- ]dining|casual|budget|affordable|family|boutique|artisan(al)?|specialty|speciality|independent|popular|local|authentic|modern|traditional|vegan|vegetarian|organic|south indian|north indian|indian|italian|chinese|japanese|korean|asian|mexican|continental|mediterranean|bengali|punjabi|kerala|goan|coastal|seafood|street food|cloud kitchen|bandra|mumbai|pune|delhi|gurgaon|gurugram|noida|bangalore|bengaluru|chennai|hyderabad|kolkata|goa|jaipur|ahmedabad|kochi|india|located|based in|called|named|known for|famous for|signature|since \d{4}|rooftop|all-day|dessert|brunch|dosa|biryani|pizza|burger|sushi|tiramisu)\b/i,
    audience: /\b(audience|target(ing|ed)?|aimed at|for (young|busy|working|urban|gen ?z|millennials?|families|parents|students|professionals|foodies|couples|women|men|office|college|tourists|locals)|aged?|age group|\d{2}\s*(?:-|–|to)\s*\d{2}|gen ?z|millennials?|professionals|students|parents|families|couples|customers|followers|people who|viewers|readers|buyers|shoppers|diners|guests|foodies|locals|tourists|office[- ]goers)\b/i,
    goal: /\b(goal|objective|aim|purpose|so that|in order to|kpi|success|drives?|driving|boost|increase|grow|generate|get (more|people|them|customers|followers)|bring (in|more)|attract|encourage|convince|fill|sell|bookings?|reservations?|footfall|walk-?ins|awareness|conversions?|sign-?ups|leads|engagement|trials?|downloads|visits|orders|sales)\b/i,
    constraints: /\b(avoid|don['’]?t|do not|never|without|no (emojis?|hashtags?|clich[eé]s?|jargon|cringe|generic|buzzwords|trending|slang|more than|fake)|under \d+|less than \d+|fewer than \d+|max(imum)?|at most|up to \d+|keep (it|them|each|the)|tone|voice|style|words|characters|seconds|budget|must|should(n['’]?t| not)|only|limit|strictly|mandatory|rules?|brand guidelines?)\b/i,
    format: /\b(table|list|bullets?|numbered|columns?|for each|each (one|reel|concept|idea|with|should|including|needs|caption|option|post)|include|including|structure|outline|format(ted)?|script|shot[- ]by[- ]shot|shot list|hooks?|on-?screen text|titles?|headlines?|storyboard|sections?)\b/i,
    count: /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+(\w+[\s-]+){0,3}(ideas|concepts|options|variations|reels?|posts?|captions?|versions?|headlines?|scripts?|subject lines|lines|hooks|taglines)\b/i,
    input: /\b(attached|attaching|attachment|here is|here's|here are|below|pasted|paste|uploaded|upload|pdf|deck|screenshot|examples? of|previous posts|past posts|last \d+ posts|our (best|top))\b/i,
    questions: /\b(ask (me )?(any |a few |some )?(clarifying )?questions?|questions? (first|before)|before you (start|begin|write))/i,
    example: /\b(example|for instance|e\.g\.|like this|such as|similar to|reference|inspired by|match (this|the|our)|in the style of)\b/i
  };
  PU.RX = RX;

  PU.checks = {
    role: {
      label: 'Role',
      what: 'Tells Claude who to be',
      test: function (t) {
        return RX.role.test(t);
      },
      tip: 'Give Claude a role, e.g. “You’re a senior social media strategist for restaurants.”'
    },
    context: {
      label: 'Context',
      what: 'Describes the brand and situation',
      test: function (t) {
        return RX.business.test(t) && RX.descriptor.test(t);
      },
      tip: 'Describe the brand: what it is, where it is, what makes it different.'
    },
    audience: {
      label: 'Audience',
      what: 'Says who it’s for',
      test: function (t) {
        return RX.audience.test(t);
      },
      tip: 'Name the audience, e.g. “25–40 year-old professionals who love home-style food.”'
    },
    goal: {
      label: 'Goal',
      what: 'Says what it should achieve',
      test: function (t) {
        return RX.goal.test(t);
      },
      tip: 'Add the business goal, e.g. “Goal: more weekend brunch bookings.”'
    },
    constraints: {
      label: 'Constraints',
      what: 'Sets rules, tone or limits',
      test: function (t) {
        return RX.constraints.test(t);
      },
      tip: 'Add rules: tone, length, words to avoid. e.g. “Under 40 words. No clichés like ‘foodie heaven’.”'
    },
    format: {
      label: 'Output format',
      what: 'Says exactly what to hand back',
      test: function (t) {
        return RX.format.test(t) || RX.count.test(t);
      },
      tip: 'Say what you want back, e.g. “3 options, each with a hook and a CTA” or “a table with…”.'
    },
    input: {
      label: 'Input',
      what: 'Gives Claude material to work from',
      test: function (t) {
        return RX.input.test(t);
      },
      tip: 'Attach or paste real material: the brief, the menu, past posts that worked.'
    },
    questions: {
      label: 'Invites questions',
      what: 'Asks Claude to check what’s missing',
      test: function (t) {
        return RX.questions.test(t);
      },
      tip: 'End with “Ask me any questions before you start.” Claude will spot the gaps.'
    },
    example: {
      label: 'Example',
      what: 'Shows what good looks like',
      test: function (t) {
        return RX.example.test(t);
      },
      tip: 'Paste an example you like and say “match this style.”'
    }
  };

  /** Build a check list from ids and/or custom objects. */
  PU.buildChecks = function (spec) {
    return spec.map(function (s) {
      if (typeof s === 'string') return Object.assign({ id: s, w: 1 }, PU.checks[s]);
      var base = s.id && PU.checks[s.id] ? PU.checks[s.id] : {};
      return Object.assign({ w: 1 }, base, s);
    });
  };

  PU.scorePrompt = function (text, checks) {
    var t = String(text || '');
    var words = PU.wordCount(t);
    var got = 0;
    var max = 0;
    var results = checks.map(function (c) {
      var pass = false;
      try {
        pass = !!c.test(t);
      } catch (e) {
        pass = false;
      }
      if (!c.bonus) max += c.w;
      if (pass) got += c.w;
      return Object.assign({}, c, { pass: pass });
    });
    var score = max ? Math.round(Math.min(1, got / max) * 100) : 0;
    var notes = [];
    if (words < 12) {
      score = Math.min(score, 30);
      notes.push('Very short. A useful brief is usually at least two or three sentences.');
    }
    return { score: score, results: results, words: words, notes: notes };
  };

  PU.grade = function (s) {
    if (s >= 90) return { title: 'Expert brief', text: 'This is how the pros brief Claude.', tier: 'high' };
    if (s >= 70) return { title: 'Strong brief', text: 'Claude has what it needs. Polish the last bits for full marks.', tier: 'high' };
    if (s >= 40) return { title: 'Getting there', text: 'Decent start. Add the missing pieces below.', tier: 'mid' };
    return { title: 'Google mode', text: 'Claude would have to guess most of this.', tier: 'low' };
  };
})();
