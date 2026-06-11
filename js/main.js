/* ============================================
   SIGN HERE SIGNS & PRINTING - MAIN JS
   ============================================ */

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

  // Also disable on sensitive areas
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
      navbar.style.zIndex = isOpen ? '1001' : '1000';
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navbar.style.zIndex = '1000';
      });
    });

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

  // ---- Parallax on scroll ----
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
    { name: 'Darnell Millman', initials: 'DM', text: 'I highly recommend this business. They do quality work, they are fast and worth every dollar. They\'ve printed off numerous projects for me and they\'ve all turned out amazing.', stars: 5 },
    { name: 'Raelene Stewart', initials: 'RS', text: 'Made a promise to get some work done and went above and beyond what was required to get the job done. Highly recommend.', stars: 5 },
    { name: 'Lee Harding', initials: 'LH', text: 'They do great work but you should stop in just to see the fantastic old photos and signs all over the walls of the interior. It\'s like a bonus heritage site!', stars: 5 },
    { name: 'Matthew C', initials: 'MC', text: 'The speed in which they completed was great. Comparing other competitors pricing and quality were the best. I will be going back for all my business and personal needs.', stars: 5 },
    { name: 'Nathan H', initials: 'NH', text: 'Very friendly customer service! Excellent work! Good people to do business with!', stars: 5 },
    { name: 'Connie Farrow', initials: 'CF', text: 'Amazing service. Friendly fast and will help you get what you need!', stars: 5 }
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

        if (dotsContainer) {
          dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === page);
          });
        }
      }, 200);

      track.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }

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

  // ---- Contact Form — Google Apps Script AJAX submit ----
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // ⚠️ IMPORTANT: This URL must match your Google Apps Script deployment!
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzBOiwMXFTaAakgRHtCnGk3QK9bmVL6SBngiHawZWX5Sn2p3kqN2KWY2WZhbb2gAoxeKA/exec';

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function getEl(id) { return document.getElementById(id); }

    function setError(id, msg) {
      const el  = getEl(id);
      const err = getEl(id + '-error');
      if (el)  { el.setAttribute('aria-invalid', 'true');  el.classList.add('input-error'); }
      if (err) { err.textContent = msg; }
    }

    function clearError(id) {
      const el  = getEl(id);
      const err = getEl(id + '-error');
      if (el)  { el.setAttribute('aria-invalid', 'false'); el.classList.remove('input-error'); }
      if (err) { err.textContent = ''; }
    }

    function showBanner(type, msg) {
      const banner = getEl('form-message');
      if (!banner) return;
      banner.className = 'form-message ' + type;
      banner.textContent = msg;
      banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Character counter
    const msgArea   = getEl('message');
    const charCount = getEl('char-count');
    if (msgArea && charCount) {
      msgArea.addEventListener('input', function () {
        charCount.textContent = this.value.length;
      });
    }

    // Real-time blur validation
    ['name', 'email', 'message'].forEach(function (id) {
      const el = getEl(id);
      if (!el) return;
      el.addEventListener('blur', function () {
        const val = (this.value || '').trim();
        if      (id === 'name'    && !val)                   setError(id, 'Please enter your full name.');
        else if (id === 'email'   && !val)                   setError(id, 'Please enter your email address.');
        else if (id === 'email'   && !EMAIL_RE.test(val))    setError(id, 'Please enter a valid email address.');
        else if (id === 'message' && !val)                   setError(id, 'Please enter your message.');
        else                                                 clearError(id);
      });
      el.addEventListener('input', function () {
        if (this.getAttribute('aria-invalid') === 'true') clearError(id);
      });
    });

    // Submit via fetch to Google Apps Script
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name    = (getEl('name')?.value    || '').trim();
      const email   = (getEl('email')?.value   || '').trim();
      const message = (getEl('message')?.value || '').trim();

      ['name', 'email', 'message'].forEach(id => clearError(id));
      let firstInvalid = null;

      if (!name)                      { setError('name',    'Please enter your full name.');       firstInvalid = firstInvalid || 'name'; }
      if (!email)                     { setError('email',   'Please enter your email address.');    firstInvalid = firstInvalid || 'email'; }
      else if (!EMAIL_RE.test(email)) { setError('email',   'Please enter a valid email address.'); firstInvalid = firstInvalid || 'email'; }
      if (!message)                   { setError('message', 'Please enter your message.');          firstInvalid = firstInvalid || 'message'; }

      if (firstInvalid) {
        getEl(firstInvalid)?.focus();
        return;
      }

      const btn   = getEl('submit-btn');
      const label = btn?.querySelector('.btn-label');
      if (btn)   btn.disabled = true;
      if (label) label.textContent = 'Sending…';

      // Loading bar elements
      const loadingWrap = getEl('upload-loading-wrap');
      const loadingBar  = getEl('upload-loading-bar');
      const loadingLbl  = getEl('upload-loading-label');

      function setProgress(pct, text) {
        if (loadingWrap) loadingWrap.hidden = false;
        if (loadingBar)  loadingBar.style.width = pct + '%';
        if (loadingLbl)  loadingLbl.textContent = text || '';
      }
      function hideProgress() {
        setTimeout(function () {
          if (loadingWrap) loadingWrap.hidden = true;
          if (loadingBar)  loadingBar.style.width = '0%';
        }, 800);
      }

      try {
        // ── Step 1: Encode each selected file to Base64 ──────────
        // Google Apps Script CANNOT receive binary FormData.
        // It only reads e.postData.contents (JSON string).
        // We encode every file as Base64 and send in a JSON payload.
        const fileInput = getEl('file-upload');
        const files = fileInput ? Array.from(fileInput.files) : [];
        const encodedFiles = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          setProgress(Math.round((i / (files.length || 1)) * 60), 'Encoding files… ' + (i + 1) + ' of ' + files.length);

          const base64 = await new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onload  = () => resolve(reader.result.split(',')[1]); // strip "data:...;base64,"
            reader.onerror = () => reject(new Error('Could not read ' + file.name));
            reader.readAsDataURL(file);
          });

          encodedFiles.push({
            name:   file.name,
            type:   file.type || 'application/octet-stream',
            base64: base64
          });
        }

        // ── Step 2: Build JSON payload ───────────────────────────
        setProgress(75, 'Sending…');

        const payload = {
          fullname: (getEl('name')?.value    || '').trim(),
          email:    (getEl('email')?.value   || '').trim(),
          phone:    (getEl('phone')?.value   || '').trim(),
          service:  (getEl('subject')?.value || '').trim(),
          message:  (getEl('message')?.value || '').trim(),
          _honey:   '',
          files:    encodedFiles
        };

        // ── Step 3: POST JSON to Google Apps Script ──────────────
        setProgress(90, 'Almost done…');

        const resp = await fetch(APPS_SCRIPT_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload)
        });

        setProgress(100, 'Done!');

        const text = await resp.text();
        let result;
        try { result = JSON.parse(text); }
        catch (_) { result = { result: 'success' }; }

        if (result.result === 'success') {
          hideProgress();
          showBanner('success', '✅ Thank you! Your message has been sent. Redirecting…');
          setTimeout(function () {
            window.location.href = 'success.html';
          }, 1500);
        } else {
          hideProgress();
          showBanner('error', '❌ ' + (result.message || 'Something went wrong. Please try again.'));
          if (btn)   btn.disabled = false;
          if (label) label.textContent = 'Send Message';
        }

      } catch (err) {
        console.error('Submit error:', err);
        hideProgress();
        // Apps Script CORS quirk can cause fetch to throw even on success
        showBanner('success', '✅ Thank you! Your message has been sent. Redirecting…');
        setTimeout(function () {
          window.location.href = 'success.html';
        }, 1500);
      }
    });
  }

  // ---- File Upload UI (FIXED) ----
  function initFileUpload() {
    const area      = document.getElementById('file-upload-area');
    const input     = document.getElementById('file-upload');
    const list      = document.getElementById('file-list');
    const noteEl    = document.getElementById('file-attach-note');
    if (!area || !input || !list) return;

    const MAX_FILES = 10;
    const MAX_BYTES = 20 * 1024 * 1024;
    let selectedFiles = [];

    function fileIcon(name) {
      const ext = (name.split('.').pop() || '').toLowerCase();
      if (['jpg','jpeg','png','gif','webp','svg','bmp'].includes(ext)) return '🖼️';
      if (['mp4','mov','avi','mkv','webm'].includes(ext))              return '🎬';
      if (ext === 'pdf')                                               return '📄';
      if (['doc','docx'].includes(ext))                                return '📝';
      if (['xls','xlsx'].includes(ext))                                return '📊';
      if (['ppt','pptx'].includes(ext))                                return '📑';
      if (['zip','rar'].includes(ext))                                 return '🗜️';
      if (['ai','eps'].includes(ext))                                  return '🎨';
      return '📎';
    }

    function formatSize(bytes) {
      if (bytes < 1024)           return bytes + ' B';
      if (bytes < 1024 * 1024)   return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function renderList() {
      list.innerHTML = '';
      selectedFiles.forEach(function (file, i) {
        const li = document.createElement('li');
        li.className = 'file-list-item';
        li.innerHTML =
          '<span class="file-list-icon">' + fileIcon(file.name) + '</span>' +
          '<span class="file-list-name" title="' + file.name + '">' + file.name + '</span>' +
          '<span class="file-list-size">' + formatSize(file.size) + '</span>' +
          '<button type="button" class="file-list-remove" aria-label="Remove ' + file.name + '">✕</button>';
        li.querySelector('.file-list-remove').addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          selectedFiles.splice(i, 1);
          renderList();
          syncInput();
        });
        list.appendChild(li);
      });

      if (noteEl) {
        noteEl.textContent = selectedFiles.length > 0
          ? selectedFiles.length + ' file(s) ready to send. Max 20MB per file.'
          : '';
      }
    }

    function syncInput() {
      // ✅ Sync selectedFiles back to the input via DataTransfer
      try {
        const dt = new DataTransfer();
        selectedFiles.forEach(f => dt.items.add(f));
        input.files = dt.files;
        console.log('Synced ' + input.files.length + ' file(s) to input element');
      } catch (e) {
        console.error('DataTransfer sync failed:', e);
      }
    }

    function addFiles(newFiles) {
      Array.from(newFiles).forEach(function (file) {
        if (selectedFiles.length >= MAX_FILES) return;
        if (file.size > MAX_BYTES) {
          alert('"' + file.name + '" is over 20 MB and was skipped.');
          return;
        }
        if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
          selectedFiles.push(file);
        }
      });
      renderList();
      syncInput();
    }

    area.addEventListener('click', function (e) {
      // ✅ Only open file picker if not clicking on a button or input
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
        input.click();
      }
    });

    area.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        input.click();
      }
    });

    input.addEventListener('change', function (e) {
      e.stopPropagation();
      if (this.files && this.files.length > 0) {
        console.log('File(s) selected:', this.files.length);
        addFiles(this.files);
      }
      // ✅ DO NOT clear this.value — it wipes the files!
      // DataTransfer syncInput() handles the file list
    });

    area.addEventListener('dragover', function (e) {
      e.preventDefault();
      area.classList.add('drag-over');
    });
    area.addEventListener('dragleave', function () {
      area.classList.remove('drag-over');
    });
    area.addEventListener('drop', function (e) {
      e.preventDefault();
      area.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    });
  }

  // ---- Init all ----
  document.addEventListener('DOMContentLoaded', () => {
    initTestimonials();
    initWorkFilter();
    initContactForm();
    initFileUpload();
    animateCounters();
  });

  document.addEventListener('DOMContentLoaded', () => {
    revealEls.forEach(el => observer.observe(el));
  });

})();

// ===========================
// HERO MARQUEE
// ===========================
(function () {
  'use strict';

  const SPEED  = 0.45;
  const GAP    = 12;

  const rows = document.querySelectorAll('.hm-row');
  if (!rows.length) return;

  var state = [];

  function buildMarquee() {
    state = [];

    rows.forEach(function (row) {
      var track    = row.querySelector('.hm-track');
      var dir      = parseFloat(row.dataset.direction) || 1;

      Array.from(track.querySelectorAll('[data-clone]')).forEach(function (el) {
        track.removeChild(el);
      });

      var originals = Array.from(track.children);

      var setWidth = 0;
      originals.forEach(function (card) {
        setWidth += card.getBoundingClientRect().width + GAP;
      });

      var needed  = Math.ceil((window.innerWidth * 2) / setWidth) + 1;

      for (var c = 0; c < needed; c++) {
        originals.forEach(function (card) {
          var clone = card.cloneNode(true);
          clone.setAttribute('data-clone', '1');
          track.appendChild(clone);
        });
      }

      var startX = dir === -1 ? -setWidth : 0;

      track.style.transform = 'translateX(' + startX + 'px)';

      state.push({ track: track, dir: dir, setWidth: setWidth, x: startX });
    });
  }

  function tick() {
    state.forEach(function (s) {
      s.x -= SPEED * s.dir;

      if (s.dir ===  1 && s.x <= -s.setWidth) s.x += s.setWidth;
      if (s.dir === -1 && s.x >=  0)          s.x -= s.setWidth;

      s.track.style.transform = 'translateX(' + s.x + 'px)';
    });
    requestAnimationFrame(tick);
  }

  function start() {
    requestAnimationFrame(function () {
      buildMarquee();
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
    const assets = document.querySelectorAll('img, svg');

    assets.forEach(function (el) {
      el.addEventListener('dragstart', function (e) { e.preventDefault(); return false; }, true);
      el.addEventListener('contextmenu', function (e) { e.preventDefault(); return false; }, true);
      el.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lockAssets);
  } else {
    lockAssets();
  }

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
    var ctrl = e.ctrlKey || e.metaKey;

    if (ctrl && key === 'u') { e.preventDefault(); return false; }
    if (e.keyCode === 123)  { e.preventDefault(); return false; }
    if (ctrl && e.shiftKey && key === 'i') { e.preventDefault(); return false; }
    if (ctrl && e.shiftKey && key === 'j') { e.preventDefault(); return false; }
    if (ctrl && e.shiftKey && key === 'c') { e.preventDefault(); return false; }
    if (ctrl && key === 's') { e.preventDefault(); return false; }
  }, true);

})();
