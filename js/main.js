/* ============================================
   SIGN HERE SIGNS & PRINTING - MAIN JS
   ============================================ */

// ---- Security: Content Security basics ----

'use strict';

// ===========================
// SECURITY MEASURES
// ===========================
(function() {
  // Prevent clickjacking
  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }

  // Disable right-click context menu on entire page
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Also disable on sensitive areas (keep for extra coverage)
  document.querySelectorAll('.no-select').forEach(el => {
    el.addEventListener('contextmenu', e => e.preventDefault());
  });

  // XSS protection: sanitize any dynamic content
  window.sanitize = function(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // Referrer policy
  const meta = document.createElement('meta');
  meta.name = 'referrer';
  meta.content = 'strict-origin-when-cross-origin';
  document.head.appendChild(meta);
})();


(function() {
  'use strict';

  // ---- Navbar shrink on scroll ----
  const navbar = document.getElementById('navbar');
  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('shrunk');
    } else {
      navbar.classList.remove('shrunk');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---- Mobile hamburger menu ----
  const hamburger = document.querySelector('.nav-hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      // Keep navbar above the fullscreen overlay
      navbar.style.zIndex = isOpen ? '1001' : '1000';
    });

    // Close menu when any link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navbar.style.zIndex = '1000';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navbar.style.zIndex = '1000';
      }
    });
  }

  // ---- Active nav link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ---- Scroll reveal animations ----
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // ---- Parallax on scroll (subtle) ----
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  // ---- Testimonials slider ----
  const testimonials = [
    {
      name: 'Darnell Millman',
      initials: 'DM',
      text: 'I highly recommend this business. They do quality work, they are fast and worth every dollar. They\'ve printed off numerous projects for me and they\'ve all turned out amazing.',
      stars: 5
    },
    {
      name: 'Raelene Stewart',
      initials: 'RS',
      text: 'Made a promise to get some work done and went above and beyond what was required to get the job done. Highly recommend.',
      stars: 5
    },
    {
      name: 'Lee Harding',
      initials: 'LH',
      text: 'They do great work but you should stop in just to see the fantastic old photos and signs all over the walls of the interior. It\'s like a bonus heritage site!',
      stars: 5
    },
    {
      name: 'Matthew C',
      initials: 'MC',
      text: 'The speed in which they completed was great. Comparing other competitors pricing and quality were the best. I will be going back for all my business and personal needs.',
      stars: 5
    },
    {
      name: 'Nathan H',
      initials: 'NH',
      text: 'Very friendly customer service! Excellent work! Good people to do business with!',
      stars: 5
    },
    {
      name: 'Connie Farrow',
      initials: 'CF',
      text: 'Amazing service. Friendly fast and will help you get what you need!',
      stars: 5
    }
  ];

  function initTestimonials() {
    const track = document.querySelector('.testimonials-track');
    const dotsContainer = document.querySelector('.testimonials-dots');
    const prevBtn = document.querySelector('.testimonials-prev');
    const nextBtn = document.querySelector('.testimonials-next');

    if (!track) return;

    let currentPage = 0;
    const perPage = 3;
    const totalPages = Math.ceil(testimonials.length / perPage);

    function renderStars(n) {
      return Array(n).fill('★').join('') + Array(5 - n).fill('☆').join('');
    }

    function renderPage(page) {
      const start = page * perPage;
      const items = testimonials.slice(start, start + perPage);

      track.style.opacity = '0';
      track.style.transform = 'translateY(10px)';

      setTimeout(() => {
        track.innerHTML = items.map(t => `
          <div class="testimonial-card">
            <div class="testimonials-stars">${renderStars(t.stars)}</div>
            <div class="testimonial-quote">&ldquo;</div>
            <p>${escapeHtml(t.text)}</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">${escapeHtml(t.initials)}</div>
              <div class="testimonial-author-info">
                <strong>${escapeHtml(t.name)}</strong>
                <span>Verified Customer</span>
              </div>
            </div>
          </div>
        `).join('');

        track.style.opacity = '1';
        track.style.transform = 'translateY(0)';

        // Update dots
        if (dotsContainer) {
          dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === page);
          });
        }
      }, 200);

      track.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }

    // Create dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
          currentPage = i;
          renderPage(currentPage);
        });
        dotsContainer.appendChild(dot);
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentPage = (currentPage - 1 + totalPages) % totalPages;
        renderPage(currentPage);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentPage = (currentPage + 1) % totalPages;
        renderPage(currentPage);
      });
    }

    renderPage(0);
  }

  // ---- XSS protection helper ----
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ---- Work gallery filter ----
  function initWorkFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        workItems.forEach(item => {
          const cat = item.dataset.category;
          if (filter === 'all' || cat === filter) {
            item.style.display = '';
            setTimeout(() => item.style.opacity = '1', 10);
          } else {
            item.style.opacity = '0';
            setTimeout(() => item.style.display = 'none', 300);
          }
        });
      });
    });
  }

  // ---- Contact form with Formspree ----
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // ── Helpers ──────────────────────────────────────────────────
    const sanitize = str => (str || '').replace(/[<>]/g, '').trim();
    const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const WEB3_KEY  = '4f3b62e6-11de-46ae-a956-33d848eb80ee'; // ← Go to https://web3forms.com/ → enter addesign.creatives@gmail.com → click "Create Access Key" → check Gmail inbox → paste key here

    function getEl(id) { return document.getElementById(id); }

    function setError(inputId, msg) {
      const input = getEl(inputId);
      const errEl = getEl(inputId + '-error');
      if (!input) return;
      input.setAttribute('aria-invalid', 'true');
      input.classList.add('input-error');
      if (errEl) errEl.textContent = msg;
    }

    function clearError(inputId) {
      const input = getEl(inputId);
      const errEl = getEl(inputId + '-error');
      if (!input) return;
      input.setAttribute('aria-invalid', 'false');
      input.classList.remove('input-error');
      if (errEl) errEl.textContent = '';
    }

    function showBanner(type, msg) {
      const el = getEl('form-message');
      if (!el) return;
      el.className = 'form-message ' + type;
      el.textContent = msg;
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function clearBanner() {
      const el = getEl('form-message');
      if (el) { el.className = 'form-message'; el.textContent = ''; }
    }

    // ── Character counter on textarea ────────────────────────────
    const msgArea  = getEl('message');
    const charCount = getEl('char-count');
    if (msgArea && charCount) {
      msgArea.addEventListener('input', function () {
        charCount.textContent = this.value.length;
      });
    }

    // ── Inline validation on blur (real-time feedback) ───────────
    ['name', 'email', 'message'].forEach(function (id) {
      const el = getEl(id);
      if (!el) return;
      el.addEventListener('blur', function () {
        const val = sanitize(this.value);
        if (id === 'name'    && !val)              setError(id, 'Please enter your full name.');
        else if (id === 'email' && !val)           setError(id, 'Please enter your email address.');
        else if (id === 'email' && !EMAIL_RE.test(val)) setError(id, 'Please enter a valid email address (e.g. you@example.com).');
        else if (id === 'message' && !val)         setError(id, 'Please enter a message.');
        else                                       clearError(id);
      });
      // Clear error as soon as user starts correcting
      el.addEventListener('input', function () {
        if (this.getAttribute('aria-invalid') === 'true') clearError(id);
      });
    });

    // ── Submit ───────────────────────────────────────────────────
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      clearBanner();

      const name    = sanitize(getEl('name')?.value);
      const email   = sanitize(getEl('email')?.value);
      const phone   = sanitize(getEl('phone')?.value);
      const subject = sanitize(getEl('subject')?.value);
      const message = sanitize(getEl('message')?.value);

      // Validate all required fields, collect errors
      let firstInvalid = null;
      ['name', 'email', 'message'].forEach(id => clearError(id));

      if (!name)                     { setError('name',    'Please enter your full name.');                              firstInvalid = firstInvalid || 'name'; }
      if (!email)                    { setError('email',   'Please enter your email address.');                          firstInvalid = firstInvalid || 'email'; }
      else if (!EMAIL_RE.test(email)){ setError('email',   'Please enter a valid email address (e.g. you@example.com).'); firstInvalid = firstInvalid || 'email'; }
      if (!message)                  { setError('message', 'Please enter your message.');                                firstInvalid = firstInvalid || 'message'; }

      if (firstInvalid) {
        // Move focus to first invalid field so keyboard/SR users land there
        getEl(firstInvalid)?.focus();
        showBanner('error', 'Please correct the highlighted fields before submitting.');
        return;
      }

      // Key not configured — open mailto fallback
      if (WEB3_KEY === '4f3b62e6-11de-46ae-a956-33d848eb80ee') {
        const body = ['Name: '+name,'Email: '+email,'Phone: '+(phone||'N/A'),'Service: '+(subject||'N/A'),'','Message:',message].join('\n');
        window.location.href = 'mailto:addesign.creatives@gmail.com'
          + '?subject=' + encodeURIComponent('Website Enquiry: '+(subject||'General'))
          + '&body='    + encodeURIComponent(body);
        showBanner('error', 'Form not fully configured — your email app has been opened with the message pre-filled.');
        return;
      }

      const submitBtn = getEl('submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-label').textContent = 'Sending…';
      }

      try {
        const resp   = await fetch('https://api.web3forms.com/submit', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key:   WEB3_KEY,
            subject:      'New Enquiry — Sign Here Signs' + (subject ? ': ' + subject : ''),
            from_name:    name,
            email,
            phone:        phone  || 'Not provided',
            service:      subject || 'Not specified',
            message,
            botcheck:     ''
          })
        });
        const result = await resp.json();

        if (result.success) {
          showBanner('success', '✅ Thank you, ' + name + '! Your message has been sent. We\'ll get back to you soon.');
          form.reset();
          if (charCount) charCount.textContent = '0';
          ['name','email','message'].forEach(id => clearError(id));
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        showBanner('error', '❌ Could not send your message. Please email us at addesign.creatives@gmail.com or call 306-773-8850.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-label').textContent = 'Send Message';
        }
      }
    });
  }

  // ---- Animated counter ----
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          let count = 0;
          const duration = 1800;
          const step = target / (duration / 16);

          const timer = setInterval(() => {
            count = Math.min(count + step, target);
            el.textContent = Math.floor(count) + suffix;
            if (count >= target) clearInterval(timer);
          }, 16);

          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // ---- Init all ----
  document.addEventListener('DOMContentLoaded', () => {
    initTestimonials();
    initWorkFilter();
    initContactForm();
    animateCounters();
  });

  // Also run reveal check after DOM
  document.addEventListener('DOMContentLoaded', () => {
    revealEls.forEach(el => observer.observe(el));
  });

})();

// ===========================
// HERO MARQUEE — FILL-AND-LOOP (seamless, viewport-aware)
// ===========================
(function () {
  'use strict';

  const SPEED  = 0.45;  // px per frame
  const GAP    = 12;    // must match CSS gap on .hm-track

  const rows = document.querySelectorAll('.hm-row');
  if (!rows.length) return;

  var state = [];

  function buildMarquee() {
    state = [];

    rows.forEach(function (row) {
      var track    = row.querySelector('.hm-track');
      var dir      = parseFloat(row.dataset.direction) || 1;

      // 1. Remove any previously injected clones (data-clone attr)
      Array.from(track.querySelectorAll('[data-clone]')).forEach(function (el) {
        track.removeChild(el);
      });

      // 2. Snapshot originals
      var originals = Array.from(track.children);

      // 3. Measure one set width using getBoundingClientRect (sub-pixel accurate)
      var setWidth = 0;
      originals.forEach(function (card) {
        setWidth += card.getBoundingClientRect().width + GAP;
      });

      // 4. Calculate how many full copies we need so total > viewport * 2
      //    This guarantees the loop boundary is always off-screen
      var needed  = Math.ceil((window.innerWidth * 2) / setWidth) + 1;

      for (var c = 0; c < needed; c++) {
        originals.forEach(function (card) {
          var clone = card.cloneNode(true);
          clone.setAttribute('data-clone', '1');
          track.appendChild(clone);
        });
      }

      // 5. For left-scroll (dir=1)  start at x=0 — cards already fill from left
      //    For right-scroll (dir=-1) start at -setWidth so it scrolls rightward into view
      var startX = dir === -1 ? -setWidth : 0;

      track.style.transform = 'translateX(' + startX + 'px)';

      state.push({ track: track, dir: dir, setWidth: setWidth, x: startX });
    });
  }

  function tick() {
    state.forEach(function (s) {
      s.x -= SPEED * s.dir;

      // Loop back exactly one set-width — invisible because clones are identical
      if (s.dir ===  1 && s.x <= -s.setWidth) s.x += s.setWidth;
      if (s.dir === -1 && s.x >=  0)          s.x -= s.setWidth;

      s.track.style.transform = 'translateX(' + s.x + 'px)';
    });
    requestAnimationFrame(tick);
  }

  // Build after fonts + layout are stable, then start the RAF loop
  function start() {
    requestAnimationFrame(function () {
      buildMarquee();
      // Rebuild on resize so clone count stays correct
      var resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildMarquee, 200);
      });
      requestAnimationFrame(tick);
    });
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
  } else {
    window.addEventListener('load', start);
  }
})();

// ============================================
// DISABLE DRAG & CONTEXT MENU ON IMAGES / SVG
// ============================================
(function () {
  'use strict';

  function lockAssets() {
    // All img and svg elements
    const assets = document.querySelectorAll('img, svg');

    assets.forEach(function (el) {
      // Block drag start
      el.addEventListener('dragstart', function (e) { e.preventDefault(); return false; }, true);
      // Block right-click / long-press context menu
      el.addEventListener('contextmenu', function (e) { e.preventDefault(); return false; }, true);
      // Block touch-hold on mobile (iOS callout)
      el.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lockAssets);
  } else {
    lockAssets();
  }

  // Also catch any dynamically inserted images (e.g. marquee clones)
  if (window.MutationObserver) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          var targets = node.matches('img, svg')
            ? [node]
            : Array.from(node.querySelectorAll('img, svg'));
          targets.forEach(function (el) {
            el.addEventListener('dragstart',   function (e) { e.preventDefault(); }, true);
            el.addEventListener('contextmenu', function (e) { e.preventDefault(); }, true);
          });
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();

// ============================================
// DISABLE VIEW SOURCE (Ctrl+U) & DEVTOOLS SHORTCUTS
// ============================================
(function () {
  'use strict';

  document.addEventListener('keydown', function (e) {
    var key = e.key ? e.key.toLowerCase() : '';
    var ctrl = e.ctrlKey || e.metaKey; // metaKey covers Cmd on Mac

    // Ctrl+U — View Source
    if (ctrl && key === 'u') {
      e.preventDefault();
      return false;
    }

    // F12 — DevTools
    if (e.keyCode === 123) {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I — DevTools (Inspector)
    if (ctrl && e.shiftKey && key === 'i') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+J — DevTools (Console)
    if (ctrl && e.shiftKey && key === 'j') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+C — DevTools (Element picker)
    if (ctrl && e.shiftKey && key === 'c') {
      e.preventDefault();
      return false;
    }

    // Ctrl+S — Save page
    if (ctrl && key === 's') {
      e.preventDefault();
      return false;
    }

    // Ctrl+A — Select all
    if (ctrl && key === 'a') {
      e.preventDefault();
      return false;
    }
  }, true); // capture phase so it fires before anything else

})();
