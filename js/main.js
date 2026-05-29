/* ==========================================================================
   Sudip Adhikari — main.js v5
   Web3Forms contact · Dark/Light · Typewriter · Counters · Gallery · Nav
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Theme (Dark / Light) ──────────────────────────────────────────── */
  const html      = document.documentElement;
  const THEME_KEY = 'sa_theme';

  const applyTheme = t => {
    html.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
    /* Desktop icon */
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    /* Drawer pill — mark active option */
    document.querySelectorAll('.pill-option').forEach(el => {
      el.classList.toggle('active', el.dataset.mode === t);
    });
  };

  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved ?? (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'));

  /* Desktop toggle */
  document.getElementById('themeToggle')?.addEventListener('click', () =>
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
  );
  /* Drawer pill toggle */
  document.getElementById('drawerThemeToggle')?.addEventListener('click', () =>
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
  );

  /* ── Scroll: progress + navbar hide + back-to-top ─────────────────── */
  const bar    = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const btt    = document.getElementById('backToTop');
  let   lastY  = 0;

  const onScroll = () => {
    const y   = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (navbar) navbar.classList.toggle('nav-hide', y > lastY && y > 100);
    lastY = y;
    btt?.classList.toggle('visible', y > 320);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── Mobile Drawer ─────────────────────────────────────────────────── */
  const burger   = document.getElementById('hamburger');
  const drawer   = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('menuBackdrop');
  const dClose   = document.getElementById('drawerClose');

  const closeDrawer = () => {
    burger?.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
    drawer?.classList.remove('open');
    backdrop?.classList.remove('show');
    document.body.style.overflow = '';
  };
  const openDrawer = () => {
    burger?.classList.add('open');
    burger?.setAttribute('aria-expanded', 'true');
    drawer?.classList.add('open');
    backdrop?.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  burger?.addEventListener('click', e => {
    e.stopPropagation();
    drawer?.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  dClose?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => e.key === 'Escape' && closeDrawer());

  /* ── Hero Roles Typewriter ─────────────────────────────────────────── */
  const rolesEl = document.getElementById('heroRoles');
  if (rolesEl) {
    const roles = [
      'Electrical Engineering Student',
      'Transmission & Distribution',
      'Renewable Energy Enthusiast',
      'Power Systems Researcher',
    ];
    const cursor = Object.assign(document.createElement('span'), { className: 'cursor-blink' });
    const text   = document.createTextNode('');
    rolesEl.append(text, cursor);

    let ri = 0, ci = 0, del = false;
    const tick = () => {
      const w = roles[ri];
      if (!del) {
        text.textContent = w.slice(0, ++ci);
        if (ci === w.length) { del = true; return setTimeout(tick, 1800); }
        setTimeout(tick, 65);
      } else {
        text.textContent = w.slice(0, --ci);
        if (ci === 0) { del = false; ri = (ri + 1) % roles.length; return setTimeout(tick, 350); }
        setTimeout(tick, 32);
      }
    };
    setTimeout(tick, 700);
  }

  /* ── About Typewriter ──────────────────────────────────────────────── */
  const tw = document.querySelector('.typewriter[data-text]');
  if (tw) {
    const full = tw.dataset.text;
    tw.textContent = '';
    let ti = 0;
    const type = () => { if (ti < full.length) { tw.textContent += full[ti++]; setTimeout(type, 95); } };
    const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) { setTimeout(type, 300); obs.disconnect(); } }, { threshold: .5 });
    obs.observe(tw);
  }

  /* ── Scroll-reveal ─────────────────────────────────────────────────── */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); revObs.unobserve(e.target); } });
  }, { threshold: .1, rootMargin: '0px 0px -36px 0px' });
  document.querySelectorAll('.animate').forEach(el => revObs.observe(el));

  /* ── Stat Counters ─────────────────────────────────────────────────── */
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = +el.dataset.target;
      let   cur = 0;
      const step = Math.max(Math.round(1200 / end), 38);
      const t = setInterval(() => { el.textContent = ++cur; if (cur >= end) clearInterval(t); }, step);
      cntObs.unobserve(el);
    });
  }, { threshold: .6 });
  document.querySelectorAll('.stat-num[data-target]').forEach(el => cntObs.observe(el));

  /* ── Horizontal Gallery Scroll ─────────────────────────────────────── */
  document.querySelectorAll('.gallery-category').forEach(cat => {
    const track   = cat.querySelector('.gallery-scroll-track');
    const prevBtn = cat.querySelector('.gscroll-prev');
    const nextBtn = cat.querySelector('.gscroll-next');
    if (!track) return;

    const AMT = 300;

    const upd = () => {
      if (prevBtn) prevBtn.disabled = track.scrollLeft <= 2;
      if (nextBtn) nextBtn.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };

    prevBtn?.addEventListener('click', () => { track.scrollBy({ left: -AMT, behavior: 'smooth' }); setTimeout(upd, 380); });
    nextBtn?.addEventListener('click', () => { track.scrollBy({ left:  AMT, behavior: 'smooth' }); setTimeout(upd, 380); });
    track.addEventListener('scroll', upd, { passive: true });

    /* mouse drag */
    let sx = 0, ss = 0, drag = false;
    track.addEventListener('mousedown',  e => { drag = true; sx = e.pageX; ss = track.scrollLeft; track.style.cursor = 'grabbing'; });
    window.addEventListener('mousemove', e => { if (!drag) return; track.scrollLeft = ss - (e.pageX - sx); });
    window.addEventListener('mouseup',   () => { if (!drag) return; drag = false; track.style.cursor = ''; upd(); });

    /* touch drag */
    let tx = 0, ts = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].pageX; ts = track.scrollLeft; }, { passive: true });
    track.addEventListener('touchmove',  e => { track.scrollLeft = ts - (e.touches[0].pageX - tx); }, { passive: true });
    track.addEventListener('touchend',   upd, { passive: true });

    upd();
  });

  /* ── Lightbox ──────────────────────────────────────────────────────── */
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightboxImg');
  const lbCap   = document.getElementById('lightboxCaption');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev  = document.getElementById('lightboxPrev');
  const lbNext  = document.getElementById('lightboxNext');

  if (lb) {
    const items = Array.from(document.querySelectorAll('.gallery-item'));
    let cur = 0;

    const openLB = idx => {
      cur = ((idx % items.length) + items.length) % items.length;
      const img = items[cur].querySelector('img');
      lbImg.src = img.src; lbImg.alt = img.alt;
      lbCap.textContent = items[cur].dataset.caption || '';
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    const closeLB = () => { lb.classList.remove('active'); document.body.style.overflow = ''; lbImg.src = ''; };

    items.forEach((item, i) => item.addEventListener('click', () => openLB(i)));

    /* Fullscreen button — tries native, falls back to lightbox */
    document.querySelectorAll('.fs-btn').forEach((btn, i) => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const img = items[i].querySelector('img');
        if (img?.requestFullscreen) img.requestFullscreen().catch(() => openLB(i));
        else openLB(i);
      });
    });

    lbClose?.addEventListener('click', closeLB);
    lbPrev?.addEventListener('click',  () => openLB(cur - 1));
    lbNext?.addEventListener('click',  () => openLB(cur + 1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape')     closeLB();
      if (e.key === 'ArrowLeft')  openLB(cur - 1);
      if (e.key === 'ArrowRight') openLB(cur + 1);
    });
  }

  /* ── Contact Form (Web3Forms — direct to Gmail) ────────────────────── */
  const form    = document.getElementById('contactForm');
  const sendBtn = document.getElementById('formSubmit');
  const fb      = document.getElementById('form-feedback');
  const btnTxt  = sendBtn?.querySelector('.btn-text');
  const btnLoad = sendBtn?.querySelector('.btn-loading');

  if (form) {
    const setLoading = on => {
      if (!sendBtn) return;
      sendBtn.disabled       = on;
      if (btnTxt)  btnTxt.style.display  = on ? 'none' : '';
      if (btnLoad) btnLoad.style.display = on ? ''     : 'none';
    };

    const showFb = (msg, type) => {
      if (!fb) return;
      fb.innerHTML       = msg;
      fb.className       = 'form-feedback ' + type;
      fb.style.display   = 'block';
      if (type === 'success') {
        setTimeout(() => { fb.style.display = 'none'; }, 8000);
      }
    };

    /* Validate only required fields (email is optional) */
    const validate = () => {
      let ok = true;
      form.querySelectorAll('[required]').forEach(f => {
        const err = f.nextElementSibling;
        f.classList.remove('error');
        if (err && err.classList.contains('form-err')) err.textContent = '';
        if (!f.value.trim()) {
          f.classList.add('error');
          if (err && err.classList.contains('form-err')) err.textContent = 'This field is required.';
          ok = false;
        }
      });
      /* Optional email — only validate format if provided */
      const emailEl = form.querySelector('#cf-email');
      if (emailEl && emailEl.value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
          emailEl.classList.add('error');
          const err = emailEl.nextElementSibling;
          if (err && err.classList.contains('form-err')) err.textContent = 'Please enter a valid email.';
          ok = false;
        }
      }
      return ok;
    };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validate()) return;

      const accessKey = form.querySelector('[name="access_key"]')?.value;
      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_KEY') {
        /* Key not set — fall back to mailto so form always works */
        const name    = form.querySelector('#cf-name')?.value.trim()    || 'Visitor';
        const email   = form.querySelector('#cf-email')?.value.trim()   || '';
        const subject = form.querySelector('#cf-subject')?.value.trim() || 'Portfolio Inquiry';
        const message = form.querySelector('#cf-message')?.value.trim() || '';
        const bodyStr = `Name: ${name}${email ? '\nEmail: ' + email : ''}\n\n${message}`;
        window.location.href = `mailto:sudipadh0410@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyStr)}`;
        showFb('📧 Your email app has opened with the message pre-filled — just hit Send!', 'success');
        form.reset();
        return;
      }

      setLoading(true);
      try {
        const data = new FormData(form);
        /* Merge subject fields so Web3Forms gets the right subject line */
        const subjectLine = form.querySelector('#cf-subject')?.value.trim() || 'Portfolio Inquiry';
        data.set('subject', `Portfolio Message: ${subjectLine}`);

        const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
        const json = await res.json();

        if (json.success) {
          showFb('✅ Message sent! I\'ll get back to you soon.', 'success');
          form.reset();
        } else {
          throw new Error(json.message || 'Submission failed');
        }
      } catch (err) {
        console.error('Web3Forms error:', err);
        showFb('❌ Could not send. Please email me directly at <a href="mailto:sudipadh0410@gmail.com">sudipadh0410@gmail.com</a>', 'error');
      } finally {
        setLoading(false);
      }
    });

    /* Clear field errors on input */
    form.querySelectorAll('input, textarea').forEach(f => {
      f.addEventListener('input', () => {
        f.classList.remove('error');
        const err = f.nextElementSibling;
        if (err && err.classList.contains('form-err')) err.textContent = '';
      });
    });
  }

}); // end DOMContentLoaded
