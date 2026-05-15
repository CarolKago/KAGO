/* ═══════════════════════════════════════════════════════════════
   KAGO ATELIER — Concierge Chat Widget
   FAQ · Rate Card · Consultation Booking
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (document.getElementById('kago-chat-widget')) return;

  var EMAIL = 'hello@kagoatelier.com';

  /* ── Styles ── */
  function injectStyles() {
    var s = document.createElement('style');
    s.textContent = [
      '#kago-chat-toggle{',
        'position:fixed;bottom:28px;right:28px;z-index:8500;',
        'width:58px;height:58px;border-radius:50%;',
        'background:#4A1220;border:1px solid rgba(196,120,138,.4);',
        'box-shadow:0 6px 28px rgba(74,18,32,.5);',
        'display:flex;align-items:center;justify-content:center;',
        'cursor:pointer;transition:background .3s,transform .3s;',
        'font-family:"Playfair Display",serif;font-style:italic;',
        'font-size:13px;letter-spacing:.08em;color:rgba(242,232,218,.9);',
      '}',
      '#kago-chat-toggle:hover{background:#6B1E2E;transform:scale(1.07);}',

      '#kago-chat-panel{',
        'position:fixed;bottom:100px;right:28px;z-index:8500;',
        'width:340px;max-height:540px;',
        'background:#F7F0E6;',
        'border:1px solid #E0CEBC;',
        'box-shadow:0 10px 52px rgba(44,16,8,.24);',
        'display:flex;flex-direction:column;',
        'opacity:0;pointer-events:none;',
        'transform:translateY(14px);',
        'transition:opacity .3s ease,transform .3s ease;',
      '}',
      '#kago-chat-panel.open{opacity:1;pointer-events:all;transform:translateY(0);}',

      '.kc-hd{',
        'background:#4A1220;padding:14px 18px;',
        'display:flex;align-items:center;justify-content:space-between;',
        'flex-shrink:0;',
      '}',
      '.kc-hd-left{}',
      '.kc-hd-name{',
        'font-family:"Playfair Display",serif;font-style:italic;font-weight:400;',
        'font-size:15px;letter-spacing:.06em;color:rgba(242,232,218,.92);',
      '}',
      '.kc-hd-sub{',
        'font-size:9.5px;letter-spacing:.28em;text-transform:uppercase;',
        'color:rgba(196,120,138,.6);margin-top:2px;',
      '}',
      '.kc-hd-close{',
        'background:none;border:none;cursor:pointer;',
        'color:rgba(196,120,138,.5);font-size:22px;line-height:1;',
        'padding:0;transition:color .2s;',
      '}',
      '.kc-hd-close:hover{color:rgba(196,120,138,.9);}',

      '.kc-body{',
        'flex:1;overflow-y:auto;',
        'padding:18px 14px;',
        'display:flex;flex-direction:column;gap:10px;',
        'scroll-behavior:smooth;',
      '}',

      '.kc-msg{',
        'max-width:90%;padding:10px 14px;',
        'font-family:"Cormorant Garamond",serif;font-style:italic;',
        'font-size:15px;line-height:1.65;',
      '}',
      '.kc-msg.bot{',
        'background:#EDD5D9;color:#3E2010;',
        'align-self:flex-start;',
        'border-left:2px solid #C4788A;',
      '}',
      '.kc-msg.bot a{color:#6B1E2E;text-decoration:underline;}',
      '.kc-msg.user{',
        'background:#4A1220;color:rgba(242,232,218,.9);',
        'align-self:flex-end;font-style:normal;font-size:14px;',
      '}',

      '.kc-chips{',
        'display:flex;flex-wrap:wrap;gap:6px;',
        'align-self:flex-start;margin-top:2px;',
      '}',
      '.kc-chip{',
        'background:none;border:1px solid rgba(196,120,138,.4);',
        'color:#6B1E2E;',
        'font-family:"EB Garamond",serif;',
        'font-size:11px;letter-spacing:.18em;text-transform:uppercase;',
        'padding:6px 13px;cursor:pointer;',
        'transition:background .25s,color .25s,border-color .25s;',
      '}',
      '.kc-chip:hover:not(:disabled){background:#4A1220;color:rgba(242,232,218,.9);border-color:#4A1220;}',
      '.kc-chip.yes{background:#C4788A;color:#F7F0E6;border-color:#C4788A;}',
      '.kc-chip.yes:hover:not(:disabled){background:#4A1220;border-color:#4A1220;}',
      '.kc-chip.no{color:#9C7860;border-color:rgba(156,120,96,.35);}',
      '.kc-chip.no:hover:not(:disabled){background:#9C7860;color:#F7F0E6;border-color:#9C7860;}',
      '.kc-chip:disabled{opacity:.45;cursor:default;}',

      '.kc-ft{',
        'padding:10px 12px;border-top:1px solid #E0CEBC;',
        'display:flex;gap:8px;flex-shrink:0;',
      '}',
      '.kc-input{',
        'flex:1;border:1px solid #E0CEBC;background:#F2E8DA;',
        'padding:8px 12px;',
        'font-family:"EB Garamond",serif;font-size:14px;color:#2C1008;',
        'outline:none;',
      '}',
      '.kc-input:focus{border-color:#C4788A;}',
      '.kc-input::placeholder{color:#9C7860;opacity:.7;}',
      '.kc-send{',
        'background:#4A1220;color:rgba(242,232,218,.85);border:none;',
        'padding:8px 14px;cursor:pointer;',
        'font-family:"EB Garamond",serif;font-size:12px;letter-spacing:.14em;text-transform:uppercase;',
        'transition:background .25s;',
      '}',
      '.kc-send:hover{background:#6B1E2E;}',

      '@media(max-width:480px){',
        '#kago-chat-panel{width:calc(100vw - 20px);right:10px;bottom:80px;}',
        '#kago-chat-toggle{right:14px;bottom:14px;}',
      '}',
    ].join('');
    document.head.appendChild(s);
  }

  /* ── DOM ── */
  function buildWidget() {
    var w = document.createElement('div');
    w.id = 'kago-chat-widget';
    w.innerHTML =
      '<button id="kago-chat-toggle" aria-label="Open KAGO concierge chat">K</button>' +
      '<div id="kago-chat-panel" role="dialog" aria-label="KAGO Atelier Concierge">' +
        '<div class="kc-hd">' +
          '<div class="kc-hd-left">' +
            '<div class="kc-hd-name">KAGO Atelier</div>' +
            '<div class="kc-hd-sub">Private Concierge</div>' +
          '</div>' +
          '<button class="kc-hd-close" aria-label="Close">&times;</button>' +
        '</div>' +
        '<div class="kc-body" id="kcBody"></div>' +
        '<div class="kc-ft">' +
          '<input class="kc-input" id="kcInput" type="text" placeholder="Ask anything…" autocomplete="off">' +
          '<button class="kc-send" id="kcSend">Send</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(w);
  }

  /* ── Messaging ── */
  function botMsg(html, chips) {
    var body = document.getElementById('kcBody');
    var m = document.createElement('div');
    m.className = 'kc-msg bot';
    m.innerHTML = html;
    body.appendChild(m);
    if (chips && chips.length) {
      var row = document.createElement('div');
      row.className = 'kc-chips';
      chips.forEach(function (c) {
        var btn = document.createElement('button');
        btn.className = 'kc-chip' + (c.cls ? ' ' + c.cls : '');
        btn.textContent = c.label;
        btn.addEventListener('click', function () {
          row.querySelectorAll('.kc-chip').forEach(function (b) {
            b.disabled = true;
          });
          userMsg(c.label);
          setTimeout(function () { respond(c.key); }, 360);
        });
        row.appendChild(btn);
      });
      body.appendChild(row);
    }
    body.scrollTop = body.scrollHeight;
  }

  function userMsg(text) {
    var body = document.getElementById('kcBody');
    var m = document.createElement('div');
    m.className = 'kc-msg user';
    m.textContent = text;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
  }

  /* ── Responses ── */
  function respond(key) {
    if (key === 'services') {
      botMsg(
        'KAGO offers four private services:<br><br>' +
        '<strong>Wardrobe Architecture</strong> &mdash; A complete structural audit and rebuild.<br>' +
        '<strong>The Power Edit</strong> &mdash; A professional wardrobe built for authority.<br>' +
        '<strong>Archive &amp; Collector</strong> &mdash; Rare piece sourcing and authentication.<br>' +
        '<strong>Creative Direction</strong> &mdash; Visual identity and styling for pivotal occasions.',
        [{ label: 'Book a Consultation', key: 'booking' }]
      );
    } else if (key === 'ratecard') {
      botMsg('Would you like to receive our private rate card?', [
        { label: 'Yes, please', key: 'rc_yes', cls: 'yes' },
        { label: 'Not right now', key: 'rc_no', cls: 'no' }
      ]);
    } else if (key === 'rc_yes') {
      botMsg('Wonderful. Please complete a brief enquiry and we will have your private rate card with you within 24 hours.');
      setTimeout(function () {
        if (typeof openBookingModal === 'function') openBookingModal();
      }, 700);
    } else if (key === 'rc_no') {
      botMsg(
        'Of course. Should you wish to reach us at any time, please contact us at ' +
        '<a href="mailto:' + EMAIL + '">' + EMAIL + '</a>. ' +
        'We are always happy to assist.'
      );
    } else if (key === 'booking') {
      botMsg(
        'You may request a private consultation using our booking form or by emailing us at ' +
        '<a href="mailto:' + EMAIL + '">' + EMAIL + '</a>. ' +
        'All enquiries receive a response within 24 hours.',
        [{ label: 'Open Booking Form', key: 'open_booking' }]
      );
    } else if (key === 'open_booking') {
      if (typeof openBookingModal === 'function') openBookingModal();
    } else if (key === 'contact') {
      botMsg(
        'You may reach us at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>. ' +
        'We respond to all enquiries within 24 hours.'
      );
    } else if (key === 'location') {
      botMsg('KAGO Atelier operates privately in London. All consultations are conducted at a location chosen for your comfort and discretion.');
    }
  }

  /* ── Text input handler ── */
  function handleText(raw) {
    raw = raw.trim();
    if (!raw) return;
    userMsg(raw);
    var t = raw.toLowerCase();
    setTimeout(function () {
      if (/rate.?card|pric|cost|fee|how much/i.test(t)) {
        respond('ratecard');
      } else if (/service|offer|what do you|what can|wardrobe|power edit|archive|creative/i.test(t)) {
        respond('services');
      } else if (/book|consult|appointment|schedule|meet/i.test(t)) {
        respond('booking');
      } else if (/contact|email|reach|get in touch|touch/i.test(t)) {
        respond('contact');
      } else if (/where|location|based|london|address/i.test(t)) {
        respond('location');
      } else if (/^(hello|hi|hey|good\s*(morning|afternoon|evening))/i.test(t)) {
        botMsg('Good day. How may I assist you today?', [
          { label: 'Our Services', key: 'services' },
          { label: 'Rate Card', key: 'ratecard' },
          { label: 'Book a Consultation', key: 'booking' },
          { label: 'Contact Us', key: 'contact' }
        ]);
      } else {
        botMsg(
          'Thank you for your message. For immediate assistance, please contact us at ' +
          '<a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.',
          [{ label: 'Book a Consultation', key: 'open_booking' }]
        );
      }
    }, 380);
  }

  /* ── Init ── */
  function init() {
    injectStyles();
    buildWidget();

    var toggle  = document.getElementById('kago-chat-toggle');
    var panel   = document.getElementById('kago-chat-panel');
    var closeBtn = panel.querySelector('.kc-hd-close');
    var input   = document.getElementById('kcInput');
    var send    = document.getElementById('kcSend');
    var opened  = false;
    var greeted = false;

    function openPanel() {
      opened = true;
      panel.classList.add('open');
      if (!greeted) {
        greeted = true;
        setTimeout(function () {
          botMsg('Welcome to KAGO Atelier. How may I assist you today?', [
            { label: 'Our Services', key: 'services' },
            { label: 'Rate Card', key: 'ratecard' },
            { label: 'Book a Consultation', key: 'booking' },
            { label: 'Contact Us', key: 'contact' }
          ]);
        }, 160);
      }
    }

    function closePanel() {
      opened = false;
      panel.classList.remove('open');
    }

    toggle.addEventListener('click', function () {
      if (opened) { closePanel(); } else { openPanel(); }
    });
    closeBtn.addEventListener('click', closePanel);

    send.addEventListener('click', function () {
      handleText(input.value);
      input.value = '';
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        handleText(input.value);
        input.value = '';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
