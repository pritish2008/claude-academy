/* Level 8 — Claude as the brain: connect your tools */
(function () {
  'use strict';
  var PU = window.PU;
  var h = PU.h;

  /* Claude in the middle, the apps around it. Tool names are examples. */
  var TOOLS = [
    { name: 'Canva', icon: 'palette', color: '#00a3e0' },
    { name: 'Adobe', icon: 'image', color: '#ff5a36' },
    { name: 'ImagineArt', icon: 'wand', color: '#7a4dff' },
    { name: 'Meta Ads', icon: 'trend', color: '#2e3bff' },
    { name: 'Higgsfield', icon: 'video', color: '#e0418b' },
    { name: 'Gmail', icon: 'send', color: '#ff7a00' },
    { name: 'Google Drive', icon: 'folder', color: '#00a676' },
    { name: 'And more', icon: 'plus', color: 'var(--muted)' }
  ];

  function hubVisual() {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 300 300');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('class', 'hub-lines');
    svg.setAttribute('aria-hidden', 'true');
    [
      [50, 50],
      [150, 50],
      [250, 50],
      [50, 150],
      [250, 150],
      [50, 250],
      [150, 250],
      [250, 250]
    ].forEach(function (p) {
      var line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', '150');
      line.setAttribute('y1', '150');
      line.setAttribute('x2', String(p[0]));
      line.setAttribute('y2', String(p[1]));
      line.setAttribute('vector-effect', 'non-scaling-stroke');
      svg.appendChild(line);
    });
    function tool(t) {
      return h('div.hub-cell', h('span.hub-tool', { style: { '--c': t.color } }, PU.icon(t.icon, 'icon-sm'), h('span', t.name)));
    }
    var cells = TOOLS.slice(0, 4).map(tool);
    cells.push(h('div.hub-cell', h('div.hub-core', PU.icon('spark'), h('b', 'Claude'), h('span', 'the brain'))));
    TOOLS.slice(4).forEach(function (t) {
      cells.push(tool(t));
    });
    return h(
      'figure.hub',
      { 'aria-label': 'Claude in the middle, connected to Canva, Adobe, ImagineArt, Meta Ads, Higgsfield, Gmail, Google Drive and more' },
      svg,
      h('div.hub-grid', cells),
      h('figcaption.small.muted', 'You talk to Claude. Claude works in each app for you.')
    );
  }

  PU.levels[8] = {
    id: 'LC',
    num: 8,
    color: 'var(--sw-12)',
    title: 'Claude as the ==brain==: connect your tools',
    short: 'Connect your tools',
    tagline: 'One request. Claude does the steps across all your apps.',
    deliverable: 'Your apps, working through Claude',
    learn: [
      'What a connector is, in plain words',
      'What Canva, Adobe, ImagineArt, Meta Ads and other tools can do through Claude',
      'How to connect a tool, step by step',
      'How one request can run a whole job across several apps',
      'What Claude can do on its own, and what you check first'
    ],
    steps: [
      { type: 'intro' },

      {
        type: 'concept',
        eyebrow: 'The big idea',
        title: 'Claude is the ==brain==. Your apps are its hands.',
        lede: 'Today you jump between Canva, Adobe, Ads Manager and email, copying and pasting. Connect those apps to Claude, and one message is enough: Claude works out the steps and does them in each app. You check the result.',
        visual: hubVisual,
        body:
          '- The link between Claude and one app is called a [[connector]]. You set each one up once.\n- After that, Claude can **read** from the app (your designs, your ad results, your emails) and **work in it** (make a design, edit a photo, save a draft).\n- You stay in charge. Claude only does what your account in that app is allowed to do, and it asks before anything important.'
      },

      {
        type: 'compare',
        eyebrow: 'Where the time goes',
        title: 'One launch post, ==two ways==',
        cols: [
          {
            tag: 'Without connectors',
            kind: 'bad',
            steps: [
              'Ask Claude for caption ideas',
              'Copy the best one',
              'Open Canva and find the brand kit',
              'Make the post, then resize it for Stories',
              'Open Adobe to cut out the product photo',
              'Download everything',
              'Upload it to the client’s Drive folder',
              'Write the approval email'
            ],
            stat: ['8', 'steps and 4 apps for you']
          },
          {
            tag: 'With connectors',
            kind: 'good',
            steps: [
              '“Write 3 captions for the Luma SPF launch. Make the best one as a post and a Story in Canva with the Luma brand kit, cut out the product photo with Adobe, save it all in the Luma Drive folder, and draft the approval email. Don’t send anything.”',
              'Check the designs and the draft, then send'
            ],
            stat: ['2', 'steps for you']
          }
        ]
      },

      {
        type: 'cards',
        xp: 15,
        eyebrow: 'Your toolkit',
        title: 'What each tool can do ==through Claude==',
        lede: 'Open each card. The example is exactly what you’d type.',
        wide: true,
        cards: [
          {
            icon: 'palette',
            title: 'Canva',
            q: 'Designs in your brand kit',
            color: '#00a3e0',
            body: 'Makes posts, Stories, decks and posters using your brand kit. Resizes designs, fills in templates, and exports PNG, PDF, PowerPoint or video.',
            example: '“Make 3 Instagram posts for the Diwali sale using the Luma brand kit.”'
          },
          {
            icon: 'image',
            title: 'Adobe',
            q: 'Photos, PDFs and quick edits',
            color: '#ff5a36',
            body: 'Edits photos (cut out backgrounds, fix colour and light), makes Adobe Express designs, works with PDFs (combine, split, hide private details) and resizes videos.',
            example: '“Remove the background from these 12 product photos and make them all square.”'
          },
          {
            icon: 'wand',
            title: 'ImagineArt',
            q: 'AI images, videos and music',
            color: '#7a4dff',
            body: 'Makes images, short videos and music from a description, and can remove backgrounds. Uses your ImagineArt credits.',
            example: '“Make 4 images of our coffee cup on a café table in warm morning light.”'
          },
          {
            icon: 'video',
            title: 'Higgsfield',
            q: 'AI video from a photo or idea',
            color: '#e0418b',
            body: 'Makes videos and images with many different AI models, and keeps the same product or face looking the same across a whole campaign. Uses your Higgsfield credits.',
            example: '“Turn this product photo into a short video for Reels.”'
          },
          {
            icon: 'trend',
            title: 'Meta Ads',
            q: 'Ad results and set-up',
            color: '#2e3bff',
            body: 'Pulls campaign results, spots problems and compares with benchmarks. It can also set up campaigns, which start paused, so nothing spends money by surprise.',
            example: '“How did the Luma campaigns do last week? Which ads should we pause?”'
          },
          {
            icon: 'send',
            title: 'Gmail and Google Drive',
            q: 'Emails and files',
            color: '#00a676',
            body: 'Finds emails and files, sums up long threads, drafts replies and saves documents in the right folder.',
            example: '“Find Ananya’s last 3 emails and draft a reply with the new dates.”'
          }
        ],
        footer:
          '**Also worth knowing:** Claude Design is Anthropic’s own design tool, included with paid plans. It makes slides, one-pagers and page mock-ups in your brand colours and fonts, and sends them to Canva, PDF or PowerPoint.'
      },

      {
        type: 'guide',
        xp: 20,
        eyebrow: 'Try it now',
        title: 'Connect your first tool: ==Canva==',
        lede: 'Most big apps are in Claude’s list of connectors. Open Claude in another tab and follow along.',
        items: [
          {
            title: 'Open the connectors list',
            body: 'In Claude, click **+** at the bottom left of the message box, point at **Connectors**, then click **Manage connectors**. (You can also go to **Customize → Connectors**.)'
          },
          { title: 'Find Canva', body: 'Browse the list or search for “Canva”. Click it, then click **Connect**.' },
          { title: 'Sign in and allow', body: 'A Canva window opens. Sign in with the agency’s Canva account and click **Allow**.' },
          { title: 'Switch it on in your chat', body: 'In any chat, click **+**, point at **Connectors**, and check Canva is switched on.' },
          { title: 'Try it', body: 'Type: “Show me my Canva brand kits.” Then: “Make an Instagram post for [client] using the [name] brand kit.”' },
          {
            title: 'Say yes carefully',
            body: 'Claude may ask before it uses a tool. Saying yes is fine for making drafts. Keep it asking for anything that sends, posts, deletes or spends money.'
          }
        ],
        footer: 'On a Team plan, an Owner has to switch connectors on for the company first. After that, each person connects their own account.'
      },

      {
        type: 'guide',
        xp: 15,
        eyebrow: 'Not in the list?',
        title: 'Connect a tool ==with a link==',
        lede: 'Some tools, like ImagineArt and Meta Ads, give you a link to paste instead. This is called a [[custom connector]].',
        items: [
          {
            title: 'Get the link from the tool’s own website',
            body: 'Search for “[tool] Claude connector”. For example, ImagineArt’s link is **https://mcp.imagine.art** and Meta Ads’ is **https://mcp.facebook.com/ads**. Links can change, so check the tool’s help page.'
          },
          { title: 'Open the connectors settings', body: 'In Claude, go to **Customize → Connectors**, click **+**, then **Add custom connector**.' },
          { title: 'Paste the link', body: 'Give it a name, like “ImagineArt”, paste the link, and add it.' },
          { title: 'Connect and sign in', body: 'Click **Connect**, sign in to the tool, and allow access.' },
          { title: 'Switch it on and try it', body: 'In a chat, click **+** → **Connectors**, switch it on, and ask for something small first.' }
        ],
        footer:
          'Only paste links from the tool’s own website. No link at all? A service like Zapier can connect Claude to thousands of apps. Or ask Claude to write the prompt, and paste it into the tool yourself.'
      },

      {
        type: 'chat',
        xp: 25,
        eyebrow: 'See it in action',
        title: 'One message, ==five apps==',
        lede: 'Here’s Claude running a whole job across your tools. Press the blue button to move on.',
        chatTitle: 'Claude · simulated',
        turns: [
          {
            role: 'user',
            text:
              'Luma Skin’s SPF 50 launches Monday. Use last week’s Meta Ads results to write 3 caption options. Make the best one as an Instagram post and a Story in Canva with the Luma brand kit. Cut out the product photo with Adobe first. Save everything in the Luma folder in Drive, and draft an approval email to Ananya. Don’t send anything.'
          },
          {
            role: 'claude',
            think: 1100,
            text: 'On it. My plan:\n\n1. Check last week’s Meta Ads results for the angle that worked best\n2. Write 3 captions around that angle\n3. Cut out the product photo in Adobe\n4. Make the post and the Story in Canva\n5. Save both to Drive and draft the email, without sending it'
          },
          {
            role: 'screen',
            title: 'Claude is working in your apps',
            lines: [
              { t: 'Meta Ads · reading last week’s Luma results… done', kind: 'ok' },
              { t: '  Best angle: “no white cast” (click-through 2.1%)', kind: 'dim' },
              { t: 'Writing 3 caption options… done', kind: 'ok' },
              { t: 'Adobe · cutting out spf50-bottle.jpg… done', kind: 'ok' },
              { t: 'Canva · making a post and a Story in the Luma brand kit… done', kind: 'ok' },
              { t: 'Google Drive · saving 2 designs to Luma Skin / SPF launch… done', kind: 'ok' },
              { t: 'Gmail · draft to Ananya saved (not sent)', kind: 'ok' }
            ]
          },
          {
            role: 'note',
            text: 'Claude used five apps, and you wrote one message. Nothing went to the client: the email is a draft waiting for you.'
          },
          {
            role: 'claude',
            text:
              'Done. The post and Story use caption 1: **“SPF 50 that feels like nothing. No white cast, no sting.”** Both designs are in Drive, and the email to Ananya is saved as a draft. Want any changes?'
          },
          { role: 'user', send: 'Ask for a change', text: 'Use caption 2 instead, and make the Story headline shorter.' },
          { role: 'claude', text: 'Done. I updated both designs in Canva and the draft email.' },
          { role: 'note', text: 'Now it’s your turn: open the designs and the draft, fix anything that’s off, then send it yourself.' }
        ],
        callout: {
          title: 'You give the brief. ==Claude does the clicking.== You check and send.',
          text: 'The time you save is all the switching between apps, copying, downloading and uploading.'
        }
      },

      {
        type: 'sort',
        xp: 20,
        eyebrow: 'Stay in charge',
        title: 'Let Claude do it, or ==check first==?',
        buckets: [
          { key: 'go', label: 'Let Claude do it' },
          { key: 'check', label: 'You check first' }
        ],
        items: [
          { text: 'Pull last month’s ad results', answer: 'go', why: 'Reading information is safe.' },
          { text: 'Make 5 draft designs in Canva', answer: 'go', why: 'Drafts are safe. You pick the best one.' },
          { text: 'Cut out the background from 20 product photos', answer: 'go', why: 'Safe, and a big time saver. Spot-check a few.' },
          { text: 'Send the report email to the client', answer: 'check', why: 'Anything a client sees, you check and send.' },
          { text: 'Post on the client’s Instagram', answer: 'check', why: 'Posting is public and final. Check it first.' },
          { text: 'Switch on a new ad campaign', answer: 'check', why: 'Spending money always needs a person’s OK.' },
          { text: 'Delete old files in the shared Drive', answer: 'check', why: 'Deleting is hard to undo.' }
        ],
        success: 'Spot on. Reading and drafting: let Claude do it. Sending, posting, spending and deleting: you check first.'
      },

      {
        type: 'cards',
        xp: 10,
        eyebrow: 'Ground rules',
        title: 'Six rules for ==connecting tools==',
        lede: 'Open each card.',
        cards: [
          { icon: 'users', title: 'Work accounts only', color: '#2e3bff', body: 'Connect the agency’s accounts, not your personal ones.' },
          { icon: 'target', title: 'Only what you need', color: '#00a676', body: 'Connect the tools you actually use. You can switch each one on or off per chat.' },
          { icon: 'lock', title: 'Keep the ask-first setting on', color: '#ff5a36', body: 'For anything that sends, posts, deletes or spends money, Claude should ask you first.' },
          {
            icon: 'alert',
            title: 'Watch for sneaky instructions',
            color: '#e0418b',
            body: 'Emails and web pages can hide instructions meant for Claude. If Claude suddenly wants to do something you didn’t ask for, say no.'
          },
          { icon: 'brief', title: 'Check the client’s rules', color: '#7a4dff', body: 'Some clients don’t allow their accounts or files to be connected to AI tools. Ask first.' },
          { icon: 'bolt', title: 'Credits cost money', color: '#ff7a00', body: 'Image and video tools use paid credits. Ask for a few options first, not fifty.' }
        ]
      },

      {
        type: 'summary',
        takeaway: 'You give the brief. ==Claude does the clicking.==',
        points: [
          'Connect each tool once: **+** → Connectors → Manage connectors.',
          'Tools not in the list: Customize → Connectors → Add custom connector, with the tool’s link.',
          'One clear request can run a whole job across several apps.',
          'Reading and drafting: let Claude do it. Sending, posting, spending and deleting: you check first.'
        ]
      }
    ]
  };
})();
