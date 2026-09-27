/* Level 5 — Research, files & images */
(function () {
  'use strict';
  var PU = window.PU;
  var h = PU.h;

  /* ---- Screenshot mocks (drawn with HTML so they stay crisp) ---- */

  function shotBar(label) {
    return h('div.shot-bar', h('i'), h('i'), h('i'), h('span', { style: 'margin-left:6px' }, label));
  }

  function dashboardMock() {
    // Daily reach for October: steady until the 14th, then a clear drop.
    var vals = [3.4, 3.6, 3.3, 3.8, 3.5, 3.9, 3.7, 3.6, 4.0, 3.8, 3.7, 3.9, 3.6, 3.8, 2.9, 2.6, 2.5, 2.7, 2.4, 2.6, 2.5, 2.3, 2.6, 2.4, 2.5, 2.2, 2.4, 2.5, 2.3, 2.4, 2.2];
    var W = 300;
    var H = 86;
    var max = 4.4;
    var pts = vals.map(function (v, i) {
      return [6 + (i * (W - 12)) / (vals.length - 1), H - 10 - (v / max) * (H - 22)];
    });
    var line = pts
      .map(function (p, i) {
        return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
      })
      .join(' ');
    var area = line + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + (H - 10) + ' L' + pts[0][0].toFixed(1) + ' ' + (H - 10) + ' Z';
    var markX = pts[13][0].toFixed(1);
    var svg =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Daily reach, dropping after October 14">' +
      '<line x1="6" y1="' + (H - 10) + '" x2="' + (W - 6) + '" y2="' + (H - 10) + '" stroke="#e4e6ee"/>' +
      '<path d="' + area + '" fill="#2e3bff" fill-opacity="0.08"/>' +
      '<path d="' + line + '" fill="none" stroke="#2e3bff" stroke-width="2" stroke-linejoin="round"/>' +
      '<line x1="' + markX + '" y1="6" x2="' + markX + '" y2="' + (H - 10) + '" stroke="#d42a43" stroke-dasharray="3 3"/>' +
      '<text x="' + (Number(markX) + 4) + '" y="14" font-size="8.5" fill="#d42a43">Oct 14</text>' +
      '<text x="6" y="' + (H - 1) + '" font-size="8" fill="#5a6078">Oct 1</text>' +
      '<text x="' + (W - 6) + '" y="' + (H - 1) + '" font-size="8" fill="#5a6078" text-anchor="end">Oct 31</text>' +
      '</svg>';
    function kpi(k, v, d, cls) {
      return h('div.dash-kpi', h('div', { style: 'color:#5a6078;font-size:10.5px' }, k), h('div.v', v), h('div.d', { class: cls }, d));
    }
    function row(a, b) {
      return h('div', h('span', a), h('b', b));
    }
    var hours = [2, 2, 3, 4, 3, 3, 4, 5, 6, 6, 8, 10, 9, 5];
    return h(
      'div.shot',
      shotBar('Instagram Insights · @lumaskin · October'),
      h(
        'div.dash',
        h('div.dash-kpis', kpi('Accounts reached', '84.1K', '▼ 32% after Oct 14', 'down'), kpi('Posts', '17', '5/wk → 2/wk after Oct 14', 'down'), kpi('Followers', '+1,240', '▲ 6% vs September', 'up')),
        h(
          'div.dash-row',
          h('div.dash-card', h('h5', 'Reach per day'), h('div', { html: svg })),
          h(
            'div.dash-card',
            h('h5', 'Top posts by reach'),
            h('div.dash-list', row('Reel · SPF in 10 seconds', '48.2K'), row('Reel · Morning routine', '41.9K'), row('Reel · Dermat Q&A', '37.5K'), row('Carousel · SPF myths', '12.1K · 8.2% saves'))
          )
        ),
        h(
          'div.dash-row',
          h(
            'div.dash-card',
            h('h5', 'When your followers are online'),
            h(
              'div.hours',
              hours.map(function (v, i) {
                return h('i', { class: i === 11 ? 'peak' : '', style: 'height:' + v * 10 + '%' });
              })
            ),
            h('div', { style: 'display:flex;justify-content:space-between;font-size:9.5px;color:#5a6078' }, h('span', '9 am'), h('span', '3 pm'), h('span', '8–9 pm'), h('span', '11 pm'))
          ),
          h('div.dash-card', h('h5', 'Reach by content type'), h('div.dash-list', row('Reels', '61%'), row('Carousels', '24%'), row('Static posts', '15%')))
        )
      )
    );
  }

  function gridMock() {
    var tiles = [
      ['20% OFF', '#ff4d6d', '#ffffff'],
      ['NEW Glow Serum', '#ffd6e0', '#7a1f3d'],
      ['BUY 1 GET 1', '#15151f', '#ffe45c'],
      ['', 'radial-gradient(circle at 30% 40%, #fff 0 16%, transparent 17%), radial-gradient(circle at 68% 58%, #f7c6d3 0 18%, transparent 19%), #f3e1d6', '#7a1f3d'],
      ['SALE ENDS TONIGHT', '#ff4d6d', '#ffffff'],
      ['Our bestsellers', '#fff0f3', '#7a1f3d'],
      ['FLAT 30%', '#15151f', '#ffffff'],
      ['New shades', '#ffd6e0', '#7a1f3d'],
      ['Festive offer', '#ff8fa3', '#ffffff']
    ];
    return h(
      'div.shot.narrow',
      shotBar('instagram.com/glowlane.beauty'),
      h(
        'div.grid9',
        h('div.grid9-head', h('span.pp'), h('div', h('b', 'glowlane.beauty'), h('div', { style: 'color:#5a6078' }, '212 posts · 48.6K followers'))),
        h(
          'div.grid9-tiles',
          tiles.map(function (t) {
            return h('div.tile', { style: 'background:' + t[1] + ';color:' + t[2] }, t[0]);
          })
        )
      )
    );
  }

  function bannerMock() {
    return h(
      'div.shot.narrow',
      shotBar('banner-draft-v3.png · 1080 × 864'),
      h(
        'div.banner',
        h('div.logo', { style: 'font-size:clamp(15px,2.6vw,22px);top:16px' }, 'LUMA'),
        h(
          'div.copy',
          h('div.h', 'NEW! Luma Hydra Gel'),
          h('div', 'Dermatologist tested'),
          h('div', 'For all skin types'),
          h('div', 'Now with Niacinamide + Ceramides'),
          h('div', 'Free shipping over ₹499'),
          h('div.tiny', '30% off'),
          h('div.btnx', 'Shop now')
        ),
        h('div.bottle', 'LUMA HYDRA GEL')
      )
    );
  }

  PU.levels[5] = {
    id: 'L5',
    num: 5,
    color: 'var(--sw-5)',
    title: 'Research, files & ==images==',
    short: 'Research, files & images',
    tagline: 'Stop typing what you can show. Then check what comes back.',
    deliverable: 'Answers based on your real material',
    learn: ['What Claude can read, and what it can’t', 'Screenshots: the fastest context there is', 'How to research with sources you can check'],
    steps: [
      { type: 'intro' },

      {
        type: 'concept',
        eyebrow: 'Show, don’t describe',
        title: 'Claude can read your ==actual material==.',
        lede: 'Most people describe things to Claude. Pros just show it.',
        visual: function () {
          return PU.tiles([
            { icon: 'file', title: 'Files', text: 'PDFs, Word, PowerPoint, Excel and [[CSV]], up to 30 MB each. Drag them into the chat, or click **+** in the message box to attach.', color: '#e0418b' },
            { icon: 'image', title: 'Screenshots & photos', text: 'Dashboards, competitor posts, designs, whiteboards, even handwriting. Paste a screenshot straight into the message box.', color: '#00a3e0' },
            { icon: 'search', title: 'Web search', text: 'Current information with links to sources. To turn it on: click **+** in the message box, then **Web search**.', color: '#00a676' },
            { icon: 'layers', title: 'Research mode', text: 'For big questions: Claude reads many sources and writes a report with links. Click **+**, then **Research** (paid plans).', color: '#7a4dff' },
            { icon: 'download', title: 'It makes files too', text: 'Ask for an Excel sheet, Word doc, PowerPoint or PDF and Claude creates the actual file.', color: '#2e3bff' },
            { icon: 'video', title: 'Video: not directly', text: 'Claude can’t watch video files. Give it the transcript or a few screenshots.', color: '#ff5a36' }
          ]);
        },
        note: 'Before uploading client files, check your agency’s rules on confidential data. Remove personal details (names, phone numbers) from screenshots.',
        noteIcon: 'lock'
      },

      {
        type: 'sort',
        xp: 20,
        eyebrow: 'Quick sort',
        title: 'Can Claude read it?',
        buckets: [
          { key: 'yes', label: 'Yes, drop it in' },
          { key: 'no', label: 'Not directly' }
        ],
        items: [
          { text: 'A 40-page PDF category report', answer: 'yes', why: 'Upload it and ask specific questions.' },
          { text: 'A screenshot of Instagram Insights', answer: 'yes', why: 'Claude reads charts and numbers in images.' },
          { text: 'An Excel export from Meta Ads Manager', answer: 'yes', why: 'Spreadsheets and CSVs work. Claude can even chart them.' },
          { text: 'A photo of the whiteboard after a brainstorm', answer: 'yes', why: 'It reads handwriting surprisingly well.' },
          { text: 'A 3-minute product video (MP4)', answer: 'no', why: 'Claude can’t watch video files. Paste the transcript or add a few screenshots.' },
          { text: 'The client’s pitch deck (PowerPoint)', answer: 'yes', why: 'Decks work, and Claude can create new ones too.' }
        ],
        success: 'All correct. Documents, spreadsheets, decks and images: yes. Video files: give Claude a transcript or screenshots instead.'
      },

      {
        type: 'screens',
        xp: 30,
        eyebrow: 'Screenshot power',
        title: 'A screenshot beats ==a paragraph of typing==.',
        lede: 'Three everyday agency situations. Attach the screenshot and see what Claude finds.',
        footer: 'Tip: say what you want Claude to focus on, and crop out anything private.',
        tabs: [
          {
            label: 'Analytics',
            file: 'insights-october.png',
            mock: dashboardMock,
            prompt: 'This is Luma Skin’s Instagram Insights for October. What’s going on, and what should we do next month? Give me 3 insights and 3 actions.',
            answer:
              '**What I see**\n\n1. **Reach dropped 32% after 14 October.** That’s exactly when posting fell from 5 to 2 posts a week. The drop follows how often you post, not the quality of the posts.\n2. **Reels do the heavy lifting.** Your top 3 posts are all Reels, and Reels bring 61% of your reach.\n3. **Useful content gets saved.** The “SPF myths” carousel has the best save rate (8.2%). People keep content that teaches them something.\n\n**What to do next month**\n\n1. Get back to 4–5 posts a week, with at least 2 Reels.\n2. Post one educational carousel every week: myths, ingredients, routines.\n3. Test posting at 8–9 pm, when your followers are most active.'
          },
          {
            label: 'Competitor grid',
            file: 'glowlane-grid.png',
            mock: gridMock,
            prompt: 'This is a competitor’s last 9 posts. What’s their content strategy, and where’s the gap for our client Luma Skin?',
            answer:
              '**Their pattern:** every one of these 9 posts is selling. 5 are discounts (“20% OFF”, “BUY 1 GET 1”, “FLAT 30%”) and 4 are product pushes. No education, no real people.\n\n**What that does:** it drives quick sales, but it trains followers to wait for the next offer.\n\n**The gap for Luma:** trust. Nobody here explains *why* a product suits sensitive skin. Luma can own honest, dermatologist-backed education with real customers, and win the people who are tired of being sold to.\n\n**3 posts to start with:** “Ingredients we’ll never use, and why”, a real customer’s 30-day skin diary, and a dermatologist answering your comments.'
          },
          {
            label: 'Design draft',
            file: 'banner-draft-v3.png',
            mock: bannerMock,
            prompt: 'Critique this ad banner before it goes to the client. Be specific and give me the top 3 fixes.',
            answer:
              '**Top 3 fixes before this goes to the client**\n\n1. **The offer is hidden.** “30% off” is the smallest text on the banner. Make it the second-biggest thing after the product name.\n2. **Too many messages.** I count 5 separate claims. Keep one headline and one supporting line, and move the rest to the product page.\n3. **The button disappears.** Pale grey on cream is hard to see. Use the brand’s dark green with white text.\n\n**Also:** the bottle is cropped at the cap, so show the whole product. And the logo is almost as big as the headline, so they compete. Make the logo smaller.'
          }
        ]
      },

      {
        type: 'compare',
        eyebrow: 'Research like a strategist',
        title: 'Lazy research vs ==real research==',
        cols: [
          {
            tag: 'Lazy',
            kind: 'bad',
            prompt: 'What are the trends in skincare?',
            result: 'A generic list: clean beauty, natural ingredients, sustainability, K-beauty. No sources, no dates, no “so what”.'
          },
          {
            tag: 'Strategist',
            kind: 'good',
            prompt:
              'Search the web for how India’s D2C skincare market changed in the last 12 months. Focus on sensitive-skin products and buyers aged 22–35. Give me 5 findings, each with a source link and date. Keep facts separate from your interpretation, and flag anything you’re unsure about. End with 3 implications for our client, Luma Skin.',
            result: 'Five sourced findings, split into facts and interpretation, with three implications you can take into a client meeting.'
          }
        ],
        body: '**What makes the difference:** a clear scope, a time frame, an audience, sources you can click, facts kept apart from opinions, and a “so what” at the end.\n\n**How to switch it on:** click **+** at the bottom left of the message box, then **Web search** (a tick appears next to it). For bigger questions, click **+** and choose **Research** instead ([[research]] is on paid plans).'
      },

      {
        type: 'quiz',
        xp: 20,
        eyebrow: 'Trust, but verify',
        title: 'Claude says: “Reels get 67% more engagement than carousels in India (2025 report).” Perfect for tomorrow’s deck. What do you do?',
        options: [
          { label: 'Paste it straight into the deck.', why: 'Claude can mix up or invent numbers and sources, and it sounds just as confident when it does.' },
          { label: 'Ask Claude for the source link, then open it and check the number yourself.', correct: true, why: 'If the source doesn’t say it, it doesn’t go in the deck.' },
          { label: 'Round it to 70% so it looks cleaner.', why: 'Now it’s made up twice.' },
          { label: 'Never use AI for research again.', why: 'Research with Claude saves hours. Just verify what goes to a client.' }
        ],
        reveal: {
          eyebrow: 'The rule',
          big: 'If a client will see it, ==a human checks it==.',
          text: 'Numbers, quotes, sources and claims. Ask Claude for links and page numbers so checking takes seconds.'
        }
      },

      {
        type: 'sort',
        xp: 25,
        eyebrow: 'Match the job to the input',
        title: 'What would you give Claude?',
        buckets: [
          { key: 'shot', label: 'Screenshot' },
          { key: 'file', label: 'Upload file' },
          { key: 'web', label: 'Web search' },
          { key: 'paste', label: 'Paste text' }
        ],
        items: [
          { text: 'Audit a client’s Instagram grid', answer: 'shot', why: 'A screenshot of the grid shows everything at once.' },
          { text: 'Summarise a 50-page category report', answer: 'file', why: 'Upload the PDF and ask specific questions.' },
          { text: 'Find what competitors launched this month', answer: 'web', why: 'Recent news needs web search, with links you can check.' },
          { text: 'Analyse last month’s ad performance', answer: 'file', why: 'Upload the export (Excel or CSV). Claude can calculate and chart it.' },
          { text: 'Tighten the copy in an email draft', answer: 'paste', why: 'Just paste the text.' },
          { text: 'Critique a banner before it goes to the client', answer: 'shot', why: 'Show the design, don’t describe it.' }
        ],
        success: 'All correct. Show it, upload it, search for it, or paste it. Anything is better than describing it.'
      },

      {
        type: 'compare',
        eyebrow: 'Images',
        title: 'What Claude can and ==can’t== do with images',
        cols: [
          {
            tag: 'Can',
            kind: 'good',
            body:
              '- Read and critique images, screenshots and designs\n- Pull text and numbers out of images\n- Write detailed prompts for your image tool\n- Make charts, diagrams, slides and simple graphics\n- Work with design tools like Canva, if your workspace connects them'
          },
          {
            tag: 'Can’t',
            kind: 'bad',
            body: '- Generate photos or illustrations on its own\n\n**Workaround:** use your image tool, and let Claude write the prompt. It’s very good at that.'
          }
        ]
      },

      {
        type: 'summary',
        takeaway: 'Show, don’t describe. ==Verify== before it reaches a client.',
        points: [
          'Files, screenshots and data make answers specific.',
          'Use web search or Research mode for anything recent, and click the sources.',
          'Claude reads images brilliantly. For making images, it writes the prompt.'
        ]
      }
    ]
  };
})();
