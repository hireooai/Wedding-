/* ==========================================================================
   Abhishek weds Pranjal — interactions & motion
   --------------------------------------------------------------------------
   Everything you may want to edit (dates, times, venue, links) lives in
   WEDDING below. Text on the page that shows a date is filled from here.
   ========================================================================== */

const WEDDING = {
  timezone: 'Asia/Kolkata',
  tzOffset: '+05:30',
  venue: {
    name: 'Rajputana Resort',
    city: 'Dhampur',
    // Used for "Get Directions" / "View on Google Maps".
    // You can replace either with your exact Google Maps share link.
    mapsQuery: 'Rajputana Resort Hotel & Restaurant Dhampur',
    directionsUrl: null,
    mapUrl: null,
  },
  // Events, in order. Each one needs either:
  //   start (+ end) — an exact local time 'YYYY-MM-DDTHH:MM'; the card shows a
  //                   live countdown and the calendar link books that slot, or
  //   date          — just 'YYYY-MM-DD' when the time isn't fixed yet; the card
  //                   shows timeLabel only and the calendar link is all-day.
  // `end` is only used for the calendar entry and the "happening now" window.
  // The big Save-the-Date countdown and every date printed on the page follow
  // the event marked `main: true`.
  events: [
    {
      id: 'haldi',
      theme: 'haldi',
      title: 'Haldi Celebration',
      badge: 'Morning',
      start: '2027-01-27T10:00',
      end: '2027-01-27T14:00',
      timeLabel: '10:00 AM – 2:00 PM',
      desc: 'A sun-washed morning of turmeric, marigolds and laughter, as our loved ones bless us with haldi.',
    },
    {
      id: 'engagement',
      theme: 'night',
      title: 'Engagement Ceremony',
      badge: 'Evening',
      start: '2027-01-27T19:00',
      end: '2027-01-27T23:00',
      timeLabel: '7:00 PM onwards',
      desc: 'Rings, blessings and a starlit night as our two families come together as one.',
    },
    {
      id: 'bhat-manda',
      theme: 'manda',
      title: 'Bhat & Manda',
      badge: 'Morning',
      start: '2027-01-28T11:00',
      end: '2027-01-28T14:00',
      timeLabel: '11:00 AM',
      desc: 'Our wedding day begins with cherished family rituals and the warm blessings of our elders.',
    },
    {
      id: 'wedding',
      theme: 'jaimala',
      title: 'Wedding Ceremony',
      badge: 'Evening',
      start: '2027-01-28T17:00',
      end: '2027-01-28T23:00',
      timeLabel: '5:00 PM',
      desc: 'Our wedding evening — garlands, blessings and cheer, as we choose each other in front of everyone we love.',
      main: true,
    },
    {
      id: 'pheras',
      theme: 'pheras',
      title: 'Pheras',
      badge: 'Night',
      date: '2027-01-28',
      timeLabel: 'Later that night',
      desc: 'Seven sacred vows around the holy fire, beneath the stars — our promise of forever.',
    },
    {
      id: 'vidai',
      theme: 'vidai',
      title: 'Vidai',
      date: '2027-01-29',
      timeLabel: 'Following the pheras',
      desc: 'A tender farewell wrapped in our families’ blessings, as we set out together to begin our new life.',
    },
  ],
};

(() => {
  'use strict';

  /* ------------------------------------------------------------------ utils */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const root = document.documentElement;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const motion = hasGSAP && !reduceMotion;
  if (motion) root.classList.add('motion');

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ------------------------------------------------------- dates & binding */
  const at = (local) => new Date(`${local}:00${WEDDING.tzOffset}`);
  const part = (date, opts) => new Intl.DateTimeFormat('en-GB', { timeZone: WEDDING.timezone, ...opts }).format(date);
  const ordinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };
  const timedEvents = WEDDING.events.filter((e) => e.start);
  const mainEvent = timedEvents.find((e) => e.main) || timedEvents[timedEvents.length - 1];
  const mainDate = at(mainEvent.start);
  const dayNum = Number(part(mainDate, { day: 'numeric' }));
  const monthName = part(mainDate, { month: 'long' });
  const year = part(mainDate, { year: 'numeric' });
  const weekday = part(mainDate, { weekday: 'long' });
  const monthNum = part(mainDate, { month: '2-digit' });

  const dayKey = (e) => (e.start || e.date).slice(0, 10);

  const binds = {
    dateLong: `${dayNum} ${monthName}, ${year}`,
    dateOrdinal: `${dayNum}<sup>${ordinal(dayNum)}</sup> ${monthName} ${year}`,
    saveLine: `${weekday} · ${WEDDING.venue.name}, ${WEDDING.venue.city}`,
    cardDate: `${String(dayNum).padStart(2, '0')} · ${monthNum} · ${year}`,
  };
  $$('[data-bind]').forEach((el) => {
    const v = binds[el.dataset.bind];
    if (v) el.innerHTML = v;
  });

  const q = encodeURIComponent(WEDDING.venue.mapsQuery).replace(/%20/g, '+');
  const directionsUrl = WEDDING.venue.directionsUrl || `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  const mapUrl = WEDDING.venue.mapUrl || `https://www.google.com/maps/search/?api=1&query=${q}`;
  $$('a[href*="maps/dir/"]').forEach((a) => (a.href = directionsUrl));
  $$('a[href*="maps/search/"]').forEach((a) => (a.href = mapUrl));

  /* ---------------------------------------------------------- event cards */
  const ART = {
    scallop(cx, cy, r, n) {
      let d = '';
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2, am = (a0 + a1) / 2;
        const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
        const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
        const c = [cx + r * 1.34 * Math.cos(am), cy + r * 1.34 * Math.sin(am)];
        d += (i ? '' : `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)}`) + `Q${c[0].toFixed(1)} ${c[1].toFixed(1)} ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
      }
      return d + 'Z';
    },
    star(x, y, s) {
      return `M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`;
    },
    p(d, cls = 'd', extra = '') { return `<path class="${cls}" pathLength="1" d="${d}" ${extra}/>`; },
    haldi() {
      const m = (cx, cy, r) => this.p(this.scallop(cx, cy, r, 11)) + this.p(this.scallop(cx, cy, r * .58, 8)) + `<circle class="f" cx="${cx}" cy="${cy}" r="${(r * .2).toFixed(1)}" fill="currentColor"/>`;
      return `<svg viewBox="0 0 160 112" aria-hidden="true">
        ${this.p('M40 70C52 62 62 62 72 67C82 72 94 72 104 66C112 61 118 62 122 66', 'f', 'fill="currentColor" opacity=".18"')}
        ${this.p('M30 66H130C130 89 108 101 80 101C52 101 30 89 30 66Z')}
        ${this.p('M24 66H136')}
        ${this.p('M42 66C50 58 62 58 70 63C78 68 90 68 98 62C106 57 112 58 118 63')}
        ${this.p('M66 101L62 107H98L94 101')}
        ${m(52, 40, 11)}${m(80, 28, 13)}${m(108, 40, 11)}
        ${this.p('M34 54C24 48 21 37 25 29C35 33 39 44 34 54Z')}${this.p('M126 54C136 48 139 37 135 29C125 33 121 44 126 54Z')}
        ${this.p(this.star(22, 14, 4))}${this.p(this.star(140, 12, 3))}${this.p(this.star(80, 4, 2.5))}
      </svg>`;
    },
    night() {
      return `<svg viewBox="0 0 160 112" aria-hidden="true">
        ${this.p('M42 70a22 22 0 1 0 44 0a22 22 0 1 0 -44 0')}
        ${this.p('M72 70a22 22 0 1 0 44 0a22 22 0 1 0 -44 0')}
        ${this.p('M86 42L94 32L102 42L94 51Z')}
        ${this.p('M86 42H102M90 42L94 51L98 42M90 42L94 32L98 42')}
        ${this.p('M131 16a13 13 0 1 0 11 20a10 10 0 1 1 -11 -20Z')}
        ${this.p(this.star(28, 22, 5))}${this.p(this.star(48, 10, 3))}${this.p(this.star(112, 22, 3))}${this.p(this.star(142, 62, 4))}${this.p(this.star(20, 56, 3))}
      </svg>`;
    },
    manda() {
      return `<svg viewBox="0 0 160 112" aria-hidden="true">
        ${this.p('M80 21C70 21 64 29 65.5 38C67 46 93 46 94.5 38C96 29 90 21 80 21Z')}
        ${this.p('M72 47C62 45 52 38 48 28C58 29 68 36 72 47Z')}${this.p('M66 51C53 52 41 48 34 40C46 37 58 42 66 51Z')}
        ${this.p('M88 47C98 45 108 38 112 28C102 29 92 36 88 47Z')}${this.p('M94 51C107 52 119 48 126 40C114 37 102 42 94 51Z')}
        ${this.p('M64 52H96M66 57H94')}
        ${this.p('M66 57C50 63 46 84 58 95C66 102 94 102 102 95C114 84 110 63 94 57')}
        ${this.p('M52 74C70 81 90 81 108 74')}
        <circle class="f" cx="70" cy="87" r="2.2" fill="currentColor"/><circle class="f" cx="80" cy="89" r="2.2" fill="currentColor"/><circle class="f" cx="90" cy="87" r="2.2" fill="currentColor"/>
        ${this.p('M66 100L62 107H98L94 100')}
        ${this.p(this.star(26, 26, 4))}${this.p(this.star(136, 22, 3.5))}${this.p(this.star(124, 86, 2.5))}${this.p(this.star(34, 88, 2.5))}
      </svg>`;
    },
    jaimala() {
      const garland = (x0, x1) => {
        const y0 = 16, k = 100;
        let out = this.p(`M${x0} ${y0}C${x0} ${y0 + k} ${x1} ${y0 + k} ${x1} ${y0}`);
        for (let i = 1; i < 9; i++) {
          const t = i / 9, u = 1 - t;
          const x = u * u * u * x0 + 3 * u * u * t * x0 + 3 * u * t * t * x1 + t * t * t * x1;
          const y = u * u * u * y0 + 3 * u * u * t * (y0 + k) + 3 * u * t * t * (y0 + k) + t * t * t * y0;
          out += this.p(this.scallop(x, y, 4.4, 7)) + `<circle class="f" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.5" fill="currentColor"/>`;
        }
        return out;
      };
      return `<svg viewBox="0 0 160 112" aria-hidden="true">
        ${garland(22, 98)}${garland(62, 138)}
        ${this.p('M60 93V102M100 93V102')}
        ${this.p(this.scallop(60, 105.5, 3, 6))}${this.p(this.scallop(100, 105.5, 3, 6))}
        ${this.p(this.star(80, 9, 4))}${this.p(this.star(10, 44, 2.5))}${this.p(this.star(150, 44, 2.5))}
      </svg>`;
    },
    vidai() {
      return `<svg viewBox="0 0 160 112" aria-hidden="true">
        ${this.p('M10 44H150M10 40V48M150 40V48')}
        ${this.p('M52 44C53 31 64 22 80 20C96 22 107 31 108 44')}
        ${this.p('M80 20V11')}<circle class="f" cx="80" cy="8.5" r="2.4" fill="currentColor"/>
        ${this.p('M54 44V92H106V44')}
        ${this.p('M54 52q6.5 7 13 0q6.5 7 13 0q6.5 7 13 0q6.5 7 13 0')}
        ${this.p('M80 59C74 70 68 81 62 92M80 59C86 70 92 81 98 92')}
        ${this.p('M48 92H112M58 92V100M102 92V100')}
        ${this.p(this.scallop(30, 76, 5, 7))}${this.p(this.scallop(132, 70, 4, 7))}${this.p(this.scallop(140, 92, 3.2, 6))}
        ${this.p(this.star(26, 22, 3.5))}${this.p(this.star(134, 20, 3))}
      </svg>`;
    },
    pheras() {
      let scallops = 'M28 44';
      for (let i = 0; i < 6; i++) scallops += 'q8.67 9 17.33 0';
      return `<svg viewBox="0 0 160 112" aria-hidden="true">
        ${this.p('M28 44Q80 -6 132 44')}
        ${this.p('M80 19V7')}<circle class="f" cx="80" cy="5" r="2.4" fill="currentColor"/>
        ${this.p(scallops)}
        ${this.p('M34 44V102M39 44V102M126 44V102M121 44V102')}
        ${this.p('M18 102H142M26 108H134')}
        ${this.p('M52 53V61M108 53V61')}<circle class="f" cx="52" cy="63" r="2" fill="currentColor"/><circle class="f" cx="108" cy="63" r="2" fill="currentColor"/>
        ${this.p('M64 102V92H96V102M60 92H100')}
        <g class="flame">${this.p('M80 90C71 82 73 71 80 61C82 70 90 74 85 83C84 87 82 89 80 90Z', 'f', 'fill="#f2a93b"')}${this.p('M80 90C76 86 77 80 80 75C82 80 84 84 80 90Z', 'f', 'fill="#ffe08a"')}</g>
      </svg>`;
    },
  };
  ART.wedding = ART.pheras;

  const calIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18M12 13v5M9.5 15.5h5"/></svg>';
  const HOUR = 36e5;
  const startMs = (e) => at(e.start).getTime();
  const endMs = (e) => (e.end ? at(e.end).getTime() : startMs(e) + 3 * HOUR);
  const nextDay = (ymd) => {
    const [Y, M, D] = ymd.split('-').map(Number);
    return new Date(Date.UTC(Y, M - 1, D + 1)).toISOString().slice(0, 10);
  };
  const gcal = (e) => {
    const z = (ms) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const p = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${e.title} · Abhishek & Pranjal`,
      dates: e.start
        ? `${z(startMs(e))}/${z(endMs(e))}`
        : `${e.date.replace(/-/g, '')}/${nextDay(e.date).replace(/-/g, '')}`,
      location: `${WEDDING.venue.name}, ${WEDDING.venue.city}`,
      details: `${e.timeLabel} — ${e.desc}\n\nDirections: ${directionsUrl}`,
    });
    if (e.start) p.set('ctz', WEDDING.timezone);
    return `https://calendar.google.com/calendar/render?${p.toString()}`;
  };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  (function renderEvents() {
    const list = $('#event-list');
    if (!list) return;
    const days = [];
    WEDDING.events.forEach((e) => {
      const key = dayKey(e);
      let d = days.find((x) => x.key === key);
      if (!d) days.push((d = { key, events: [] }));
      d.events.push(e);
    });
    days.sort((a, b) => a.key.localeCompare(b.key));
    const DARK = ['night', 'pheras'];
    let side = 0, html = '';
    days.forEach((d, i) => {
      const dt = at(`${d.key}T12:00`);
      html += `<div class="tl__day"><strong>${part(dt, { weekday: 'long' })}, ${part(dt, { day: 'numeric', month: 'long' })}</strong></div>`;
      d.events.forEach((e) => {
        const s = side++ % 2 ? 'right' : 'left';
        const fx = e.theme === 'night'
          ? Array.from({ length: 14 }, () => `<i class="star" style="left:${rand(4, 96).toFixed(1)}%;top:${rand(4, 96).toFixed(1)}%;--t:${rand(2, 4.5).toFixed(2)}s;--dl:${rand(0, 3).toFixed(2)}s"></i>`).join('')
          : e.theme === 'pheras'
            ? Array.from({ length: 12 }, () => `<i class="ember" style="left:${rand(18, 82).toFixed(1)}%;bottom:${rand(4, 30).toFixed(1)}%;--t:${rand(2.6, 4.8).toFixed(2)}s;--dl:${rand(0, 4).toFixed(2)}s;--dx:${rand(-30, 30).toFixed(0)}px"></i>`).join('')
            : '';
        const when = e.start ? `${e.start}${WEDDING.tzOffset}` : e.date;
        const live = e.start
          ? `<p class="event__live" role="timer" data-start="${startMs(e)}" data-end="${endMs(e)}"><span class="event__live-dot" aria-hidden="true"></span><span class="event__live-label">Begins in</span><span class="event__live-time"></span></p>`
          : '';
        html += `<article class="event event--${e.theme}${DARK.includes(e.theme) ? ' is-dark' : ''}" data-side="${s}">
          <span class="event__node" aria-hidden="true"></span>
          <div class="event__card" data-tilt>
            <span class="event__glare" aria-hidden="true"></span>${fx}
            <div class="event__art">${(ART[e.theme] || ART.wedding).call(ART)}</div>
            <p class="event__meta">${e.badge ? `<span class="event__badge">${esc(e.badge)}</span>` : ''}<time datetime="${when}">${esc(e.timeLabel)}</time></p>
            <h3 class="event__title">${esc(e.title)}</h3>
            <p class="event__desc">${esc(e.desc)}</p>
            ${live}
            <a class="event__cal" href="${esc(gcal(e))}" target="_blank" rel="noopener">${calIcon}Add to Google Calendar</a>
          </div>
        </article>`;
      });
    });
    list.innerHTML = html;
  })();

  /* ------------------------------------------------------------ countdown */
  const countdown = (() => {
    const nums = {};
    $$('.cd__num').forEach((n) => (nums[n.dataset.unit] = n));
    const last = {};
    const note = $('[data-bind="countdownNote"]');
    function set(unit, value) {
      const el = nums[unit];
      if (!el || last[unit] === value) return;
      const first = last[unit] === undefined;
      last[unit] = value;
      el.textContent = value;
      if (first || !motion) return;
      el.classList.remove('is-flip');
      void el.offsetWidth; // restart the flip animation
      el.classList.add('is-flip');
    }
    const pad = (v) => String(v).padStart(2, '0');
    const lives = $$('.event__live').map((el) => ({
      el, start: Number(el.dataset.start), end: Number(el.dataset.end),
      label: $('.event__live-label', el), time: $('.event__live-time', el), state: '',
    }));
    const span = (ms) => {
      let x = Math.floor(ms / 1000);
      const d = Math.floor(x / 86400); x -= d * 86400;
      const h = Math.floor(x / 3600); x -= h * 3600;
      const m = Math.floor(x / 60); const s = x - m * 60;
      return `${d ? `<b>${d}</b>d ` : ''}<b>${pad(h)}</b>h <b>${pad(m)}</b>m <b>${pad(s)}</b>s`;
    };
    function tickEvents(now) {
      for (const L of lives) {
        const state = now < L.start ? 'soon' : now < L.end ? 'now' : 'done';
        if (state !== L.state) {
          L.state = state;
          L.el.dataset.state = state;
          L.label.textContent = state === 'soon' ? 'Begins in' : state === 'now' ? 'Happening now' : 'Celebrated with love';
          if (state !== 'soon') L.time.innerHTML = '';
        }
        if (state === 'soon') L.time.innerHTML = span(L.start - now);
      }
    }
    function tick() {
      const now = Date.now();
      tickEvents(now);
      let diff = Math.max(0, mainDate.getTime() - now);
      const d = Math.floor(diff / 864e5); diff -= d * 864e5;
      const h = Math.floor(diff / 36e5); diff -= h * 36e5;
      const m = Math.floor(diff / 6e4); diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);
      set('days', String(d).padStart(2, '0'));
      set('hours', String(h).padStart(2, '0'));
      set('minutes', String(m).padStart(2, '0'));
      set('seconds', String(s).padStart(2, '0'));
      if (mainDate.getTime() <= now && note) note.textContent = 'and so our forever began — thank you for being part of it';
    }
    // tick just after each wall-clock second so digits never repeat or skip
    (function loop() { tick(); setTimeout(loop, 1000 - (Date.now() % 1000) + 20); })();
    return { tick };
  })();

  /* ------------------------------------------------- split text helpers */
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="w"><span class="wi">${w}</span></span>`).join(' ');
    return $$('.wi', el);
  }
  function splitChars(el) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(/\s+/).map((w) => `<span class="wd" aria-hidden="true">${Array.from(w).map((c) => `<span class="ch">${c}</span>`).join('')}</span>`).join(' ');
    return $$('.ch', el);
  }

  /* ---------------------------------------------------- inline Ganesha */
  const ganeshaPaths = $$('.ganesha path');

  /* ======================================================================
     Static fallback (reduced motion or libraries unavailable)
     ====================================================================== */
  if (!motion) {
    const env = $('.env');
    const toHero = () => $('#hero').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    env && env.addEventListener('click', toHero);
    env && env.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toHero(); } });
    $('.footer__replay')?.addEventListener('click', () => window.scrollTo(0, 0));
    return;
  }

  /* ======================================================================
     Motion build
     ====================================================================== */
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  // always start at the sealed envelope, even after a reload
  ScrollTrigger.clearScrollMemory('manual');

  /* ------------------------------------------------------- smooth scroll */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const easeInOutCubic = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
  let nativeTween = null;
  const scrollTo = (y, duration = 1.8, onComplete, easing = easeInOutCubic) => {
    if (lenis) { lenis.scrollTo(y, { duration, easing, onComplete }); return; }
    const top = typeof y === 'number' ? y : y.getBoundingClientRect().top + window.scrollY;
    const p = { y: window.scrollY };
    let last = p.y;
    nativeTween && nativeTween.kill();
    nativeTween = gsap.to(p, {
      y: Math.min(top, root.scrollHeight - innerHeight), duration, ease: easing,
      onUpdate() {
        if (Math.abs(window.scrollY - last) > 3) { this.kill(); return; } // the guest took over
        window.scrollTo(0, p.y); last = window.scrollY;
      },
      onComplete,
    });
  };
  // stop any programmatic scroll that is still running
  const haltScroll = () => {
    if (lenis && lenis.isScrolling === 'smooth') { lenis.stop(); lenis.start(); }
    nativeTween && nativeTween.kill();
  };
  window.scrollTo(0, 0);
  window.__invite = { get lenis() { return lenis; } };

  /* ======================================================================
     FX canvas — rose petal shower, gold sparkles, drifting dust
     ====================================================================== */
  const FX = (() => {
    const cvs = $('#fx');
    const ctx = cvs.getContext('2d');
    let W = 0, H = 0, DPR = 1;
    const petals = [], sparks = [], dust = [];
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, lx: 0, ly: 0, lt: 0, sx: 0, sy: 0 };
    const mobile = !finePointer || innerWidth < 700;
    let ambientMax = mobile ? 14 : 30;
    let scrollVel = 0, lastScroll = scrollY, acc = 0, time = 0;
    const tickers = [];

    function sprite(w, h, draw) {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      draw(c.getContext('2d'), w, h);
      return c;
    }
    function petal(c1, c2, c3, slim = 1) {
      return sprite(46, 52, (g, w, h) => {
        const cx = w / 2;
        g.beginPath();
        g.moveTo(cx, h * .97);
        g.bezierCurveTo(w * (.5 - .5 * slim), h * .78, w * (.5 - .54 * slim), h * .22, w * (.5 - .27 * slim), h * .07);
        g.quadraticCurveTo(w * .42, -h * .01, cx, h * .11);
        g.quadraticCurveTo(w * .58, -h * .01, w * (.5 + .27 * slim), h * .07);
        g.bezierCurveTo(w * (.5 + .54 * slim), h * .22, w * (.5 + .5 * slim), h * .78, cx, h * .97);
        g.closePath();
        const gr = g.createRadialGradient(cx * .82, h * .32, 1, cx, h * .46, h * .62);
        gr.addColorStop(0, c1); gr.addColorStop(.6, c2); gr.addColorStop(1, c3);
        g.fillStyle = gr; g.fill();
        g.globalCompositeOperation = 'source-atop';
        const hl = g.createLinearGradient(0, 0, w, 0);
        hl.addColorStop(0, 'rgba(255,255,255,0)'); hl.addColorStop(.34, 'rgba(255,255,255,.24)'); hl.addColorStop(.52, 'rgba(255,255,255,0)');
        g.fillStyle = hl; g.fillRect(0, 0, w, h);
        g.strokeStyle = 'rgba(90,0,20,.16)'; g.lineWidth = .9;
        g.beginPath(); g.moveTo(cx, h * .92); g.quadraticCurveTo(cx - 2, h * .5, cx + 1, h * .2); g.stroke();
      });
    }
    const PETALS = [
      [petal('#ff97ad', '#e0365e', '#a3102f'), 3],
      [petal('#ffd3dc', '#f27a98', '#d24670'), 3],
      [petal('#fff0f1', '#f9bcc7', '#ec8ca1'), 2],
      [petal('#d62a48', '#a0102a', '#6e0819'), 2.2],
      [petal('#ffe28f', '#f6a623', '#e07b0c', .72), 1.4],
      [petal('#ffffff', '#fbf0e7', '#e9d4c1', .8), .9],
    ];
    const totalW = PETALS.reduce((s, p) => s + p[1], 0);
    const pickPetal = () => { let r = Math.random() * totalW; for (const [s, w] of PETALS) { if ((r -= w) <= 0) return s; } return PETALS[0][0]; };
    const GLOW = sprite(48, 48, (g, w) => {
      const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      gr.addColorStop(0, 'rgba(255,252,235,1)'); gr.addColorStop(.25, 'rgba(255,214,130,.85)'); gr.addColorStop(.6, 'rgba(230,170,70,.25)'); gr.addColorStop(1, 'rgba(230,170,70,0)');
      g.fillStyle = gr; g.fillRect(0, 0, w, w);
    });
    const STAR = sprite(40, 40, (g, w) => {
      const c = w / 2;
      g.fillStyle = '#f7d27a';
      g.beginPath();
      g.moveTo(c, 0); g.quadraticCurveTo(c, c, w, c); g.quadraticCurveTo(c, c, c, w); g.quadraticCurveTo(c, c, 0, c); g.quadraticCurveTo(c, c, c, 0);
      g.fill();
    });

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cvs.width = Math.round(W * DPR); cvs.height = Math.round(H * DPR);
      cvs.style.width = W + 'px'; cvs.style.height = H + 'px';
      ambientMax = (!finePointer || W < 700) ? 14 : 30;
    }
    resize();
    addEventListener('resize', resize);

    function makePetal(x, y, o = {}) {
      const depth = rand(.45, 1);
      return Object.assign({
        x, y, vx: 0, vy: rand(20, 60),
        fall: rand(28, 52) + depth * 38,
        size: (rand(.38, .62) + depth * .38) * (mobile ? .85 : 1),
        rot: rand(0, Math.PI * 2), vr: rand(-1.4, 1.4),
        flip: rand(0, Math.PI * 2), vf: rand(1.4, 3.6),
        sway: rand(14, 42), swayF: rand(.5, 1.4), phase: rand(0, 6.28),
        depth, img: pickPetal(), alpha: rand(.8, 1), burst: false,
      }, o);
    }
    for (let i = 0; i < 22; i++) {
      dust.push({ x: rand(0, 1), y: rand(0, 1), r: rand(.6, 2.1), v: rand(5, 16), tw: rand(0, 6.28), tws: rand(.8, 2.2) });
    }

    function burst(n) {
      n = n || (mobile ? 64 : 115);
      for (let i = 0; i < n; i++) {
        if (i < n * .7) {
          petals.push(makePetal(rand(-40, W + 40), rand(-H * .55, -20), { vy: rand(180, 320), fall: rand(110, 170), burst: true }));
        } else {
          const a = rand(-Math.PI * .95, -Math.PI * .05), sp = rand(380, 820);
          petals.push(makePetal(W / 2 + rand(-60, 60), H * .5 + rand(-40, 40), { vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, burst: true }));
        }
      }
    }
    function sparkle(x, y, n = 30, power = 1) {
      for (let i = 0; i < n; i++) {
        const a = rand(0, Math.PI * 2), sp = rand(60, 320) * power;
        sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60 * power, g: 260, life: 0, max: rand(.6, 1.3), size: rand(.35, .9), rot: rand(0, 6), vr: rand(-6, 6) });
      }
    }
    function trail(x, y) {
      sparks.push({ x: x + rand(-4, 4), y: y + rand(-4, 4), vx: rand(-24, 24) + pointer.vx * .04, vy: rand(-20, 16) + pointer.vy * .04, g: 30, life: 0, max: rand(.45, .95), size: rand(.18, .42), rot: rand(0, 6), vr: rand(-4, 4) });
    }

    addEventListener('pointermove', (e) => {
      const now = performance.now();
      const dt = Math.max(8, now - pointer.lt) / 1000;
      const vx = (e.clientX - pointer.lx) / dt, vy = (e.clientY - pointer.ly) / dt;
      pointer.vx += (vx - pointer.vx) * .35; pointer.vy += (vy - pointer.vy) * .35;
      pointer.x = pointer.lx = e.clientX; pointer.y = pointer.ly = e.clientY; pointer.lt = now;
      if (e.pointerType === 'mouse') {
        const dx = e.clientX - pointer.sx, dy = e.clientY - pointer.sy;
        if (dx * dx + dy * dy > 120) { trail(e.clientX, e.clientY); pointer.sx = e.clientX; pointer.sy = e.clientY; }
      }
    }, { passive: true });
    addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') { pointer.x = e.clientX; pointer.y = e.clientY; pointer.vx = pointer.vy = 0; }
      sparkle(e.clientX, e.clientY, e.pointerType === 'mouse' ? 10 : 16, .45);
    }, { passive: true });
    addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') setTimeout(() => { pointer.x = pointer.y = -9999; }, 250); }, { passive: true });
    document.addEventListener('pointerleave', () => { pointer.x = pointer.y = -9999; });

    let last = performance.now();
    function frame(now) {
      const dt = Math.min(.05, (now - last) / 1000); last = now; time += dt;
      const sy = window.scrollY;
      const v = (sy - lastScroll) / Math.max(dt, .001); lastScroll = sy;
      scrollVel += (clamp(v, -4000, 4000) - scrollVel) * .18;
      for (const fn of tickers) fn(dt, time, scrollVel, pointer);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      // ambient spawning — steady-state count ≈ ambientMax
      let ambient = 0;
      for (const p of petals) if (!p.burst) ambient++;
      acc += dt * ambientMax / ((H + 80) / 62);
      while (acc > 1) { acc--; if (ambient < ambientMax) { petals.push(makePetal(rand(-30, W + 30), -40)); ambient++; } }

      // dust
      ctx.fillStyle = '#d7a64c';
      for (const d of dust) {
        d.y -= (d.v * dt) / H + scrollVel * .00003 * dt;
        if (d.y < -.02) d.y += 1.04; if (d.y > 1.03) d.y -= 1.04;
        d.tw += d.tws * dt;
        ctx.globalAlpha = .18 + .42 * (.5 + .5 * Math.sin(d.tw));
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        ctx.beginPath(); ctx.arc(d.x * W, d.y * H, d.r, 0, 6.283); ctx.fill();
      }

      // petals
      const R = 120;
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        const sway = Math.sin(time * p.swayF + p.phase) * p.sway;
        const k = Math.min(1, dt * (p.burst ? .9 : 1.6));
        p.vx += (sway + 6 - p.vx) * k;
        p.vy += (p.fall - p.vy) * k;
        const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1, f = 1 - d / R;
          p.vx += (dx / d) * f * 1400 * dt + pointer.vx * f * 3 * dt;
          p.vy += (dy / d) * f * 1400 * dt + pointer.vy * f * 3 * dt;
          p.vr += (Math.random() - .5) * f * 14 * dt;
          p.vf += f * 4 * dt;
        }
        p.vf += (2.4 - p.vf) * dt * .5;
        p.x += p.vx * dt;
        p.y += (p.vy - scrollVel * .22 * p.depth) * dt;
        p.rot += p.vr * dt; p.flip += p.vf * dt;
        if (p.y > H + 70 || p.x < -120 || p.x > W + 120 || (p.y < -H * 1.2 && !p.burst) || p.y < -H * 2) { petals.splice(i, 1); continue; }
        const sc = p.size, fy = Math.cos(p.flip), fx = .72 + .28 * Math.cos(p.flip * .63);
        const c = Math.cos(p.rot), s = Math.sin(p.rot);
        ctx.globalAlpha = p.alpha * (.75 + .25 * Math.abs(fy));
        ctx.setTransform(DPR * c * sc * fx, DPR * s * sc * fx, -DPR * s * sc * fy, DPR * c * sc * fy, DPR * p.x, DPR * p.y);
        ctx.drawImage(p.img, -23, -26);
      }

      // sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt;
        if (s.life >= s.max) { sparks.splice(i, 1); continue; }
        s.vx *= 1 - dt * 1.8; s.vy = s.vy * (1 - dt * 1.8) + s.g * dt;
        s.x += s.vx * dt; s.y += s.vy * dt; s.rot += s.vr * dt;
        const t = s.life / s.max, a = t < .15 ? t / .15 : 1 - (t - .15) / .85;
        const sz = s.size * (1 - t * .4);
        ctx.globalAlpha = a * .55;
        ctx.setTransform(DPR * sz, 0, 0, DPR * sz, DPR * s.x, DPR * s.y);
        ctx.drawImage(GLOW, -24, -24);
        const c = Math.cos(s.rot) * sz * .8, n = Math.sin(s.rot) * sz * .8;
        ctx.globalAlpha = a;
        ctx.setTransform(DPR * c, DPR * n, -DPR * n, DPR * c, DPR * s.x, DPR * s.y);
        ctx.drawImage(STAR, -20, -20);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    return { burst, sparkle, tickers, pointer, get scrollVel() { return scrollVel; } };
  })();

  /* ======================================================================
     Custom cursor, magnetic buttons, tilt cards (fine pointers)
     ====================================================================== */
  if (finePointer) {
    root.classList.add('has-cursor');
    const cur = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__label');
    const pos = { x: innerWidth / 2, y: innerHeight / 2 }, rp = { ...pos };
    const setDot = { x: gsap.quickSetter(dot, 'x', 'px'), y: gsap.quickSetter(dot, 'y', 'px') };
    const setRing = { x: gsap.quickSetter(ring, 'x', 'px'), y: gsap.quickSetter(ring, 'y', 'px') };
    gsap.set([dot, ring], { x: pos.x, y: pos.y });
    gsap.set(cur, { autoAlpha: 0 });
    let seen = false;
    addEventListener('pointermove', (e) => {
      pos.x = e.clientX; pos.y = e.clientY; setDot.x(pos.x); setDot.y(pos.y);
      if (!seen) { seen = true; rp.x = pos.x; rp.y = pos.y; gsap.to(cur, { autoAlpha: 1, duration: .4 }); }
    }, { passive: true });
    gsap.ticker.add(() => {
      rp.x += (pos.x - rp.x) * .18; rp.y += (pos.y - rp.y) * .18;
      setRing.x(rp.x); setRing.y(rp.y);
    });
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('a, button, [role="button"], [data-cursor]');
      cur.classList.toggle('is-hover', !!t);
      const l = t && t.dataset.cursor;
      cur.classList.toggle('has-label', !!l);
      if (l) label.textContent = l;
    });
    addEventListener('pointerdown', () => cur.classList.add('is-down'));
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    document.addEventListener('mouseleave', () => gsap.to(cur, { autoAlpha: 0, duration: .3 }));
    document.addEventListener('mouseenter', () => gsap.to(cur, { autoAlpha: 1, duration: .3 }));

    $$('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * .32);
        yTo((e.clientY - (r.top + r.height / 2)) * .42);
      });
      el.addEventListener('pointerleave', () => { gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, .4)' }); });
    });

    $$('[data-tilt]').forEach((el) => {
      const glare = $('.event__glare', el);
      const rx = gsap.quickTo(el, 'rotationX', { duration: .6, ease: 'power3' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: .6, ease: 'power3' });
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        rx((.5 - py) * 9); ry((px - .5) * 11);
        if (glare) { glare.style.setProperty('--gx', `${px * 100}%`); glare.style.setProperty('--gy', `${py * 100}%`); }
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  /* ======================================================================
     The opening — envelope → card → invitation (pinned, scroll-scrubbed)
     ====================================================================== */
  const opening = $('.opening'), intro = $('.intro'), env = $('.env'), card = $('.env__card'), flap = $('.env__flap'), glow = $('.env__glow');
  const envParts = $$('.env__back, .env__interior, .env__pocket, .env__flap, .env__glow');
  const heroLead = splitWords($('.hero__lead'));

  const H = () => env.offsetHeight;
  const cardW = () => env.offsetWidth * .86;
  const cardFull = () => cardW() / (1087 / 1447);
  const moveA = () => H() * .2;
  const moveB = () => H() * .46;
  const rise = () => -H() * .57;
  const envTop = () => { let el = env, y = 0; while (el && el !== intro) { y += el.offsetTop; el = el.offsetParent; } return y; };
  const centerY = () => {
    const h = H();
    const centreNow = envTop() + moveB() + .96 * h - cardFull() + rise() + cardFull() / 2;
    return rise() + (innerHeight / 2 - centreNow);
  };
  const fillScale = () => Math.min((innerHeight * .8) / cardFull(), (innerWidth * .88) / cardW());

  // hero entrance — plays once the card has flown away
  gsap.set(ganeshaPaths, { strokeDashoffset: 1, fillOpacity: 0 });
  const narrow = matchMedia('(max-width: 899px)').matches;
  // arch window, couple and lantern glows — on phones these sit below the fold,
  // so they get their own scroll trigger instead of joining the reveal
  const addArt = (t) => t
    .fromTo('.scene', { scale: 1.22 }, { scale: 1.06, duration: 2.6, ease: 'power2.out' }, 0)
    .fromTo('.arch__line path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', stagger: .25 }, .1)
    .fromTo('.arch__line circle', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: .6, ease: 'back.out(3)' }, 1.6)
    .fromTo('.couple', { x: 90, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.8 }, .8)
    .fromTo('.regards', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .9 }, 2.4)
    .fromTo('.glow', { autoAlpha: 0 }, { autoAlpha: 1, stagger: .12, duration: 1.2 }, 1.4);
  const heroIn = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
  if (!narrow) addArt(heroIn);
  heroIn
    .to(ganeshaPaths, { strokeDashoffset: 0, duration: 1.5, stagger: .05, ease: 'power1.inOut' }, .15)
    .to(ganeshaPaths, { fillOpacity: 1, duration: .7, stagger: .03 }, 1.1)
    .fromTo('.shloka', { clipPath: 'inset(0% 50% 0% 50%)', autoAlpha: 0 }, { clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1, duration: 1.1, ease: 'power2.inOut' }, .8)
    .fromTo(heroLead, { yPercent: 110 }, { yPercent: 0, duration: .9, stagger: .022 }, 1)
    .fromTo('.names__one', { clipPath: 'inset(-30% 100% -30% -12%)', x: -24 }, { clipPath: 'inset(-30% -12% -30% -12%)', x: 0, duration: 1.4, ease: 'power2.inOut' }, 1.35)
    .fromTo('.names__amp', { scale: 0, rotation: -140, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 1.1, ease: 'back.out(2.2)' }, 2.15)
    .fromTo('.names__two', { clipPath: 'inset(-30% 100% -30% -12%)', x: -24 }, { clipPath: 'inset(-30% -12% -30% -12%)', x: 0, duration: 1.4, ease: 'power2.inOut' }, 2.35)
    .fromTo('.hero__knot', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .9 }, 3)
    .fromTo('.datebox', { autoAlpha: 0, y: 26, scale: .92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, ease: 'back.out(1.7)' }, 3.2)
    .fromTo('.hero__bless', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .9 }, 3.5)
    .fromTo('.hero__rule', { scaleX: 0 }, { scaleX: 1, duration: .9 }, 3.7)
    .fromTo('.scroll-cue', { autoAlpha: 0 }, { autoAlpha: 1, duration: .8 }, 3.9);
  let heroPlayed = false;
  const playHero = () => { if (!heroPlayed) { heroPlayed = true; heroIn.play(); } };

  const T = { crack: 1.55, burst: 7.45, hero: 7.75, total: 10.2 };
  let lastP = 0;
  const introTL = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: opening,
      start: 'top top',
      end: () => '+=' + Math.round(innerHeight * (finePointer ? 2.9 : 2.5)),
      pin: true,
      scrub: .9,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const p = self.progress, tot = T.total;
        const crossed = (t) => lastP < t / tot && p >= t / tot;
        if (crossed(T.crack)) { const r = glow.getBoundingClientRect(); FX.sparkle(r.left + r.width / 2, r.top + r.height / 2, 46, 1); }
        if (crossed(T.burst)) FX.burst();
        if (p >= T.hero / tot) playHero();
        intro.style.pointerEvents = p > .82 ? 'none' : '';
        $('.rail').classList.toggle('is-on', p > .9);
        lastP = p;
      },
    },
  });
  introTL
    .to('.intro__cue', { autoAlpha: 0, y: 16, duration: .6 }, 0)
    .to('.env__sparkle', { autoAlpha: 0, duration: .35 }, 0)
    .to('.intro__title', { autoAlpha: 0, y: 46, duration: 1 }, .2)
    .fromTo(glow, { opacity: .6, scale: 1 }, { opacity: 1, scale: 1.4, duration: .8 }, .45)
    .to(glow, { opacity: 0, scale: 1.9, duration: .5 }, 1.25)
    .fromTo(flap, { rotationX: 0 }, { rotationX: 180, duration: 2.4, ease: 'power1.inOut' }, 1.2)
    .set(flap, { zIndex: 3 }, 2.4)
    .fromTo('.env__shade--front', { opacity: 0 }, { opacity: .55, duration: 1.2, ease: 'power1.in' }, 1.2)
    .fromTo('.env__shade--back', { opacity: .65 }, { opacity: 0, duration: 1.2, ease: 'power1.out' }, 2.4)
    .fromTo(env, { y: 0 }, { y: moveA, duration: 2.2, ease: 'power1.inOut' }, 1.4)
    .fromTo(card, { height: () => H() * .84 }, { height: cardFull, duration: 1.4, ease: 'power1.inOut' }, 3.3)
    .to(env, { y: moveB, duration: 2.6, ease: 'power1.inOut' }, 3.6)
    .fromTo(card, { y: 0 }, { y: rise, duration: 1.9, ease: 'power2.inOut' }, 4.35)
    .set(card, { zIndex: 9 }, 6.25)
    .to(envParts, { y: () => innerHeight * .9, opacity: 0, duration: 1.6, ease: 'power2.in' }, 6.25)
    .to(card, { y: centerY, scale: fillScale, boxShadow: '0 40px 90px rgba(60,0,10,.35)', duration: 1.6, ease: 'power2.inOut' }, 6.25)
    .to('.intro__bg', { opacity: 0, duration: 1.2 }, 7.75)
    .to(card, { scale: () => fillScale() * 2.1, opacity: 0, duration: 1.3, ease: 'power2.in' }, 7.75)
    .to({}, { duration: 1.15 }, 9.05);

  if (narrow) {
    addArt(gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: '.hero__art', start: 'top 82%', pinnedContainer: opening } }));
  }

  // tap / Enter on the envelope: the seal is pressed, a short pause, then the
  // opening plays in three stages — flap, card, reveal (~7s total).
  // Any wheel / touch / key from the guest hands control straight back.
  let autoplay = null;
  const openEnvelope = () => {
    const st = introTL.scrollTrigger;
    if (autoplay || window.scrollY >= st.end - 4) return;
    const run = (autoplay = { cancelled: false });
    // cancel only on real scroll intent — a stray tap (which also sparkles) must not strand the envelope
    const CANCEL = ['wheel', 'touchmove', 'keydown'];
    const unbind = () => CANCEL.forEach((t) => removeEventListener(t, stop));
    const finish = () => { unbind(); if (autoplay === run) autoplay = null; };
    function stop(e) {
      if (e && e.type === 'keydown' && (e.repeat || (e.target === env && (e.key === 'Enter' || e.key === ' ')))) return;
      run.cancelled = true;
      haltScroll();
      finish();
    }
    // listen from the next tick so the tap that started this doesn't cancel it
    setTimeout(() => CANCEL.forEach((t) => addEventListener(t, stop, { passive: true })), 0);

    const r = glow.getBoundingClientRect();
    FX.sparkle(r.left + r.width / 2, r.top + r.height / 2, 22, .6);
    gsap.timeline()
      .to(env, { scale: .965, duration: .22, ease: 'power2.out' })
      .to(env, { scale: 1, duration: 1.1, ease: 'elastic.out(1, .45)' });

    const yAt = (t) => st.start + (st.end - st.start) * (t / T.total);
    // skip any stage the guest has already scrolled past
    const stages = [[yAt(3.9), 2.2], [yAt(6.4), 1.9], [st.end + 2, 2.2]].filter(([y]) => y > window.scrollY + 4);
    let i = 0;
    const next = () => {
      if (run.cancelled) return;
      if (i >= stages.length) { finish(); return; }
      const [y, d] = stages[i++];
      scrollTo(y, d, () => setTimeout(next, i < stages.length ? 300 : 0), easeInOutSine);
    };
    setTimeout(next, 550);
  };
  env.addEventListener('click', openEnvelope);
  env.addEventListener('keydown', (e) => { if (e.repeat) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); } });

  // envelope tilts toward the mouse while it is still sealed
  if (finePointer) {
    const rx = gsap.quickTo(env, 'rotationX', { duration: .8, ease: 'power3' });
    const ry = gsap.quickTo(env, 'rotationY', { duration: .8, ease: 'power3' });
    gsap.set(env, { transformPerspective: 1100 });
    addEventListener('pointermove', (e) => {
      if (lastP > .02) { rx(0); ry(0); return; }
      rx(((e.clientY / innerHeight) - .5) * -10);
      ry(((e.clientX / innerWidth) - .5) * 14);
    }, { passive: true });
  }

  // invitation parallax: mouse depth + scroll drift
  if (finePointer) {
    const layers = [['.scene', -16], ['.couple', 22], ['.hero__copy', -6], ['.glow', -16]];
    const setters = layers.map(([s, a]) => [gsap.quickTo(s, 'x', { duration: 1.2, ease: 'power3' }), gsap.quickTo(s, 'y', { duration: 1.2, ease: 'power3' }), a]);
    addEventListener('pointermove', (e) => {
      if (!heroPlayed) return;
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      setters.forEach(([sx, sy, a]) => { sx(nx * a); sy(ny * a); });
    }, { passive: true });
  }
  gsap.to('.hero__art', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.save', start: 'top bottom', end: 'top top', scrub: true } });
  gsap.to('.hero__copy', { yPercent: 8, autoAlpha: .3, ease: 'none', scrollTrigger: { trigger: '.save', start: 'top bottom', end: 'top 10%', scrub: true } });

  /* ======================================================================
     Generic scroll reveals
     ====================================================================== */
  $$('.title.script').forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(-30% 100% -30% -10%)', y: 26 }, {
      clipPath: 'inset(-30% -10% -30% -10%)', y: 0, duration: 1.7, ease: 'power2.inOut',
      scrollTrigger: { trigger: el, start: 'top 86%' },
    });
  });
  $$('[data-chars]').forEach((el) => {
    const chars = splitChars(el);
    gsap.fromTo(chars, { autoAlpha: 0, y: 10, filter: 'blur(5px)' }, {
      autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: .9, stagger: .035, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
  $$('[data-reveal]').forEach((el) => {
    gsap.fromTo(el, { autoAlpha: 0, y: 40 }, {
      autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
  $$('.wash').forEach((w) => {
    if (w.closest('.intro')) return;
    gsap.fromTo(w, { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: w.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------------------------------------------------- save the date */
  gsap.fromTo('.cd', { autoAlpha: 0, y: 40, rotationX: -50 }, {
    autoAlpha: 1, y: 0, rotationX: 0, duration: 1.1, stagger: .12, ease: 'back.out(1.5)',
    scrollTrigger: { trigger: '.countdown', start: 'top 90%' },
  });
  gsap.fromTo('.save__date', { scale: .86 }, { scale: 1, duration: 1.6, ease: 'elastic.out(1, .6)', scrollTrigger: { trigger: '.save__card', start: 'top 85%' } });

  /* ------------------------------------------------------- events */
  const tl = $('.tl');
  gsap.timeline({ scrollTrigger: { trigger: tl, start: 'top 62%', end: 'bottom 62%', scrub: .6 } })
    .fromTo('.tl__fill', { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0)
    .fromTo('.tl__diya', { top: '0%' }, { top: '100%', ease: 'none' }, 0);
  $$('.tl__day').forEach((d) => {
    gsap.fromTo(d, { autoAlpha: 0, scale: .8, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: .9, ease: 'back.out(2)', scrollTrigger: { trigger: d, start: 'top 85%' } });
  });
  $$('.event').forEach((ev) => {
    const cardEl = $('.event__card', ev);
    const left = ev.dataset.side === 'left' && !narrow;
    gsap.fromTo(cardEl, { autoAlpha: 0, x: narrow ? 50 : (left ? -90 : 90), rotationY: narrow ? -8 : (left ? 14 : -14), transformPerspective: 900 }, {
      autoAlpha: 1, x: 0, rotationY: 0, duration: 1.3, ease: 'power3.out',
      scrollTrigger: { trigger: ev, start: 'top 82%' },
    });
    const strokes = $$('.event__art .d', ev);
    gsap.fromTo(strokes, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, stagger: .06, ease: 'power1.inOut', scrollTrigger: { trigger: ev, start: 'top 78%' } });
    gsap.fromTo($$('.event__art .f', ev), { autoAlpha: 0, scale: .4, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .8, stagger: .05, ease: 'back.out(2)', scrollTrigger: { trigger: ev, start: 'top 70%' } });
    ScrollTrigger.create({
      trigger: ev, start: 'top 62%',
      onEnter: () => { ev.classList.add('is-lit'); const n = $('.event__node', ev).getBoundingClientRect(); FX.sparkle(n.left + n.width / 2, n.top + n.height / 2, 14, .5); },
      onLeaveBack: () => ev.classList.remove('is-lit'),
    });
  });

  /* ----------------------------------------------- presence + toran */
  gsap.fromTo('.presence__bg img', { yPercent: -8, scale: 1.12 }, { yPercent: 8, scale: 1, ease: 'none', scrollTrigger: { trigger: '.presence', start: 'top bottom', end: 'bottom top', scrub: true } });

  (function toran() {
    const host = $('.toran');
    if (!host) return;
    const strands = [];
    function build() {
      $$('.strand', host).forEach((s) => s.remove());
      strands.length = 0;
      const w = host.clientWidth;
      const n = Math.max(5, Math.round(w / (w < 700 ? 58 : 74)));
      const b = w < 700 ? 13 : 16;
      for (let i = 0; i < n; i++) {
        const t = n === 1 ? .5 : i / (n - 1);
        const len = Math.round(6 + 5 * (.5 + .5 * Math.cos(t * Math.PI * 4)));
        const s = document.createElement('div');
        s.className = 'strand';
        s.style.left = `${((i + .5) / n) * 100}%`;
        s.style.setProperty('--b', `${b}px`);
        let beads = '';
        for (let k = 0; k < len; k++) {
          const cls = k % 4 === 3 ? 'bead--r' : k % 2 ? 'bead--y' : '';
          beads += `<span class="bead ${cls}"></span>`;
          if (k === 1 || k === len - 3) beads += '<span class="bead bead--l"></span>';
        }
        s.innerHTML = `<div class="strand__inner">${beads}<span class="bell"></span></div>`;
        s.style.marginLeft = `${-b / 2}px`;
        host.appendChild(s);
        strands.push({ el: s, x: ((i + .5) / n) * w, len: len * (b - 3) + b, a: 0, v: 0, k: rand(14, 20), dir: rand(.7, 1.3) * (i % 2 ? 1 : -1) * .35 + 1 });
      }
    }
    build();
    let rw = host.clientWidth;
    addEventListener('resize', () => { if (Math.abs(host.clientWidth - rw) > 40) { rw = host.clientWidth; build(); } });

    let active = false;
    ScrollTrigger.create({ trigger: '.presence', start: 'top bottom', end: 'bottom top', onToggle: (self) => (active = self.isActive) });
    ScrollTrigger.create({
      trigger: '.presence', start: 'top 75%', once: true,
      onEnter: () => gsap.fromTo($$('.strand__inner', host), { scaleY: 0 }, { scaleY: 1, duration: 1.4, stagger: { each: .04, from: 'center' }, ease: 'elastic.out(1, .5)' }),
    });
    gsap.set($$('.strand__inner', host), { scaleY: 0 });

    FX.tickers.push((dt, time, sv, ptr) => {
      if (!active) return;
      const hr = host.getBoundingClientRect();
      const target0 = clamp(sv * .00014, -.32, .32);
      for (let i = 0; i < strands.length; i++) {
        const s = strands[i];
        const target = target0 * s.dir + Math.sin(time * 1.25 + i * .7) * .035;
        let f = -s.k * (s.a - target) - 2.4 * s.v;
        const dx = ptr.x - (hr.left + s.x), dy = ptr.y - hr.top;
        if (Math.abs(dx) < 28 && dy > 0 && dy < s.len + 20) f += ptr.vx * .0045 * (1 - Math.abs(dx) / 28);
        s.v += f * dt; s.a += s.v * dt;
        s.a = clamp(s.a, -.7, .7);
        s.el.style.transform = `rotate(${s.a.toFixed(4)}rad)`;
      }
    });
  })();

  /* ------------------------------------------------------- families */
  $$('.family').forEach((f) => {
    const fromLeft = f.dataset.from === 'left';
    gsap.fromTo(f, { autoAlpha: 0, x: narrow ? 0 : (fromLeft ? -110 : 110), y: narrow ? 50 : 0, rotationY: narrow ? 0 : (fromLeft ? 22 : -22), transformPerspective: 1000 }, {
      autoAlpha: 1, x: 0, y: 0, rotationY: 0, duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: f, start: 'top 85%' },
    });
  });
  gsap.fromTo('.families__amp', { scale: 0, rotation: -200 }, { scale: 1, rotation: 0, duration: 1.3, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.families__grid', start: 'top 75%' } });
  gsap.fromTo('.families .rule', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '.families .rule', start: 'top 90%' } });

  /* ---------------------------------------------------------- venue */
  gsap.fromTo('.map', { clipPath: 'inset(12% 12% 12% 12% round 30px)' }, { clipPath: 'inset(0% 0% 0% 0% round 30px)', duration: 1.6, ease: 'power3.inOut', scrollTrigger: { trigger: '.map', start: 'top 85%' } });
  gsap.fromTo('.map__inner', { scale: 1.3 }, { scale: 1, duration: 2.2, ease: 'power3.out', scrollTrigger: { trigger: '.map', start: 'top 85%' } });
  gsap.fromTo('.venue__actions .btn', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.venue__actions', start: 'top 95%' } });

  /* ---------------------------------------------------------- footer */
  gsap.fromTo('.footer__mandala', { scale: .5, autoAlpha: 0, rotation: -60 }, { scale: 1, autoAlpha: 1, rotation: 0, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: '.footer', start: 'top 80%' } });
  gsap.fromTo('.footer__names', { clipPath: 'inset(-30% 100% -30% -10%)' }, { clipPath: 'inset(-30% -10% -30% -10%)', duration: 1.8, ease: 'power2.inOut', scrollTrigger: { trigger: '.footer', start: 'top 75%' } });
  gsap.fromTo('.footer__ganesha', { scale: .6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.4, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.footer', start: 'top 65%' } });
  ScrollTrigger.create({
    trigger: '.footer', start: 'top 55%', once: true,
    onEnter: () => { const r = $('.footer__ganesha').getBoundingClientRect(); FX.sparkle(r.left + r.width / 2, r.top + r.height / 2, 60, 1.2); FX.burst(finePointer ? 60 : 36); },
  });
  $('.footer__replay').addEventListener('click', () => scrollTo(0, 3.2));

  /* -------------------------------------------- rail, progress, anchors */
  const bar = $('.progress span');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => { bar.style.transform = `scaleX(${self.progress.toFixed(4)})`; } });

  const railLinks = $$('.rail a');
  const sections = ['#hero', '#save-the-date', '#events', '#families', '#venue'].map((s) => $(s));
  sections.forEach((sec, i) => {
    if (!sec) return;
    ScrollTrigger.create({
      trigger: i === 0 ? opening : sec,
      start: i === 0 ? () => introTL.scrollTrigger.end - innerHeight * .5 : 'top 55%',
      end: i === 0 ? () => introTL.scrollTrigger.end + innerHeight * .5 : 'bottom 55%',
      onToggle: (self) => self.isActive && railLinks.forEach((a, k) => a.classList.toggle('is-active', k === i)),
    });
  });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id === '#invitation' || a.dataset.goto === 'hero' ? introTL.scrollTrigger.end + 2 : $(id);
    if (target == null) return;
    e.preventDefault();
    scrollTo(target, 2);
  });

  // fonts change text metrics; re-measure once they are in
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  // start at the sealed envelope — unless the guest is already scrolling
  let touched = false;
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => addEventListener(t, () => (touched = true), { once: true, passive: true }));
  addEventListener('load', () => {
    if (!touched && window.scrollY > 0) { window.scrollTo(0, 0); lenis && lenis.scrollTo(0, { immediate: true }); }
    ScrollTrigger.refresh();
  });
})();
