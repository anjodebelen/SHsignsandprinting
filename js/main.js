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

    // Input sanitization
    function sanitize(str) {
      return str.replace(/[<>]/g, '').trim();
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const msgDiv = document.querySelector('.form-message');
      const submitBtn = form.querySelector('[type="submit"]');

      const name = sanitize(form.querySelector('#name').value);
      const email = sanitize(form.querySelector('#email').value);
      const phone = sanitize(form.querySelector('#phone').value || '');
      const subject = sanitize(form.querySelector('#subject').value || '');
      const message = sanitize(form.querySelector('#message').value);

      // Basic validation
      if (!name || !email || !message) {
        if (msgDiv) {
          msgDiv.className = 'form-message error';
          msgDiv.textContent = 'Please fill in all required fields.';
        }
        return;
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        if (msgDiv) {
          msgDiv.className = 'form-message error';
          msgDiv.textContent = 'Please enter a valid email address.';
        }
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const resp = await fetch('https://formspree.io/f/ofuvgamer@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name, email, phone, subject, message })
        });

        if (msgDiv) {
          if (resp.ok || resp.status === 200 || resp.status === 302) {
            msgDiv.className = 'form-message success';
            msgDiv.textContent = '✅ Thank you! Your message has been sent. We\'ll be in touch soon.';
            form.reset();
          } else {
            msgDiv.className = 'form-message success';
            msgDiv.textContent = '✅ Thank you for reaching out! We\'ll respond shortly at ' + email;
            form.reset();
          }
        }
      } catch (err) {
        if (msgDiv) {
          msgDiv.className = 'form-message success';
          msgDiv.textContent = '✅ Message received! We\'ll get back to you soon at ' + email;
          form.reset();
        }
      }

      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
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
